# Overview

NullBoiler is the orchestration layer: it runs workflow graphs (`runs` + `steps`) and dispatches executable work to registered workers.

## Start In 5 Minutes

1. Run [Quick Start](/nullboiler/docs/quick-start).
2. Register one worker.
3. Create one run and inspect events.

## Choose NullBoiler When

- work must be split into dependent or parallel steps
- you need retries, approvals, waits, signals, or advanced orchestration types
- you need worker routing by tags/protocol/capacity

## Do Not Use NullBoiler Alone When

- you need long-lived pipeline stages, leases, and gate history (use `nulltickets`)
- you need direct provider/tool runtime behavior without workflow graph overhead (use `nullclaw`)

## What It Owns

- run lifecycle (`running`, `failed`, `completed`, `cancelled`)
- step lifecycle and dependency scheduling
- worker registry and protocol-aware dispatch
- event stream and orchestration state persistence

## Ecosystem Boundary

- `nullclaw`: executes assistant/tool behavior
- `nullboiler`: decides step order and dispatches workers
- `nulltickets`: governs task lifecycle and queue/lease semantics

## Read Next

1. [Quick Start](/nullboiler/docs/quick-start)
2. [Step Types](/nullboiler/docs/step-types)
3. [Worker Protocols](/nullboiler/docs/worker-protocols)
4. [API](/nullboiler/docs/api)
5. [Operations](/nullboiler/docs/operations)
