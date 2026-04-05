# DingDawg Governance — 5-Minute Quickstart

This guide gets you from zero to your first governed AI agent action in five minutes.

**Free tier:** 200 governed actions per day. No credit card required.

---

## Step 1: Install

```bash
npm install -g dingdawg-governance
```

Verify:

```bash
dingdawg --version
# DingDawg Governance v1.0.0
```

Python users:

```bash
pip install dingdawg-governance
```

---

## Step 2: Add to Claude Code

The fastest way — one command wires DingDawg directly into Claude Code as an MCP server:

```bash
claude mcp add dingdawg-governance npx dingdawg-governance
```

That's it. Claude Code will now route all agent actions through DingDawg before executing them.

**Alternatively**, add it manually to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "dingdawg-governance": {
      "command": "npx",
      "args": ["dingdawg-governance"],
      "env": {
        "DINGDAWG_API_KEY": "ddg_live_your_key_here"
      }
    }
  }
}
```

Get your API key at [app.dingdawg.com/keys](https://app.dingdawg.com/keys) — sign in with GitHub or Google.

---

## Step 3: Initialize Your Config

```bash
dingdawg init
```

This creates a minimal `.governance.yaml` in your project directory:

```yaml
governance_level: standard
receipts:
  display: verbose
  store: true
rollback:
  enabled: true
  window_hours: 168
```

That single `governance_level` line is all you need. See [configuration.md](configuration.md) for every available option.

---

## Step 4: Make Your First Governed Action

Start Claude Code with governance active:

```bash
DINGDAWG_API_KEY="ddg_live_your_key_here" claude
```

Ask Claude Code to create a file:

```
> Create a file called hello.txt with "Hello, governed world"
```

DingDawg intercepts the write before it executes. You'll see:

```
[DingDawg] Governing action: file_write
  Resource:  ./hello.txt
  Scope:     project
  Level:     standard
  Decision:  ALLOW
  Receipt:   ddgr_01HXYZ9K3M2P7Q8R4T6V

Action executed. Receipt stored.
```

Every governed action gets a cryptographically signed, tamper-evident receipt. That's your audit trail.

---

## Step 5: View Your Receipt

```bash
dingdawg receipt show ddgr_01HXYZ9K3M2P7Q8R4T6V
```

Output:

```json
{
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T6V",
  "action_type": "file_write",
  "resource": "./hello.txt",
  "scope": "project",
  "outcome": "success",
  "timestamp": "2026-03-28T14:32:07.441Z",
  "chain_hash": "sha256:9a4f2c8b1e6d3a7f...",
  "hmac_signature": "v1:8f3a2c9b1e4d7f0a...",
  "rollback_id": "rb_01HXYZ9K3M2P7Q8R4T6V",
  "rollback_expires": "2026-04-27T14:32:07.441Z",
  "verified": true
}
```

List all recent receipts:

```bash
dingdawg receipt list --limit 10
```

---

## Step 6: Check Your Status

```bash
dingdawg status
```

```
DingDawg Governance Status
───────────────────────────────────────────
Account:        you@example.com
Plan:           Free
Actions today:  1 / 200
Actions reset:  2026-03-29 00:00 UTC

Governance level:  standard
Receipts stored:   1
Chain integrity:   VERIFIED (1/1 receipts valid)
───────────────────────────────────────────
All systems operational.
```

---

## You're Done

DingDawg is now governing every file write, shell command, and API call your AI agent makes — with a signed receipt for each one.

**Free tier:** 200 governed actions per day, forever. No expiry, no credit card.

When you're ready to go deeper:

- [Configuration Reference](configuration.md) — every option in `.governance.yaml`
- [API Reference](api-reference.md) — all 6 MCP tools documented
- [Receipt Format](receipt-format.md) — the open standard your receipts follow
- [Pricing](pricing.md) — upgrade when your usage grows

Questions? Email support@dingdawg.com or open an issue at [github.com/dingdawg/governance](https://github.com/dingdawg/governance).
