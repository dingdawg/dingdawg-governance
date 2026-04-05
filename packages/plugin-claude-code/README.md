# DingDawg Governance for Claude Code

[![npm version](https://img.shields.io/npm/v/@dingdawg/plugin-claude-code.svg)](https://www.npmjs.com/package/@dingdawg/plugin-claude-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Every Claude Code action receipted. Capability-gated. Rollback-ready.

```bash
/plugin install dingdawg/governance-mcp
```

DingDawg Governance wraps your Claude Code session with a tamper-evident audit layer. Every file write, shell command, and message is validated before it runs and receipted after it completes — giving you a verifiable record you can audit, share, or roll back at any time. Works in any project, no code changes required.

---

## Setup

**Step 1.** Install the plugin:

```bash
/plugin install dingdawg/governance-mcp
```

**Step 2.** Add your API key:

```bash
export DINGDAWG_API_KEY=your_key_here
```

Get your key at [app.dingdawg.com/settings/api](https://app.dingdawg.com/settings/api) — free, no credit card.

That's it. Governance hooks activate automatically on every session.

---

## What You Get

- **Pre-execution validation** — Every write, command, and tool call checked against your policy before it runs. Blocked actions never touch your filesystem.
- **Cryptographic receipts** — Tamper-evident record for every action. Each receipt gets a unique ID (`gvn_01J5KX2`) and a public verification URL.
- **One-command rollback** — Undo any file write by referencing its receipt ID. State is captured before every write automatically.
- **Slash commands** — `/governance-status`, `/governance-receipts`, `/governance-audit` available in every session.
- **Background governance monitor** — Tracks connectivity, flags plan limits, and produces an end-of-session summary without interrupting your flow.

---

## See It In Action

```
> Edit the payment processing module

# DingDawg Governance: checking... allowed
[Edit completes]
# [DingDawg Governance] receipt: gvn_01J5KX2
# verify: https://receipts.dingdawg.com/gvn_01J5KX2

> Run the test suite

# DingDawg Governance: checking... allowed
[Tests complete]
# [DingDawg Governance] receipt: gvn_01J5KX3

> Delete all files in /var/prod

# [DingDawg Governance] BLOCKED
# Reason: Destructive operation outside project root requires
#         explicit policy approval.
# Review: https://app.dingdawg.com/governance/policies

> Roll back gvn_01J5KX2

# [DingDawg Governance] Rolling back gvn_01J5KX2...
# Restored: src/payments/processor.ts → prior state confirmed.
```

---

## How It Works

| Layer | What it does |
|-------|-------------|
| **PreToolUse hook** | Validates every write, run, and send against your policy before execution. Blocked actions never run. |
| **PostToolUse hook** | Generates a tamper-evident receipt after each successful action. Receipt IDs appear inline. |
| **Governance monitor** | Background subagent tracking connectivity, quotas, and session-level activity. |
| **Slash commands** | On-demand status, receipt browsing, and audit reports — sourced from the governance server, not Claude's context window. |

Read-only operations (`Read`, `Glob`, `Grep`) are skipped entirely — zero overhead on pure exploration.

**Graceful degradation:** if the governance server is unreachable, all hooks exit cleanly and allow the action. Governance is never a blocker.

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/governance-status` | Current plan, mode, and session usage |
| `/governance-receipts` | Browse and search receipts for the current session |
| `/governance-audit` | Generate a full compliance-ready audit report |

---

## How Receipts Work

Every receipted action gets a unique ID. Each receipt stores:

- The tool called and its exact inputs
- Timestamp (UTC)
- A hash of the output for tamper detection
- The session ID for cross-session correlation

Receipts are queryable via `/governance-receipts` or the dashboard at [app.dingdawg.com/governance/receipts](https://app.dingdawg.com/governance/receipts). Every receipt has a public verification URL — share it with your team or include it in compliance reports.

---

## Rollback

For reversible operations (file writes), the governance layer captures prior state automatically. To undo any action:

```
Roll back gvn_01J5KX2
```

Claude Code calls `rollback_action` on your behalf and confirms the restore. No manual git reset, no hunting through history.

---

## Plans

| Plan | Actions/day | Rollback | Audit reports | Support |
|------|-------------|---------|--------------|---------|
| **Free** | 200 | — | — | Docs |
| **Pro** — $29/mo | 10,000 | 30-day window | Unlimited | Email |
| **Business** — $149/mo | Unlimited | 90-day window | Compliance PDF | Priority |

No credit card required to start. When you hit the limit:

```bash
npx dingdawg upgrade
```

Full pricing: [dingdawg.com/governance#pricing](https://dingdawg.com/governance#pricing)

---

## Documentation

**[dingdawg.com/governance/docs](https://dingdawg.com/governance/docs)**

- [Getting started](https://dingdawg.com/governance/docs/getting-started)
- [Policy configuration](https://dingdawg.com/governance/docs/policies)
- [Capability gates and custom rules](https://dingdawg.com/governance/docs/capability-gates)
- [Webhook integrations](https://dingdawg.com/governance/docs/webhooks) — Slack, PagerDuty, Jira
- [Enterprise SSO and team management](https://dingdawg.com/governance/docs/enterprise)
- [MCP server reference](https://dingdawg.com/governance/docs/tools)

---

[github.com/dingdawg/governance-mcp](https://github.com/dingdawg/governance-mcp) — Issues and pull requests welcome.

Built by [DingDawg](https://dingdawg.com) — Trust layer for the agentic internet.
