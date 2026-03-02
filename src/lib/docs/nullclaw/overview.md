# NullClaw Overview

NullClaw is the runtime layer of the ecosystem: it executes prompts, tools, memory operations, and channel I/O.

## Start In 5 Minutes

1. Follow [Quick Start](/nullclaw/docs/getting-started).
2. Run one successful command with `nullclaw agent -m "hello"`.
3. Then add channels, tools, and memory incrementally.

## Choose NullClaw When

- you need a fast local/hosted agent runtime
- you want provider + tool + memory execution in one process
- you need channel/gateway delivery without full task orchestration

## Do Not Use NullClaw Alone When

- you need multi-step DAG orchestration across workers (use `nullboiler`)
- you need long-lived pipeline stages, lease claiming, gates, and queue ops (use `nulltickets`)

## Code-Derived Snapshot

- **CLI commands:** 19 top-level commands in `src/main.zig`
- **Channels:** 20 entries in `src/channel_catalog.zig`
- **Provider aliases:** 89 OpenAI-compatible aliases in `src/providers/factory.zig`
- **Tool specs:** 33 unique `tool_name` values in `src/tools/*.zig`
- **Memory backends:** 9 known backends in `src/memory/engines/registry.zig`

## Product Boundary

- `nullclaw`: runtime execution (providers, tools, memory, channels)
- `nullboiler`: orchestration graph (runs, steps, workers, retries, approvals)
- `nulltickets`: task control plane (pipelines, leases, transitions, gates)

## Read Next

1. [Quick Start](/nullclaw/docs/getting-started)
2. [Configuration](/nullclaw/docs/configuration)
3. [Channels](/nullclaw/docs/channels)
4. [Tools](/nullclaw/docs/tools)
5. [CLI](/nullclaw/docs/cli)
