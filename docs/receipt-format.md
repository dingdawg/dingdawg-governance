# DingDawg Governance Receipt Format — Open Standard v1.0

This document specifies the DingDawg Governance Receipt Format (DGRF v1.0). The receipt format is an open standard. Any system can generate, store, and verify DingDawg-compatible receipts by following this specification.

---

## Overview

A governance receipt is an immutable record produced before or at the moment an AI agent action executes. Receipts are:

- **Signed** with HMAC-SHA256 using a server-side key
- **Chained** via SHA-256 hash of the previous receipt, forming a tamper-evident log
- **Verifiable** by any party with access to the public verification endpoint
- **Permanent** — the receipt record is never deleted (rollback state expires separately)

---

## Receipt Fields

### Top-Level Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `receipt_id` | string | Yes | Globally unique receipt identifier. Format: `ddgr_` + ULID (26 chars). Example: `ddgr_01HXYZ9K3M2P7Q8R4T6V`. |
| `version` | string | Yes | Receipt format version. Always `"1.0"` for this spec. |
| `action_type` | string | Yes | Category of action governed. See action type registry below. |
| `resource` | string | Yes | The resource the action operated on. File path, URL, database table, or shell command string. Max 2048 chars. |
| `scope` | string | Yes | Declared scope of the action. Values: `project`, `system`, `network`, `database`, `external`. |
| `outcome` | string | Yes | Result of the action. Values: `success`, `denied`, `error`, `rolled_back`, `pending`. |
| `timestamp` | string | Yes | ISO 8601 UTC timestamp at the moment the receipt was issued. Example: `"2026-03-28T14:32:07.441Z"`. |
| `chain_hash` | string | Yes | SHA-256 hash linking this receipt to the previous one. See hash chain section. |
| `hmac_signature` | string | Yes | HMAC-SHA256 signature of the canonical receipt payload. See signing section. |
| `rollback_id` | string | Conditional | Present if a rollback snapshot was created. Format: `rb_` + ULID. Null if no rollback available. |
| `rollback_expires` | string | Conditional | ISO 8601 UTC timestamp when rollback state expires. Null if `rollback_id` is null. |
| `account_id` | string | Yes | DingDawg account ID that issued the receipt. Format: `acc_` + ULID. |
| `governance_level` | string | Yes | Governance level active at time of action. Values: `strict`, `standard`, `permissive`. |
| `risk_score` | integer | Yes | DingDawg risk evaluation score 0–100. 0 = no risk, 100 = maximum risk. |
| `deny_reason` | string | Conditional | Human-readable reason for a deny decision. Present only when `outcome` is `"denied"`. |
| `offline` | boolean | Yes | `true` if this receipt was generated in offline mode without server validation. |
| `verified` | boolean | Yes | `true` if the receipt passed server-side signature verification at time of issuance. |

### Action Type Registry

| `action_type` | Description |
|---|---|
| `file_write` | Creating or overwriting a file |
| `file_delete` | Deleting a file or directory |
| `file_move` | Moving or renaming a file |
| `shell_exec` | Executing a shell command |
| `api_call` | Making an outbound HTTP/HTTPS request |
| `db_write` | Inserting, updating, or deleting database records |
| `db_schema` | Altering a database schema (CREATE, DROP, ALTER) |
| `git_push` | Pushing commits to a remote git repository |
| `git_force` | Force-pushing to a remote git repository |
| `env_write` | Writing to environment variables or secrets |
| `config_write` | Writing to a configuration file |
| `package_install` | Installing a package or dependency |
| `deploy` | Deploying an application or service |
| `rollback` | Reversing a previous governed action |

Custom action types are allowed using reverse-DNS notation: `com.example.custom_action`.

---

## Hash Chain

Every receipt is linked to the previous receipt in the account's chain. This creates a tamper-evident log — if any historical receipt is modified, all subsequent `chain_hash` values fail verification.

### Chain Hash Computation

```
chain_hash = SHA-256(previous_receipt_chain_hash + "|" + current_receipt_canonical_payload)
```

**`current_receipt_canonical_payload`** is the receipt serialized as a sorted JSON string with these fields only (in exactly this order, no whitespace):

```
{"account_id":"...","action_type":"...","outcome":"...","resource":"...","scope":"...","timestamp":"...","version":"1.0"}
```

**For the first receipt in an account** (no previous receipt), use the constant string `GENESIS` in place of `previous_receipt_chain_hash`:

```
chain_hash = SHA-256("GENESIS" + "|" + current_receipt_canonical_payload)
```

### Example Chain Hash Computation (Python)

```python
import hashlib
import json

def compute_chain_hash(previous_chain_hash: str, receipt: dict) -> str:
    canonical = json.dumps({
        "account_id": receipt["account_id"],
        "action_type": receipt["action_type"],
        "outcome": receipt["outcome"],
        "resource": receipt["resource"],
        "scope": receipt["scope"],
        "timestamp": receipt["timestamp"],
        "version": receipt["version"],
    }, separators=(",", ":"), sort_keys=True)

    payload = previous_chain_hash + "|" + canonical
    return "sha256:" + hashlib.sha256(payload.encode("utf-8")).hexdigest()

# First receipt in account
chain_hash = compute_chain_hash("GENESIS", receipt)
# sha256:9a4f2c8b1e6d3a7f0c5b9e2d4a1f8c6b3e7a2d5f9c4b8e1a6d3f7c2b5e9a4d

# Subsequent receipt
chain_hash = compute_chain_hash("sha256:9a4f2c8b1e6d3a7f...", next_receipt)
```

---

## Signing

Each receipt is signed using HMAC-SHA256. The signing key is account-specific and server-managed. DingDawg does not expose the raw signing key — verification is done through the verification endpoint.

### Signature Format

```
hmac_signature = "v1:" + base64url(HMAC-SHA256(signing_key, canonical_payload))
```

Where `canonical_payload` is the same sorted JSON string used in the chain hash computation.

### Signature Format String

```
v1:<base64url-encoded-hmac-sha256>
```

Example:
```
v1:8f3a2c9b1e4d7f0a5c8b2e6d9a3f1c7b4e8a2d5f9c3b7e1a4d6f2c9b5e8a3d
```

---

## Verification

### Via API (recommended)

```bash
curl -X POST https://governance.dingdawg.com/v1/receipts/verify \
  -H "Authorization: Bearer ddg_live_a8f3k2m9x7p1q4r6" \
  -H "Content-Type: application/json" \
  -d '{"receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T6V"}'
```

Response:
```json
{
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T6V",
  "verified": true,
  "chain_position": 47,
  "chain_intact": true,
  "signature_valid": true,
  "timestamp": "2026-03-28T14:32:07.441Z"
}
```

### Via CLI

```bash
dingdawg receipt verify ddgr_01HXYZ9K3M2P7Q8R4T6V
```

Output:
```
Receipt:         ddgr_01HXYZ9K3M2P7Q8R4T6V
Signature:       VALID
Chain position:  47
Chain integrity: INTACT (47/47 receipts verified)
Issued:          2026-03-28 14:32:07 UTC
```

### Verification Response Fields

| Field | Type | Description |
|---|---|---|
| `verified` | boolean | `true` if both the signature and chain hash are valid. |
| `chain_position` | integer | Position of this receipt in the account's chain (1-indexed). |
| `chain_intact` | boolean | `true` if every receipt from position 1 to `chain_position` has a valid chain hash. |
| `signature_valid` | boolean | `true` if HMAC-SHA256 signature matches the canonical payload. |

A receipt is considered authentic only when `verified: true`.

---

## Rollback State and Expiry

DingDawg separates the **receipt record** (permanent) from **rollback state** (time-limited).

| | Receipt Record | Rollback State |
|---|---|---|
| What it is | Signed, chained log entry | Snapshot of resources before action executed |
| Retention | Permanent (never deleted) | Expires after `rollback_window_hours` |
| After expiry | Receipt remains, `rollback_id` reference preserved | Snapshot deleted from storage |
| After deletion | `rollback_id` on receipt still readable | Rollback action returns `rollback_expired` error |

Rollback state expiry is indicated by `rollback_expires` in the receipt:

```json
"rollback_id": "rb_01HXYZ9K3M2P7Q8R4T6V",
"rollback_expires": "2026-04-27T14:32:07.441Z"
```

Once `rollback_expires` has passed, `rollback_id` remains in the receipt for audit reference, but executing the rollback returns:

```json
{
  "error": "rollback_expired",
  "message": "Rollback state for rb_01HXYZ9K3M2P7Q8R4T6V expired on 2026-04-27T14:32:07.441Z",
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T6V"
}
```

---

## Example Receipt — Full JSON

```json
{
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R4T6V",
  "version": "1.0",
  "action_type": "file_write",
  "resource": "./src/index.ts",
  "scope": "project",
  "outcome": "success",
  "timestamp": "2026-03-28T14:32:07.441Z",
  "chain_hash": "sha256:9a4f2c8b1e6d3a7f0c5b9e2d4a1f8c6b3e7a2d5f9c4b8e1a6d3f7c2b5e9a4d",
  "hmac_signature": "v1:8f3a2c9b1e4d7f0a5c8b2e6d9a3f1c7b4e8a2d5f9c3b7e1a4d6f2c9b5e8a3d",
  "rollback_id": "rb_01HXYZ9K3M2P7Q8R4T6V",
  "rollback_expires": "2026-04-27T14:32:07.441Z",
  "account_id": "acc_01HXYZ9K3M2P7Q8R4T6A",
  "governance_level": "standard",
  "risk_score": 12,
  "deny_reason": null,
  "offline": false,
  "verified": true
}
```

---

## Example Receipt — Denied Action

```json
{
  "receipt_id": "ddgr_01HXYZ9K3M2P7Q8R5U8Z",
  "version": "1.0",
  "action_type": "shell_exec",
  "resource": "rm -rf /",
  "scope": "system",
  "outcome": "denied",
  "timestamp": "2026-03-28T15:01:44.882Z",
  "chain_hash": "sha256:b7e2a4d9c1f5b8e3a6d2f9c4b1e7a3d5f8c2b9e4a1d6f3c7b5e8a2d4f1c9b6",
  "hmac_signature": "v1:3d9a7c2b5e8f1a4d6c9b3e7f2a5d8c1b4e7a2d5f9c3b6e8a1d4f7c2b9e5a3d",
  "rollback_id": null,
  "rollback_expires": null,
  "account_id": "acc_01HXYZ9K3M2P7Q8R4T6A",
  "governance_level": "strict",
  "risk_score": 100,
  "deny_reason": "Destructive system-scope command denied at governance level strict. This command would recursively delete all files starting from the filesystem root.",
  "offline": false,
  "verified": true
}
```

---

## Implementing a Compatible Receipt Generator

Third-party systems can generate DGRF v1.0 compatible receipts by:

1. Generating a ULID for `receipt_id` (prefix with `ddgr_`)
2. Computing the canonical payload (sorted JSON, 7 fields)
3. Computing `chain_hash` using the formula above
4. Signing with your own HMAC-SHA256 key (note: receipts signed with non-DingDawg keys will fail DingDawg's verification endpoint but pass local verification)
5. Storing the resulting JSON

DingDawg's verification endpoint only verifies receipts generated by DingDawg servers. For third-party receipt verification, implement local HMAC verification using your own key.

---

## Changelog

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-03-28 | Initial public release |

---

*This standard is published under CC0. You are free to implement it without restriction.*

*See also: [Getting Started](getting-started.md) | [Configuration](configuration.md)*
