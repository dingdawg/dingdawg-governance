# DingDawg

**Trust layer for the agentic internet.**

AI agents are writing code, running commands, and modifying production systems. Most teams have no idea what their agents actually did — or how to undo it. DingDawg solves this with a governance layer that works with any AI agent, any platform, and any existing workflow.

Every action validated before it runs. Every action receipted after it completes. Any action reversible by receipt ID.

---

## What We Build

### DingDawg Governance

The governance layer for AI agent pipelines.

Add governance to Claude Code, OpenAI Codex, Cursor, or any MCP-compatible agent in under 2 minutes. No code changes to your project. No agent reconfiguration.

```bash
# Claude Code
/plugin install dingdawg/governance-mcp

# OpenAI Codex
codex plugin install dingdawg/governance-mcp

# Cursor
cursor plugin install dingdawg/governance-mcp

# Any MCP-compatible agent
npx dingdawg-governance
```

**200 governed actions per day. Free forever. No credit card.**

[Get started →](https://dingdawg.com/governance/docs/getting-started) · [Pricing](https://dingdawg.com/governance#pricing)

---

## The Packages

| Package | Description | Install |
|---------|-------------|---------|
| [`dingdawg-governance`](https://github.com/dingdawg/governance-mcp/tree/main/packages/mcp-server) | Core MCP server. Governance for any MCP-compatible agent. | `npx dingdawg-governance` |
| [`@dingdawg/plugin-claude-code`](https://github.com/dingdawg/governance-mcp/tree/main/packages/plugin-claude-code) | Governance plugin for Claude Code. Hooks, slash commands, monitor. | `/plugin install dingdawg/governance-mcp` |
| [`@dingdawg/plugin-codex`](https://github.com/dingdawg/governance-mcp/tree/main/packages/plugin-codex) | Governance plugin for OpenAI Codex. Pre/post-action hooks. | `codex plugin install dingdawg/governance-mcp` |
| [`@dingdawg/plugin-cursor`](https://github.com/dingdawg/governance-mcp/tree/main/packages/plugin-cursor) | Governance plugin for Cursor. Rules, skill, Team Marketplace support. | `cursor plugin install dingdawg/governance-mcp` |

---

## How It Works

```
Your AI Agent  (Claude Code / Codex / Cursor / any MCP agent)
      │
      │  MCP (JSON-RPC)
      ▼
 Client Plugin  (open source, intentionally thin)
      │
      │  HTTPS
      ▼
 governance.dingdawg.com  (governance intelligence — server-side)
      │
      ├─ validate_action      →  APPROVED / FLAGGED / BLOCKED
      ├─ generate_receipt     →  gvn_01J5KX2  (cryptographic, immutable)
      ├─ capture_rollback     →  state snapshot before every write
      ├─ rollback_action      →  restore prior state by receipt ID
      ├─ query_receipts       →  audit trail, filterable, export-ready
      └─ generate_audit       →  SOC 2 / ISO 27001 PDF, on demand
```

The client packages are open source and intentionally thin. All governance intelligence — policy evaluation, trust scoring, receipt signing — runs server-side. You get the benefit without the operational burden.

---

## What Governance Looks Like

```
> Edit the payment processing module

# DingDawg Governance: checking... allowed
[File edits complete]
# [DingDawg Governance] receipt: gvn_01J5KX2
# verify: https://receipts.dingdawg.ai/gvn_01J5KX2

> Delete all files in /var/prod

# [DingDawg Governance] BLOCKED
# Reason: Destructive operation outside project root requires
#         explicit policy approval.

> Roll back gvn_01J5KX2

# [DingDawg Governance] Rolling back gvn_01J5KX2...
# Restored: src/payments/processor.ts → prior state confirmed.
```

---

## Who Uses DingDawg Governance

**Individual developers** who want a verifiable record of what their AI agent actually did — and the ability to undo it.

**Engineering teams** who need a shared audit trail for AI-assisted changes. Distribute governance to your entire team through Cursor Team Marketplace or Claude Code with org-level policy control.

**Regulated industries** — fintech, healthcare, legal — where AI-assisted code changes need to meet SOC 2 Type II, ISO 27001, or internal compliance requirements.

---

## Plans

| | Free | Pro | Business |
|---|---|---|---|
| Governed actions/day | 200 | 10,000 | Unlimited |
| Rollback window | — | 30 days | 90 days |
| Audit reports | — | Unlimited | Compliance PDF |
| Support | Docs | Email | Priority |
| Price | Free | $29/mo | $149/mo |

No credit card required to start.

[See full pricing →](https://dingdawg.com/governance#pricing)

---

## Documentation

**[dingdawg.com/governance/docs](https://dingdawg.com/governance/docs)**

- [Getting started](https://dingdawg.com/governance/docs/getting-started)
- [MCP tool reference](https://dingdawg.com/governance/docs/tools)
- [Policy configuration](https://dingdawg.com/governance/docs/policies)
- [Webhook integrations](https://dingdawg.com/governance/docs/webhooks) — Slack, PagerDuty, Jira
- [Enterprise SSO and team management](https://dingdawg.com/governance/docs/enterprise)
- [Audit report formats](https://dingdawg.com/governance/docs/reports)

---

## Contributing

The client packages are open source. Issues and pull requests welcome on any package. The governance intelligence runs server-side — PRs that keep the clients thin are prioritized.

[github.com/dingdawg/governance-mcp](https://github.com/dingdawg/governance-mcp)

---

[dingdawg.com](https://dingdawg.com) · [app.dingdawg.com](https://app.dingdawg.com) · [docs](https://dingdawg.com/governance/docs) · [status](https://status.dingdawg.com)
