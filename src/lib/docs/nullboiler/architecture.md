# Architecture

NullBoiler is composed of an HTTP API surface, persistent store, scheduler engine, and dispatch subsystem.

## Runtime Components

- `src/api.zig`: routing, auth checks, request validation, response shaping
- `src/store.zig`: SQLite persistence for workers/runs/steps/events/artifacts and advanced state
- `src/engine.zig`: scheduler loop and step lifecycle transitions
- `src/dispatch.zig`: worker selection + protocol-specific request/response handling
- `src/main.zig`: startup, config loading, worker seeding, server + engine lifecycle

## Request To Execution Flow

1. API validates incoming request (for example `POST /runs`).
2. Run and steps are persisted in SQLite.
3. Engine polls active runs and promotes eligible steps.
4. Dispatch selects worker by status, capacity, and tag overlap.
5. Worker result is parsed and persisted as step output/events.
6. Engine continues until terminal run status.

## Data Model

From `src/migrations/001_init.sql` + `002_advanced_steps.sql`:

- core: `workers`, `runs`, `steps`, `step_deps`, `events`, `artifacts`
- advanced: `cycle_state`, `chat_messages`, `saga_state`

## Engine-Heavy Step Families

`wait`, `loop`, `sub_workflow`, `debate`, `group_chat`, and `saga` require engine-specific progression logic beyond simple task dispatch.

## Operational Implication

When runs look stuck, inspect in this order:

1. `GET /runs/{id}`
2. `GET /runs/{id}/steps`
3. `GET /runs/{id}/events`
4. `GET /workers`
