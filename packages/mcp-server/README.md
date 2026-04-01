# dingdawg-governance

[![npm version](https://img.shields.io/npm/v/dingdawg-governance.svg)](https://www.npmjs.com/package/dingdawg-governance)
[![npm downloads](https://img.shields.io/npm/dm/dingdawg-governance.svg)](https://www.npmjs.com/package/dingdawg-governance)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Every AI action receipted. Capability-gated. Rollback-ready.

```bash
npx dingdawg-governance init
```

The MCP server that adds a governance layer to any AI agent pipeline. Every write, shell command, and state-changing operation is validated before it runs and receipted after it completes — giving you a tamper-evident audit trail you can query, export, or roll back at any time. Built for teams running Claude Code, Codex, Cursor, or any MCP-compatible agent.

---

## Quick Start

```bash
# Install globally
npm install -g dingdawg-governance

# Start the server
DINGDAWG_API_KEY=your_key dingdawg-governance

# Or point your MCP client at it directly
npx dingdawg-governance
```

Add to your MCP client config:

```json
{
  "mcpServers": {
    "dingdawg-governance": {
      "command": "npx",
      "args": ["dingdawg-governance"],
      "env": {
        "DINGDAWG_API_KEY": "your_key_here"
      }
    }
  }
}
```

Get your API key at [app.dingdawg.com/settings/api](https://app.dingdawg.com/settings/api) — free, no credit card.

---

## What You Get

- **Pre-execution validation** — Every action checked against your policy before it runs. Blocked actions never touch your filesystem.
- **Cryptographic receipts** — Tamper-evident record for every action. Each receipt gets a unique ID, a hash of the output, and a public verification URL.
- **One-command rollback** — Undo any file write by referencing its receipt ID. Prior state is captured automatically before every write.
- **Real-time trust scores** — The governance server tracks behavioral patterns across sessions and surfaces anomalies before they become incidents.
- **Compliance reports in seconds** — Generate SOC 2 and ISO 27001-aligned audit reports as signed PDF or structured JSON. One API call.

---

## How It Works

```
Your AI Agent
    │
    │  MCP (JSON-RPC)
    ▼
dingdawg-governance          ← this package (open source, thin client)
    │
    │  HTTPS
    ▼
governance.dingdawg.com            ← governance intelligence (server-side)
    │
    ├── validate_action            ← APPROVED / FLAGGED / BLOCKED
    ├── generate_receipt           ← gvn_01J5KX2 (cryptographic)
    ├── capture_rollback_state     ← snapshot before every write
    ├── rollback_action            ← restore prior state by receipt ID
    ├── query_receipts             ← audit trail, filterable
    └── generate_audit_report     ← SOC 2 / ISO 27001 PDF
```

The client is intentionally thin. All governance intelligence — policy evaluation, trust scoring, receipt signing — runs server-side on infrastructure we maintain. You get the benefit without the operational burden.

---

## See It In Action

```
Agent: "Edit the payment processing module"

→ validate_action called
← APPROVED  [12ms]

[File edit completes]

→ generate_receipt called
← receipt: gvn_01J5KX2
   verify: https://receipts.dingdawg.com/gvn_01J5KX2

---

Agent: "Delete all files in /var/prod"

→ validate_action called
← BLOCKED
   Reason: Destructive operation outside project root requires
           explicit policy approval.
   Policy: https://app.dingdawg.com/governance/policies

---

Agent: "Roll back gvn_01J5KX2"

→ rollback_action called
← Restored: src/payments/processor.ts
   State confirmed. Receipt updated.
```

---

## MCP Tools Exposed

| Tool | What it does |
|------|-------------|
| `validate_action` | Pre-execution governance check. Returns `APPROVED`, `FLAGGED`, or `BLOCKED` with reason code and risk score. |
| `generate_receipt` | Post-execution cryptographic receipt with tamper-evident output hash. |
| `capture_rollback_state` | Snapshot current state before destructive or high-risk operations. |
| `rollback_action` | Restore prior state from a receipt ID. Confirms what changed. |
| `query_receipts` | Search receipts by date, agent, action type, or status. Export-ready. |
| `check_status` | Current tier, daily usage, quota percentage, and active governance alerts. |
| `generate_audit_report` | On-demand compliance report — SOC 2, ISO 27001, or custom policy framework. |

---

## Configuration

| Environment variable | Required | Description |
|---------------------|----------|-------------|
| `DINGDAWG_API_KEY` | Yes (for full governance) | Your API key from [app.dingdawg.com/settings/api](https://app.dingdawg.com/settings/api) |
| `GOVERNANCE_API_URL` | No | Override API endpoint. Default: `https://governance.dingdawg.com` |
| `GOVERNANCE_TIMEOUT_MS` | No | Request timeout in ms. Default: `5000` |
| `GOVERNANCE_FAIL_OPEN` | No | If `true`, allow actions when governance server is unreachable. Default: `true` |

No API key? The server runs in **pass-through mode** — the MCP tools are available but receipts are not stored. Pass-through mode is useful for local testing.

---

## Graceful Degradation

If the governance server is unreachable, all tools exit cleanly and return a pass-through response. The server is designed to be non-blocking. Your agent continues to work — governance is best-effort when connectivity fails, not a hard dependency.

```
→ validate_action called
← GOVERNANCE_UNAVAILABLE (pass-through)
   All checks skipped. Action allowed.
   [Governance server unreachable — check https://status.dingdawg.com]
```

---

## Plans

| Plan | Governed actions/day | Rollback window | Audit reports | Support |
|------|---------------------|----------------|--------------|---------|
| **Free** | 200 | — | — | Docs |
| **Pro** — $29/mo | 10,000 | 30 days | Unlimited | Email |
| **Business** — $149/mo | Unlimited | 90 days | Compliance PDF | Priority |

No credit card required to start. Upgrade when you hit the limit:

```bash
npx dingdawg upgrade
```

Full pricing: [dingdawg.com/governance#pricing](https://dingdawg.com/governance#pricing)

---

## Integrations

This MCP server is the core. Agent-specific plugins wrap it with native hooks for each platform:

| Platform | Package | Install |
|----------|---------|---------|
| Claude Code | `@dingdawg/plugin-claude-code` | `/plugin install dingdawg/governance-mcp` |
| OpenAI Codex | `@dingdawg/plugin-codex` | `codex plugin install dingdawg/governance-mcp` |
| Cursor | `@dingdawg/plugin-cursor` | `cursor plugin install dingdawg/governance-mcp` |

All plugins use this package under the hood. If your platform supports MCP, this package is all you need.

---

## Documentation

**[dingdawg.com/governance/docs](https://dingdawg.com/governance/docs)**

- [Getting started](https://dingdawg.com/governance/docs/getting-started)
- [MCP tool reference](https://dingdawg.com/governance/docs/tools)
- [Policy configuration](https://dingdawg.com/governance/docs/policies)
- [Webhook integrations](https://dingdawg.com/governance/docs/webhooks) — Slack, PagerDuty, Jira
- [Audit report formats](https://dingdawg.com/governance/docs/reports)
- [Enterprise SSO and team management](https://dingdawg.com/governance/docs/enterprise)

---

## Contributing

Issues and pull requests welcome. The client is intentionally thin — governance intelligence runs server-side. PRs that keep the client light are prioritized.

[github.com/dingdawg/governance-mcp](https://github.com/dingdawg/governance-mcp)

---

Built by [DingDawg](https://dingdawg.com) — Trust layer for the agentic internet.
