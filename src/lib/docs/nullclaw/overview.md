# NullClaw Overview

NullClaw is a Zig runtime for autonomous AI agents with configurable providers, channels, tools, memory, and security policy.

## Source Snapshot

- **CLI commands:** 19 top-level commands in `src/main.zig`
- **Channels:** 20 entries in `src/channel_catalog.zig`
- **Provider aliases:** 89 OpenAI-compatible aliases in `src/providers/factory.zig`
- **Tool specs:** 33 unique `tool_name` values in `src/tools/*.zig`
- **Memory backends:** 9 known backends in `src/memory/engines/registry.zig`

## Start Here

1. [Quick Start](/nullclaw/docs/getting-started)
2. [Architecture](/nullclaw/docs/architecture)
3. [Configuration](/nullclaw/docs/configuration)
4. [Channels](/nullclaw/docs/channels)
5. [CLI](/nullclaw/docs/cli)

## Scope

- Runtime modes: `agent`, `gateway`, `service`
- Channel matrix and capability-gated builds
- Provider abstraction + compatibility aliases
- Tool execution with policy constraints
- Memory engines and retrieval pipeline
- Pairing, sandbox, and audit/security controls
