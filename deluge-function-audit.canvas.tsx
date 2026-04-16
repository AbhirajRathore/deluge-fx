import { useState } from 'react';
import {
  Stack, H1, H2, H3, Grid, Stat, Table, Divider, Text, Row,
  Card, CardHeader, CardBody, Button, useHostTheme, Spacer, Pill,
} from 'cursor/canvas';

// ── Deleted files (108) ────────────────────────────────────────────────────

const DELETED: Array<{ name: string; cluster: string }> = [
  // Reverse Sync (3 remain deleted; api + two schedule scripts)
  { name: 'reverse_sync_api', cluster: 'Reverse Sync' },
  { name: 'reverse_sync_transaction_for_dxb_ant_ny_ind', cluster: 'Reverse Sync' },
  { name: 'reverse_sync_transaction_for_sales_not_sync', cluster: 'Reverse Sync' },
  // International Transactions
  { name: 'Sum_up_carat_and_amount_in_International_transaction_on_create', cluster: 'Intl Transaction' },
  { name: 'Sum_up_carat_and_amount_in_International_transaction1', cluster: 'Intl Transaction' },
  { name: 'Sum_up_carat_and_amount_in_International_dispatch', cluster: 'Intl Transaction' },
  { name: 'update_inventory_on_stone_actions_Transaction', cluster: 'Intl Transaction' },
  { name: 'update_inventory_on_stone_action_dispatches', cluster: 'Intl Transaction' },
  { name: 'pdate_inventory_on_stone_action_deal', cluster: 'Intl Transaction' },
  { name: 'Update_inventory_on_stone_action_Bid2Buy', cluster: 'Intl Transaction' },
  // Stone ID
  { name: 'UpdateStoneID', cluster: 'Stone ID' },
  { name: 'UpdateStoneID_DispatchDetail_Page', cluster: 'Stone ID' },
  { name: 'UpdateStoneID_TransactionDetail_Page', cluster: 'Stone ID' },
  { name: 'GetStoneData', cluster: 'Stone ID' },
  { name: 'GetStoneData21111', cluster: 'Stone ID' },
  { name: 'GetStoneData211111', cluster: 'Stone ID' },
  // Markup
  { name: 'Update_Markup', cluster: 'Markup' },
  { name: 'Update_markup_on_create', cluster: 'Markup' },
  { name: 'Update_markup_on_transaction', cluster: 'Markup' },
  { name: 'Update_Markup_to_Deal_X_invemtory', cluster: 'Markup' },
  // Kafka / Webhook (not associated)
  { name: 'Send_KYC_approved_to_kafka', cluster: 'Kafka/Webhook' },
  { name: 'send_kyc_status_to_webhook', cluster: 'Kafka/Webhook' },
  { name: 'send_paid_status_to_kafka', cluster: 'Kafka/Webhook' },
  { name: 'Send_Invoice_status_tot_kafka', cluster: 'Kafka/Webhook' },
  { name: 'Send_Contact_Owner_Date_to_Webhook', cluster: 'Kafka/Webhook' },
  { name: 'Send_Contact_Owner_Date_to_Webhook1', cluster: 'Kafka/Webhook' },
  { name: 'Send_push_notification', cluster: 'Kafka/Webhook' },
  // Consignment
  { name: 'consignment', cluster: 'Consignment' },
  { name: 'Consignment_Return', cluster: 'Consignment' },
  // Restore / Populate
  { name: 'restore_record_and_subform_data', cluster: 'Restore/Populate' },
  { name: 'restore_record_and_subform_data_transaction', cluster: 'Restore/Populate' },
  { name: 'populate_transaction_amount', cluster: 'Restore/Populate' },
  // NIVID Samples
  { name: 'SampleCreateKYCRecordinNivid', cluster: 'NIVID Samples' },
  { name: 'SampelFunctionToCreateRecordinNivid_India', cluster: 'NIVID Samples' },
  { name: 'onboard_customer_lead', cluster: 'NIVID Samples' },
  { name: 'Retrieve_Account_from_Nivid_button', cluster: 'NIVID Samples' },
  // Bid2Buy (unused)
  { name: 'Sum_up_calculation_for_bid2buy', cluster: 'Bid2Buy (unused)' },
  // Misc
  { name: 'update_ledger_code_webhook', cluster: 'Misc' },
  { name: 'detectMismatchTriggerEmail', cluster: 'Misc' },
  { name: 'bulk_delete_from_recycle_bin', cluster: 'Misc' },
  { name: 'Update_account_customer_status', cluster: 'Misc' },
  { name: 'add_notes_from_subfrom', cluster: 'Misc' },
  { name: 'Update_Website_order_clear_inventory', cluster: 'Misc' },
  { name: 'manually_sync_account', cluster: 'Misc' },
  { name: 'client_script_get_related_contacts', cluster: 'Misc' },
  { name: 'add_contact_to_demand_jorney', cluster: 'Misc' },
  { name: 'update_amount_on_sales', cluster: 'Misc' },
  { name: 'Test_function', cluster: 'Misc' },
  { name: 'update_member_account_to_parent', cluster: 'Misc' },
  { name: 'add_parent_on_list', cluster: 'Misc' },
  { name: 'update_admin_ledger_code', cluster: 'Misc' },
  { name: 'Update_fields', cluster: 'Misc' },
  { name: 'bulk_update_old_owner', cluster: 'Misc' },
  { name: 'Update_Lead_Status_list_view_button', cluster: 'Misc' },
  { name: 'Update_Mobile_Number_button_contact', cluster: 'Misc' },
  { name: 'Update_Mobile_number_button', cluster: 'Misc' },
  { name: 'Auto_Merge_for_Website_Orders', cluster: 'Misc' },
  { name: 'update_converted_lead_source_in_leads', cluster: 'Misc' },
  { name: 'Identify_marketing_lead', cluster: 'Misc' },
  { name: 'legal_status_by_country_validation', cluster: 'Misc' },
  { name: 'Update_tran_status_of_sales', cluster: 'Misc' },
  { name: 'update_lead_source_on_deals', cluster: 'Misc' },
  { name: 'export_accounts_in_rishis_format', cluster: 'Misc' },
  { name: 'Send_email_after_approval', cluster: 'Misc' },
  { name: 'update_dispatch_amount_from_deal', cluster: 'Misc' },
  { name: 'update_account_owner_based_on_purchase_by', cluster: 'Misc' },
  { name: 'delete_tasks_from_old_owner', cluster: 'Misc' },
  { name: 'update_not_in_nivid_entry_type_of_transaction', cluster: 'Misc' },
  { name: 'Bulk_update_records', cluster: 'Misc' },
  { name: 'stones_return_functions13112', cluster: 'Misc' },
  { name: 'stones_return_functions131121', cluster: 'Misc' },
  { name: 'Create_record_from_Deal_subform', cluster: 'Misc' },
  { name: 'update_stage_list_view_button', cluster: 'Misc' },
  { name: 'update_stone_location_field_in_deal', cluster: 'Misc' },
  { name: 'Validate_Contact_Name_Deals', cluster: 'Misc' },
  { name: 'Update_Contact_Owner', cluster: 'Misc' },
  { name: 'Close_deal_after_5_days', cluster: 'Misc' },
  { name: 'send_test_whatsapp', cluster: 'Misc' },
  { name: 'Transaction_Sale_return111111111111111111', cluster: 'Misc' },
  { name: 'Transaction_Sale_return1111111111111111111', cluster: 'Misc' },
  { name: 'Update_related_deal_and_lead_source_on_inventory', cluster: 'Misc' },
  { name: 'invoke_url_for_js', cluster: 'Misc' },
  { name: 'Update_account_status', cluster: 'Misc' },
  { name: 'Download_stock_list11', cluster: 'Misc' },
  { name: 'Download_stock_list111', cluster: 'Misc' },
  { name: 'Update_Account_Address_one_address', cluster: 'Misc' },
  { name: 'New_deal_send_email_Owner', cluster: 'Misc' },
  { name: 'Sum_up_list_price_in_deal', cluster: 'Misc' },
  { name: 'unpack_diamonds', cluster: 'Misc' },
  { name: 'update_difference', cluster: 'Misc' },
  { name: 'delete_unrelated_stones1', cluster: 'Misc' },
  { name: 'Update_data_from_acc_to_Memo', cluster: 'Misc' },
  { name: 'Update_line_item', cluster: 'Misc' },
  { name: 'Remove_Lot_Number', cluster: 'Misc' },
  { name: 'testing_function', cluster: 'Misc' },
  { name: 'Auto_Currency', cluster: 'Misc' },
  { name: 'Populate_inventory_fields', cluster: 'Misc' },
  { name: 'ZFS_Link', cluster: 'Misc' },
  { name: 'Print_preview', cluster: 'Misc' },
  { name: 'remove_unrecorded_dispatch_records', cluster: 'Misc' },
  { name: 'Update_Address_from_the_Account', cluster: 'Misc' },
  { name: 'Update_contacts_status', cluster: 'Misc' },
  { name: 'Customer_Onboard_Email_Sent', cluster: 'Misc' },
  { name: 'Send_confirm_transaction_Failed_email', cluster: 'Misc' },
  { name: 'Update_subform', cluster: 'Misc' },
  { name: 'reset_Website_password_of_contacts1', cluster: 'Misc' },
  { name: 'assign_task_based_on_owner', cluster: 'Misc' },
  { name: 'extract_account_data', cluster: 'Misc' },
];

// ── Dependency tree data ───────────────────────────────────────────────────

type TreeNode = { name: string; kind: 'associated' | 'transitive' | 'hub'; children?: TreeNode[] };

const NON_TRIVIAL: TreeNode[] = [
  { name: 'accounts_sync', kind: 'associated', children: [
    { name: 'set_nivid_token', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
    { name: 'accounts_sync_function', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
    { name: 'tag_retention_deal', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
      { name: 'tag_retention_email', kind: 'transitive', children: [
        { name: 'get_variable_value', kind: 'hub' },
      ]},
    ]},
  ]},
  { name: 'sync_accounts_buttons', kind: 'associated', children: [
    { name: 'accounts_sync_function', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
  ]},
  { name: 'tag_retention_check', kind: 'associated', children: [
    { name: 'get_variable_value', kind: 'hub' },
    { name: 'tag_retention_weborder', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
  ]},
  { name: 'tag_retention_on_edit', kind: 'associated', children: [
    { name: 'get_variable_value', kind: 'hub' },
    { name: 'tag_retention_weborder', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
  ]},
  { name: 'bid_2_buy_notifications_flow', kind: 'associated', children: [
    { name: 'get_variable_value', kind: 'hub' },
    { name: 'Live_bidding_notifications_b2b', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
  ]},
  { name: 'send_accounting_memo_email_notification', kind: 'associated', children: [
    { name: 'Send_email_to_accounting_team', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
  ]},
  { name: 'send_accounting_sales_email_notification', kind: 'associated', children: [
    { name: 'Send_email_to_accounting_team', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
  ]},
  { name: 'Reverse_sync', kind: 'associated', children: [
    { name: 'get_variable_value', kind: 'hub' },
    { name: 'Reverse_Sync_Audit', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
    { name: 'Reverse_Sync_Update', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
    { name: 'Reverse_Sync_Update_Price', kind: 'transitive', children: [
      { name: 'get_variable_value', kind: 'hub' },
    ]},
  ]},
  { name: 'Cart_Followup_Scheduler', kind: 'associated', children: [
    { name: 'cart_generateExcelAndSendEmail', kind: 'transitive' },
  ]},
  { name: 'send_KYC_email_with_list_of_documents', kind: 'associated', children: [
    { name: 'send_kyc_email_to_client_standalone', kind: 'transitive' },
  ]},
  { name: 'send_email_kyc_button', kind: 'associated', children: [
    { name: 'send_kyc_email_to_client_standalone', kind: 'transitive' },
  ]},
];

const SINGLE_LEVEL_GET_VAR = [
  'Send_KYC_approved_Send_KAM_Create_Password',
  'Customer_onboard_button',
  'create_deal_from_tasks',
  'Send_contact_details_to_Kafka',
  'Pre_KYC_Send_Notification_and_Update_stage',
  'reset_Website_password_of_contacts',
  'convert_lead_button',
  'Update_Website_order_lead_source_on_inventory',
  'Kafka_api_crm_update_contact_notifications',
  'new_arrival_Send_daily_Notification',
  'update_related_accounts',
  'restart_kafka1',
  'restart_kafka2',
  'bid_2_buy_notifications',
];

const LEAF_FUNCTIONS = [
  'Send_zoho_sheet_to_accounting_and_confirm_sale',
  'push_to_acc', 'Closeemailtask', 'Update_owner_from_lead',
  'New_deal_send_email_Owner_button', 'New_unpack_diamonds_for_transaction',
  'validate_Contact_Name_transaction', 'pull_out_stones_transaction',
  'Retrive_Stone_from_NIVID', 'update_net_amount', 'Get_bank_rates',
  'Order_Confirmation_Email_to_client', 'validation_on_phone_lead',
  'pull_out_stone_Home1111112', 'update_amount_on_transaction',
  'increament_number_of_reassign', 'Pull_out_stone_dispatch',
  'validate_Contact_Name_dispatch', 'convert_lead_function_for_blueprint1',
  'convert_lead_function_for_blueprint2', 'convert_lead_function_for_blueprint3',
  'assign_member_account_kisko1', 'assign_member_account_kisko2',
  'bulk_update_inventory_via_button', 'delete_unrelated_x_inventories',
  'new_arrival_daily_Email', 'set_vetting_fields_as_empty',
  'update_mobile_on_leads', 'Set_mark_up_4', 'update_mobile_on_contact',
  'update_old_owner', 'Order_confirmation_send_email_button',
  'Print_memo_button', 'schedule_a_30_days_followUp_call',
  'Activate_marketing_account_for_sdr',
  'assign_salesperson_based_on_referral_name_New_Lead1',
  'add_contact_to_post_kyc', 'update_customer_status_in_parent_account',
  'Cart_abandonment_update_stone_added_time', 'Send_Live_bidding_bid_2_buy_Email',
  'update_user_id_on_record', 'update_user_id (Button)', 'update_user_id (Automation)',
];

// ── Tree row component ─────────────────────────────────────────────────────

function TreeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const { tokens } = useHostTheme();
  const [open, setOpen] = useState(true);
  const hasChildren = (node.children?.length ?? 0) > 0;

  const nameColor =
    node.kind === 'associated'
      ? tokens.accent.primary
      : node.kind === 'hub'
      ? tokens.text.tertiary
      : tokens.text.primary;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          paddingLeft: 8 + depth * 20,
          paddingTop: 3,
          paddingBottom: 3,
          cursor: hasChildren ? 'pointer' : 'default',
        }}
        onClick={hasChildren ? () => setOpen((o) => !o) : undefined}
      >
        <span style={{ color: tokens.text.tertiary, fontSize: 10, width: 12, flexShrink: 0, textAlign: 'center' }}>
          {hasChildren ? (open ? '▾' : '▸') : '·'}
        </span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 12,
            color: nameColor,
            fontWeight: node.kind === 'associated' ? 600 : 400,
          }}
        >
          {node.name}
        </span>
        {node.kind === 'transitive' && depth > 0 && (
          <span style={{ fontSize: 10, color: tokens.text.quaternary, marginLeft: 4 }}>
            via dep
          </span>
        )}
        {node.kind === 'hub' && (
          <span style={{ fontSize: 10, color: tokens.text.quaternary, marginLeft: 4 }}>
            shared hub
          </span>
        )}
      </div>
      {hasChildren && open &&
        node.children!.map((child, i) => (
          <TreeRow key={i} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

// ── Cluster summary ────────────────────────────────────────────────────────

const clusterCounts = DELETED.reduce<Record<string, number>>((acc, f) => {
  acc[f.cluster] = (acc[f.cluster] ?? 0) + 1;
  return acc;
}, {});

// ── Main canvas ────────────────────────────────────────────────────────────

export default function DelugeFunctionAudit() {
  const { tokens } = useHostTheme();
  const [view, setView] = useState<'deleted' | 'tree'>('deleted');
  const [clusterFilter, setClusterFilter] = useState<string>('All');

  const visibleRows = DELETED
    .filter((f) => clusterFilter === 'All' || f.cluster === clusterFilter)
    .sort((a, b) => a.cluster.localeCompare(b.cluster) || a.name.localeCompare(b.name));

  return (
    <Stack gap={20} style={{ padding: 24 }}>
      <H1>Deluge Function Audit</H1>

      <Grid columns={3} gap={16}>
        <Stat value="189" label="Total Functions" />
        <Stat value="81" label="Active (Root)" tone="success" />
        <Stat value="108" label="Moved to deleted/" tone="warning" />
      </Grid>

      <Divider />

      <Row gap={8}>
        <Button
          onClick={() => setView('deleted')}
          variant={view === 'deleted' ? 'primary' : 'secondary'}
        >
          Part A — Deleted Functions (108)
        </Button>
        <Button
          onClick={() => setView('tree')}
          variant={view === 'tree' ? 'primary' : 'secondary'}
        >
          Part B — Dependency Tree
        </Button>
      </Row>

      {/* ── PART A ── */}
      {view === 'deleted' && (
        <Stack gap={16}>
          <Stack gap={4}>
            <H2>Functions moved to deleted/</H2>
            <Text tone="secondary" size="small">
              Not in the associated list and not transitively called by any associated function.
            </Text>
          </Stack>

          <Row gap={8} style={{ flexWrap: 'wrap' }}>
            {Object.entries(clusterCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([cluster, count]) => (
                <div
                  key={cluster}
                  onClick={() => setClusterFilter((f) => (f === cluster ? 'All' : cluster))}
                  style={{ cursor: 'pointer' }}
                >
                  <Pill
                    label={`${cluster} (${count})`}
                    tone={clusterFilter === cluster ? 'info' : 'default'}
                  />
                </div>
              ))}
          </Row>

          {clusterFilter !== 'All' && (
            <Row>
              <Button onClick={() => setClusterFilter('All')} variant="secondary">
                Clear filter
              </Button>
            </Row>
          )}

          <Table
            headers={['Function', 'Cluster']}
            rows={visibleRows.map((f) => [f.name, f.cluster])}
          />
        </Stack>
      )}

      {/* ── PART B ── */}
      {view === 'tree' && (
        <Stack gap={20}>
          <Stack gap={4}>
            <H2>Dependency Tree</H2>
            <Text tone="secondary" size="small">
              All 81 active functions. Click a row to collapse its subtree.
            </Text>
            <Row gap={16} style={{ flexWrap: 'wrap', marginTop: 4 }}>
              {[
                { label: 'Associated (direct)', color: tokens.accent.primary },
                { label: 'Transitively needed', color: tokens.text.primary },
                { label: 'Shared hub', color: tokens.text.tertiary },
              ].map(({ label, color }) => (
                <Row key={label} gap={6} style={{ alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                  <Text size="small" tone="secondary">{label}</Text>
                </Row>
              ))}
            </Row>
          </Stack>

          <Stack gap={4}>
            <H3>Multi-level chains</H3>
            <Text tone="secondary" size="small">
              Associated functions that pull in 2+ levels of transitive dependencies.
            </Text>
          </Stack>
          <div
            style={{
              background: tokens.bg.chrome,
              border: `1px solid ${tokens.stroke.secondary}`,
              borderRadius: 6,
              padding: '8px 0',
            }}
          >
            {NON_TRIVIAL.map((node, i) => (
              <div key={i}>
                {i > 0 && (
                  <div style={{ height: 1, background: tokens.stroke.secondary, margin: '4px 0' }} />
                )}
                <TreeRow node={node} depth={0} />
              </div>
            ))}
          </div>

          <Stack gap={4}>
            <H3>Single-level — get_variable_value ({SINGLE_LEVEL_GET_VAR.length})</H3>
            <Text tone="secondary" size="small">
              These associated functions call only get_variable_value as their custom dep.
            </Text>
          </Stack>
          <Table
            headers={['Associated Function', 'Calls']}
            rows={SINGLE_LEVEL_GET_VAR.map((f) => [f, 'get_variable_value'])}
          />

          <Stack gap={4}>
            <H3>Pure leaf functions ({LEAF_FUNCTIONS.length})</H3>
            <Text tone="secondary" size="small">
              Call only built-in Zoho APIs — no other custom Deluge functions.
            </Text>
          </Stack>
          <Table
            headers={['Associated Function']}
            rows={LEAF_FUNCTIONS.map((f) => [f])}
          />
        </Stack>
      )}
    </Stack>
  );
}
