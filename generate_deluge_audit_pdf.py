#!/usr/bin/env python3
"""Build deluge-function-audit.pdf from deluge-function-audit.canvas.tsx."""

from __future__ import annotations

import re
import sys
from pathlib import Path

from fpdf import FPDF


def extract_array_block(text: str, start: str, end: str) -> str:
    """Extract inner of `[...]` for `const NAME ... = [...]`.

    Must not use the first `[` in the chunk: e.g. `TreeNode[] = [` has `[` in `[]`
    before the real array opener.
    """
    i = text.index(start)
    j = text.index(end, i + len(start))
    chunk = text[i:j]
    m = re.search(r"=\s*\[", chunk)
    if not m:
        raise ValueError(f"no '= [' array initializer found after {start!r}")
    lb = m.end() - 1
    depth = 0
    for k in range(lb, len(chunk)):
        if chunk[k] == "[":
            depth += 1
        elif chunk[k] == "]":
            depth -= 1
            if depth == 0:
                return chunk[lb + 1 : k]
    raise ValueError(f"unbalanced array for {start!r}")


def parse_deleted(inner: str) -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []
    pat = re.compile(r"\{\s*name:\s*'((?:\\'|[^'])*)',\s*cluster:\s*'((?:\\'|[^'])*)'\s*\}")
    for m in pat.finditer(inner):
        name = m.group(1).replace("\\'", "'")
        cluster = m.group(2).replace("\\'", "'")
        rows.append((name, cluster))
    return rows


def parse_string_list(inner: str) -> list[str]:
    out: list[str] = []
    for m in re.finditer(r"'((?:\\'|[^'])*)'", inner):
        out.append(m.group(1).replace("\\'", "'"))
    return out


class TreeNode:
    __slots__ = ("name", "kind", "children")

    def __init__(
        self,
        name: str,
        kind: str,
        children: list[TreeNode] | None = None,
    ) -> None:
        self.name = name
        self.kind = kind
        self.children = children or []


def parse_tree_nodes(s: str, pos: int = 0) -> tuple[list[TreeNode], int]:
    nodes: list[TreeNode] = []
    n = len(s)
    while pos < n and s[pos] in " \t\n\r,":
        pos += 1
    if pos >= n or s[pos] != "{":
        return nodes, pos
    while pos < n:
        while pos < n and s[pos] in " \t\n\r,":
            pos += 1
        if pos >= n or s[pos] != "{":
            break
        pos += 1
        name_m = re.match(r"\s*name:\s*'", s[pos:])
        if not name_m:
            raise ValueError("expected name")
        pos += name_m.end()
        name_start = pos
        while pos < n:
            if s[pos] == "\\" and pos + 1 < n:
                pos += 2
                continue
            if s[pos] == "'":
                break
            pos += 1
        name = s[name_start:pos].replace("\\'", "'")
        pos += 1
        kind_m = re.match(r"\s*,\s*kind:\s*'", s[pos:])
        if not kind_m:
            raise ValueError("expected kind")
        pos += kind_m.end()
        k_start = pos
        while pos < n and s[pos] != "'":
            pos += 1
        kind = s[k_start:pos]
        pos += 1
        children: list[TreeNode] = []
        ch_m = re.match(r"\s*,\s*children:\s*\[", s[pos:])
        if ch_m:
            pos += ch_m.end()
            children, pos = parse_tree_nodes(s, pos)
            if pos >= n or s[pos] != "]":
                raise ValueError("expected ] after children")
            pos += 1
        while pos < n and s[pos] in " \t\n\r":
            pos += 1
        if pos >= n or s[pos] != "}":
            raise ValueError("expected }")
        pos += 1
        nodes.append(TreeNode(name, kind, children))
        while pos < n and s[pos] in " \t\n\r,":
            pos += 1
        if pos < n and s[pos] == "]":
            break
    return nodes, pos


def render_tree_lines(nodes: list[TreeNode], depth: int = 0) -> list[str]:
    lines: list[str] = []
    for node in nodes:
        indent = "  " * depth
        suffix = ""
        if node.kind == "hub":
            suffix = "  (shared hub)"
        elif node.kind == "transitive" and depth > 0:
            suffix = "  (via dep)"
        lines.append(f"{indent}- {node.name}{suffix}")
        lines.extend(render_tree_lines(node.children, depth + 1))
    return lines


class AuditPDF(FPDF):
    def header(self) -> None:
        self.set_font("Helvetica", "B", 10)
        self.cell(0, 8, "Deluge Function Audit", ln=True)
        self.ln(2)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")


def main() -> int:
    root = Path(__file__).resolve().parent
    tsx = root / "deluge-function-audit.canvas.tsx"
    if not tsx.exists():
        print(f"Missing {tsx}", file=sys.stderr)
        return 1
    text = tsx.read_text(encoding="utf-8")

    deleted_inner = extract_array_block(text, "const DELETED", "type TreeNode")
    deleted_rows = parse_deleted(deleted_inner)
    if len(deleted_rows) != 108:
        print(f"Warning: expected 108 deleted rows, got {len(deleted_rows)}", file=sys.stderr)

    tree_inner = extract_array_block(text, "const NON_TRIVIAL", "const SINGLE_LEVEL_GET_VAR")
    tree_nodes, _ = parse_tree_nodes(tree_inner, 0)

    sl_inner = extract_array_block(text, "const SINGLE_LEVEL_GET_VAR", "const LEAF_FUNCTIONS")
    single_level = parse_string_list(sl_inner)

    leaf_inner = extract_array_block(text, "const LEAF_FUNCTIONS", "// ── Tree row")
    leaf_funcs = parse_string_list(leaf_inner)

    cluster_counts: dict[str, int] = {}
    for _, c in deleted_rows:
        cluster_counts[c] = cluster_counts.get(c, 0) + 1

    pdf = AuditPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.multi_cell(pdf.epw, 9, "Deluge Function Audit")
    pdf.ln(2)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(
        pdf.epw,
        5,
        "Summary: 189 total functions, 81 active (root), 108 moved to deleted/. "
        "Dependency tree below is the primary reference.",
    )
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 7, "Part B - Dependency tree (full)", ln=True)
    pdf.set_font("Helvetica", "", 8)
    pdf.multi_cell(
        pdf.epw,
        4,
        "Legend: top-level names are associated functions; indented names are transitive "
        "dependencies; (shared hub) marks get_variable_value and similar hubs.",
    )
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, "Multi-level chains", ln=True)
    pdf.set_font("Courier", "", 7)
    for line in render_tree_lines(tree_nodes):
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(pdf.epw, 3.5, line)
        if pdf.get_y() > 275:
            pdf.add_page()
            pdf.set_font("Courier", "", 7)

    pdf.ln(3)
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, f"Single-level - get_variable_value ({len(single_level)})", ln=True)
    pdf.set_font("Helvetica", "", 7)
    pdf.set_font("Helvetica", "B", 7)
    pdf.cell(95, 5, "Associated function", border="B")
    pdf.cell(95, 5, "Calls", border="B", ln=True)
    pdf.set_font("Helvetica", "", 7)
    for fn in single_level:
        pdf.cell(95, 4, fn[:68] + ("..." if len(fn) > 68 else ""), border=0)
        pdf.cell(95, 4, "get_variable_value", border=0, ln=True)
        if pdf.get_y() > 275:
            pdf.add_page()

    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(0, 6, f"Pure leaf functions ({len(leaf_funcs)})", ln=True)
    pdf.set_font("Helvetica", "", 7)
    pdf.multi_cell(
        pdf.epw,
        4,
        "Call only built-in Zoho APIs - no other custom Deluge functions.",
    )
    for fn in leaf_funcs:
        pdf.set_x(pdf.l_margin)
        pdf.multi_cell(pdf.epw, 4, f"- {fn}")
        if pdf.get_y() > 275:
            pdf.add_page()

    pdf.add_page()
    pdf.set_font("Helvetica", "B", 12)
    pdf.cell(0, 7, "Part A - Deleted functions (108)", ln=True)
    pdf.set_font("Helvetica", "", 8)
    pdf.multi_cell(
        pdf.epw,
        4,
        "Not in the associated list and not transitively called by any associated function. "
        "Sorted by cluster, then function name.",
    )
    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 11)
    pdf.cell(0, 6, "Cluster counts (deleted/)", ln=True)
    pdf.set_font("Helvetica", "", 9)
    for cluster, count in sorted(cluster_counts.items(), key=lambda x: -x[1]):
        pdf.cell(0, 5, f"  {cluster}: {count}", ln=True)
    pdf.ln(3)

    deleted_sorted = sorted(deleted_rows, key=lambda r: (r[1], r[0]))
    pdf.set_font("Helvetica", "B", 8)
    pdf.cell(95, 6, "Function", border="B")
    pdf.cell(95, 6, "Cluster", border="B", ln=True)
    pdf.set_font("Helvetica", "", 7)
    for name, cluster in deleted_sorted:
        pdf.set_x(pdf.l_margin)
        x, y = pdf.get_x(), pdf.get_y()
        pdf.multi_cell(95, 4, name, border=0)
        y2 = pdf.get_y()
        pdf.set_xy(x + 95, y)
        pdf.multi_cell(95, 4, cluster, border=0)
        pdf.set_y(max(y2, pdf.get_y()))
        if pdf.get_y() > 270:
            pdf.add_page()

    out = root / "deluge-function-audit.pdf"
    pdf.output(str(out))
    print(f"Wrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
