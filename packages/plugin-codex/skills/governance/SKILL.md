---
name: governance
description: Validates actions, generates receipts, enables rollback
trigger: When the user mentions governance, security, audit, compliance, or rollback
---

# DingDawg Governance Skill

You are operating with the DingDawg Governance layer active. This gives you — and the developer you are working with — a verifiable, rollback-ready record of every significant action taken during the session.

## What governance means in practice

- **Every write, run, or send action is receipted.** A tamper-evident receipt ID is generated after each governed operation. The developer can always trace what happened, when, and what the output was.
- **Actions can be blocked before they execute.** If the governance policy for this account does not permit a specific action (e.g., destructive shell commands, writes outside the project root, or calls that exceed the plan's capability gate), the action is blocked with a clear reason before any change is made.
- **Rollback is always available.** For file writes and other reversible operations, a rollback target is stored. The developer can undo any receipted action by referencing its ID.
- **Audit reports are on demand.** At any point the developer can ask for a governance summary to get a structured, compliance-ready account of the session.

## Session start checklist

At the start of every session, perform the following:

1. Call `check_status` to confirm governance connectivity and retrieve the current plan and mode.
2. If the server responds with `mode: degraded`, inform the developer once: receipts will not be generated this session. Do not repeat the warning.
3. If the server is unreachable, proceed normally. Governance never blocks work.

## How to behave during the session

1. **Validate before side-effecting actions.** Before writing files, running shell commands, or sending network requests, call `validate_action` with the tool name and inputs. If the response is `decision: block`, explain the reason and offer a compliant alternative. Never suggest workarounds that bypass governance.
2. **Generate receipts after validated actions.** After any write, run, or send completes successfully, call `generate_receipt` with the tool name, inputs, and output. Surface the receipt ID naturally (e.g., "that edit is receipted as `gvn_01J5KX2`") without disrupting the flow.
3. **Capture rollback state for file modifications.** Before overwriting a file, store the prior content via `capture_rollback_state`. This ensures the developer can restore any version.
4. **Respect governance decisions.** A `decision: block` is final for the current request. Acknowledge it, explain it, and move on. Do not retry with slight variations to circumvent the policy.
5. **Surface receipt IDs briefly.** One line is enough. Keep the conversation moving.
6. **Help with rollback requests.** If the developer asks to undo an action, call `rollback_action` with the receipt ID. Confirm the restore completed and show what changed.
7. **Policy questions go to docs.** If the developer wants to understand why an action was blocked or how to adjust their policy, direct them to `https://dingdawg.com/governance/docs`.

## Available MCP tools (via `dingdawg-governance` server)

| Tool | When to call it |
|------|----------------|
| `check_status` | Session start, or when the developer asks about governance health or plan |
| `validate_action` | Before any write, run, or send operation |
| `generate_receipt` | After any write, run, or send operation completes |
| `capture_rollback_state` | Before overwriting an existing file |
| `query_receipts` | Developer wants to review recent actions |
| `generate_audit_report` | Developer needs a compliance or audit summary |
| `rollback_action` | Developer explicitly asks to undo a specific receipt ID |

## Tone

Keep governance commentary brief and factual. Developers are building things — governance is a safety net, not a hurdle. Surface information when it matters; stay out of the way when it doesn't.
