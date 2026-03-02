# Architecture

NullClaw is built around a vtable-driven architecture where every major subsystem is defined by an interface. Implementations are registered in factories and selected at runtime via configuration. This means you can swap any provider, channel, tool, memory backend, or sandbox without changing code -- just update the config.

## Overview

The codebase is roughly 151 source files and 96,000 lines of Zig. It compiles to a single static binary with zero external dependencies (besides libc and an optional vendored SQLite). The design is zero-copy where possible, with explicit ownership semantics enforced by the Zig compiler.

Key design principles:

- **Vtable interfaces** for all extension points
- **Factory registration** to discover and instantiate implementations
- **Zero-copy** message passing with explicit ownership
- **No allocator overhead** -- arenas and fixed-buffer allocators where appropriate
- **No runtime reflection** -- all dispatch is compile-time or vtable-based

## Module Map

```
src/
  main.zig              CLI entry point, argument parsing, command dispatch
  root.zig              Public module hierarchy
  config.zig            JSON config loader (30+ sub-config structs)
  agent.zig             Agent loop, auto-compaction, tool dispatch
  gateway.zig           HTTP gateway (rate limiting, idempotency, pairing)
  daemon.zig            Daemon supervisor with exponential backoff
  bus.zig               Internal message bus
  channel_manager.zig   Channel lifecycle (register, start, stop, health)
  cron.zig              Cron scheduler with JSON persistence
  health.zig            Component health registry
  tunnel.zig            Tunnel vtable (Cloudflare, ngrok, Tailscale, custom)
  peripherals.zig       Hardware peripheral vtable (serial, Arduino, RPi, Nucleo)
  runtime.zig           Runtime vtable (native, Docker, WASM)
  skillforge.zig        Skill discovery, evaluation, integration

  channels/             19 channel implementations
  providers/            19 provider implementations
  tools/                36+ tool implementations
  memory/               Storage, retrieval, vector, lifecycle
  security/             Pairing, secrets, sandbox, audit, policy
```

## Core Modules

### agent.zig

The agent loop. Receives a message (from CLI or any channel), constructs a conversation context, sends it to the configured provider, processes tool calls in a loop until the model produces a final response, and returns the result. Handles auto-compaction of long conversations to stay within context limits.

### gateway.zig

The HTTP server that powers the runtime. Handles webhook ingress (Telegram, WhatsApp, LINE, Lark), the pairing handshake, rate limiting, and idempotency checks. Routes incoming messages to the appropriate channel handler based on the request path and payload.

### channel_manager.zig

Manages the lifecycle of all channels. Registers channel implementations from the factory, starts and stops them based on config, monitors health, and provides the `channel status` interface. Handles multi-account configurations where a single channel type (e.g., IRC) can have multiple named accounts.

### bus.zig

The internal message bus that decouples channels from the agent. Channels push inbound messages onto the bus, the agent loop consumes them, and responses are routed back through the bus to the originating channel. Session keys ensure responses reach the correct conversation.

### daemon.zig

The supervisor process for the gateway loop. Handles graceful shutdown, signal handling, and exponential backoff on crashes. Routes inbound messages from long-polling channels (Discord, QQ, OneBot, Mattermost, MaixCam) that maintain persistent connections rather than receiving webhooks.

## Vtable Contract

Every extension point follows the same pattern. An interface is defined as a struct of function pointers (a vtable), and implementations provide concrete functions that match those signatures.

Pseudocode example:

```zig
// The interface
const Provider = struct {
    ptr: *anyopaque,
    vtable: *const VTable,

    const VTable = struct {
        chat: *const fn (ptr: *anyopaque, messages: []Message) Error!Response,
        stream: *const fn (ptr: *anyopaque, messages: []Message, callback: StreamCallback) Error!void,
    };

    // Dispatch through the vtable
    pub fn chat(self: Provider, messages: []Message) Error!Response {
        return self.vtable.chat(self.ptr, messages);
    }
};

// An implementation
const AnthropicProvider = struct {
    api_key: []const u8,
    base_url: []const u8,

    pub fn init(config: ProviderConfig) AnthropicProvider { ... }

    pub fn chat(ptr: *anyopaque, messages: []Message) Error!Response {
        const self: *AnthropicProvider = @ptrCast(@alignCast(ptr));
        // Make API call to Anthropic
    }
};
```

Implementations are registered in factory files. At startup, NullClaw reads the config, looks up the requested implementation in the factory, and instantiates it. Swapping from Anthropic to OpenAI is a config change -- no recompilation needed.

## Extension Points

| Interface | Directory | How to Extend |
|-----------|-----------|---------------|
| `Provider` | `src/providers/` | Implement the Provider vtable, register in `factory.zig` |
| `Channel` | `src/channels/` | Implement the Channel vtable, register in channel factory |
| `Tool` | `src/tools/` | Implement the Tool vtable with `execute()`, register in tool factory |
| `Memory` | `src/memory/` | Implement the Memory vtable (store, recall, search), register in engine registry |
| `Observer` | `src/observer.zig` | Implement the Observer vtable for custom telemetry |
| `RuntimeAdapter` | `src/runtime.zig` | Implement for new execution environments (native, Docker, WASM) |
| `Peripheral` | `src/peripherals.zig` | Implement for hardware interfaces (serial, I2C, SPI, GPIO) |
| `Tunnel` | `src/tunnel.zig` | Implement for new tunnel providers (Cloudflare, ngrok, etc.) |

## Data Flow

A message flows through the system in this order:

```
Channel (Telegram, Discord, CLI, ...)
    |
    v
Channel Manager (parse, filter, extract session key)
    |
    v
Message Bus (route to agent by session)
    |
    v
Agent Loop
    |--- construct conversation context
    |--- send to Provider (Anthropic, OpenAI, Ollama, ...)
    |--- receive response
    |
    |--- if tool calls:
    |       |--- dispatch to Tool (shell, file_read, web_search, ...)
    |       |--- collect results
    |       |--- send back to Provider with tool results
    |       |--- repeat until final response
    |
    v
Response routed back through Bus
    |
    v
Channel Manager (format for target channel)
    |
    v
Channel (send reply to user)
```

### Session Keys

Each conversation is identified by a session key derived from the channel and user. For Telegram, this is the chat ID. For Discord, it is the channel ID plus user ID. Session keys ensure that multi-turn conversations maintain context and responses reach the correct recipient.

### Tool Dispatch

When the provider responds with tool calls, the agent loop looks up each tool by name in the tool registry, executes it within the configured security scope (sandbox, workspace restrictions, allowlists), collects the results, and sends them back to the provider. This loop continues until the provider produces a final text response.

### Heartbeat

The heartbeat engine runs on a configurable interval (default: 30 minutes) and executes tasks defined in `HEARTBEAT.md`. This enables periodic autonomous behavior -- checking news, running maintenance, sending updates -- without external triggers.

## Build Architecture

NullClaw uses Zig's build system with conditional compilation:

- `-Dchannels=telegram,discord` compiles only the selected channels, reducing binary size
- `-Dsqlite=true` includes the vendored SQLite for the memory backend
- `-Dtarget=aarch64-linux-gnu` cross-compiles for any supported target
- `-Doptimize=ReleaseSmall` produces the smallest binary (678 KB)

The binary is fully static and self-contained. No shared libraries, no runtime dependencies beyond libc. Drop it on any machine with a compatible architecture and it runs.

## Further Reading

- [Configuration](/nullclaw/docs/configuration) -- how to configure all subsystems
- [Providers](/nullclaw/docs/providers) -- AI model provider details
- [Channels](/nullclaw/docs/channels) -- channel implementations
- [Tools](/nullclaw/docs/tools) -- built-in tool catalog
- [Memory](/nullclaw/docs/memory) -- memory system internals
- [Security](/nullclaw/docs/security) -- security layers
