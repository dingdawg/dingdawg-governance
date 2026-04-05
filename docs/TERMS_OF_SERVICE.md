# Terms of Service

**DingDawg Governance**
Effective Date: March 28, 2026
Last Updated: March 28, 2026
Document Version: 2.0

---

These Terms of Service ("**Terms**") constitute a legally binding agreement between DingDawg, Inc. ("**DingDawg**," "**we**," "**us**," or "**our**") and the individual or entity ("**Customer**," "**you**," or "**your**") accessing or using the DingDawg Governance platform, API, CLI, SDKs, and associated services (collectively, the "**Service**"). By creating an account, accessing the API, or using any component of the Service, you agree to be bound by these Terms. **If you do not agree, do not access or use the Service.**

If you are accepting these Terms on behalf of an organization, you represent and warrant that you have authority to bind that organization, in which case "you" and "your" refer to that organization.

---

## 1. Definitions

The following capitalized terms have the meanings set forth below and apply throughout these Terms.

**"Action Request"** means any instruction, command, invocation, or payload submitted to the Service by a Customer, an AI agent operating on behalf of a Customer, or an integration acting on the Customer's behalf, requesting evaluation, governance review, or execution of an action.

**"Approved Action"** means an Action Request that the Service has evaluated against the Customer's configured governance policies and returned a decision permitting execution. An Approved Action does not represent DingDawg's independent recommendation, endorsement, or certification that the action is safe, correct, or appropriate in the Customer's environment. The approval is policy-relative, not absolute.

**"Behavioral Pattern"** means any derivative data, inference, statistical model, heuristic, score weighting, or pattern extracted or derived from the aggregate sequence, timing, content, or outcomes of Governance Decisions, Action Requests, or Governance Outputs across one or more Customer accounts. Behavioral Patterns embedded in the Service's evaluation engine are DingDawg proprietary information. Behavioral Patterns derived solely from a Customer's own receipts and their own operational data remain the Customer's data subject to Section 8.

**"Customer Data"** means all data, configurations, action metadata, file paths, shell command strings, API call payloads, and governance policy definitions submitted to the Service by or on behalf of the Customer.

**"DPA"** means the DingDawg Data Processing Addendum, available at dingdawg.com/legal/dpa, which governs the processing of personal data on behalf of Customers subject to applicable data protection laws including GDPR and CCPA.

**"Governance Decision"** means the policy evaluation result returned by the Service in response to an Action Request, including the outcome (approved, blocked, flagged, or deferred), the applicable policy rules evaluated, the risk score or tier assigned, and the cryptographically signed receipt generated to document the evaluation. A Governance Decision is a record of evaluation, not a guarantee of outcome.

**"Governance Output"** means all artifacts produced by the Service in connection with a Governance Decision, including signed receipts in DingDawg Governance Receipt Format (DGRF), audit logs, policy evaluation traces, rollback manifests, and chain hashes.

**"Rollback Artifact"** means any snapshot, diff, state capture, manifest, or restoration package created by the Service before, during, or after execution of an Action Request for purposes of enabling reversal of that action. Rollback Artifacts may contain Customer Data, file contents, environment state, or other information present in the Customer's environment at the time of capture.

**"Service Level"** means the uptime and availability commitments applicable to each subscription tier as specified in Section 11.

**"Subscription Tier"** means the Customer's current plan designation: Free, Builder, Team, or Enterprise, as further described at dingdawg.com/pricing.

---

## 2. Description of the Service

DingDawg Governance is a software platform that provides AI agent governance, audit, and rollback capabilities. The Service intercepts and evaluates AI agent Action Requests against configurable governance policies, generates cryptographically signed Governance Outputs, and enables rollback of executed actions via Rollback Artifacts.

The Service operates as a governance and observability layer. **The Service does not independently control, operate, direct, or take responsibility for the underlying AI models, AI coding tools, development environments, or production systems with which Customers integrate it.** Governance Decisions are outputs of Customer-configured policy evaluation, not independent safety determinations by DingDawg.

The Service is available via REST API, CLI, and integrations including but not limited to Claude Code, Codex, and Cursor. Enterprise Customers may access additional integration methods under a separate Order Form.

---

## 3. Accounts and Access

**3.1 Eligibility.** You must be at least 18 years old to create an account. Corporate or organizational accounts require that the individual accepting these Terms has authority to bind the organization.

**3.2 Accurate Information.** You agree to provide accurate, current, and complete information when creating and maintaining your account. You agree to promptly update account information if it changes.

**3.3 API Key Security.** API keys grant programmatic access to the Service with the full permissions of the associated account. You are solely responsible for: (a) maintaining the confidentiality of all API keys; (b) controlling which systems, agents, and personnel have access to API keys; (c) immediately rotating compromised keys at app.dingdawg.com/keys; and (d) all actions taken using your API keys, regardless of authorization. DingDawg is not liable for unauthorized access or use resulting from Customer's failure to secure API keys.

**3.4 Account Integrity.** Creating multiple Free accounts for the purpose of circumventing plan limits, usage quotas, or access restrictions is a material breach of these Terms and grounds for immediate termination of all associated accounts.

**3.5 Organizational Accounts.** Enterprise and Team plan Customers may provision sub-accounts or user seats. The account owner is responsible for all activity across all seats and sub-accounts under the organizational account.

---

## 4. Acceptable Use

You may use the Service for lawful purposes consistent with these Terms, including governing AI agent actions in development and production environments, generating audit trails for compliance and regulatory purposes, integrating Governance Outputs into internal compliance workflows, enabling Rollback Artifact-based reversal of AI-executed actions, and building integrations that consume Governance Outputs for Customer's internal operations.

---

## 5. Prohibited Use

The following are expressly prohibited. Violations constitute material breach and grounds for immediate account termination with no refund.

**5.1 Reverse Engineering Governance Logic.** You may not attempt to reconstruct, extract, replicate, model, or approximate DingDawg's proprietary risk scoring algorithms, policy evaluation logic, Behavioral Pattern weighting, routing decisions, or governance evaluation engine through any means including but not limited to systematic API probing, statistical inference from Governance Decisions, adversarial payload construction, or examination of Service responses. You may freely inspect your own receipts and chain hashes — those are your Governance Outputs. The evaluation engine that generated them is DingDawg's exclusive intellectual property.

**5.2 Behavioral Pattern Extraction.** You may not use the Service, or any data derived from the Service, to extract, train on, model, or replicate Behavioral Patterns for any purpose other than governing your own AI agents within your own environment. Prohibited extraction includes: (a) submitting Action Requests designed to probe decision boundaries rather than govern real operations; (b) aggregating Governance Decision sequences to infer risk thresholds or scoring weights; (c) using the Service as a labeled dataset for training governance models; and (d) instrumenting the Service API to collect decision metadata for machine learning purposes. This prohibition applies regardless of whether the extracted data is used internally or shared externally.

**5.3 Competitive Use and Benchmarking.** You may not use the Service, or Governance Outputs derived from it, to: (a) design, build, train, evaluate, or benchmark a competing AI governance product or service; (b) conduct competitive analysis of DingDawg's governance capabilities for the purpose of replicating or undercutting those capabilities; (c) generate comparative performance data for use in marketing or sales materials against DingDawg; or (d) advise, consult for, or provide material assistance to any third party engaged in building a product that competes directly with DingDawg Governance. See also Section 12.

**5.4 Free Tier Scraping.** You may not use Free Tier access to systematically collect, aggregate, or export Customer Data, Governance Outputs, or Behavioral Patterns for commercial purposes. The Free Tier exists for individual developers evaluating the Service. Automated pipelines, bulk data collection, and programmatic harvesting of Governance Outputs at volume without a paid subscription are prohibited.

**5.5 Circumventing Governance.** You may not deliberately structure Action Requests to generate false Approved Action outcomes — for example, by decomposing high-risk actions into sequences of lower-risk components designed to individually pass policy evaluation while collectively executing a prohibited operation. The integrity of Governance Decisions depends on honest use of the Service.

**5.6 Denial of Service and Abuse.** You may not submit malformed payloads, excessively large requests, or artificially high request volumes designed to degrade Service performance for other customers. Rate limits apply per plan and are enforced automatically.

**5.7 Illegal Use.** You may not use the Service in connection with: unauthorized access to computer systems; export control violations; processing personal data without lawful basis under applicable law; or any other activity that violates applicable local, national, or international law.

---

## 6. Governance Decision Disclaimer

**THIS SECTION CONTAINS CRITICAL LIMITATIONS ON HOW GOVERNANCE DECISIONS MAY BE RELIED UPON. READ CAREFULLY.**

**6.1 Approved Actions Do Not Transfer Liability.**

AN APPROVED ACTION REPRESENTS THE SERVICE'S EVALUATION OF AN ACTION REQUEST AGAINST THE CUSTOMER'S CONFIGURED GOVERNANCE POLICIES AT THE TIME OF EVALUATION. AN APPROVED ACTION DOES NOT CONSTITUTE: (A) A GUARANTEE THAT THE ACTION IS SAFE, CORRECT, REVERSIBLE, OR APPROPRIATE IN THE CUSTOMER'S ENVIRONMENT; (B) AN ENDORSEMENT BY DINGDAWG OF THE UNDERLYING AI AGENT'S BEHAVIOR; (C) A CERTIFICATION THAT THE ACTION COMPLIES WITH ANY REGULATORY REQUIREMENT, INTERNAL POLICY, OR THIRD-PARTY AGREEMENT; OR (D) A TRANSFER OF LIABILITY FROM THE CUSTOMER TO DINGDAWG FOR OUTCOMES RESULTING FROM THE EXECUTION OF THAT ACTION.

THE CUSTOMER REMAINS SOLELY RESPONSIBLE FOR ALL CONSEQUENCES OF ACTIONS EXECUTED IN ITS ENVIRONMENT, INCLUDING CONSEQUENCES OF ACTIONS BEARING AN APPROVED ACTION GOVERNANCE DECISION. RECEIVING AN APPROVED ACTION GOVERNANCE DECISION DOES NOT RELIEVE THE CUSTOMER OF ITS OBLIGATION TO EXERCISE INDEPENDENT JUDGMENT BEFORE AUTHORIZING EXECUTION OF SENSITIVE, IRREVERSIBLE, OR HIGH-IMPACT OPERATIONS.

**6.2 False Positive and False Negative Disclaimer.**

THE SERVICE MAY PRODUCE FALSE POSITIVES (BLOCKING ACTIONS THAT WOULD BE SAFE TO EXECUTE) AND FALSE NEGATIVES (APPROVING ACTIONS THAT CAUSE HARM). NO GOVERNANCE SYSTEM IS INFALLIBLE. THE ACCURACY OF GOVERNANCE DECISIONS DEPENDS ON THE QUALITY AND COMPLETENESS OF THE CUSTOMER'S POLICY CONFIGURATION, THE FIDELITY OF ACTION REQUEST PAYLOADS, AND THE INHERENT LIMITATIONS OF AUTOMATED POLICY EVALUATION.

DINGDAWG DOES NOT WARRANT THAT THE SERVICE WILL CORRECTLY EVALUATE ANY PARTICULAR ACTION REQUEST. CUSTOMER IS RESPONSIBLE FOR DESIGNING GOVERNANCE POLICIES, TESTING THOSE POLICIES UNDER REALISTIC CONDITIONS, AND VALIDATING THAT THE SERVICE BEHAVES AS EXPECTED BEFORE DEPLOYING IT IN HIGH-STAKES OR PRODUCTION ENVIRONMENTS.

**6.3 Deployment Deadline and Time-Sensitive Operation Liability.**

CUSTOMERS MUST NOT RELY ON THE SERVICE AS THE SOLE OR PRIMARY MECHANISM FOR MANAGING DEPLOYMENT DEADLINES, TIME-SENSITIVE OPERATIONS, OR REGULATORY FILING WINDOWS. THE SERVICE MAY EXPERIENCE LATENCY, QUEUING DELAYS, OUTAGES, OR POLICY EVALUATION TIMEOUTS THAT RESULT IN ACTION REQUESTS BEING DEFERRED OR NOT EVALUATED WITHIN CUSTOMER-REQUIRED TIMEFRAMES.

DINGDAWG IS NOT LIABLE FOR: (A) MISSED DEPLOYMENT WINDOWS CAUSED BY SERVICE LATENCY OR UNAVAILABILITY; (B) REGULATORY OR CONTRACTUAL PENALTIES INCURRED DUE TO DELAYED GOVERNANCE DECISIONS; (C) DOWNSTREAM SLA BREACHES WITH CUSTOMER'S CUSTOMERS OR PARTNERS CAUSED BY GOVERNANCE-RELATED DELAYS; OR (D) BUSINESS LOSSES RESULTING FROM AN AI AGENT'S INABILITY TO EXECUTE AN ACTION DURING A SERVICE OUTAGE OR DEGRADED STATE.

CUSTOMERS OPERATING IN ENVIRONMENTS WITH HARD DEADLINE REQUIREMENTS MUST IMPLEMENT FALLBACK PROCEDURES THAT DO NOT DEPEND ON THE SERVICE'S AVAILABILITY.

**6.4 Post-Approval Customer Responsibility.**

ONCE A GOVERNANCE DECISION IS ISSUED AND AN ACTION IS EXECUTED, DINGDAWG'S ROLE IS COMPLETE. DINGDAWG HAS NO VISIBILITY INTO, AND ACCEPTS NO RESPONSIBILITY FOR, DOWNSTREAM EFFECTS OF ACTIONS EXECUTED PURSUANT TO APPROVED ACTION GOVERNANCE DECISIONS, INCLUDING BUT NOT LIMITED TO: DATA LOSS, SYSTEM CORRUPTION, SECURITY INCIDENTS, FINANCIAL LOSSES, REGULATORY EXPOSURE, OR REPUTATIONAL HARM.

---

## 7. Intellectual Property

**7.1 DingDawg Ownership.**

DingDawg owns all right, title, and interest in and to the Service, including: the API, CLI, SDKs, web application, and all associated software; the governance evaluation engine and all underlying algorithms, models, heuristics, and scoring logic; the DingDawg Governance Receipt Format (DGRF) implementation, cryptographic signing infrastructure, and chain hash architecture; all Behavioral Patterns embedded in or derived from the operation of the Service across the customer base; all documentation, training materials, and product interfaces; and all improvements, modifications, and derivative works of the foregoing. No rights are granted to Customer except the limited license to use the Service as described in these Terms.

**7.2 Customer Data Ownership.**

Customer retains ownership of all Customer Data submitted to the Service. DingDawg's license to Customer Data is limited to: (a) operating, maintaining, and improving the Service as described in Section 8; and (b) generating Governance Outputs in response to Action Requests. DingDawg does not claim ownership of Customer Data.

**7.3 Prohibition on AI Training Using Customer Data.**

DINGDAWG WILL NOT USE CUSTOMER DATA TO TRAIN, FINE-TUNE, OR IMPROVE ANY MACHINE LEARNING MODEL, LARGE LANGUAGE MODEL, OR AI SYSTEM, WHETHER OPERATED BY DINGDAWG OR ANY THIRD PARTY. This prohibition covers: (a) the content of Action Requests; (b) Customer governance policy configurations; (c) Rollback Artifact contents; and (d) any other Customer Data submitted to the Service. Usage metadata and aggregate, de-identified service performance metrics are not Customer Data and are not subject to this prohibition.

**7.4 Behavioral Pattern Ownership.**

Behavioral Patterns derived from aggregate, de-identified, cross-customer operational data — including patterns used to improve the Service's evaluation engine — are DingDawg's exclusive intellectual property. These patterns are derived from the Service's operation at scale and do not constitute Customer Data. Customer's individual governance configuration, individual receipt history, and individual operational data remain Customer Data subject to Section 7.2.

**7.5 Open Standard.**

The DingDawg Governance Receipt Format (DGRF) specification is published as an open standard under CC0. You are free to implement compatible receipt generators and consumers without restriction. This license covers the specification only, not the DingDawg implementation.

**7.6 Feedback.**

If you provide suggestions, bug reports, feature requests, or other feedback about the Service, you grant DingDawg a perpetual, irrevocable, worldwide, royalty-free license to use, incorporate, and commercialize that feedback without restriction or compensation. You waive any moral rights in such feedback to the extent permitted by applicable law.

---

## 8. Data Processing

**8.1 DPA Incorporation.**

To the extent Customer submits personal data (as defined under applicable data protection law) to the Service, the parties' processing activities are governed by the DingDawg Data Processing Addendum ("DPA"), available at dingdawg.com/legal/dpa and incorporated herein by reference. In the event of conflict between the DPA and these Terms with respect to personal data processing, the DPA governs.

**8.2 Usage Data.**

DingDawg collects and owns aggregate, de-identified usage data generated by the Service's operation, including request volumes, action type distributions, policy evaluation latencies, error rates, and system performance metrics. This data does not identify individual Customers or contain Customer Data. DingDawg may use usage data to: (a) operate and improve the Service; (b) generate internal analytics; and (c) publish aggregate benchmarks or industry reports. Individual-level data is never published without Customer consent.

**8.3 No Training on Customer Data.**

See Section 7.3. DingDawg's obligation not to train on Customer Data is unconditional and survives termination.

**8.4 Subprocessors.**

DingDawg uses third-party subprocessors to operate the Service, including cloud infrastructure providers and payment processors. A current list of subprocessors is maintained at dingdawg.com/legal/subprocessors.

**8.5 Data Residency.**

Enterprise Customers may request data residency configurations under a separate Order Form. By default, the Service processes data in the United States.

---

## 9. Rollback and Snapshot Liability

**9.1 Customer Responsibility for Rollback Artifact Contents.**

ROLLBACK ARTIFACTS ARE CREATED FROM CUSTOMER'S ENVIRONMENT AT THE TIME OF ACTION REQUEST EVALUATION. ROLLBACK ARTIFACTS MAY CONTAIN SOURCE CODE, CONFIGURATION FILES, SECRETS, CREDENTIALS, PERSONAL DATA, PROPRIETARY INFORMATION, OR OTHER SENSITIVE MATERIAL PRESENT IN CUSTOMER'S ENVIRONMENT. CUSTOMER IS SOLELY RESPONSIBLE FOR: (A) THE CONTENTS OF ALL ROLLBACK ARTIFACTS CREATED IN CONNECTION WITH CUSTOMER'S USE OF THE SERVICE; (B) ENSURING THAT PERSONAL DATA INCLUDED IN ROLLBACK ARTIFACTS IS PROCESSED IN ACCORDANCE WITH APPLICABLE DATA PROTECTION LAW; (C) ENSURING THAT ROLLBACK ARTIFACTS DO NOT CONTAIN SECRETS OR CREDENTIALS THAT SHOULD NOT BE STORED IN THE SERVICE; AND (D) THE CONSEQUENCES OF ROLLING BACK TO ANY PRIOR STATE, INCLUDING LOSS OF DATA WRITTEN AFTER THE SNAPSHOT WAS TAKEN.

**9.2 No Warranty of Rollback Completeness.**

DINGDAWG DOES NOT WARRANT THAT ROLLBACK ARTIFACTS WILL COMPLETELY OR ACCURATELY CAPTURE ALL STATE CHANGES MADE BY AN AI AGENT, THAT RESTORATION FROM A ROLLBACK ARTIFACT WILL FULLY REVERSE ALL EFFECTS OF AN EXECUTED ACTION, OR THAT ROLLBACK OPERATIONS WILL SUCCEED IN ALL ENVIRONMENTS AND CONFIGURATIONS. ROLLBACK IS PROVIDED AS A BEST-EFFORT CAPABILITY.

**9.3 Snapshot Retention.**

Rollback Artifacts are retained for the periods specified in Section 10.2. After expiration, Rollback Artifacts are permanently deleted. DingDawg is not liable for Customer's inability to perform a rollback operation after the applicable retention period has elapsed.

**9.4 Irreversible Actions.**

Some AI agent actions are irreversible by nature (e.g., deletion of external data, sending of messages, financial transactions). THE SERVICE CANNOT RESTORE STATE FOR ACTIONS THAT ARE IRREVERSIBLE IN CUSTOMER'S ENVIRONMENT. DINGDAWG IS NOT LIABLE FOR CUSTOMER'S FAILURE TO CONFIGURE GOVERNANCE POLICIES TO BLOCK IRREVERSIBLE ACTIONS IN ADVANCE.

---

## 10. Data Retention

**10.1 Receipt Records.**

Governance Outputs (signed receipts in DGRF format) are retained for the following periods by Subscription Tier: Free (30 days), Builder (1 year), Team (1 year), Enterprise (custom, per Order Form). On account deletion, receipt records are deleted within 30 days. Except as required by law or as agreed in an Order Form, no receipt records are retained beyond the plan's retention period or after account deletion.

**10.2 Rollback Artifacts.**

Rollback Artifacts are retained as follows: Free (7 days), Builder (30 days), Team (90 days), Enterprise (1 year, configurable per Order Form). After expiration, Rollback Artifacts are permanently deleted. The receipt record referencing the Rollback Artifact remains for the full receipt retention period.

**10.3 Action Metadata.**

Action metadata (action type, resource path, scope, outcome, timestamp) is retained for the same period as receipt records under Section 10.1.

**10.4 Account Deletion.**

On account deletion, all Customer Data is deleted within 30 days. DingDawg may retain minimal records required by law (billing records, fraud investigation records) for up to 7 years.

---

## 11. Service Levels

**11.1 Tiered SLA Commitments.**

Service availability commitments vary by Subscription Tier:

- **Free:** No uptime SLA. The Service is provided on a best-effort basis. No credits are available for Free Tier downtime.
- **Builder:** 99.5% monthly uptime target, measured across calendar months. Downtime credit: 10% of monthly fee per full hour of unplanned downtime exceeding the SLA.
- **Team:** 99.5% monthly uptime target with priority support response time of 4 business hours. Credit structure per Builder terms.
- **Enterprise:** 99.9% monthly uptime SLA with terms, credits, and escalation procedures defined in the applicable Order Form. Enterprise Customers may negotiate custom SLAs, dedicated infrastructure, and enhanced support terms.

Credits are the sole and exclusive remedy for SLA breaches. Credits are applied to future invoices and are not refundable as cash.

**11.2 Latency Disclaimer.**

GOVERNANCE DECISION LATENCY — THE TIME BETWEEN AN ACTION REQUEST BEING SUBMITTED AND A GOVERNANCE DECISION BEING RETURNED — VARIES BASED ON POLICY COMPLEXITY, PAYLOAD SIZE, INFRASTRUCTURE LOAD, AND NETWORK CONDITIONS. DINGDAWG DOES NOT WARRANT ANY SPECIFIC GOVERNANCE DECISION LATENCY. CUSTOMERS OPERATING IN LATENCY-SENSITIVE ENVIRONMENTS (INCLUDING REAL-TIME DEPLOYMENT PIPELINES, INTERACTIVE AI AGENTS, AND TIME-CRITICAL OPERATIONS) ARE SOLELY RESPONSIBLE FOR IMPLEMENTING APPROPRIATE TIMEOUT HANDLING AND FALLBACK LOGIC.

**11.3 Scheduled Maintenance.**

Scheduled maintenance windows are announced at status.dingdawg.com with at least 48 hours advance notice. Enterprise Customers may request maintenance windows that minimize impact on their operations under their Order Form.

**11.4 Exclusions.**

SLA commitments exclude downtime caused by: Customer's failure to comply with these Terms; Customer's misuse or abuse of the Service; third-party services outside DingDawg's reasonable control; Force Majeure events; or attacks on infrastructure that DingDawg is actively mitigating.

---

## 12. Competitive Use and Benchmarking

**12.1 Prohibition on Competitive Use.**

You may not use the Service, directly or through a third party, to design, develop, train, evaluate, benchmark, or support any product or service that competes with DingDawg Governance. This includes building AI governance products, AI agent policy enforcement layers, AI audit trail platforms, or AI rollback systems that incorporate insights, architectures, or capabilities derived from Customer's use of the Service.

**12.2 Prohibition on Published Benchmarks.**

You may not publish, distribute, or disclose benchmarks, performance comparisons, or evaluations of the Service without DingDawg's prior written consent. This prohibition applies to academic publications, marketing materials, analyst briefings, and investor presentations.

**12.3 No Circumvention.**

You may not use a third party, affiliate, contractor, or agent to conduct any activity prohibited under Sections 5.2, 5.3, or this Section 12.

---

## 13. Pricing and Payment

**13.1 Free Tier.**

The Free Tier has no fees and requires no credit card. Free Tier access is subject to usage limits published at dingdawg.com/pricing. DingDawg reserves the right to modify Free Tier limits with 30 days notice.

**13.2 Paid Plans.**

Paid plans are billed in advance on a monthly or annual cycle via Stripe. All prices are in USD unless otherwise specified in an Order Form.

**13.3 Overages.**

If a Customer exceeds plan action limits, the Service enters passthrough mode — Action Requests execute without governance evaluation until the limit resets at the start of the next billing cycle. No overage fees are automatically charged. Customer may upgrade at any time. **Customer assumes all governance risk for actions processed in passthrough mode.**

**13.4 Refunds.**

Monthly subscriptions are non-refundable. Annual subscriptions may receive a prorated refund for unused full months if cancellation is requested within 30 days of the annual renewal date. Contact billing@dingdawg.com.

**13.5 Price Changes.**

DingDawg will provide 30 days written notice before increasing prices. Customers on a paid plan at the time of a price increase will be grandfathered at their current price for 6 months from the effective date of the price change.

**13.6 Taxes.**

Stated prices exclude taxes. Customer is responsible for all applicable sales tax, VAT, GST, or similar charges based on Customer's location and jurisdiction.

**13.7 Late Payment.**

Unpaid invoices accrue interest at 1.5% per month (or the maximum rate permitted by law, whichever is lower) from the due date. DingDawg may suspend access after 14 days written notice of non-payment.

---

## 14. Limitation of Liability

**14.1 Exclusion of Consequential Damages.**

IN NO EVENT WILL DINGDAWG, ITS AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE TO CUSTOMER FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:

- LOST PROFITS, REVENUE, OR BUSINESS OPPORTUNITIES;
- LOSS OF DATA OR CORRUPTION OF DATA;
- MISSED DEPLOYMENT DEADLINES OR RELEASE WINDOWS;
- DEPLOYMENT DELAYS CAUSED BY SERVICE LATENCY, QUEUING, OR UNAVAILABILITY;
- DOWNSTREAM SLA BREACHES WITH CUSTOMER'S CUSTOMERS, PARTNERS, OR VENDORS;
- BUSINESS INTERRUPTION OR OPERATIONAL DISRUPTION;
- SECURITY INCIDENTS, DATA BREACHES, OR UNAUTHORIZED ACCESS OCCURRING AFTER OR AS A RESULT OF AN APPROVED ACTION GOVERNANCE DECISION;
- REGULATORY FINES, PENALTIES, OR ENFORCEMENT ACTIONS;
- REPUTATIONAL HARM OR LOSS OF GOODWILL;

REGARDLESS OF THE THEORY OF LIABILITY (CONTRACT, TORT, STRICT LIABILITY, OR OTHERWISE) AND EVEN IF DINGDAWG HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

**14.2 Aggregate Liability Cap.**

TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DINGDAWG'S TOTAL AGGREGATE LIABILITY TO CUSTOMER FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE — WHETHER IN CONTRACT, TORT, OR OTHERWISE — IS LIMITED TO THE GREATER OF: (A) THE TOTAL FEES PAID BY CUSTOMER TO DINGDAWG IN THE 12-MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM; OR (B) ONE HUNDRED U.S. DOLLARS ($100.00 USD).

THE $100 FLOOR APPLIES TO ALL CUSTOMERS, INCLUDING FREE TIER CUSTOMERS, WHO HAVE PAID NO FEES. THIS FLOOR REFLECTS THE NATURE OF GOVERNANCE TOOLING: CUSTOMERS RETAIN CONTROL OVER EXECUTION, CONFIGURATION, AND ENVIRONMENT.

**14.3 Essential Basis.**

THE PARTIES ACKNOWLEDGE THAT THE LIMITATIONS OF LIABILITY IN THIS SECTION 14 REFLECT A REASONABLE ALLOCATION OF RISK AND ARE AN ESSENTIAL BASIS OF THE BARGAIN BETWEEN THE PARTIES. DINGDAWG WOULD NOT PROVIDE THE SERVICE ON THE TERMS SET FORTH HERE WITHOUT THESE LIMITATIONS.

**14.4 Exceptions.**

Nothing in this Section 14 limits DingDawg's liability for: (a) death or personal injury caused by DingDawg's gross negligence; (b) fraud or intentional misconduct; or (c) any other liability that cannot be excluded by applicable law.

---

## 15. Indemnification

**15.1 Customer Indemnification of DingDawg.**

Customer shall defend, indemnify, and hold harmless DingDawg, its affiliates, and their respective directors, officers, employees, and agents from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to:

(a) **Actions executed after Governance Decisions**, including any claim by a third party that an action executed pursuant to an Approved Action Governance Decision caused harm, data loss, security breach, financial loss, or any other injury — regardless of whether Customer, an AI agent, or an automated system initiated the execution;

(b) **Customer's governance configuration**, including claims arising from Customer's design, implementation, or failure to maintain governance policies that adequately protect Customer's environment;

(c) **Rollback Artifact contents**, including claims arising from personal data, confidential information, or regulated data included in Rollback Artifacts created in Customer's environment;

(d) **Customer Data**, including claims by third parties that Customer Data or Customer's use of the Service infringes any patent, copyright, trademark, trade secret, or other proprietary right, or violates any applicable law;

(e) **Customer's violation of these Terms**, including claims arising from Customer's violation of Section 5 (Prohibited Use), Section 12 (Competitive Use), or any other provision of these Terms; and

(f) **AI agent behavior**, including claims arising from the behavior, outputs, or decisions of AI agents operating within Customer's environment, regardless of whether those agents were evaluated by the Service.

**15.2 Indemnification Procedure.**

DingDawg will: (a) promptly notify Customer in writing of any claim subject to indemnification; (b) give Customer sole control over the defense and settlement of the claim (provided Customer does not settle any claim in a manner that admits DingDawg's liability or imposes obligations on DingDawg without DingDawg's prior written consent); and (c) provide reasonable cooperation and assistance at Customer's expense.

---

## 16. Warranties and Disclaimer

**16.1 Customer Warranties.**

Customer represents and warrants that: (a) Customer has the right and authority to submit all Customer Data to the Service; (b) Customer's use of the Service will comply with all applicable laws and regulations; (c) Customer's governance policies are designed in good faith to govern AI agent behavior, not to circumvent the Service; and (d) if Customer is an organization, the individual accepting these Terms has authority to bind the organization.

**16.2 Service Disclaimer.**

THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, DINGDAWG EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. DINGDAWG DOES NOT WARRANT THAT: (A) THE SERVICE WILL OPERATE WITHOUT INTERRUPTION OR ERROR; (B) GOVERNANCE DECISIONS WILL BE FREE FROM FALSE POSITIVES OR FALSE NEGATIVES; (C) THE SERVICE WILL MEET CUSTOMER'S SPECIFIC GOVERNANCE, COMPLIANCE, OR REGULATORY REQUIREMENTS; (D) ROLLBACK OPERATIONS WILL FULLY RESTORE PRIOR STATE IN ALL ENVIRONMENTS; OR (E) THE SERVICE IS FREE FROM SECURITY VULNERABILITIES.

---

## 17. Suspension and Termination

**17.1 Termination by Customer.**

Customer may cancel at any time from app.dingdawg.com/billing or by emailing support@dingdawg.com. Cancellation takes effect at the end of the current billing period. No refunds are issued except as described in Section 13.4.

**17.2 Suspension or Termination by DingDawg.**

DingDawg may suspend or terminate Customer's account immediately upon notice if: (a) Customer violates Section 5 (Prohibited Use) or Section 12 (Competitive Use); (b) DingDawg detects activity suggesting abuse, fraud, or circumvention of Service limits; (c) Customer fails to pay a past-due invoice after 14 days written notice; (d) DingDawg is required to do so by applicable law or court order; or (e) Customer's use of the Service creates legal, regulatory, or reputational risk for DingDawg.

For less severe violations, DingDawg will, where practicable, provide prior written notice and an opportunity to cure before suspension.

**17.3 Effect of Termination.**

Upon termination: (a) Customer's access to the Service ends immediately; (b) all API keys associated with the account are revoked; (c) data deletion proceeds per Section 10.4; and (d) Sections 6, 7, 9.1, 9.4, 14, 15, 16.2, and 18 survive termination.

---

## 18. General Provisions

**18.1 Governing Law.**

These Terms are governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions. The United Nations Convention on Contracts for the International Sale of Goods does not apply.

**18.2 Dispute Resolution.**

Any dispute arising out of or relating to these Terms or the Service will be resolved by binding arbitration under the Commercial Arbitration Rules of the American Arbitration Association, administered in Wilmington, Delaware, before a single arbitrator. The arbitrator's award will be final and binding. Judgment on the award may be entered in any court of competent jurisdiction. Either party may seek emergency injunctive relief from a court of competent jurisdiction to prevent irreparable harm pending arbitration.

**18.3 Opt-Out of Arbitration.**

You may opt out of the arbitration agreement in Section 18.2 within 30 days of first accepting these Terms by emailing legal@dingdawg.com with your account email and a written statement of opt-out. If you opt out, disputes will be resolved in the state or federal courts located in Wilmington, Delaware, and both parties consent to personal jurisdiction in those courts.

**18.4 Class Action Waiver.**

ALL DISPUTES MUST BE BROUGHT IN EACH PARTY'S INDIVIDUAL CAPACITY. YOU WAIVE YOUR RIGHT TO BRING OR PARTICIPATE IN ANY CLASS ACTION, COLLECTIVE ACTION, OR REPRESENTATIVE PROCEEDING AGAINST DINGDAWG. THE ARBITRATOR MAY NOT CONSOLIDATE MORE THAN ONE PERSON'S CLAIMS AND MAY NOT PRESIDE OVER ANY CLASS OR REPRESENTATIVE PROCEEDING.

**18.5 Severability.**

If any provision of these Terms is held unenforceable, that provision will be modified to the minimum extent necessary to make it enforceable, and the remaining provisions continue in full force and effect.

**18.6 Waiver.**

DingDawg's failure to enforce any provision of these Terms is not a waiver of DingDawg's right to enforce that provision in the future.

**18.7 Assignment.**

Customer may not assign or transfer these Terms or any rights hereunder without DingDawg's prior written consent. DingDawg may assign these Terms in connection with a merger, acquisition, or sale of substantially all of its assets upon notice to Customer. Any purported assignment in violation of this section is void.

**18.8 Force Majeure.**

DingDawg is not liable for any delay or failure to perform resulting from causes beyond its reasonable control, including natural disasters, acts of government, infrastructure failures, cyberattacks, or pandemic events. DingDawg will provide prompt notice of any Force Majeure event affecting the Service.

**18.9 Notices.**

Notices from DingDawg to Customer will be delivered to the email address on the account. Notices from Customer to DingDawg must be sent to legal@dingdawg.com. Notices are effective upon transmission for email and upon receipt for postal mail.

**18.10 Entire Agreement.**

These Terms, together with the Privacy Policy (dingdawg.com/legal/privacy), the DPA (dingdawg.com/legal/dpa), and any applicable Order Form, constitute the entire agreement between Customer and DingDawg regarding the Service and supersede all prior agreements, representations, and understandings. In the event of conflict, the order of precedence is: (1) Order Form, (2) DPA, (3) these Terms, (4) Privacy Policy.

**18.11 Changes to These Terms.**

DingDawg may update these Terms from time to time. For material changes, DingDawg will provide at least 30 days advance notice via email and by posting the updated Terms at dingdawg.com/legal/terms. Continued use of the Service after the effective date of a change constitutes acceptance of the updated Terms. If Customer objects to a material change, Customer may terminate its account before the effective date of the change in accordance with Section 17.1.

---

## Contact

| Purpose | Contact |
|---|---|
| General Support | support@dingdawg.com |
| Billing | billing@dingdawg.com |
| Legal / Compliance | legal@dingdawg.com |
| Enterprise Sales | enterprise@dingdawg.com |
| Security Incidents | security@dingdawg.com |
| Data Protection / DPA | privacy@dingdawg.com |

**DingDawg, Inc.**
dingdawg.com/legal/terms

---

*These Terms were last updated on March 28, 2026. Prior versions are available at dingdawg.com/legal/terms/history.*
