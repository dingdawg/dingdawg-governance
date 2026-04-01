# Changelog

All notable changes to DingDawg Governance will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] — 2026-04-01

### Added

- `validate_action` — Pre-execution governance check returning `APPROVED`, `FLAGGED`, or `BLOCKED` with reason code and risk score
- `generate_receipt` — Post-execution cryptographic receipt with tamper-evident output hash
- `capture_rollback_state` — Snapshot current file state before destructive or high-risk operations
- `rollback_action` — Restore prior state from a receipt ID with confirmation of what changed
- `query_receipts` — Search receipts by date, agent, action type, or status with export support
- `check_status` — Current tier, daily usage, quota percentage, and active governance alerts
- `generate_audit_report` — On-demand compliance reports in SOC 2 and ISO 27001 formats
- Pass-through mode for local development without an API key
- Graceful degradation — governance server unavailability never blocks agent execution
- Claude Code, Codex, and Cursor plugin packages
- Free tier: 200 governed actions/day, no credit card required
