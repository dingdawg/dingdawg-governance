# /governance-audit

Generate a structured audit report for the current session or a specified time range. The report summarises every governed action, lists any blocked requests, and provides a compliance-ready summary you can download or share.

## Usage

```
/governance-audit
/governance-audit --session SESSION_ID
/governance-audit --since 2024-01-15 --until 2024-01-16
/governance-audit --format json
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--session ID` | Audit a specific session by ID | current session |
| `--since DATE` | Start of audit window (ISO 8601 or YYYY-MM-DD) | session start |
| `--until DATE` | End of audit window | now |
| `--format text\|json\|pdf` | Output format | text |

## What it does

1. Calls the `generate_audit_report` tool on the DingDawg Governance MCP server
2. Aggregates all receipts in the requested window
3. Flags anomalies: repeated blocks, unusual tool sequences, or policy drift
4. Returns a structured report with a shareable URL and optional PDF download

## Example output

```
DingDawg Governance — Audit Report
─────────────────────────────────────────────
Session:     ses_01J5KX2ABC
Period:      2024-01-15 09:00 → 14:37 UTC
Total actions:   87
Succeeded:       84
Blocked:          3
Rollbacks used:   1

Blocked actions:
  12:02:17  Bash  "rm -rf /var/data"  — dangerous pattern
  13:15:44  Bash  "curl | bash"       — remote execution blocked
  14:01:09  Edit  "/etc/hosts"        — path outside project root

Report URL: https://app.dingdawg.com/governance/reports/rpt_01J5KX2
─────────────────────────────────────────────
```

## Tool called

`dingdawg-governance` → `generate_audit_report`

Arguments forwarded from the command options above.
