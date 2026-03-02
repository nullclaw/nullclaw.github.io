# Getting Started

NullClaw is a fully autonomous AI assistant infrastructure written in Zig. It compiles to a 678 KB static binary that boots in under 2 ms, uses roughly 1 MB of RAM, and runs on anything from a $5 ARM board to a full server. Zero external dependencies beyond libc and an optional vendored SQLite.

## Requirements

- **Zig 0.15.2** (exact version required -- 0.16.0-dev and other versions are unsupported)
- A supported AI provider API key (OpenRouter, Anthropic, OpenAI, Ollama, etc.)
- libc (present on all standard Linux/macOS systems)

Verify your Zig version before building:

```bash
zig version
# Must print: 0.15.2
```

## Installation

Clone the repository and build:

```bash
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall
```

The binary is at `zig-out/bin/nullclaw`. You can copy it anywhere in your `$PATH`:

```bash
cp zig-out/bin/nullclaw ~/.local/bin/
```

If you skip the global install, prefix all commands with `zig-out/bin/`:

```bash
zig-out/bin/nullclaw status
```

### Build Options

| Flag | Description |
|------|-------------|
| `-Doptimize=ReleaseSmall` | Smallest binary (678 KB) |
| `-Doptimize=ReleaseFast` | Fastest execution |
| `-Doptimize=ReleaseSafe` | Safe release with runtime checks |
| `-Dsqlite=true` | Include vendored SQLite for memory backend |
| `-Dchannels=telegram,discord` | Compile only selected channels |
| `-Dtarget=aarch64-linux-gnu` | Cross-compile for a specific target |

## Quick Start

### Option 1: Quick Setup

Pass your API key and provider directly:

```bash
nullclaw onboard --api-key sk-or-... --provider openrouter
```

This creates `~/.nullclaw/config.json` with sensible defaults, sets up the provider, and encrypts your API key.

### Option 2: Interactive Wizard

The interactive onboarding walks through every configuration section:

```bash
nullclaw onboard --interactive
```

The wizard covers provider selection, channel setup (Telegram, Discord, Signal, Nostr, IRC, etc.), memory backend, security settings, and more.

### Option 3: Channels Only

If you already have a working config and just want to add or reconfigure channels:

```bash
nullclaw onboard --channels-only
```

## First Message

Send a single message and get a response:

```bash
nullclaw agent -m "What can you do?"
```

## Interactive Chat

Start an interactive session:

```bash
nullclaw agent
```

Type messages at the prompt. The agent has access to all configured tools (file operations, shell, web search, memory, etc.) and will use them as needed.

## Start the Gateway

The gateway is the long-running runtime that powers channels, scheduled tasks, and the HTTP API:

```bash
nullclaw gateway
```

By default it binds to `127.0.0.1:3000`. Customize with flags:

```bash
nullclaw gateway --port 8080 --host 127.0.0.1
```

The gateway starts all configured channels (Telegram, Discord, etc.), the heartbeat engine, the cron scheduler, and exposes the webhook API.

## Install as a Service

For persistent operation, install NullClaw as a system service:

```bash
nullclaw service install
nullclaw service start
nullclaw service status
```

## Verify Installation

### System Diagnostics

Run the doctor command to check that everything is configured correctly:

```bash
nullclaw doctor
```

This checks Zig version compatibility, config file validity, provider connectivity, sandbox availability, and channel health.

### System Status

View the current state of all components:

```bash
nullclaw status
```

### Channel Health

Check which channels are running and their connection state:

```bash
nullclaw channel status
```

## Project Stats

```
Binary:       678 KB (ReleaseSmall)
Peak RSS:     ~1 MB
Startup:      <2 ms (Apple Silicon)
Source files: ~151
Lines of code: ~96,000
Tests:        3,371
Dependencies: 0 (besides libc + optional SQLite)
```

## Next Steps

- [Architecture](/nullclaw/docs/architecture) -- understand how NullClaw is structured
- [Configuration](/nullclaw/docs/configuration) -- full config reference
- [Providers](/nullclaw/docs/providers) -- connect AI models
- [Channels](/nullclaw/docs/channels) -- set up Telegram, Discord, Signal, and more
- [Tools](/nullclaw/docs/tools) -- built-in tool catalog
- [Memory](/nullclaw/docs/memory) -- hybrid search and storage
- [Security](/nullclaw/docs/security) -- pairing, encryption, sandboxing
- [CLI Reference](/nullclaw/docs/cli) -- all commands and options
