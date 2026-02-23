---
title: Getting Started
description: Quick start guide for building and running nullclaw
---

# Getting Started

## Prerequisites

- **Zig 0.15** — install via [ziglang.org](https://ziglang.org/download/) or your package manager
- **SQLite** (optional) — for persistent memory. On macOS: `brew install sqlite`
- **Git** — to clone the repository

## Build from Source

```bash
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw

# Debug build
zig build

# Release build (smallest binary)
zig build -Doptimize=ReleaseSmall

# Run tests
zig build test --summary all
```

The binary will be at `./zig-out/bin/nullclaw`.

## First-Time Setup

Run the interactive onboarding wizard:

```bash
./zig-out/bin/nullclaw onboard
```

The wizard walks you through 8 steps:

1. **Provider** — choose from 50+ providers (OpenRouter is the default)
2. **API key** — enter directly or reference an environment variable
3. **Model** — select from available models (fetched live from the provider)
4. **Memory** — sqlite (recommended), markdown, lucid, or none
5. **Tunnel** — none, cloudflare, ngrok, or tailscale
6. **Autonomy** — supervised (default), read_only, or full
7. **Channels** — configure now or skip (CLI is always available)
8. **Workspace** — directory for agent file operations (default: `~/.nullclaw/workspace/`)

This creates `~/.nullclaw/config.json` and scaffolds the workspace.

For non-interactive setup:

```bash
./zig-out/bin/nullclaw onboard --api-key sk-or-... --provider openrouter
```

## First Conversation

### CLI Mode (Interactive)

```bash
./zig-out/bin/nullclaw agent
```

Type messages and press Enter. The agent responds, can use tools, and remembers context. Exit with `exit`, `quit`, or `:q`.

### Single Message

```bash
./zig-out/bin/nullclaw agent -m "What files are in the current directory?"
```

### Named Session

```bash
./zig-out/bin/nullclaw agent -s myproject -m "Summarize the README"
```

## Connect a Channel

### Telegram (Quick Example)

1. Message [@BotFather](https://t.me/BotFather) on Telegram, create a bot, copy the token
2. Add to your config (`~/.nullclaw/config.json`):

```json
{
  "channels": {
    "telegram": {
      "bot_token": "123456:ABC-DEF...",
      "allow_from": ["your_telegram_user_id"]
    }
  }
}
```

3. Start the channel:

```bash
./zig-out/bin/nullclaw channel start telegram
```

See the [Channels guide](channels.md) for all 17 supported platforms.

## Add a Provider API Key

Edit `~/.nullclaw/config.json`:

```json
{
  "default_provider": "anthropic",
  "models": {
    "providers": {
      "anthropic": { "api_key": "sk-ant-..." }
    }
  }
}
```

Or use environment variables:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export NULLCLAW_PROVIDER=anthropic
```

See the [Providers guide](providers.md) for all 50+ providers and setup details.

## Run as a Daemon

The daemon starts the gateway server, all configured channels, heartbeat, and scheduler:

```bash
./zig-out/bin/nullclaw daemon --port 3000
```

## Install as a System Service

```bash
# Install and start (launchd on macOS, systemd on Linux)
./zig-out/bin/nullclaw service install
./zig-out/bin/nullclaw service start

# Check status
./zig-out/bin/nullclaw service status
```

## Run Diagnostics

```bash
./zig-out/bin/nullclaw doctor
```

Checks provider connectivity, tool availability, memory backend, and channel health.

## Next Steps

- [Configuration Reference](configuration.md) — all config options
- [Providers](providers.md) — 50+ AI providers, fallback, model routing
- [Channels](channels.md) — 17 messaging platforms
- [Tools](tools.md) — 30+ built-in tools
- [CLI Reference](cli.md) — all commands and options
- [Architecture](architecture.md) — vtable design, subsystem map
- [Security](security/overview.md) — sandboxing, audit, encryption
