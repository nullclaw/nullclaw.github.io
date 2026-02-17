# nullclaw Architecture

## Design Philosophy

nullclaw follows a **vtable interface** pattern for every major subsystem. Each core abstraction is a struct with a pointer to an opaque implementation and a vtable of function pointers. This gives runtime polymorphism without dynamic dispatch overhead or allocator pressure from trait objects.

## Core Pattern

```zig
pub const Interface = struct {
    ptr: *anyopaque,
    vtable: *const VTable,

    pub const VTable = struct {
        method: *const fn (ptr: *anyopaque, ...) anyerror!ReturnType,
    };

    pub fn method(self: Interface, ...) !ReturnType {
        return self.vtable.method(self.ptr, ...);
    }
};
```

Callers interact with the interface; implementations provide the vtable. Swap any implementation via config — zero code changes.

**Important:** callers must **own** the struct backing the vtable (local variable or heap-allocated). Never return a vtable interface pointing to a temporary.

## Subsystem Map

| Subsystem | Interface | Implementations | Location |
|-----------|-----------|-----------------|----------|
| **AI Models** | `Provider` | Anthropic, OpenAI, OpenRouter, Ollama, Gemini, Compatible, Reliable, Router | `src/providers/` |
| **Channels** | `Channel` | CLI, Telegram, Discord, Slack, WhatsApp, Matrix, IRC, iMessage, Email, Lark, DingTalk | `src/channels/` |
| **Memory** | `Memory` | SQLite (FTS5 + vector), Markdown, None | `src/memory/` |
| **Tools** | `Tool` | Shell, FileRead, FileWrite, FileEdit, HTTP, Git, Memory*, Browser*, Image, Schedule, Delegate, HardwareInfo | `src/tools/` |
| **Sandbox** | `Sandbox` | Landlock, Firejail, Bubblewrap, Docker, auto-detect | `src/security/` |
| **Runtime** | `RuntimeAdapter` | Native, Docker, WASM | `src/runtime.zig` |
| **Tunnel** | `Tunnel` | None, Cloudflare, Tailscale, ngrok, Custom | `src/tunnel.zig` |
| **Observer** | `Observer` | Noop, Log, File, Multi | `src/observability.zig` |
| **Peripheral** | `Peripheral` | Serial, Arduino, RPi GPIO, STM32/Nucleo | `src/peripherals.zig` |

## Module Layout

```
src/
  main.zig              CLI entry point + argument parsing
  root.zig              Module hierarchy (public API)
  config.zig            JSON config loader + 30 sub-config structs
  agent/                Agent loop, tool dispatch, prompt construction
  channels/             11 channel implementations
  providers/            22+ AI provider implementations
  memory/               SQLite backend, embeddings, vector search, hygiene, snapshots
  tools/                17 tool implementations
  security/             Policy, audit, secrets, sandbox backends
  daemon.zig            Daemon supervisor with exponential backoff
  gateway.zig           HTTP gateway (rate limiting, pairing, webhooks)
  cron.zig              Cron scheduler with JSON persistence
  tunnel.zig            Tunnel vtable
  runtime.zig           Runtime vtable
  peripherals.zig       Hardware peripheral vtable
  skillforge.zig        Skill discovery and evaluation
  observability.zig     Logging, metrics, events
  health.zig            Component health registry
  onboard.zig           Interactive setup wizard
```

## Allocation Patterns

- **Owned allocations:** strings, arrays, structs are heap-allocated and freed by caller
- **Stack-based vtables:** implementations often stack-allocated, then converted to interface
- **Deinit pattern:** every heap-allocated type has a `deinit()` method
- **Arena-like cleanup:** large operations allocate, collect results, return slices

## Error Handling

- **Error sets:** `anyerror!ReturnType` for flexible error propagation
- **Result types:** `ToolResult` with `.success`, `.output`, `.error_msg` fields
- **Try/catch:** `!` operator forces callers to handle errors

## Configuration Flow

1. Load JSON from `~/.nullclaw/config.json` into `Config` struct
2. Dispatch to sub-config structs (`TelegramConfig`, `ProviderConfig`, etc.)
3. Validate and populate agent, channels, providers from config
4. Initialize vtable interfaces with loaded config

## Agent Loop

1. Build system prompt (identity, tool descriptions, context)
2. Receive message from channel
3. Send to provider (LLM)
4. Parse tool calls from response
5. Execute tools, collect results
6. Append results to history, loop back to step 3
7. When no more tool calls, return final response to channel

History auto-compacts at 50 messages. Tool call iteration limit: 10 per turn.

## Memory System

```
User query
    ↓
┌─────────────┐    ┌──────────────┐
│ FTS5 Search │    │ Vector Search│
│ (BM25)      │    │ (cosine sim) │
└──────┬──────┘    └──────┬───────┘
       └──────┬───────────┘
              ↓
       Hybrid Merge
    (weighted combine)
              ↓
       Ranked Results
```

- **Keyword search:** SQLite FTS5 with BM25 scoring
- **Vector search:** embeddings stored as BLOB, cosine similarity
- **Hybrid merge:** configurable `vector_weight` / `keyword_weight`
- **Hygiene:** automatic archival + purge of stale memories
- **Snapshots:** export/import full memory state

## Build

```bash
zig build                          # Debug
zig build -Doptimize=ReleaseSmall  # Release (639 KB)
zig build test --summary all       # 1,639 tests
```

Dependencies: zero Zig packages. Only libc + optional SQLite (via Homebrew on macOS).
