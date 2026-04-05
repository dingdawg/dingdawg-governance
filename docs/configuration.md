# Configuration Reference

DingDawg Governance is configured through two mechanisms: environment variables (for secrets and runtime overrides) and `.governance.yaml` (for persistent project-level settings). Environment variables always take precedence over the YAML file.

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DINGDAWG_API_KEY` | Yes | — | Your API key from [app.dingdawg.com/keys](https://app.dingdawg.com/keys). Format: `ddg_live_...` (production) or `ddg_test_...` (sandbox). |
| `DINGDAWG_API_ENDPOINT` | No | `https://governance.dingdawg.com` | Override the API endpoint. Use for self-hosted or regional deployments. |
| `DINGDAWG_GOVERNANCE_LEVEL` | No | `standard` | Override governance level at runtime. Values: `strict`, `standard`, `permissive`. Takes precedence over YAML. |
| `DINGDAWG_RECEIPT_DISPLAY` | No | `verbose` | Override receipt display mode. Values: `verbose`, `minimal`, `silent`. |
| `DINGDAWG_TIMEOUT_MS` | No | `5000` | API request timeout in milliseconds. Increase for slow networks. Note: Claude Code hooks use a fixed 40ms timeout for minimal latency overhead. This setting applies to SDK and CLI calls only. |
| `DINGDAWG_OFFLINE_MODE` | No | `false` | Set to `true` to generate receipts locally without API validation. Receipts generated in offline mode are not verifiable server-side and are flagged `offline: true`. |
| `DINGDAWG_LOG_LEVEL` | No | `info` | Log verbosity. Values: `debug`, `info`, `warn`, `error`, `silent`. |
| `DINGDAWG_DISABLE_ROLLBACK` | No | `false` | Set to `true` to skip rollback snapshot creation. Use only in read-only pipelines. |

**Setting variables in a project `.env` file:**
```bash
DINGDAWG_API_KEY=ddg_live_a8f3k2m9x7p1q4r6
DINGDAWG_GOVERNANCE_LEVEL=strict
DINGDAWG_RECEIPT_DISPLAY=minimal
```

---

## .governance.yaml Schema

Place `.governance.yaml` in your project root. DingDawg walks up the directory tree and uses the first file it finds. A global default lives at `~/.dingdawg/governance.yaml`.

### Complete Schema with All Options

```yaml
# .governance.yaml — Complete Reference
# All fields are optional unless marked REQUIRED.

# ─────────────────────────────────────────
# GOVERNANCE LEVEL
# ─────────────────────────────────────────
governance_level: standard  # strict | standard | permissive
                            # See "Governance Levels" section below.

# ─────────────────────────────────────────
# RECEIPTS
# ─────────────────────────────────────────
receipts:
  display: verbose          # verbose | minimal | silent
                            # See "Receipt Display Options" below.
  store: true               # Write receipts to local .dingdawg/receipts/ in addition
                            # to cloud storage. Useful for offline audit access.
  local_path: .dingdawg/receipts  # Override local receipt storage directory.
  format: json              # json | jsonl | ndjson
                            # Format for locally stored receipts.

# ─────────────────────────────────────────
# ROLLBACK
# ─────────────────────────────────────────
rollback:
  enabled: true             # Master switch. Set false to disable all rollback features.
  window_hours: 168         # How long rollback state is retained (default 168 = 7 days on Free).
                            # Free: 168h (7 days). Builder: 720h (30 days). Team: 2160h (90 days). Enterprise: 8760h (1 year).
  auto_rollback:
    enabled: false          # Automatically roll back actions that produce errors.
    on_exit_code: [1, 2]    # Trigger auto-rollback when command exits with these codes.
    on_pattern:             # Trigger auto-rollback when stdout/stderr matches these patterns.
      - "FATAL"
      - "panic:"
      - "ROLLBACK REQUIRED"
    max_auto_rollbacks: 3   # Stop auto-rolling back after this many consecutive failures.
                            # Prevents runaway loops. Set 0 for unlimited.

# ─────────────────────────────────────────
# ACTION FILTERING
# ─────────────────────────────────────────
actions:
  include:                  # Only govern these action types. Empty = govern all.
    - file_write
    - file_delete
    - shell_exec
    - api_call
    - db_write
  exclude:                  # Never govern these action types.
    - file_read
    - env_read
  resource_patterns:
    include:                # Glob patterns — only govern matching resources.
      - "src/**"
      - "*.config.*"
    exclude:                # Glob patterns — never govern matching resources.
      - "node_modules/**"
      - ".git/**"
      - "*.log"

# ─────────────────────────────────────────
# PLATFORM-SPECIFIC CONFIG
# ─────────────────────────────────────────
platforms:
  claude_code:
    enabled: true
    intercept_mcp: true     # Intercept actions at the MCP tool call layer.
    show_inline_receipts: true  # Print receipt summary inline in Claude Code output.
  codex:
    enabled: true
    intercept_mcp: true
    show_inline_receipts: false
  cursor:
    enabled: true
    intercept_mcp: true
    show_inline_receipts: true
    cursor_workspace_sync: true  # Sync governance status to Cursor workspace panel.

# ─────────────────────────────────────────
# TEAM POLICIES (Builder plan and above)
# ─────────────────────────────────────────
team:
  policy_id: pol_01HXYZ9K3M2P7Q8R4T6V  # Team policy ID from app.dingdawg.com/policies.
                                          # Overrides local governance_level when set.
  require_approval:
    enabled: false          # Require human approval for flagged actions before execution.
    high_risk_only: true    # Only require approval for actions scored high-risk.
    approval_timeout_seconds: 300  # Block for up to this many seconds waiting for approval.
    fallback: deny          # What to do if approval times out: deny | allow | defer

# ─────────────────────────────────────────
# NOTIFICATIONS
# ─────────────────────────────────────────
notifications:
  webhook:
    url: ""                 # POST receipt JSON to this URL after each governed action.
    events:                 # Which events trigger the webhook.
      - deny
      - auto_rollback
      - high_risk
    secret: ""              # Optional HMAC secret to sign webhook payloads.
  email:
    enabled: false          # Send email digest (requires Builder plan).
    address: ""
    frequency: daily        # daily | weekly | on_deny
```

---

## Governance Levels

### `strict`

Maximum protection. Designed for production deployments, regulated environments, and any context where a mistake is expensive to recover from.

**Behavior:**
- Every action is evaluated against DingDawg's full risk model before execution.
- Destructive actions (file delete, bulk write, schema migration, force push) require an elevated justification header or are denied.
- Any action touching files outside the declared project scope is denied.
- Rollback snapshots are always created, even for low-risk actions.
- API calls to external services are logged with full request metadata (URL, method, response code — never request body).
- Actions are rate-checked: >50 actions/minute triggers a soft hold and requires explicit continuation.

**Use when:** CI/CD pipelines, production deployments, financial or healthcare data.

```yaml
governance_level: strict
```

Terminal indicator:
```
[DingDawg] Level: STRICT | Decision: ALLOW | Risk: low
```

### `standard`

Balanced governance. The default for most development workflows. Protects against common mistakes without adding friction to normal work.

**Behavior:**
- Destructive actions are governed and rollback snapshots are created.
- Non-destructive reads and low-risk writes are allowed with receipt generation but no blocking evaluation.
- Out-of-scope resource access triggers a warning receipt, not a deny.
- Rate limiting threshold: >200 actions/minute.

**Use when:** Active development, staging environments, team collaboration.

```yaml
governance_level: standard
```

Terminal indicator:
```
[DingDawg] Level: STANDARD | Decision: ALLOW | Risk: low
```

### `permissive`

Lightweight governance. Generates receipts for every action but performs minimal blocking evaluation. Adds almost zero latency.

**Behavior:**
- All actions are allowed unless they match a hardcoded deny list (e.g., `rm -rf /`, writes to `/etc/`).
- Receipts are generated for audit purposes.
- No rollback snapshots by default (configurable).
- No rate limiting.

**Use when:** Local experimentation, sandboxed environments, performance-sensitive pipelines where you only need the audit trail.

```yaml
governance_level: permissive
```

Terminal indicator:
```
[DingDawg] Level: PERMISSIVE | Receipt generated
```

---

## Receipt Display Options

### `verbose` (default)

Prints a full receipt block after each governed action:

```
[DingDawg] Governing action: file_write
  Resource:  ./src/index.ts
  Scope:     project
  Level:     standard
  Risk:      low
  Decision:  ALLOW
  Receipt:   ddgr_01HXYZ9K3M2P7Q8R4T6V
  Rollback:  available until 2026-04-27 14:32 UTC

Action executed successfully.
```

### `minimal`

One line per action:

```
[DingDawg] ALLOW file_write ./src/index.ts → ddgr_01HXYZ9K3M2P7Q8R4T6V
```

### `silent`

No terminal output. Receipts are still generated and stored. Use in production pipelines where DingDawg output would pollute logs.

```yaml
receipts:
  display: silent
```

To check receipts when running silent: `dingdawg receipt list --limit 20`

---

## Auto-Rollback Configuration

Auto-rollback monitors action outcomes and reverses them automatically when failures are detected.

```yaml
rollback:
  enabled: true
  auto_rollback:
    enabled: true
    on_exit_code: [1, 2, 126, 127]
    on_pattern:
      - "Error:"
      - "FATAL"
      - "panic:"
      - "Traceback (most recent call last)"
    max_auto_rollbacks: 5
```

**What happens when auto-rollback triggers:**

```
[DingDawg] Action completed with exit code 1
  Matched auto-rollback condition: exit_code=1
  Rolling back: shell_exec (npm run build)
  Restoring 12 modified files...
  Rollback complete.
  Rollback receipt: ddgr_01HXYZ9K3M2P7Q8R5U8Z
```

**Limits:**
- Auto-rollback only fires if a rollback snapshot exists for the action.
- `max_auto_rollbacks` resets after a successful action.
- Auto-rollback does not fire for actions with `governance_level: permissive` unless explicitly enabled.

---

## Platform-Specific Configuration

### Claude Code

DingDawg automatically detects Claude Code via the `CLAUDE_CODE` environment variable. Set in `.governance.yaml`:

```yaml
platforms:
  claude_code:
    enabled: true
    intercept_mcp: true       # Required for full governance coverage.
    show_inline_receipts: true
```

Claude Code integration intercepts at the MCP `tool_call` layer, before any tool executes. This means governance fires before file writes, shell commands, or web fetches — not after.

### Codex CLI

```yaml
platforms:
  codex:
    enabled: true
    intercept_mcp: true
    show_inline_receipts: false  # Codex output is often piped — keep silent.
```

Set the API key in your Codex environment before launch:
```bash
DINGDAWG_API_KEY=ddg_live_... codex "refactor this function"
```

### Cursor

```yaml
platforms:
  cursor:
    enabled: true
    intercept_mcp: true
    show_inline_receipts: true
    cursor_workspace_sync: true  # Enables Cursor sidebar governance panel.
```

Install the DingDawg Cursor extension from the Cursor marketplace to enable the sidebar panel and inline receipt annotations.

---

## Minimal Working Configuration

If you want the simplest possible setup that works:

```yaml
governance_level: standard
```

That's it. DingDawg will use all defaults.

---

## Configuration Precedence

When the same setting appears in multiple places, this order wins (highest to lowest):

1. Environment variables (`DINGDAWG_GOVERNANCE_LEVEL`, etc.)
2. Project `.governance.yaml` (nearest file walking up the directory tree)
3. Global `~/.dingdawg/governance.yaml`
4. Built-in defaults

---

*See also: [Getting Started](getting-started.md) | [Receipt Format](receipt-format.md)*
