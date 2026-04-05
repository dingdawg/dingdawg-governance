# DingDawg Governance — Architecture Overview

This document describes how DingDawg Governance works at a high level: what happens when an AI agent takes an action, how receipts are structured and chained, and how the policy engine evaluates requests.

---

## How It Works

DingDawg Governance sits between your AI agent and your environment. Every time the agent attempts an action — write a file, run a shell command, call an API — DingDawg evaluates it against your configured governance policy before it executes.

```
AI Agent
   │
   │  (proposed action)
   ▼
DingDawg MCP Server
   │
   ├─ Evaluate against policy
   ├─ Assign risk score
   ├─ Generate signed receipt
   ├─ Create rollback snapshot (if applicable)
   │
   ├── ALLOW ──► Action executes in your environment
   │               Receipt stored in audit chain
   │
   └── DENY  ──► Action blocked
                  Receipt stored (denial documented)
```

The governance layer introduces minimal latency (median ~18ms) because it runs as a local MCP server process — no round-trip to a remote proxy is required for the interception step. Receipt signing and storage happen asynchronously after the decision is returned.

---

## Components

### MCP Server

DingDawg runs as a local Model Context Protocol (MCP) server. Your AI coding tool (Claude Code, Codex, Cursor, or any MCP-compatible client) connects to it at startup. The server exposes six tools your agent calls to request governance decisions, generate receipts, query audit history, and produce compliance reports.

Because the server runs locally, it works without modifying your agent's source code. Add DingDawg to your `.mcp.json` once and every subsequent agent session is governed automatically.

### Governance API

The MCP server communicates with DingDawg's cloud governance API to:

- Validate action requests against your policy configuration
- Store signed receipts in the centralized audit chain
- Manage rollback snapshots
- Serve receipt queries and audit reports

The API endpoint is `https://governance.dingdawg.com`. All communication is over TLS 1.2 or higher.

### Receipt Store

Every governed action produces a receipt. Receipts are stored in an append-only audit chain — each receipt cryptographically references the one before it, making the chain tamper-evident. If any historical receipt is altered, all subsequent chain hashes fail verification.

Receipts are immutable once written. Rollback state (snapshots) is separate and time-limited per your plan's retention window. The receipt record itself persists for your plan's full receipt history period.

### Policy Engine

The policy engine evaluates Action Requests against:

1. **Your governance level** — `strict`, `standard`, or `permissive`. Controls which action types are blocked by default, which require justification, and how aggressively out-of-scope resource access is handled.
2. **Your action filters** — the `actions.include`, `actions.exclude`, and `resource_patterns` settings in `.governance.yaml` narrow which actions are evaluated and which pass through without governance.
3. **Risk scoring** — each Action Request receives a risk score (0–100) based on action type, scope, resource characteristics, and pattern analysis. Risk scores inform the policy decision and are stored in the receipt.
4. **Team policies** (Builder plan and above) — shared policy definitions that override or extend local `.governance.yaml` settings across all members of a team account.

The policy engine is server-side. Policy updates take effect immediately on your next governed action without restarting the MCP server.

---

## Receipt Format

Each receipt is a signed JSON document containing:

- A unique receipt ID (`ddgr_` + ULID)
- Action metadata: type, resource, scope, outcome, timestamp
- Risk score and governance level
- A chain hash linking this receipt to the previous one in your account's chain
- An HMAC-SHA256 signature for tamper detection
- Rollback references (if a snapshot was created)

Receipts follow the **DingDawg Governance Receipt Format (DGRF) v1.0** — an open standard published under CC0. Any system can generate or verify DGRF-compatible receipts. See [receipt-format.md](receipt-format.md) for the full specification including hash chain computation and signature format.

---

## Rollback

When governance is enabled and an action is allowed, DingDawg optionally captures a rollback snapshot of the affected resources before execution. If something goes wrong, you can restore prior state with a single command:

```bash
dingdawg rollback ddgr_01HXYZ9K3M2P7Q8R4T6W
```

Rollback snapshots:

- Are encrypted at rest (AES-256)
- Are retained for your plan's rollback window (Free: 7 days, Builder: 30 days, Team: 90 days, Enterprise: 1 year)
- Are automatically deleted after expiry
- Cover the resources declared in the Action Request — not the entire filesystem

The receipt record always remains after a rollback snapshot expires. You retain the full audit trail regardless of rollback state.

---

## Offline Mode

DingDawg supports an offline mode for environments without API access. In offline mode:

- The MCP server generates receipts locally using a locally cached signing key
- No API call is made for governance decisions
- Offline receipts are flagged `"offline": true` in the receipt JSON
- Offline receipts cannot be verified via the server-side verification endpoint
- Rollback snapshots are stored locally (not in cloud storage)

Enable offline mode with:

```bash
DINGDAWG_OFFLINE_MODE=true
```

Offline mode is intended for air-gapped environments and local development without network access. For production use, cloud-connected mode with server-side receipt verification is recommended.

---

## Security Model

**Receipt integrity.** Receipts are signed with HMAC-SHA256 using a server-managed, account-specific signing key. The signing key is never exposed to the client. Verification is done through the verification endpoint.

**Chain tamper detection.** Each receipt includes a hash of the previous receipt's chain hash combined with the current receipt's canonical payload. Modifying any historical receipt breaks all subsequent chain hashes, making tampering detectable.

**Transport security.** All API communication uses TLS 1.2 or higher. The CLI enforces TLS and does not support plain HTTP fallback.

**API key scope.** API keys are scoped to a single account. Keys can be rotated at any time at [app.dingdawg.com/keys](https://app.dingdawg.com/keys). Compromised keys should be rotated immediately — all receipts generated under the old key remain valid and verifiable.

**Data isolation.** Each account's audit chain, receipt store, and rollback snapshots are logically isolated. Account data is never commingled across customers.

---

## Integrations

DingDawg integrates at the MCP layer, which means it works with any agent that supports the Model Context Protocol. Officially supported:

- **Claude Code** — add via `claude mcp add dingdawg-governance npx dingdawg-governance` or `.mcp.json`
- **OpenAI Codex** — add via `.mcp.json`
- **Cursor** — add via `.mcp.json` + optional Cursor extension for sidebar panel

Any other MCP-compatible agent can integrate by connecting to the DingDawg MCP server process.

---

*See also: [Quickstart](quickstart.md) | [Configuration](configuration.md) | [Receipt Format](receipt-format.md) | [API Reference](api-reference.md)*
