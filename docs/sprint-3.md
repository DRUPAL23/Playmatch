# Sprint 3 — Live Match + Venue Operations

## Delivered
- Venue and table CRUD APIs.
- Pool venue seed script for local development.
- Player check-in events.
- Match event persistence and Socket.IO room broadcasting.
- Live match room join/leave events.
- Player dispute creation; disputed matches are blocked from normal settlement by state.
- Mobile live lobby with API-backed open challenges and live-room messaging.

## API
- `GET /venues`
- `POST /venues`
- `GET /venues/:id/tables`
- `POST /venues/tables`
- `PATCH /venues/tables/:id`
- `POST /matches/:id/check-in`
- `POST /matches/:id/events`
- `POST /matches/:id/dispute`

## Realtime
Socket.IO namespace: `/matches`

Client events:
- `match:join` with a match ID
- `match:leave` with a match ID

Server events:
- `match:event`
- `match:disputed`

## Safety
The Sprint 3 live-event layer does not enable real-money wagering. `REAL_MONEY_ENABLED=false` remains the required local configuration. Production authentication, authorization, KYC, venue-operator roles, payment controls and licensing gates remain mandatory before real-money launch.
