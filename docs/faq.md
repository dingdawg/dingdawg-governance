# DingDawg Governance — FAQ

---

## What is AI governance?

AI governance is the practice of applying oversight, audit, and control to actions taken by AI agents — before those actions execute in your environment.

When an AI coding agent writes a file, runs a shell command, calls an API, or modifies a database, it does so autonomously. AI governance means a policy layer evaluates each of those actions first, decides whether to allow or block it, and creates a permanent, signed record of the decision.

DingDawg Governance applies that layer to AI coding agents (Claude Code, Codex, Cursor, and others) through the Model Context Protocol (MCP). Every action gets a cryptographically signed receipt. High-risk actions can be blocked automatically. Every action can be rolled back if something goes wrong.

---

## Why do I need it?

AI agents are fast and capable. They're also capable of making fast, hard-to-reverse mistakes: deleting the wrong files, pushing to production branches, overwriting configuration, or sending API calls to the wrong endpoint.

Without governance:
- You have no record of what your agent did or why
- You have no automatic way to undo it
- You have no audit trail for compliance or incident review

With DingDawg Governance:
- Every action is documented with a signed receipt before it executes
- Dangerous actions can be blocked based on your configured policy
- Rollback snapshots let you restore prior state if something goes wrong
- Your full audit chain is verifiable and tamper-evident

If you're using AI agents for anything that touches real files, real APIs, or real data — governance is how you maintain oversight without slowing the agent down.

---

## Is it free?

Yes. The Free plan is free forever with no credit card required.

**Free plan includes:**
- 200 governed actions per day (resets at midnight UTC)
- Cryptographically signed receipts
- Full 7-day rollback window
- Receipt history for 30 days
- Claude Code, Codex, and Cursor integration
- SHA-256 hash chain verification

The Free plan does not expire. There is no trial period.

When you outgrow 200 actions/day, the Builder plan ($49/month) gives you 50,000 actions/month. See [pricing.md](pricing.md) for the full plan comparison.

---

## What frameworks and tools does it support?

DingDawg Governance works with any AI coding agent that supports the Model Context Protocol (MCP).

**Officially supported:**

| Tool | Integration Method |
|---|---|
| Claude Code | `claude mcp add dingdawg-governance npx dingdawg-governance` or `.mcp.json` |
| OpenAI Codex | `.mcp.json` |
| Cursor | `.mcp.json` + optional Cursor extension |

**Any MCP-compatible agent** can integrate by adding DingDawg to its MCP server configuration. The governance server exposes a standard MCP interface — if your tool supports MCP, it works with DingDawg.

DingDawg also provides a REST API and Python/Node.js SDKs for direct integration outside of MCP contexts.

---

## How do I get receipts?

Receipts are generated automatically for every governed action. You don't have to do anything after setup — DingDawg creates and stores them.

**View a specific receipt:**

```bash
dingdawg receipt show ddgr_01HXYZ9K3M2P7Q8R4T6V
```

**List recent receipts:**

```bash
dingdawg receipt list --limit 20
```

**Search receipts by date, action type, or outcome:**

```bash
dingdawg receipt list --from 2026-03-01 --outcome denied
```

**Export receipts for compliance:**

```bash
dingdawg receipt export --from 2026-03-01 --to 2026-03-31 --format json > march-audit.json
```

You can also view, search, and export receipts from the dashboard at [app.dingdawg.com](https://app.dingdawg.com).

Each receipt is a signed JSON document containing the action type, resource, outcome, timestamp, risk score, chain hash, and HMAC signature. The receipt format is an open standard (DGRF v1.0) — see [receipt-format.md](receipt-format.md) for the full specification.

---

## What counts as a governed action?

One governed action equals one Action Request that DingDawg evaluates. Examples:

- Writing a file: 1 action
- Deleting a file: 1 action
- Running a shell command: 1 action
- Making an API call: 1 action
- Reading a file: 0 actions (reads are not governed)

If an agent writes 10 files in a loop, that counts as 10 actions. A denied action still counts — the evaluation happened.

---

## What happens when I reach my daily or monthly limit?

When you hit the cap, DingDawg enters **passthrough mode**: your agent's actions continue executing, but governance evaluation pauses until the limit resets.

You'll see a warning in your terminal:

```
[DingDawg] Daily limit reached (200/200). Actions will execute without governance until midnight UTC.
Upgrade at app.dingdawg.com/upgrade to restore governance.
```

Your existing receipts and rollback snapshots remain fully intact.

To avoid hitting the limit unexpectedly, you can configure a webhook notification at 80% cap usage:

```yaml
notifications:
  webhook:
    url: "https://your-endpoint.com/dingdawg-alert"
    events:
      - cap_warning_80pct
      - cap_reached
```

---

## How do rollbacks work?

When DingDawg governs a write, shell command, or other state-changing action, it optionally creates a snapshot of the affected resources before execution. If something goes wrong, you can restore the prior state:

```bash
dingdawg rollback ddgr_01HXYZ9K3M2P7Q8R4T6W
```

Output:

```
[DingDawg] Rolling back: shell_exec (npm run build)
  Restoring 12 modified files...
  Rollback complete.
  Rollback receipt: ddgr_01HXYZ9K3M2P7R8S5U7Y
  Status: SUCCESS
```

Rollback snapshots are retained for:
- Free plan: 7 days
- Builder plan: 30 days
- Team plan: 90 days
- Enterprise: 1 year

After expiry, the snapshot is deleted. The receipt referencing it remains permanently in your audit chain.

Note: some actions (sending messages, financial transactions, writes to external systems) are irreversible by nature. DingDawg can block these in advance with a strict governance policy, but cannot roll them back after execution.

---

## Does DingDawg read my source code or file contents?

No. DingDawg collects action metadata — file paths, action types, scopes, timestamps — not file contents.

The only exception is rollback snapshots. When rollback is enabled and DingDawg creates a pre-execution snapshot, that snapshot may contain file contents so it can restore the prior state. Snapshots are:

- Encrypted at rest (AES-256)
- Used only for rollback — never for any other purpose
- Deleted automatically when the rollback window expires

You can delete a specific rollback snapshot before expiry:

```bash
dingdawg rollback drop ddgr_01HXYZ9K3M2P7Q8R4T6V
```

See the [Privacy Policy](PRIVACY_POLICY.md) for the complete data collection description.

---

## Can I use DingDawg in CI/CD pipelines?

Yes. DingDawg works in automated pipelines. Recommended settings for CI/CD:

```yaml
governance_level: strict
receipts:
  display: silent   # No terminal noise in pipeline logs
  store: true
rollback:
  enabled: true
  auto_rollback:
    enabled: true
    on_exit_code: [1, 2]
```

Set `DINGDAWG_API_KEY` as a CI/CD secret. The governance evaluation adds minimal latency (median ~18ms per action).

---

## What is the receipt format? Can I parse it myself?

Yes. The DingDawg Governance Receipt Format (DGRF v1.0) is an open standard published under CC0. You can implement compatible receipt generators and verifiers without restriction.

See [receipt-format.md](receipt-format.md) for the complete specification: field definitions, hash chain computation, HMAC signing format, and example implementations in Python.

---

## How do I verify that my receipts haven't been tampered with?

**Via CLI:**

```bash
dingdawg receipt verify ddgr_01HXYZ9K3M2P7Q8R4T6V
```

**Via API:**

```bash
curl -X POST https://governance.dingdawg.com/v1/receipts/verify \
  -H "Authorization: Bearer ddg_live_your_key" \
  -H "Content-Type: application/json" \
  -d '{"receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T6V"}'
```

**Full chain integrity check:**

```bash
dingdawg status --verify-chain
```

This verifies every receipt in your account's chain from genesis to present.

---

## What's the enterprise pricing?

Enterprise is custom-priced and includes:

- Unlimited actions and seats
- 99.9% uptime SLA with financial credits
- Dedicated support engineer
- Custom data residency (US, EU, or your own VPC)
- Custom retention periods beyond 1 year
- On-premises deployment option
- Audit trail formatted for cyber liability insurance claims
- Security review and penetration test report on request

Contact [enterprise@dingdawg.com](mailto:enterprise@dingdawg.com) to start a conversation.

---

## Do you offer discounts?

**Open source maintainers:** Free Builder plan for qualifying open source projects (MIT, Apache 2.0, GPL). Email [opensource@dingdawg.com](mailto:opensource@dingdawg.com) with a link to your repository.

**Students and educators:** 50% off Builder and Team plans. Verify with a `.edu` email at [app.dingdawg.com/edu](https://app.dingdawg.com/edu).

**Annual billing:** Save ~20% on Builder and Team plans by paying annually.

---

## Where do I get help?

- **Documentation:** You're already here. Start with [quickstart.md](quickstart.md).
- **GitHub Issues:** [github.com/dingdawg/governance](https://github.com/dingdawg/governance)
- **Email:** support@dingdawg.com
- **Status page:** [status.dingdawg.com](https://status.dingdawg.com)
- **Dashboard:** [app.dingdawg.com](https://app.dingdawg.com)

Builder and Team customers get priority email support. Enterprise customers get a named support engineer.
