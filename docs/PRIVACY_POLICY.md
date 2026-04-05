# Privacy Policy

**DingDawg Governance**
Effective date: March 28, 2026
Last updated: March 28, 2026

---

This Privacy Policy explains what data DingDawg, Inc. ("DingDawg", "we", "us", "our") collects when you use DingDawg Governance, how we use it, and your rights over it. We've written this to be readable, not a document you need a lawyer to interpret.

If something here is unclear, email us at support@dingdawg.com.

---

## 1. What We Collect

### Data you provide directly

When you create an account:
- Email address
- Name (optional)
- Password (stored as a bcrypt hash — we never store plaintext passwords)
- Organization name (optional)
- Payment information — this goes directly to Stripe; we do not store card numbers

When you use the API or CLI:
- API key (stored as a one-way hash; we show only the last 4 characters in the dashboard)

### Governance action metadata

When DingDawg intercepts an AI agent action, we collect:

| Data Point | Example | Why |
|---|---|---|
| Action type | `file_write` | To evaluate risk and generate the receipt |
| Resource path | `./src/index.ts` | To generate the receipt and scope evaluation |
| Scope declaration | `project` | Governance policy evaluation |
| Outcome | `success` | Receipt and audit trail |
| Timestamp | `2026-03-28T14:32:07Z` | Chain ordering and audit |
| Risk score | `12` | Governance decision record |
| Governance level | `standard` | Governance decision record |
| Deny reason | (if denied) | Receipt and your audit trail |

### What we do NOT collect

This is important. DingDawg is designed to govern actions without reading the content of those actions.

- We do not collect file contents — only the file path
- We do not collect the prompts you send to AI models
- We do not collect the outputs AI models generate
- We do not collect shell command output (stdout/stderr)
- We do not collect API request or response bodies
- We do not collect PII from the end users of your products
- We do not read your source code

If a resource path happens to contain sensitive information (e.g., a file named after a customer), consider configuring `resource_patterns.exclude` in your `.governance.yaml` to mask those paths.

### Technical and usage data

- IP address (retained for 30 days for security and fraud detection)
- Browser and CLI version (for support diagnostics)
- API request timestamps and response codes
- Action count per account per day (for metering)

### Rollback snapshots

When rollback is enabled, we create a snapshot of the resources affected by an action. This snapshot may contain file contents if those files were written or deleted by your AI agent.

- Snapshots are encrypted at rest (AES-256)
- Snapshots are never used for any purpose other than rollback
- Snapshots are deleted when rollback state expires (see your plan's rollback window)
- You can delete a specific rollback snapshot before expiry via `dingdawg rollback drop <receipt_id>`

---

## 2. How We Use Your Data

**Receipt generation.** Action metadata is used to generate signed, chained receipts — the core function of the Service.

**Governance decisions.** Action type, resource, and scope are used by the risk evaluation engine to produce a governance decision (allow or deny).

**Usage metering.** Action counts are used to enforce plan limits and generate your usage dashboard.

**Account management.** Your email is used to send account-related communications: account verification, billing receipts, password resets, and important service notices.

**Security and fraud prevention.** IP addresses and request patterns are analyzed to detect abuse, credential stuffing, and anomalous usage that could indicate a compromised API key.

**Service improvement.** Aggregated, de-identified action type distributions (e.g., "X% of all governed actions are file writes") may be used to improve our governance models. We do not use individual account data for this purpose without explicit consent.

We do not sell your data. We do not use your data to train AI models. We do not share your data with advertisers.

---

## 3. Data Storage and Security

**Where your data lives.** All data is stored on cloud infrastructure in the United States. Rollback snapshots and receipt data are stored in US-based cloud object storage.

**Encryption at rest.** All data is encrypted at rest using AES-256. Receipt records are additionally protected by the HMAC-SHA256 signature chain, which makes tampering detectable even if storage is compromised.

**Encryption in transit.** All API communication uses TLS 1.2 or higher. The CLI enforces TLS and does not support plain HTTP.

**Access control.** DingDawg employees can access your account data only when required to resolve a support request or investigate a security incident. Access is logged. We do not access your data for any other purpose.

**Security practices.** We use bcrypt for password hashing, rotate API signing keys quarterly, and run automated vulnerability scanning on our infrastructure.

**Breach notification.** If we become aware of a data breach affecting your personal information, we will notify you by email within 72 hours of becoming aware of the breach, consistent with GDPR requirements.

---

## 4. Third-Party Services

We share data with the following third parties to operate the Service:

**Stripe** — payment processing. When you enter billing information, it goes directly to Stripe. We receive a Stripe customer ID and subscription status. We do not receive or store your full card number, CVV, or billing address. Stripe's Privacy Policy: [stripe.com/privacy](https://stripe.com/privacy).

That's it. We do not share your data with analytics platforms, advertising networks, data brokers, or any other third parties.

If this changes, we will update this policy and notify you by email before the change takes effect.

---

## 5. Cookies and Tracking

The DingDawg web app (app.dingdawg.com) uses:

- **Session cookies** — required for authentication. Deleted when you log out or the session expires.
- **Preference cookies** — store your dashboard UI preferences (e.g., date range filters). Expire after 1 year.

We do not use advertising cookies, third-party analytics cookies, or tracking pixels.

The CLI does not use cookies.

---

## 6. Your Data Rights

Regardless of where you are located, you have the following rights over your data.

**Right to access.** You can view all of your receipts, action metadata, and account information in the dashboard at app.dingdawg.com. You can export your full receipt history at any time via `dingdawg receipt export` or the dashboard export feature.

**Right to correction.** If your account information is incorrect (e.g., wrong email), update it at app.dingdawg.com/account or email support@dingdawg.com.

**Right to deletion.** You can delete your account at any time. Account deletion removes all personal data, action metadata, and rollback snapshots within 30 days. Receipt records are also deleted. (Note: if you are under a legal hold or audit obligation, you may be required to retain your receipt data. That's your responsibility to determine.)

**Right to portability.** You can export your receipts in machine-readable JSON format at any time. Export includes all receipt fields as specified in the DingDawg Governance Receipt Format.

**Right to restriction.** You can disable data collection for specific action types using the `actions.exclude` configuration option in `.governance.yaml`. Excluded actions are not governed and no receipt is generated.

**Right to object.** You can opt out of your anonymized usage data being used for service improvement by emailing privacy@dingdawg.com with the subject line "Opt out of aggregate analytics."

**For EU/EEA residents (GDPR).** DingDawg processes your personal data under the following legal bases:
- **Contract performance** — account data, billing, usage metering (necessary to provide the Service)
- **Legitimate interests** — security and fraud prevention, service improvement using aggregated data
- **Consent** — marketing emails (you opt in; you can unsubscribe at any time)

You have the right to lodge a complaint with your national data protection authority if you believe we have processed your data unlawfully.

**For California residents (CCPA).** We do not sell personal information. You have the right to know what personal information we collect, request deletion, and opt out of sale (which we don't do). Contact privacy@dingdawg.com to exercise these rights.

---

## 7. Data Retention

| Data Type | Retention Period |
|---|---|
| Account information | Until account deletion + 30 days |
| Receipt records | Until account deletion + 30 days |
| Rollback snapshots | Per plan: Free 7 days, Builder 30 days, Team 90 days, Enterprise 1 year |
| IP addresses | 30 days |
| Billing records | 7 years (legal requirement) |
| Support emails | 3 years |

When you delete your account, all data in the table above (except billing records) is deleted within 30 days.

---

## 8. Children

DingDawg Governance is not directed at individuals under 18. We do not knowingly collect personal information from anyone under 18. If you believe we have accidentally collected data from someone under 18, contact privacy@dingdawg.com and we will delete it.

---

## 9. Changes to This Policy

We will notify you by email and post an updated version at dingdawg.com/legal/privacy at least 30 days before any material change to this policy takes effect. Continued use of the Service after the effective date constitutes acceptance of the updated policy.

For non-material changes (e.g., clarifying language that doesn't change our data practices), we may update this policy without advance notice. The "Last updated" date at the top of this policy always reflects the most recent version.

---

## 10. Contact

For privacy-related questions, data access requests, or deletion requests:

**Email:** privacy@dingdawg.com
**General support:** support@dingdawg.com

We aim to respond to all privacy inquiries within 5 business days.

DingDawg, Inc.
support@dingdawg.com
