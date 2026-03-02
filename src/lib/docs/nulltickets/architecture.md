# Architecture

## Runtime Layout

From `src/main.zig`:

- Simple HTTP server bound to `127.0.0.1:<port>`
- SQLite-backed store initialization
- Request routing through `api.handleRequest`

CLI flags:

- `--port` (default `7700`)
- `--db` (default `nulltickets.db`)
- `--version`

## API Layer (`src/api.zig`)

Responsible for:

- path/method routing
- header extraction (`Authorization`, `Idempotency-Key`)
- payload parsing
- response shaping and error mapping

Groups:

- health/openapi
- pipeline APIs
- task APIs (including dependencies + assignments)
- lease + run mutation APIs
- artifacts + ops
- OTLP ingest endpoints

## Domain Validation (`src/domain.zig`)

Pipeline definition checks:

- initial state exists and is known
- transitions reference known states
- at least one terminal state
- each non-terminal state has outgoing transition

## Store Layer (`src/store.zig`)

Implements:

- transactional task creation + relations
- claim selection by role, priority, dependencies, assignments, eligibility
- lease issue/heartbeat/token validation
- transition/fail behavior with retry/dead-letter logic
- gate persistence + checks
- paginated list APIs with cursor contract

## Data Model (`src/migrations/001_init.sql`)

Main tables:

- `pipelines`, `tasks`, `runs`, `leases`, `events`, `artifacts`
- `task_dependencies`, `gate_results`, `task_assignments`
- `idempotency_keys`
- `otlp_batches`, `otlp_spans`
