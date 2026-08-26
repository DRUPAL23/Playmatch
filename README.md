# PlayMatch

Mobile-first peer-to-peer live competitive gaming platform.

## MVP scope
- Player accounts and profiles
- Pool venues and tables
- Challenge/match lifecycle
- Demo-credit escrow and double-entry ledger
- Result verification and disputes
- Responsible-gaming and compliance feature gates
- PWA-ready frontend architecture
- API boundary for KYC and M-Pesa

> Real-money wagering is disabled by default. Enable only after applicable licensing, authorization, payment, KYC/AML and responsible-gaming requirements are satisfied.

## Monorepo
- `apps/web` — Next.js PWA
- `apps/api` — NestJS API
- `packages/domain` — shared domain types/state machine
- `packages/config` — shared configuration
- `infra` — Docker and deployment scaffolding
- `docs` — architecture and product documentation

## Development
Node.js 22+ and pnpm 10+ are recommended.

```bash
pnpm install
pnpm dev
```

See `docs/architecture.md` for the initial architecture and security boundaries.