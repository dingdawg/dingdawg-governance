# /governance-receipts

View the tamper-evident receipts generated for governed actions in the current session or a specified time window.

## Usage

```
/governance-receipts
/governance-receipts --limit 20
/governance-receipts --since 2024-01-15T09:00:00Z
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--limit N` | Number of receipts to return | 10 |
| `--since ISO8601` | Only receipts after this timestamp | current session |
| `--tool NAME` | Filter by tool name | all tools |
| `--status ok\|blocked` | Filter by outcome | all |

## What it does

1. Calls the `query_receipts` tool on the DingDawg Governance MCP server
2. Returns a chronological list of receipts with tool name, timestamp, and outcome
3. Each receipt ID links to the full governance record on the DingDawg dashboard

## Example output

```
DingDawg Governance — Recent Receipts
──────────────────────────────────────
#gvn_01J5KX2  Edit        success   12:04:33
#gvn_01J5KX1  Bash        success   12:03:58
#gvn_01J5KX0  Write       success   12:03:41
#gvn_01J5KW9  Bash        blocked   12:02:17  "Blocked: dangerous rm -rf pattern"
──────────────────────────────────────
4 receipts  |  View all: https://app.dingdawg.com/governance/receipts
```

## Tool called

`dingdawg-governance` → `query_receipts`

Arguments forwarded from the command options above.
