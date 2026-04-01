# DingDawg Governance

[![npm version](https://img.shields.io/npm/v/dingdawg-governance.svg)](https://www.npmjs.com/package/dingdawg-governance)
[![npm downloads](https://img.shields.io/npm/dm/dingdawg-governance.svg)](https://www.npmjs.com/package/dingdawg-governance)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> Every AI action receipted. Capability-gated. Rollback-ready.

AI Governance-as-a-Service via MCP. Every write, shell command, and state-changing operation your agent makes is validated before it runs and cryptographically receipted after it completes — giving you a tamper-evident audit trail you can query, export, or roll back at any time.

Works with Claude Code, Codex, Cursor, Windsurf, and any MCP-compatible agent.

---

## Install

```bash
npm install dingdawg-governance
```

---

## Quick Start

```bash
# Authenticate (free — no credit card)
npx dingdawg-governance auth login

# Start the governance MCP server
DINGDAWG_API_KEY=your_key npx dingdawg-governance
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

Get your free API key at [app.dingdawg.com/settings/api](https://app.dingdawg.com/settings/api).

---

## What You Get

- **Pre-execution validation** — Every action checked against your policy before it runs. Blocked actions never touch your filesystem.
- **Cryptographic receipts** — Tamper-evident record for every action with a unique ID, output hash, and public verification URL.
- **One-command rollback** — Undo any file write by referencing its receipt ID. Prior state is captured automatically before every write.
- **Real-time trust scores** — Behavioral pattern tracking across sessions surfaces anomalies before they become incidents.
- **Compliance reports in seconds** — SOC 2 and ISO 27001-aligned audit reports as signed PDF or structured JSON. One API call.

---

## MCP Tools

| Tool | What it does |
|------|-------------|
| `validate_action` | Pre-execution check. Returns `APPROVED`, `FLAGGED`, or `BLOCKED` with reason code and risk score. |
| `generate_receipt` | Post-execution cryptographic receipt with tamper-evident output hash. |
| `capture_rollback_state` | Snapshot current state before destructive or high-risk operations. |
| `rollback_action` | Restore prior state from a receipt ID. |
| `query_receipts` | Search receipts by date, agent, action type, or status. Export-ready. |
| `check_status` | Current tier, daily usage, quota, and active governance alerts. |
| `generate_audit_report` | On-demand compliance report — SOC 2, ISO 27001, or custom policy framework. |

---

## Plans

| Plan | Governed actions/day | Rollback window | Audit reports |
|------|---------------------|----------------|--------------|
| **Free** | 200 | — | — |
| **Pro** — $29/mo | 10,000 | 30 days | Unlimited |
| **Business** — $149/mo | Unlimited | 90 days | Compliance PDF |

No credit card to start. Full pricing: [dingdawg.com/governance#pricing](https://dingdawg.com/governance#pricing)

---

## Documentation

Full docs at **[dingdawg.com/governance/docs](https://dingdawg.com/governance/docs)**

- [Getting started](./docs/getting-started.md)
- [MCP tool reference](https://dingdawg.com/governance/docs/tools)
- [Policy configuration](https://dingdawg.com/governance/docs/policies)
- [Audit report formats](https://dingdawg.com/governance/docs/reports)
- [Enterprise SSO and team management](https://dingdawg.com/governance/docs/enterprise)

---

## Contributing

Issues and pull requests welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

[github.com/dingdawg/governance-mcp](https://github.com/dingdawg/governance-mcp)

---

Built by [DingDawg](https://dingdawg.com) — Trust layer for the agentic internet.
