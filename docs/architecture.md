# PlayMatch MVP Architecture

## Product boundary
PlayMatch matches players for live competitive games and coordinates venue, match, escrow and result workflows. It is not a bank and must not custody or settle real-money wagers until the applicable regulatory and payment requirements are satisfied.

## Core services
1. Identity/KYC — account, age/identity verification and device sessions.
2. Venue — venues, tables, operators and availability.
3. Match — challenge, acceptance, game state and result workflow.
4. Ledger — immutable double-entry accounting using integer minor units.
5. Escrow — locks demo credits in MVP; real-money capability is feature-gated.
6. Settlement — idempotent winner/fee/refund postings.
7. Risk — velocity, collusion and suspicious activity events.
8. Responsible gaming — limits, cooling-off and self-exclusion.
9. Payments — provider adapter boundary for approved rails such as M-Pesa.

## Security rules
- Server is authoritative for match state and settlement.
- Client never declares a winner or changes balances.
- Every financial mutation is idempotent.
- Ledger postings are append-only; corrections use compensating entries.
- Store money as integer minor units, never floating point.
- Real-money operations require `REAL_MONEY_ENABLED=true` plus compliance checks.
- Withdrawals require KYC eligibility, risk checks and a successful settlement state.

## Initial match lifecycle
`OPEN -> CHALLENGED -> ACCEPTED -> STAKE_PENDING -> ESCROWED -> READY -> LIVE -> RESULT_PENDING -> RESULT_CONFIRMED -> SETTLED`

Alternative terminal paths include cancellation, dispute, suspension and refund.

## Mobile architecture
The web client is a PWA with responsive CSS, touch-friendly controls, offline-safe read views, Web Push notifications and a low-bandwidth live state channel. Video is optional and separate from the authoritative match engine.

## Production deployment
Docker containers run behind TLS termination and an API gateway. PostgreSQL is the system of record; Redis is used for ephemeral state, queues and realtime fanout. Observability includes structured audit logs, metrics, traces and error reporting.