# DingDawg Governance — Pricing

Every plan includes the core DingDawg Governance features: cryptographically signed receipts, hash-chained audit trail, rollback capability, and MCP-layer interception for Claude Code, Codex, and Cursor.

---

## Plans

### Free
**$0/month — No credit card required**

For individuals getting started with governed AI execution.

- **200 actions/day** (resets at midnight UTC)
- Instant receipt generation
- Full receipt history for 30 days
- Rollback window: 7 days
- SHA-256 hash chain verification
- Claude Code, Codex, and Cursor integration
- Receipt export (JSON)
- Community support (GitHub Discussions)

**No time limit. Use the Free plan forever.**

---

### Builder
**$49/month** — or $39/month billed annually ($468/year)

For developers and solo builders running serious workloads.

Everything in Free, plus:

- **50,000 actions/month** (≈1,600/day)
- Receipt history for 1 year
- Rollback window: 30 days
- **Routing intelligence** — DingDawg analyzes your action patterns and suggests governance tuning automatically
- Compliance exports (JSON, CSV, PDF summary)
- Webhook notifications on deny or rollback events
- Email digest reports (daily or weekly)
- Priority support (email, 48-hour response)

---

### Team
**$149/month** — or $119/month billed annually ($1,428/year)

For teams that share an AI agent environment.

Everything in Builder, plus:

- **200,000 actions/month** shared across the team
- Up to **15 seats** (additional seats $8/seat/month)
- Shared audit trail — all team members' actions in one searchable log
- **Team policies** — define governance rules once, enforce across every seat
- Role-based access control (Admin, Reviewer, Member)
- Human approval workflows for high-risk actions
- Slack and webhook integration for approval requests
- SSO (Google Workspace, Okta, Azure AD)
- Compliance package: SOC 2 Type II report on request
- Priority support (email + Slack, 24-hour response)

---

### Enterprise
**Custom pricing**

For organizations with compliance requirements, high action volume, or dedicated infrastructure needs.

Everything in Team, plus:

- **Unlimited actions**
- Unlimited seats
- **SLA**: 99.9% uptime guarantee with financial credits
- Dedicated support engineer (named contact)
- **Insurance integration**: audit trail formatted for cyber liability insurance claims
- Custom data residency (US, EU, or your VPC)
- Custom retention periods (beyond 1 year)
- Custom governance policies authored by DingDawg team
- On-premises deployment option
- Security review and penetration test report on request
- Quarterly business review with DingDawg team

Contact us: [enterprise@dingdawg.com](mailto:enterprise@dingdawg.com)

---

## Plan Comparison

| Feature | Free | Builder | Team | Enterprise |
|---|---|---|---|---|
| Actions | 200/day | 50K/month | 200K/month | Unlimited |
| Seats | 1 | 1 | Up to 15 | Unlimited |
| Receipt history | 30 days | 1 year | 1 year | Custom |
| Rollback window | 7 days | 30 days | 90 days | 1 year |
| Routing intelligence | — | Yes | Yes | Yes |
| Compliance export | JSON | JSON, CSV, PDF | JSON, CSV, PDF | Custom |
| Team policies | — | — | Yes | Yes |
| Shared audit trail | — | — | Yes | Yes |
| Approval workflows | — | — | Yes | Yes |
| SSO | — | — | Yes | Yes |
| SLA | — | — | — | 99.9% |
| Insurance integration | — | — | — | Yes |
| Support | Community | Email 48h | Email + Slack 24h | Dedicated |

---

## Frequently Asked Questions

### What counts as an action?

One governed action = one intercepted tool call that DingDawg evaluates before execution. Examples:

- Writing a file: 1 action
- Deleting a file: 1 action
- Running a shell command: 1 action
- Making an API call: 1 action
- Reading a file: 0 actions (reads are not governed, only writes)

If an agent writes 10 files in a loop, that counts as 10 actions. If DingDawg denies an action, it still counts toward your total — the evaluation happened.

### What happens when I hit my daily or monthly cap?

**Free plan (200 actions/day):** When you hit the cap, DingDawg enters passthrough mode. Actions still execute but receipts are no longer generated. You'll see a warning in your terminal:

```
[DingDawg] Daily limit reached (200/200). Actions will execute without governance until midnight UTC.
Upgrade to Builder at app.dingdawg.com/upgrade to restore governance.
```

Your existing receipts and rollback state remain intact.

**Builder and Team plans (monthly cap):** Same behavior — governance pauses, actions continue. You can set a webhook alert to notify you when you reach 80% of your monthly cap:

```yaml
notifications:
  webhook:
    url: "https://your-endpoint.com/dingdawg-alert"
    events:
      - cap_warning_80pct
      - cap_reached
```

You can also purchase action top-ups from the dashboard without upgrading your plan.

### Can I downgrade my plan?

Yes. You can downgrade any time from [app.dingdawg.com/billing](https://app.dingdawg.com/billing). Downgrade takes effect at the end of your current billing period — you keep your current plan's features until then.

When downgrading from Team to Builder or Free:
- Team policies are preserved but deactivated (reactivated if you upgrade again)
- Shared audit trail data is retained for 30 days after downgrade, then deleted
- Seats above the new plan limit are deactivated (not deleted)

When downgrading from Builder to Free:
- Receipt history older than 30 days is deleted 30 days after downgrade
- Rollback state older than 7 days expires immediately on downgrade (Free plan rollback window)

### Can I upgrade mid-month?

Yes. You're billed a prorated amount for the remainder of the current billing period. Your higher action limit is available immediately.

### Do unused actions roll over?

No. Monthly action counts reset on your billing date. Daily counts reset at midnight UTC.

### Is the Free plan really free forever?

Yes. We do not require a credit card to sign up. The Free plan has no trial period — it does not expire.

### Do you offer discounts for open source projects?

Yes. Maintainers of qualifying open source projects (MIT, Apache 2.0, GPL) get the Builder plan free. Email [opensource@dingdawg.com](mailto:opensource@dingdawg.com) with a link to your repository.

### Do you offer a student or education discount?

Yes. Students and educators get 50% off Builder and Team plans. Verify with a `.edu` email address at [app.dingdawg.com/edu](https://app.dingdawg.com/edu).

### What payment methods do you accept?

Credit card (Visa, Mastercard, Amex, Discover) via Stripe. Annual plans can also be paid by invoice (ACH or wire). Contact [billing@dingdawg.com](mailto:billing@dingdawg.com) for invoice payments.

### What is the pricing change policy?

We provide 30 days notice before any price increase. Existing customers are grandfathered at their current price for 6 months after any price change.

---

*Prices are in USD. All plans are subject to the [Terms of Service](TERMS_OF_SERVICE.md) and [Privacy Policy](PRIVACY_POLICY.md).*
