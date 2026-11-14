# Payomatix Merchant Operations Desk

A responsive front-end prototype for a payments support team. It is designed around the three WA4 support scenarios:
1. UPI debit but merchant order failed — trace with UTR/RRN and check status/callback.
2. Card refund not visible — verify refund state and share ARN for issuer tracing.
3. Settlement amount mismatch — reconcile gross sales, refunds, disputes, fees, taxes and adjustments.

## Run locally
- Extract the ZIP.
- Open `index.html` in Chrome, Edge or Firefox.
- No build tools or installation are required.

## Included modules
- Overview dashboard with sample payment health and priority queue
- Searchable transaction register with status and method filters
- Support ticket creation, filtering and resolve/reopen actions
- Settlement breakdown and editable net payout calculator
- CSV export for transactions and settlement breakdown
- Help centre with reference IDs, support workflow and official RBI/NPCI links
- Responsive layout for desktop and mobile

## Important prototype limitations
- This is a front-end demo using fictional sample records.
- It does not connect to Payomatix, a payment gateway, bank, UPI, card network, webhook, CRM or live settlement system.
- Ticket and status changes are held in browser memory and reset on refresh.
- A production deployment needs secure authentication, role-based access, a backend API, database, audit logs, encryption, monitoring, PCI-DSS scope assessment where relevant, and approved payment-provider integrations.
- Do not use the sample UTR/ARN or settlement values to trace a real transaction.

## Regulatory note
The RBI failed-transaction TAT framework has different timelines for different failure categories. For example, specified UPI fund-transfer failures where the beneficiary is not credited have an auto-reversal TAT of T+1; certain merchant-payment confirmation failures have T+5. Check the current RBI circular and applicable updates before using timelines in live customer communication. A merchant-initiated card refund is not the same as a failed-transaction auto-reversal; issuer posting times can vary.

## Suggested production architecture
Frontend: React + TypeScript
Backend: Node.js / Express or Java Spring Boot
Database: PostgreSQL
Integrations: payment processor/acquirer APIs and verified webhook events
Security: SSO/MFA, RBAC, secrets vault, encryption in transit/at rest, immutable audit trail
Operations: structured logs, alerting, idempotency, retry queues and reconciliation jobs
