# DingDawg Governance for OpenAI Codex

[![npm version](https://img.shields.io/npm/v/@dingdawg/plugin-codex.svg)](https://www.npmjs.com/package/@dingdawg/plugin-codex)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Every Codex action receipted. Capability-gated. Rollback-ready.

```bash
codex plugin install dingdawg/governance-mcp
```

DingDawg Governance wraps your Codex session with a tamper-evident audit layer. Every file write, shell command, and network request is validated before it runs and receipted after it completes — giving you a verifiable record you can audit, share, or roll back at any time. No code changes to your project. No agent reconfiguration.

---

## Setup

**Step 1.** Install the plugin:

```bash
codex plugin install dingdawg/governance-mcp
```

**Step 2.** Add your API key:

```bash
export DINGDAWG_API_KEY=your_key_here
```

Get your key at [app.dingdawg.com/settings/api](https://app.dingdawg.com/settings/api) — free, no credit card.

The plugin registers the MCP server, activates the governance skill, and starts intercepting governed operations automatically.

---

## What You Get

- **Pre-execution validation** — Every write, shell command, and network request checked against your policy before it runs. Blocked actions never touch your filesystem.
- **Cryptographic receipts** — Tamper-evident record for every action. Each receipt has a unique ID and a public verification URL.
- **One-command rollback** — Undo any file write by referencing its receipt ID. State is captured before every write automatically.
- **Session governance check** — Connectivity and quota status at session start. One line — then out of the way.
- **Audit-ready exports** — Query receipts by date, agent, or action type. Generate SOC 2 and ISO 27001 reports on demand.

---

## See It In Action

```
> Refactor the authentication module

# DingDawg Governance: checking... allowed
[File edits complete]
# [DingDawg Governance] receipt: gvn_01J5KX2
# verify: https://receipts.dingdawg.com/gvn_01J5KX2

> Run the test suite

# DingDawg Governance: checking... allowed
[Tests run]
# [DingDawg Governance] receipt: gvn_01J5KX3

> Delete the legacy config directory

# [DingDawg Governance] BLOCKED
# Reason: Destructive operation outside project root requires
#         explicit policy approval.
# Review: https://app.dingdawg.com/governance/policies

> Roll back gvn_01J5KX2

# [DingDawg Governance] Rolling back gvn_01J5KX2...
# Restored: src/auth/module.ts → prior state confirmed.
```

---

## How It Works

| Layer | What it does |
|-------|-------------|
| **Pre-action validation** | Before any write, shell command, or state-changing request, Codex calls the governance server. Blocked actions are stopped before they reach your filesystem. |
| **Tamper-evident receipts** | After each successful action, a receipt is generated with a unique ID, output hash, and public verification URL. |
| **Rollback targets** | For file writes, prior state is captured automatically. Undo any action by referencing its receipt ID. |
| **Session check** | At session start, Codex checks governance connectivity and quota status. One line of output — then silent. |

Read-only operations (file reads, search, directory listing) are skipped entirely — zero overhead on pure exploration.

**Graceful degradation:** if the governance server is unreachable, all checks exit cleanly and allow the action. Governance is never a blocker.

---

## How Receipts Work

Every receipted action gets a unique ID (e.g., `gvn_01J5KX2`). Each receipt stores:

- The operation type and its exact inputs
- Timestamp (UTC)
- A hash of the output for tamper detection
- The session ID for cross-session correlation

Receipts are queryable from the governance dashboard at [app.dingdawg.com/governance/receipts](https://app.dingdawg.com/governance/receipts). Every receipt has a public verification URL — share it with your team, link it in a PR, or attach it to a compliance report.

---

## Rollback

For reversible operations (file writes), the governance layer captures prior state automatically before any change is applied. To undo a specific action, tell Codex:

```
Roll back gvn_01J5KX2
```

The governance skill calls `rollback_action` on your behalf, restores the prior state, and confirms what changed. No git hunting. No manual diffs.

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
