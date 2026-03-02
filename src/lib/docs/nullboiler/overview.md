# Overview

## What NullBoiler Is

`nullboiler` is a workflow orchestrator. It executes workflow runs composed of dependent steps and routes executable work to registered workers.

Core concerns in code:

- `src/api.zig`: run/step/worker HTTP surface
- `src/engine.zig`: scheduler + step execution state machine
- `src/dispatch.zig`: protocol-aware worker dispatch
- `src/store.zig`: SQLite persistence for runs, steps, events, workers, advanced state

## What It Owns

- Run lifecycle (`running`, `failed`, `completed`, `cancelled`)
- Step lifecycle (`pending`, `ready`, `running`, `waiting_approval`, ...)
- Step dependency graph execution (`depends_on`)
- Worker selection by tag overlap, status, and capacity
- Advanced orchestration constructs (`loop`, `wait`, `router`, `saga`, `group_chat`, ...)

## What It Does Not Own

- Long-lived product task pipelines/stages across teams (that is `nulltickets`)
- LLM/tool runtime internals (that is `nullclaw` workers)

## Where It Fits In Ecosystem

- `nullclaw`: executes assistant behavior as workers.
- `nullboiler`: orchestrates workflow topology and execution order.
- `nulltickets`: tracks pipeline state, leases, gates, and artifacts as task control plane.

## Typical Use Cases

- Multi-step delivery flows (`research -> implement -> review`)
- Human-in-the-loop approvals for sensitive steps
- Fan-out/fan-in content or code processing pipelines
- Workflows that need retries, timeouts, and event-level auditability
