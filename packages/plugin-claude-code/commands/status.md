# /governance-status

Check the current governance status for your session, including your plan, remaining capacity, and whether the governance layer is operating normally.

## Usage

```
/governance-status
```

## What it does

1. Calls the `check_status` tool on the DingDawg Governance MCP server
2. Displays your current plan, API key identity, and session usage
3. Reports whether governance is operating in full mode or degraded mode
4. Shows the count of receipts generated in the current session

## Example output

```
DingDawg Governance — Status
─────────────────────────────
Plan:        Pro
API Key:     dd_live_••••••••••••abcd
Mode:        Full governance (connected)
Session:     42 actions receipted
Rollbacks:   available
Audits:      available
─────────────────────────────
Docs: https://dingdawg.com/governance/docs
```

## Tool called

`dingdawg-governance` → `check_status`

No arguments required.
