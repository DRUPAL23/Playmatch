# Sprint 2 — Match Engine

## Sandbox workflow

`DEMO_MODE=true` and `REAL_MONEY_ENABLED=false` are required for the local demo.

1. `POST /demo/bootstrap`
2. `GET /demo/wallet/demo-alice`
3. `POST /matches` with `{ "challengerId": "demo-alice", "stakeMinor": 500 }`
4. `GET /matches/open`
5. `POST /matches/:id/accept` with `{ "opponentId": "demo-bob" }`
6. `POST /matches/:id/start`
7. `POST /matches/:id/result` with `{ "winnerId": "demo-alice" }`
8. `GET /demo/wallet/demo-alice`

`stakeMinor` is integer minor units. For the sandbox this is treated as demo KES units.

## State machine

OPEN → ACCEPTED/READY → LIVE → RESULT_CONFIRMED → SETTLED

Invalid transitions are rejected server-side. Wallet locking and settlement execute inside Prisma transactions.

## Safety boundary

The API rejects match creation when `REAL_MONEY_ENABLED=true` is not backed by an approved production implementation. No live payment provider or withdrawal path is enabled by Sprint 2.

## Realtime

The `/matches` Socket.IO namespace is reserved for match-room events. Sprint 3 will add authenticated room joins and server-emitted state events.
