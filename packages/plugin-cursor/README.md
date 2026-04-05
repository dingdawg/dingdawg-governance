# DingDawg Governance for Cursor

[![npm version](https://img.shields.io/npm/v/@dingdawg/plugin-cursor.svg)](https://www.npmjs.com/package/@dingdawg/plugin-cursor)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> Every Cursor AI action receipted. Capability-gated. Rollback-ready.

```bash
cursor plugin install dingdawg/governance-mcp
```

DingDawg Governance wraps your Cursor AI session with a tamper-evident audit layer. Every file write, terminal command, and state-changing operation is validated before it runs and receipted after it completes — giving you a verifiable record you can audit, share, or roll back at any time. Works with any project. Distributable to your entire team through the Cursor Team Marketplace.

---

## Setup

**Step 1.** Install the plugin:

```bash
cursor plugin install dingdawg/governance-mcp
```

**Step 2.** Add your API key:

```bash
export DINGDAWG_API_KEY=your_key_here
```

Get your key at [app.dingdawg.com/settings/api](https://app.dingdawg.com/settings/api) — free, no credit card.

The plugin installs the governance rules, registers the MCP server, and enables the governance skill automatically.

---

## What You Get

- **Pre-execution validation** — Every write, terminal command, and network request checked against your policy before it runs. Blocked actions never touch your filesystem.
- **Cryptographic receipts** — Tamper-evident record for every action. Each receipt has a unique ID (`gvn_01J5KX2`) and a public verification URL.
- **One-command rollback** — Undo any file write by referencing its receipt ID. State is captured before every write automatically.
- **Inspectable governance rules** — `.cursor/rules/governance.mdc` is fully readable and customizable. No black box.
- **Team Marketplace ready** — Distribute governance to your entire team with org-level policy control. One-time setup, zero per-developer friction.

---

## See It In Action

```
> Update the payment processing module

# DingDawg Governance: checking... allowed
[File edits complete]
# [DingDawg Governance] receipt: gvn_01J5KX2
# verify: https://receipts.dingdawg.com/gvn_01J5KX2

> Run the integration tests

# DingDawg Governance: checking... allowed
[Tests run]
# [DingDawg Governance] receipt: gvn_01J5KX3

> Remove the entire /var/prod directory

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
| **Pre-action validation** | Before any file write, terminal command, or network request, Cursor calls the governance server. Blocked actions are stopped before they reach your filesystem. |
| **Tamper-evident receipts** | After each successful action, a receipt is generated with a unique ID, output hash, and public verification URL. |
| **Rollback targets** | Prior state is captured before any write is applied. Undo any action by referencing its receipt ID. |
| **Governance rules** | `.cursor/rules/governance.mdc` defines what requires validation, what gets receipted, and when rollback state is captured. Fully inspectable and customizable. |
| **Session check** | At session start, Cursor checks governance connectivity and plan status. One line of output — then silent. |

Read-only operations (file reads, search, directory listing, GET requests) are skipped entirely — zero overhead on pure exploration.

**Graceful degradation:** if the governance server is unreachable, all checks exit cleanly and allow the action. Governance is never a blocker.

---

## Customizing Rules

The governance rules live in `.cursor/rules/governance.mdc`. You can extend them to fit your workflow:

```
# governance.mdc

# Require validation for all writes outside /src
validate: write outside /src

# Skip governance for test fixtures
exclude: /tests/fixtures/**

# Require receipts for all bash commands
receipt: bash *
```

Changes take effect immediately — no reload required.

---

## Team Marketplace Distribution

DingDawg Governance is built for teams in regulated or compliance-heavy environments.

**Distribute to your entire team in 3 steps:**

1. Publish the plugin to your team's private marketplace in Cursor settings.
2. Every developer gets governance active by default — no per-developer setup.
3. Set governance policies at the organization level via the dashboard. Every team member operates under the same rules.

This makes DingDawg Governance ideal for:

- SOC 2 Type II compliance programs
- Regulated industries (fintech, healthcare, legal)
- Engineering teams that need a shared, auditable trail of AI-assisted changes
- Organizations deploying AI agents at scale

Learn more: [dingdawg.com/governance/enterprise](https://dingdawg.com/governance/enterprise)

---

## How Receipts Work

Every receipted action gets a unique ID (e.g., `gvn_01J5KX2`). Each receipt stores:

- The operation type and its exact inputs
- Timestamp (UTC)
- A hash of the output for tamper detection
- The session ID for cross-session correlation

Receipts are queryable from the governance dashboard at [app.dingdawg.com/governance/receipts](https://app.dingdawg.com/governance/receipts). Every receipt has a public verification URL — share it in a PR, link it in a Slack thread, or attach it to a compliance report.

---

## Rollback

For reversible operations (file writes), the governance layer captures prior state automatically before any change is applied. To undo a specific action, tell Cursor:

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
- [Team Marketplace distribution guide](https://dingdawg.com/governance/docs/team-marketplace)
- [MCP server reference](https://dingdawg.com/governance/docs/tools)

---

[github.com/dingdawg/governance-mcp](https://github.com/dingdawg/governance-mcp) — Issues and pull requests welcome.

Built by [DingDawg](https://dingdawg.com) — Trust layer for the agentic internet.
