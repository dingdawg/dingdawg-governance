# DingDawg Governance — API Reference

DingDawg Governance exposes six MCP tools. Each tool is callable by any MCP-compatible AI agent (Claude Code, Codex, Cursor, or any MCP client). All tools require a valid `DINGDAWG_API_KEY` environment variable.

**Base URL (REST fallback):** `https://governance.dingdawg.com/v1`

**Authentication:** `Authorization: Bearer ddg_live_your_key_here`

---

## Tools

### 1. `validate_action`

Evaluates a proposed AI agent action against the active governance policy and returns a decision (allow or deny) with a signed receipt.

This is the primary tool. Most integrations call this before every write, shell command, or external API call.

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action_type` | string | Yes | The category of action. See [action type registry](receipt-format.md#action-type-registry). Examples: `file_write`, `shell_exec`, `api_call`, `db_write`. |
| `resource` | string | Yes | The resource the action will operate on. File path, URL, database table, or shell command string. Max 2048 chars. |
| `scope` | string | Yes | Declared scope. Values: `project`, `system`, `network`, `database`, `external`. |
| `governance_level` | string | No | Override active governance level for this call only. Values: `strict`, `standard`, `permissive`. Defaults to level set in `.governance.yaml`. |
| `justification` | string | No | Human-readable reason for the action. Required for certain high-risk actions at `strict` level. |
| `metadata` | object | No | Arbitrary key-value pairs attached to the receipt. Not evaluated by governance engine. Useful for tagging actions with PR numbers, deploy IDs, etc. |

**Example Request**

```json
{
  "tool": "validate_action",
  "parameters": {
    "action_type": "file_write",
    "resource": "./src/index.ts",
    "scope": "project",
    "governance_level": "standard",
    "justification": "Refactoring authentication module",
    "metadata": {
      "pr_number": "142",
      "author": "agent"
    }
  }
}
```

**Example Response — Allowed**

```json
{
  "decision": "allow",
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T6V",
  "risk_score": 12,
  "governance_level": "standard",
  "rollback_id": "rb_01HXYZ9K3M2P7Q8R4T6V",
  "rollback_expires": "2026-04-27T14:32:07.441Z",
  "chain_hash": "sha256:9a4f2c8b1e6d3a7f0c5b9e2d4a1f8c6b3e7a2d5f9c4b8e1a6d3f7c2b5e9a4d",
  "hmac_signature": "v1:8f3a2c9b1e4d7f0a5c8b2e6d9a3f1c7b4e8a2d5f9c3b7e1a4d6f2c9b5e8a3d",
  "timestamp": "2026-03-28T14:32:07.441Z",
  "verified": true
}
```

**Example Response — Denied**

```json
{
  "decision": "deny",
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R5U8Z",
  "risk_score": 100,
  "governance_level": "strict",
  "deny_reason": "Destructive system-scope command denied at governance level strict. This command would recursively delete all files starting from the filesystem root.",
  "rollback_id": null,
  "chain_hash": "sha256:b7e2a4d9c1f5b8e3a6d2f9c4b1e7a3d5f8c2b9e4a1d6f3c7b5e8a2d4f1c9b6",
  "hmac_signature": "v1:3d9a7c2b5e8f1a4d6c9b3e7f2a5d8c1b4e7a2d5f9c3b6e8a1d4f7c2b9e5a3d",
  "timestamp": "2026-03-28T15:01:44.882Z",
  "verified": true
}
```

**Notes**

- A `deny` decision means the action was blocked. The agent must not proceed with execution.
- A `allow` decision does not guarantee the action is safe — it means the action passed your configured policy. See the [Governance Decision Disclaimer](TERMS_OF_SERVICE.md#6-governance-decision-disclaimer).
- Latency p50: ~18ms. p99: ~85ms. See [configuration.md](configuration.md) for timeout settings.

---

### 2. `generate_receipt`

Generates a signed governance receipt for an action that has already executed. Use this when you need to retroactively document an action that bypassed `validate_action` (e.g., legacy code paths, offline operations, or actions taken before governance was enabled).

Receipts generated via this tool are flagged with `"retroactive": true` and cannot have rollback snapshots (since the action has already executed).

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action_type` | string | Yes | The category of action. See action type registry. |
| `resource` | string | Yes | The resource the action operated on. |
| `scope` | string | Yes | Scope of the action. Values: `project`, `system`, `network`, `database`, `external`. |
| `outcome` | string | Yes | What happened. Values: `success`, `error`, `rolled_back`. |
| `executed_at` | string | No | ISO 8601 UTC timestamp when the action executed. Defaults to now. |
| `metadata` | object | No | Arbitrary key-value metadata to attach to the receipt. |

**Example Request**

```json
{
  "tool": "generate_receipt",
  "parameters": {
    "action_type": "db_write",
    "resource": "users",
    "scope": "database",
    "outcome": "success",
    "executed_at": "2026-03-28T13:00:00.000Z",
    "metadata": {
      "rows_affected": 47,
      "migration": "20260328_add_user_roles"
    }
  }
}
```

**Example Response**

```json
{
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T9B",
  "retroactive": true,
  "action_type": "db_write",
  "resource": "users",
  "scope": "database",
  "outcome": "success",
  "timestamp": "2026-03-28T14:45:00.000Z",
  "executed_at": "2026-03-28T13:00:00.000Z",
  "chain_hash": "sha256:c8d3f1a7b4e2d9c5a1f8b3e6d2c9a5f1b7e4d2c8a5f3b1e7d4c2a9f5b8e3d1",
  "hmac_signature": "v1:7a2c5f9b3e8d1a4c7f2b5e8a1d4c7b2e5f8a1d4c7b2e9f5a8d3c6b1e4f7a2d",
  "verified": true
}
```

---

### 3. `capture_rollback_state`

Captures a snapshot of the current state of one or more resources. Use this before executing a high-risk operation to create a restore point you can roll back to if something goes wrong.

Typically called automatically by `validate_action` when a rollback snapshot is warranted. Call this tool directly when you need manual control over snapshot timing — for example, before a batch operation where you want a single snapshot covering multiple subsequent writes.

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `resources` | array of strings | Yes | File paths, directory paths, or database tables to snapshot. Max 50 entries per call. |
| `scope` | string | Yes | Scope of the snapshot. Values: `project`, `system`, `database`. |
| `label` | string | No | Human-readable label for this snapshot. Appears in `dingdawg rollback list` output. |
| `ttl_hours` | integer | No | How long to retain this snapshot in hours. Defaults to your plan's rollback window. Cannot exceed plan maximum. |

**Example Request**

```json
{
  "tool": "capture_rollback_state",
  "parameters": {
    "resources": [
      "./src/auth/",
      "./config/production.yaml"
    ],
    "scope": "project",
    "label": "Pre-auth-refactor snapshot",
    "ttl_hours": 72
  }
}
```

**Example Response**

```json
{
  "rollback_id": "rb_01HXYZ9K3M2P7Q8R5V1C",
  "resources_captured": 2,
  "files_captured": 14,
  "snapshot_size_bytes": 48291,
  "label": "Pre-auth-refactor snapshot",
  "expires": "2026-03-31T14:32:07.441Z",
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R5V1D"
}
```

**Notes**

- Snapshots are encrypted at rest (AES-256).
- Snapshots may contain file contents. See the [Privacy Policy](PRIVACY_POLICY.md) for how snapshot data is handled.
- Snapshots for database resources capture table state as a structured dump, not raw binary.
- After `expires`, the snapshot is permanently deleted. The receipt referencing it remains.

---

### 4. `query_receipts`

Searches and retrieves receipts from your account's audit chain. Supports filtering by date range, action type, outcome, resource pattern, and risk score.

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `from` | string | No | ISO 8601 date or datetime. Return receipts at or after this time. |
| `to` | string | No | ISO 8601 date or datetime. Return receipts at or before this time. |
| `action_type` | string or array | No | Filter to one or more action types. Example: `"file_write"` or `["file_write", "shell_exec"]`. |
| `outcome` | string or array | No | Filter to one or more outcomes. Values: `success`, `denied`, `error`, `rolled_back`. |
| `resource_pattern` | string | No | Glob pattern to match against the `resource` field. Example: `"./src/**"`. |
| `min_risk_score` | integer | No | Return only receipts with `risk_score` at or above this value (0–100). |
| `limit` | integer | No | Maximum number of receipts to return. Default: 50. Max: 500. |
| `offset` | integer | No | Pagination offset. Default: 0. |
| `order` | string | No | Sort order. Values: `asc`, `desc`. Default: `desc` (newest first). |

**Example Request — Get all denied actions in the past 7 days**

```json
{
  "tool": "query_receipts",
  "parameters": {
    "from": "2026-03-21T00:00:00Z",
    "to": "2026-03-28T23:59:59Z",
    "outcome": "denied",
    "limit": 100,
    "order": "asc"
  }
}
```

**Example Response**

```json
{
  "total": 3,
  "returned": 3,
  "offset": 0,
  "receipts": [
    {
      "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R5U8Z",
      "action_type": "shell_exec",
      "resource": "rm -rf /",
      "scope": "system",
      "outcome": "denied",
      "risk_score": 100,
      "deny_reason": "Destructive system-scope command denied at governance level strict.",
      "timestamp": "2026-03-22T09:14:33.001Z",
      "verified": true
    },
    {
      "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R6A2F",
      "action_type": "env_write",
      "resource": ".env.production",
      "scope": "project",
      "outcome": "denied",
      "risk_score": 88,
      "deny_reason": "Production environment file write denied at governance level strict. Use the secrets manager.",
      "timestamp": "2026-03-24T16:42:11.774Z",
      "verified": true
    },
    {
      "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R6B3G",
      "action_type": "git_force",
      "resource": "origin/main",
      "scope": "project",
      "outcome": "denied",
      "risk_score": 95,
      "deny_reason": "Force push to main branch denied at governance level strict.",
      "timestamp": "2026-03-27T11:07:58.220Z",
      "verified": true
    }
  ]
}
```

**Example Request — Export all receipts for a specific file path**

```json
{
  "tool": "query_receipts",
  "parameters": {
    "resource_pattern": "./src/auth/**",
    "limit": 500
  }
}
```

---

### 5. `check_status`

Returns the current governance status for the account: plan details, action usage, chain integrity, and service health.

**Parameters**

None required.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `include_chain_verification` | boolean | No | If `true`, runs a full chain integrity check against all receipts. May be slow for large chains. Default: `false` (returns cached verification result). |

**Example Request**

```json
{
  "tool": "check_status",
  "parameters": {
    "include_chain_verification": false
  }
}
```

**Example Response**

```json
{
  "account": {
    "email": "you@example.com",
    "plan": "free",
    "seats": 1
  },
  "usage": {
    "actions_today": 47,
    "daily_limit": 200,
    "reset_at": "2026-03-29T00:00:00Z",
    "passthrough_mode": false
  },
  "governance": {
    "level": "standard",
    "receipts_total": 47,
    "rollbacks_active": 3,
    "chain_integrity": "verified",
    "chain_last_verified": "2026-03-28T14:30:00Z"
  },
  "service": {
    "api_endpoint": "https://governance.dingdawg.com",
    "latency_p50_ms": 18,
    "latency_p99_ms": 84,
    "status": "operational",
    "status_page": "https://status.dingdawg.com"
  }
}
```

**Notes**

- `passthrough_mode: true` means the daily or monthly action cap has been reached. Actions are still executing but governance evaluation is paused until the limit resets.
- `chain_integrity: "verified"` is a cached result updated every 15 minutes. Pass `include_chain_verification: true` to force a live check.

---

### 6. `generate_audit_report`

Generates a structured audit report for a specified time period. Returns a summary of all governed actions, decisions, risk distribution, denied actions, and rollback activity. Useful for compliance exports, incident reviews, and team reporting.

**Parameters**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `from` | string | Yes | ISO 8601 date or datetime. Start of the reporting period. |
| `to` | string | Yes | ISO 8601 date or datetime. End of the reporting period. |
| `format` | string | No | Output format. Values: `json`, `csv`, `pdf_summary`. Default: `json`. CSV and PDF require Builder plan or above. |
| `include_receipts` | boolean | No | If `true`, includes the full receipt list in the report. Default: `false` (summary only). |
| `filter_action_types` | array of strings | No | Limit the report to specific action types. |

**Example Request**

```json
{
  "tool": "generate_audit_report",
  "parameters": {
    "from": "2026-03-01T00:00:00Z",
    "to": "2026-03-31T23:59:59Z",
    "format": "json",
    "include_receipts": false
  }
}
```

**Example Response**

```json
{
  "report_id": "rpt_01HXYZ9K3M2P7Q8R7C4H",
  "period": {
    "from": "2026-03-01T00:00:00Z",
    "to": "2026-03-31T23:59:59Z"
  },
  "generated_at": "2026-03-28T15:00:00Z",
  "summary": {
    "total_actions": 1247,
    "allowed": 1231,
    "denied": 14,
    "errors": 2,
    "rolled_back": 8,
    "deny_rate_pct": 1.12,
    "avg_risk_score": 19.4,
    "chain_integrity": "verified"
  },
  "by_action_type": {
    "file_write": 614,
    "shell_exec": 298,
    "api_call": 187,
    "file_delete": 91,
    "db_write": 45,
    "git_push": 12
  },
  "top_denied_resources": [
    { "resource": "rm -rf /", "count": 3 },
    { "resource": ".env.production", "count": 6 },
    { "resource": "origin/main (force)", "count": 5 }
  ],
  "rollback_activity": {
    "snapshots_created": 43,
    "rollbacks_executed": 8,
    "rollback_success_rate_pct": 100.0
  },
  "export_url": null,
  "format": "json"
}
```

**Notes**

- `pdf_summary` format returns a `export_url` pointing to a signed, time-limited download URL (expires after 1 hour).
- Reports are not stored — regenerate them on demand.
- For large time ranges, report generation may take several seconds. The response is synchronous; plan for up to 30 seconds on ranges exceeding 90 days.

---

## Error Responses

All tools return a consistent error envelope when something goes wrong.

```json
{
  "error": "rate_limit_exceeded",
  "message": "Daily action limit of 200 reached. Governance paused until 2026-03-29T00:00:00Z. Upgrade at app.dingdawg.com/upgrade.",
  "retry_after": "2026-03-29T00:00:00Z"
}
```

**Common error codes**

| Code | HTTP Status | Description |
|---|---|---|
| `unauthorized` | 401 | API key missing, invalid, or revoked. |
| `forbidden` | 403 | API key valid but lacks permission for this operation. |
| `invalid_parameters` | 400 | One or more required parameters are missing or invalid. |
| `rate_limit_exceeded` | 429 | Daily or monthly action limit reached. |
| `action_type_unknown` | 400 | The `action_type` value is not in the action type registry and is not valid reverse-DNS format. |
| `resource_too_long` | 400 | The `resource` string exceeds 2048 characters. |
| `rollback_expired` | 410 | The rollback snapshot referenced by `rollback_id` has expired and been deleted. |
| `plan_limit` | 402 | The requested operation requires a paid plan. |
| `service_unavailable` | 503 | Service temporarily unavailable. Check status.dingdawg.com. |

---

## SDK Usage

**Node.js / TypeScript**

```typescript
import { DingDawgClient } from 'dingdawg-governance';

const client = new DingDawgClient({ apiKey: process.env.DINGDAWG_API_KEY });

const result = await client.validateAction({
  actionType: 'file_write',
  resource: './src/index.ts',
  scope: 'project',
});

if (result.decision === 'deny') {
  throw new Error(`Action denied: ${result.denyReason}`);
}

// Proceed with action, receipt stored automatically
console.log(`Receipt: ${result.receiptId}`);
```

**Python**

```python
from dingdawg import governance

client = governance.Client(api_key=os.environ["DINGDAWG_API_KEY"])

result = client.validate_action(
    action_type="file_write",
    resource="./src/index.ts",
    scope="project",
)

if result.decision == "deny":
    raise Exception(f"Action denied: {result.deny_reason}")

print(f"Receipt: {result.receipt_id}")
```

---

*See also: [Quickstart](quickstart.md) | [Configuration](configuration.md) | [Receipt Format](receipt-format.md)*
