# Architecture

## Runtime Components

## API Layer (`src/api.zig`)

- Parses incoming requests
- Authorizes requests (optional bearer token)
- Validates workflow payloads on `POST /runs`
- Provides run/step/worker/event admin APIs

## Store Layer (`src/store.zig`)

- Persists workers, runs, steps, dependencies, events, artifacts
- Stores advanced execution state:
  - `cycle_state` (loop iterations)
  - `chat_messages` (group chat rounds)
  - `saga_state` (compensation tracking)

## Engine (`src/engine.zig`)

Background thread started by `main.zig`:

- Polls active runs
- Promotes eligible steps (`pending -> ready`)
- Executes `ready` steps by type
- Monitors long-running step families (`wait`, `loop`, `sub_workflow`, `debate`, `group_chat`, `saga`)
- Emits events and updates statuses

## Dispatch Layer (`src/dispatch.zig`)

- Selects worker by:
  - active status
  - available capacity (`current_tasks < max_concurrent`)
  - tag intersection with step `worker_tags`
- Builds protocol-specific request payloads
- Parses worker responses (`response`, `reply`, or OpenAI-style `choices[0].message.content`)

## Config + Startup

From `src/main.zig` and `src/config.zig`:

- Loads `config.json` (optional)
- Applies CLI overrides: `--host`, `--port`, `--db`, `--token`, `--config`
- Seeds workers from config (`source=config`)
- Starts HTTP server + engine thread

## Data Model (Migrations)

From `src/migrations/001_init.sql` + `002_advanced_steps.sql`:

- Core: `workers`, `runs`, `steps`, `step_deps`, `events`, `artifacts`
- Advanced: `cycle_state`, `chat_messages`, `saga_state`
