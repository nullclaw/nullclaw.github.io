# Architecture

NullTickets is a focused HTTP + SQLite control plane with strict domain validation and lease-aware mutation paths.

## Runtime Layout

From `src/main.zig`:

- bind address is fixed to `127.0.0.1`
- `--port` and `--db` CLI options
- API routing via `api.handleRequest`

## Component Responsibilities

- `src/api.zig`: routing, headers, auth checks, response/error shaping
- `src/domain.zig`: pipeline definition validation rules
- `src/store.zig`: transactional persistence and selection logic

## Claim/Lease Model

1. agent calls `POST /leases/claim` with role context
2. server returns active task/run and lease token
3. lease-protected mutations require `Authorization: Bearer <lease_token>`
4. agent heartbeats lease for long-running work

## Data Model

From `src/migrations/001_init.sql`:

- pipelines/tasks/runs/leases/events/artifacts core
- dependencies, assignments, gate results
- idempotency keys
- OTLP batch/span storage

## Operational Implication

If automation stalls, inspect in this order:

1. `GET /ops/queue`
2. `GET /tasks?stage=...`
3. lease expiry/heartbeat behavior
4. gate requirements on target transitions
