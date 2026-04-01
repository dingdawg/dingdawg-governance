# Getting Started with DingDawg Governance

DingDawg Governance wraps every AI agent action in a cryptographically signed receipt before it executes. You get a full audit trail, rollback capability, and a real-time governance status dashboard — in under five minutes.

---

## Prerequisites

- Node.js 18+ or Python 3.10+
- An AI coding agent (Claude Code, Codex CLI, Cursor, or any MCP-compatible tool)
- A terminal

---

## Step 1: Install the Package

**npm (Node.js / Claude Code / Codex):**
```bash
npm install -g dingdawg-governance
```

**pip (Python environments):**
```bash
pip install dingdawg-governance
```

**Verify installation:**
```bash
dingdawg --version
# DingDawg Governance v1.0.0
```

---

## Step 2: Get Your API Key

**Option A — CLI (fastest):**
```bash
dingdawg auth login
# Opens browser → sign in with GitHub or Google
# Returns:
# Authenticated. API key written to ~/.dingdawg/credentials
# Key: ddg_live_a8f3k2m9...
```

**Option B — Dashboard:**
Visit [https://app.dingdawg.com/keys](https://app.dingdawg.com/keys), click **New Key**, copy the value.

Set it as an environment variable:
```bash
export DINGDAWG_API_KEY="ddg_live_a8f3k2m9x7p1q4r6"
```

Add it to your shell profile to persist across sessions:
```bash
echo 'export DINGDAWG_API_KEY="ddg_live_a8f3k2m9x7p1q4r6"' >> ~/.zshrc
source ~/.zshrc
```

---

## Step 3: Configure Governance Level

Create `.governance.yaml` in your project root (or home directory for global config):

```bash
dingdawg init
# Created .governance.yaml in current directory
```

This produces a minimal working config:

```yaml
# .governance.yaml
governance_level: standard
receipts:
  display: verbose
  store: true
rollback:
  enabled: true
  window_hours: 168   # 7 days (Free plan default)
```

That one `governance_level` line is all you need to get started. See [configuration.md](configuration.md) for every available option.

---

## Step 4: Register the MCP Server

DingDawg Governance works by exposing an MCP server that your AI coding tool connects to. You need to add it to your tool's MCP configuration once.

### Claude Code

Add to your project-level `.mcp.json` (creates it if it doesn't exist):

```json
{
  "mcpServers": {
    "dingdawg-governance": {
      "command": "npx",
      "args": ["dingdawg-governance"],
      "env": {
        "DINGDAWG_API_KEY": "ddg_live_a8f3k2m9x7p1q4r6"
      }
    }
  }
}
```

Or add to the global config at `~/.config/claude/mcp.json` to enable governance across all projects.

### OpenAI Codex

Add to your project `.mcp.json`:

```json
{
  "mcpServers": {
    "dingdawg-governance": {
      "command": "npx",
      "args": ["dingdawg-governance"],
      "env": {
        "DINGDAWG_API_KEY": "ddg_live_a8f3k2m9x7p1q4r6"
      }
    }
  }
}
```

### Cursor

Add to your project `mcp.json`:

```json
{
  "mcpServers": {
    "dingdawg-governance": {
      "command": "npx",
      "args": ["dingdawg-governance"],
      "env": {
        "DINGDAWG_API_KEY": "ddg_live_a8f3k2m9x7p1q4r6"
      }
    }
  }
}
```

Replace `ddg_live_a8f3k2m9x7p1q4r6` with your actual API key from Step 2. After saving the config file, restart your AI coding tool to load the governance server.

---

## Step 5: Make Your First Governed Action

DingDawg intercepts actions at the MCP layer. Once installed, every file write, shell command, and API call your agent makes is governed automatically.

**Example — run a governed file write with Claude Code:**
```bash
# Start Claude Code with governance enabled
DINGDAWG_API_KEY="ddg_live_a8f3k2m9x7p1q4r6" claude
```

Inside Claude Code, ask it to create a file:
```
> Create a file called hello.txt with the content "Hello, governed world"
```

DingDawg intercepts the write before it happens. You'll see in your terminal:

```
[DingDawg] Governing action: file_write
  Resource:  ./hello.txt
  Scope:     project
  Level:     standard
  Decision:  ALLOW
  Receipt:   ddgr_01HXYZ9K3M2P7Q8R4T6V

Action executed. Receipt stored.
```

**Example — governed shell command:**
```bash
dingdawg exec -- rm -rf ./build
```

Output:
```
[DingDawg] Governing action: shell_exec
  Command:   rm -rf ./build
  Scope:     project
  Level:     standard
  Risk:      medium (destructive flag detected)
  Decision:  ALLOW — rollback snapshot created
  Receipt:   ddgr_01HXYZ9K3M2P7Q8R4T6W

Command executed. Rollback available for 720 hours.
```

**Example — Python SDK:**
```python
from dingdawg import governance

with governance.session(level="standard") as gov:
    result = gov.exec(
        action="file_write",
        resource="./output/report.csv",
        payload=report_data
    )
    print(f"Receipt: {result.receipt_id}")
    # Receipt: ddgr_01HXYZ9K3M2P7Q8R4T6X
```

---

## Step 6: View Your First Receipt

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
  "chain_hash": "sha256:9a4f2c8b1e6d3a7f0c5b9e2d4a1f8c6b3e7a2d5f9c4b8e1a6d3f7c2b5e9a4d",
  "rollback_id": "rb_01HXYZ9K3M2P7Q8R4T6V",
  "rollback_expires": "2026-04-27T14:32:07.441Z",
  "hmac_signature": "v1:8f3a2c9b1e4d7f0a5c8b2e6d9a3f1c7b4e8a2d5f9c3b7e1a4d6f2c9b5e8a3d",
  "verified": true
}
```

**List recent receipts:**
```bash
dingdawg receipt list --limit 10
```

```
RECEIPT ID                    ACTION        RESOURCE           OUTCOME   TIMESTAMP
ddgr_01HXYZ9K3M2P7Q8R4T6X   file_write    ./output/report    success   2026-03-28 14:35:12
ddgr_01HXYZ9K3M2P7Q8R4T6W   shell_exec    rm -rf ./build     success   2026-03-28 14:33:44
ddgr_01HXYZ9K3M2P7Q8R4T6V   file_write    ./hello.txt        success   2026-03-28 14:32:07
```

**Export receipts as JSON for compliance:**
```bash
dingdawg receipt export --from 2026-03-01 --to 2026-03-28 --format json > march-audit.json
```

---

## Step 7: Check Your Governance Status

```bash
dingdawg status
```

Output:
```
DingDawg Governance Status
───────────────────────────────────────────
Account:        you@example.com
Plan:           Free
Actions today:  47 / 200
Actions reset:  2026-03-29 00:00 UTC

Governance level:  standard
Receipts stored:   47
Rollbacks active:  3 (available for use)
Chain integrity:   VERIFIED (47/47 receipts valid)

API endpoint:      https://governance.dingdawg.com
Latency (p50):     18ms
───────────────────────────────────────────
All systems operational.
```

**Roll back an action:**
```bash
dingdawg rollback ddgr_01HXYZ9K3M2P7Q8R4T6W
```

```
[DingDawg] Rolling back: shell_exec (rm -rf ./build)
  Restoring from snapshot rb_01HXYZ9K3M2P7Q8R4T6W...
  Restored 247 files to ./build
  Rollback receipt: ddgr_01HXYZ9K3M2P7R8S5U7Y
  Status: SUCCESS
```

---

## What's Next

- [Configuration Reference](configuration.md) — every option in `.governance.yaml`
- [Receipt Format Spec](receipt-format.md) — the open standard your receipts follow
- [Pricing](pricing.md) — upgrade when your usage grows
- [Dashboard](https://app.dingdawg.com) — visual audit trail and governance controls

---

*Questions? Email support@dingdawg.com or open an issue at github.com/dingdawg/governance*
