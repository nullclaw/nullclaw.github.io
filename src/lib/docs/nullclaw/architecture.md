# Architecture

NullClaw is structured as modular runtime components connected through typed interfaces and registries.

## Core Runtime Entry Points

- `src/main.zig`: CLI command routing and command handlers
- `src/daemon.zig`: long-running gateway orchestration loop
- `src/gateway.zig`: HTTP/WebSocket ingress and API endpoints
- `src/agent/root.zig`: agent loop and tool-calling logic

## Primary Module Domains

- `src/providers/*`: model providers and provider factory/runtime bundle
- `src/channels/*`: channel integrations and dispatch logic
- `src/tools/*`: tool interfaces and implementations
- `src/memory/*`: memory engines, retrieval, lifecycle, vector layers
- `src/security/*`: policy, pairing, sandbox backends, audit
- `src/channel_catalog.zig`: source-of-truth channel registry
- `src/capabilities.zig`: runtime capability manifest generation

## Request Flow

1. Inbound message enters via channel or gateway endpoint.
2. Channel/gateway resolves routing/session context.
3. Agent loop builds prompt + state and selects provider path.
4. Provider response may trigger tool calls.
5. Tool dispatcher executes allowed tools under policy constraints.
6. Tool results feed back into agent loop until final response.
7. Outbound response is published back through channel/gateway.

## Provider Layer

Provider selection is handled in `src/providers/factory.zig` and `src/providers/runtime_bundle.zig`:

- Core implementations: `anthropic`, `openai`, `openrouter`, `ollama`, `gemini`, `claude-cli`, `codex-cli`, `openai-codex`
- Compatible alias table: large set of endpoint aliases mapped to OpenAI-compatible transport
- Reliability wrapper: fallback/retry orchestration from config

## Channel Layer

Channel metadata is centralized in `src/channel_catalog.zig`:

- 20 channel entries (CLI + messaging/web integrations)
- Build-enabled flags controlled by `build_options`
- Runtime/configured status calculation and lifecycle mode hints

## Tool Layer

`src/tools/root.zig` provides:

- Common tool interface (`Tool` + `ToolVTable`)
- Core tool assembly (`allTools`, `defaultTools`, `subagentTools`)
- Memory tool binding to runtime memory engines

Tool availability depends on both build and config (see `src/capabilities.zig`).

## Memory Layer

`src/memory/engines/registry.zig` defines backend descriptors and capabilities.

Known backend names:

- `none`, `markdown`, `memory`, `api`, `sqlite`, `lucid`, `redis`, `lancedb`, `postgres`

Runtime search/retrieval pipeline and lifecycle management live under:

- `src/memory/retrieval/*`
- `src/memory/lifecycle/*`
- `src/memory/vector/*`

## Security Layer

`src/security/*` contains:

- Pairing and token checks
- Command/path policy evaluation
- Sandbox backends (`landlock`, `firejail`, `bubblewrap`, `docker`, auto-detect)
- Audit/tracking modules

## Capability Introspection

`nullclaw capabilities` and `nullclaw capabilities --json` expose:

- channel availability and configuration state
- memory engine availability
- estimated/loaded tool sets

Use this output when validating deployment reality vs configuration intent.
