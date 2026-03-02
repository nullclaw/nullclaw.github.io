# Architecture

NullClaw is a modular runtime where channel/gateway input is routed into an agent loop, then through providers and tools, and finally back to output channels.

## Mental Model

- ingress: channels + gateway
- execution: agent loop + provider client
- side effects: tools + memory
- control: policy + sandbox + pairing

## Core Entry Points

- `src/main.zig`: CLI routing and command handlers
- `src/daemon.zig`: long-running gateway orchestration
- `src/gateway.zig`: HTTP/WebSocket ingress
- `src/agent/root.zig`: agent loop and tool-calling behavior

## Runtime Domains

- `src/providers/*`: model providers and compatibility factory
- `src/channels/*`: channel integrations and dispatch
- `src/tools/*`: tool interface + implementations
- `src/memory/*`: engines, retrieval, lifecycle, vector helpers
- `src/security/*`: policy, pairing, sandbox, audit
- `src/channel_catalog.zig`: source-of-truth channel registry
- `src/capabilities.zig`: effective runtime capability view

## Request Flow

1. Message enters via channel or gateway endpoint.
2. Session/routing context is resolved.
3. Agent loop composes context and calls provider.
4. Tool calls execute under policy/sandbox constraints.
5. Tool results are fed back into loop.
6. Final response is emitted back to channel/gateway.

## Why Capabilities Matter

Config alone is not enough: build flags can remove channels/tools/memory backends.

Use:

```bash
nullclaw capabilities
nullclaw capabilities --json
```

to inspect actual runtime reality.

## Extension Points

- new provider: add provider module + factory registration
- new channel: implement channel interface + catalog entry
- new tool: add tool module + tool assembly wiring
- new memory backend: add engine descriptor + runtime wiring
