---
title: Configuration Reference
description: Complete configuration reference for nullclaw
---

# Configuration Reference

nullclaw is configured through a single JSON file and optional environment variable overrides. This page documents every configuration section, field, type, and default value.

## Config File

- **Location:** `~/.nullclaw/config.json`
- **Max size:** 64 KB
- **Created by:** `nullclaw onboard` (interactive 8-step wizard) or manually

The config file is standard JSON. All sections are optional — nullclaw ships with sensible defaults for everything.

## Environment Variable Overrides

Environment variables take precedence over values in `config.json`. Useful for CI, containers, and per-session tweaks.

| Variable | Overrides | Notes |
|---|---|---|
| `NULLCLAW_PROVIDER` | `default_provider` | |
| `NULLCLAW_MODEL` | `default_model` | |
| `NULLCLAW_TEMPERATURE` | `default_temperature` | Must be 0.0-2.0 |
| `NULLCLAW_GATEWAY_PORT` | `gateway.port` | |
| `NULLCLAW_GATEWAY_HOST` | `gateway.host` | |
| `NULLCLAW_WORKSPACE` | `workspace_dir` | |
| `NULLCLAW_ALLOW_PUBLIC_BIND` | `gateway.allow_public_bind` | Set to `"1"` or `"true"` to enable |

## Top-Level Fields

| Key | Type | Default | Description |
|---|---|---|---|
| `default_provider` | string | `"openrouter"` | Provider used for LLM requests |
| `default_temperature` | f64 | `0.7` | Sampling temperature (0.0-2.0) |
| `max_tokens` | u32? | `null` | Max output tokens per call. `null` = provider default |
| `reasoning_effort` | string? | `null` | One of `"low"`, `"medium"`, `"high"`, `"none"` |

```json
{
  "default_provider": "openrouter",
  "default_temperature": 0.7,
  "max_tokens": 4096,
  "reasoning_effort": "medium"
}
```

## models.providers

Object-of-objects. Each key is a provider name. Use this section to register API keys and custom endpoints for each provider you want to use.

**Fields per entry:**

| Key | Type | Default | Description |
|---|---|---|---|
| `api_key` | string? | `null` | API key for the provider |
| `base_url` | string? | `null` | Custom base URL (alias: `api_url`) |

```json
{
  "models": {
    "providers": {
      "openrouter": {
        "api_key": "sk-or-..."
      },
      "anthropic": {
        "api_key": "sk-ant-...",
        "base_url": "https://custom.endpoint.com"
      },
      "openai": {
        "api_key": "sk-..."
      }
    }
  }
}
```

## agents

### agents.defaults

Default settings applied to all agents unless overridden per-agent.

| Key Path | Type | Default | Description |
|---|---|---|---|
| `agents.defaults.model.primary` | string | `"anthropic/claude-sonnet-4"` | Default model for all agents |
| `agents.defaults.heartbeat.enabled` | bool | `false` | Enable periodic heartbeat |
| `agents.defaults.heartbeat.every` | string | `"30m"` | Heartbeat interval (e.g. `"30m"`, `"1h"`) |

### agents.list

Array of named agent definitions. Each entry creates a distinct agent personality with its own provider, model, and behavior.

| Key | Type | Required | Default | Description |
|---|---|---|---|---|
| `id` | string | yes | — | Unique agent identifier |
| `name` | string | yes | — | Human-readable agent name |
| `provider` | string | yes | — | Provider to use (`"openrouter"`, `"anthropic"`, etc.) |
| `model` | string or object | yes | — | Model ID as a flat string, or `{"primary": "..."}` |
| `system_prompt` | string? | no | `null` | Custom system prompt |
| `api_key` | string? | no | `null` | Per-agent API key override |
| `temperature` | f64? | no | `null` | Per-agent temperature override |
| `max_depth` | u32 | no | `3` | Max tool-use recursion depth |

```json
{
  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/claude-sonnet-4" },
      "heartbeat": { "enabled": true, "every": "30m" }
    },
    "list": [
      {
        "id": "main",
        "name": "Main Assistant",
        "provider": "openrouter",
        "model": "anthropic/claude-sonnet-4",
        "system_prompt": "You are a helpful assistant.",
        "max_depth": 5
      },
      {
        "id": "coder",
        "name": "Code Agent",
        "provider": "anthropic",
        "model": { "primary": "claude-sonnet-4" },
        "temperature": 0.3
      }
    ]
  }
}
```

## agent (Runtime Behavior)

Controls agent runtime behavior: context management, tool dispatch, and session limits.

| Key | Type | Default | Description |
|---|---|---|---|
| `compact_context` | bool | `false` | Enable context compaction |
| `max_tool_iterations` | u32 | `25` | Max tool calls per turn |
| `max_history_messages` | u32 | `50` | Max messages retained in history |
| `parallel_tools` | bool | `false` | Allow parallel tool execution |
| `tool_dispatcher` | string | `"auto"` | Tool dispatch strategy |
| `token_limit` | u64 | `128000` | Context window token limit |
| `session_idle_timeout_secs` | u64 | `1800` | Idle timeout before session ends (30 min) |
| `compaction_keep_recent` | u32 | `20` | Messages kept after compaction |
| `compaction_max_summary_chars` | u32 | `2000` | Max chars in compaction summary |
| `compaction_max_source_chars` | u32 | `12000` | Max source chars fed to compactor |
| `message_timeout_secs` | u64 | `300` | Timeout for a single LLM call (5 min) |

```json
{
  "agent": {
    "compact_context": true,
    "max_tool_iterations": 25,
    "max_history_messages": 50,
    "parallel_tools": false,
    "token_limit": 128000,
    "session_idle_timeout_secs": 1800,
    "message_timeout_secs": 300
  }
}
```

## channels

Channels connect nullclaw to messaging platforms (Telegram, Discord, Slack, etc.).

**Multi-account format** (recommended for multiple accounts on one platform):

```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": { "bot_token": "123:ABC..." },
        "secondary": { "bot_token": "456:DEF..." }
      }
    }
  }
}
```

**Single-account shorthand** (when you only need one account):

```json
{
  "channels": {
    "telegram": {
      "bot_token": "123:ABC..."
    }
  }
}
```

**Account priority resolution:** `account_id="default"` > `"main"` > first entry alphabetically.

See [Channels](channels.md) for per-channel configuration details.

## bindings (Agent-to-Channel Routing)

Bindings route incoming messages from specific channels/accounts/peers to specific agents. This is how you control which agent handles which conversation.

| Key | Type | Description |
|---|---|---|
| `agent_id` | string | Agent to route to |
| `comment` | string? | Human-readable description |
| `match.channel` | string | Channel type (`"telegram"`, `"discord"`, etc.) |
| `match.account_id` | string? | Account within the channel |
| `match.guild_id` | string? | Discord guild / Slack workspace |
| `match.team_id` | string? | Team identifier |
| `match.roles` | string[] | Required roles |
| `match.peer` | object? | Peer filter: `{"kind": "direct", "id": "..."}` |

```json
{
  "bindings": [
    {
      "agent_id": "main",
      "comment": "Route my Telegram DMs to the main agent",
      "match": {
        "channel": "telegram",
        "account_id": "main",
        "guild_id": null,
        "team_id": null,
        "roles": [],
        "peer": { "kind": "direct", "id": "123456789" }
      }
    }
  ]
}
```

## model_routes

Model routes let you define named routing hints. When an agent or tool requests a model by hint (e.g. `"hint:reasoning"`), the router resolves it to the configured provider and model.

| Key | Type | Description |
|---|---|---|
| `hint` | string | Route name (referenced as `"hint:<name>"`) |
| `provider` | string | Target provider |
| `model` | string | Target model |
| `api_key` | string? | Optional per-route API key |

```json
{
  "model_routes": [
    { "hint": "reasoning", "provider": "anthropic", "model": "claude-opus", "api_key": null },
    { "hint": "fast", "provider": "openrouter", "model": "anthropic/claude-haiku", "api_key": null }
  ]
}
```

## reliability

Controls retry behavior, backoff, and provider fallback chains.

| Key | Type | Default | Description |
|---|---|---|---|
| `provider_retries` | u32 | `2` | Retries per provider call |
| `provider_backoff_ms` | u64 | `500` | Initial backoff between retries (ms) |
| `channel_initial_backoff_secs` | u64 | `2` | Initial backoff for channel reconnects |
| `channel_max_backoff_secs` | u64 | `60` | Max backoff for channel reconnects |
| `scheduler_poll_secs` | u64 | `15` | Scheduler polling interval |
| `scheduler_retries` | u32 | `2` | Retries for scheduled tasks |
| `fallback_providers` | string[] | `[]` | Ordered list of fallback providers |
| `api_keys` | string[] | `[]` | Additional API keys for rotation |
| `model_fallbacks` | array | `[]` | Per-model fallback chains (see below) |

**model_fallbacks entry:**

```json
{
  "model_fallbacks": [
    { "model": "claude-opus", "fallbacks": ["claude-sonnet", "gpt-4o"] },
    { "model": "gpt-4o", "fallbacks": ["claude-sonnet"] }
  ]
}
```

When the primary model fails after all retries, nullclaw automatically tries each fallback in order.

## mcp_servers

MCP (Model Context Protocol) server definitions. Compatible with Claude Desktop and Cursor format.

Each key is a server name. The server is started as a subprocess.

| Key | Type | Description |
|---|---|---|
| `command` | string | Executable to run |
| `args` | string[] | Command-line arguments |
| `env` | object? | Environment variables for the subprocess |

```json
{
  "mcp_servers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["/home/user/projects"],
      "env": { "DEBUG": "true" }
    },
    "database": {
      "command": "mcp-server-sqlite",
      "args": ["--db", "/data/app.db"]
    }
  }
}
```

## memory

Controls conversation memory, embeddings, caching, and data lifecycle.

| Key | Type | Default | Description |
|---|---|---|---|
| `backend` | string | `"sqlite"` | Storage backend |
| `auto_save` | bool | `true` | Automatically persist conversations |
| `hygiene_enabled` | bool | `true` | Enable memory hygiene (archival/purge) |
| `archive_after_days` | u32 | `7` | Archive memories older than N days |
| `purge_after_days` | u32 | `30` | Purge archived memories after N days |
| `conversation_retention_days` | u32 | `30` | Retain conversation logs for N days |
| `embedding_provider` | string | `"none"` | Provider for embeddings (`"none"`, `"openai"`, etc.) |
| `embedding_model` | string | `"text-embedding-3-small"` | Embedding model |
| `embedding_dimensions` | u32 | `1536` | Embedding vector dimensions |
| `vector_weight` | f64 | `0.7` | Weight for vector similarity in hybrid search |
| `keyword_weight` | f64 | `0.3` | Weight for keyword matching in hybrid search |
| `embedding_cache_size` | u32 | `10000` | Max cached embedding vectors |
| `chunk_max_tokens` | u32 | `512` | Max tokens per memory chunk |
| `response_cache_enabled` | bool | `false` | Cache LLM responses |
| `response_cache_ttl_minutes` | u32 | `60` | Response cache TTL |
| `response_cache_max_entries` | u32 | `5000` | Max cached responses |
| `snapshot_enabled` | bool | `false` | Enable memory snapshots |
| `snapshot_on_hygiene` | bool | `false` | Snapshot before hygiene runs |
| `auto_hydrate` | bool | `true` | Auto-load relevant memories into context |

**Available backends:** `sqlite` (recommended), `markdown`, `lucid`, `none`

```json
{
  "memory": {
    "backend": "sqlite",
    "auto_save": true,
    "hygiene_enabled": true,
    "archive_after_days": 7,
    "purge_after_days": 30,
    "embedding_provider": "openai",
    "embedding_model": "text-embedding-3-small",
    "vector_weight": 0.7,
    "keyword_weight": 0.3
  }
}
```

## security

### security.sandbox

Controls process sandboxing for tool execution.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool? | `null` | Enable sandboxing. `null` = auto-detect |
| `backend` | enum | `"auto"` | Sandbox backend |
| `firejail_args` | string[] | `[]` | Extra arguments for firejail backend |

**Available backends:** `auto`, `landlock`, `firejail`, `bubblewrap`, `docker`, `none`

When set to `"auto"`, nullclaw probes for available backends in order: landlock > firejail > bubblewrap > docker > none.

### security.resources

Resource limits for tool execution.

| Key | Type | Default | Description |
|---|---|---|---|
| `max_memory_mb` | u32 | `512` | Memory limit per subprocess (MB) |
| `max_cpu_percent` | u32 | `80` | CPU usage cap (%) |
| `max_disk_mb` | u32 | `1024` | Disk usage limit (MB) |
| `max_cpu_time_seconds` | u64 | `60` | Max CPU time per execution |
| `max_subprocesses` | u32 | `10` | Max concurrent subprocesses |
| `memory_monitoring` | bool | `true` | Enable runtime memory monitoring |

### security.audit

Audit logging for compliance and debugging.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `true` | Enable audit logging |
| `log_path` | string | `"audit.log"` | Audit log file path |
| `retention_days` | u32 | `90` | Retain audit logs for N days |
| `max_size_mb` | u32 | `100` | Max audit log size before rotation |
| `sign_events` | bool | `false` | Cryptographically sign audit events |

```json
{
  "security": {
    "sandbox": {
      "enabled": true,
      "backend": "auto"
    },
    "resources": {
      "max_memory_mb": 512,
      "max_cpu_percent": 80,
      "max_subprocesses": 10
    },
    "audit": {
      "enabled": true,
      "log_path": "audit.log",
      "retention_days": 90,
      "sign_events": false
    }
  }
}
```

## autonomy

Controls how much freedom the agent has to act without human approval.

| Key | Type | Default | Description |
|---|---|---|---|
| `level` | enum | `"supervised"` | Autonomy level |
| `workspace_only` | bool | `true` | Restrict file operations to workspace |
| `max_actions_per_hour` | u32 | `20` | Rate limit on autonomous actions |
| `require_approval_for_medium_risk` | bool | `true` | Prompt user for medium-risk actions |
| `block_high_risk_commands` | bool | `true` | Block high-risk commands entirely |
| `allowed_commands` | string[] | `[]` | Allowlist of shell commands |
| `allowed_paths` | string[] | `[]` | Allowlist of filesystem paths |

**Autonomy levels:**

| Level | Behavior |
|---|---|
| `read_only` | Agent can only read files and call LLMs. No writes, no shell. |
| `supervised` | Agent can act but prompts for approval on risky operations. |
| `full` | Agent acts freely within configured limits. Use with caution. |

```json
{
  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 20,
    "block_high_risk_commands": true,
    "allowed_commands": ["git", "npm", "cargo", "zig"],
    "allowed_paths": ["/home/user/projects"]
  }
}
```

## gateway

The gateway exposes an HTTP API for pairing, webhooks, and external integrations.

| Key | Type | Default | Description |
|---|---|---|---|
| `port` | u16 | `3000` | Listening port |
| `host` | string | `"127.0.0.1"` | Bind address |
| `require_pairing` | bool | `true` | Require token pairing for API access |
| `allow_public_bind` | bool | `false` | Allow binding to `0.0.0.0` |
| `pair_rate_limit_per_minute` | u32 | `10` | Rate limit on pairing attempts |
| `webhook_rate_limit_per_minute` | u32 | `60` | Rate limit on webhook deliveries |
| `idempotency_ttl_secs` | u64 | `300` | Idempotency key TTL (5 min) |
| `paired_tokens` | string[] | `[]` | Pre-paired tokens (for automation) |

```json
{
  "gateway": {
    "port": 3000,
    "host": "127.0.0.1",
    "require_pairing": true,
    "allow_public_bind": false,
    "webhook_rate_limit_per_minute": 60
  }
}
```

## tunnel

Expose the gateway to the internet through a tunnel provider.

| Key | Type | Default | Description |
|---|---|---|---|
| `provider` | string | `"none"` | Tunnel provider |

**Available providers:** `none`, `cloudflare`, `ngrok`, `tailscale`, `custom`

Each provider has its own sub-configuration:

**cloudflare:**

| Key | Type | Description |
|---|---|---|
| `token` | string | Cloudflare Tunnel token |

**ngrok:**

| Key | Type | Description |
|---|---|---|
| `auth_token` | string | ngrok auth token |
| `domain` | string? | Custom domain (optional) |

**tailscale:**

| Key | Type | Description |
|---|---|---|
| `funnel` | bool | Enable Tailscale Funnel |
| `hostname` | string? | Custom hostname (optional) |

**custom:**

| Key | Type | Description |
|---|---|---|
| `start_command` | string | Command to start the tunnel |
| `health_url` | string? | URL to check tunnel health |
| `url_pattern` | string? | Regex to extract public URL from stdout |

```json
{
  "tunnel": {
    "provider": "ngrok",
    "ngrok": {
      "auth_token": "2abc...",
      "domain": "my-bot.ngrok.app"
    }
  }
}
```

## tools

General tool execution settings.

| Key | Type | Default | Description |
|---|---|---|---|
| `shell_timeout_secs` | u64 | `60` | Shell command timeout |
| `shell_max_output_bytes` | u32 | `1048576` | Max shell output (1 MB) |
| `max_file_size_bytes` | u32 | `10485760` | Max file size for read/write (10 MB) |
| `web_fetch_max_chars` | u32 | `50000` | Max characters fetched from URLs |

### tools.media.audio

Audio transcription settings (used by voice channels and audio tools).

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `true` | Enable audio processing |
| `language` | string? | `null` | Language hint for transcription (ISO 639-1) |
| `models[0].provider` | string | `"groq"` | Transcription provider |
| `models[0].model` | string | `"whisper-large-v3"` | Transcription model |

```json
{
  "tools": {
    "shell_timeout_secs": 60,
    "shell_max_output_bytes": 1048576,
    "max_file_size_bytes": 10485760,
    "media": {
      "audio": {
        "enabled": true,
        "language": "en",
        "models": [
          { "provider": "groq", "model": "whisper-large-v3" }
        ]
      }
    }
  }
}
```

## cost

Cost tracking and budget enforcement.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable cost tracking |
| `daily_limit_usd` | f64 | `10.0` | Daily spending limit (USD) |
| `monthly_limit_usd` | f64 | `100.0` | Monthly spending limit (USD) |
| `warn_at_percent` | u8 | `80` | Warn when budget usage reaches this % |
| `allow_override` | bool | `false` | Allow agents to override limits |

```json
{
  "cost": {
    "enabled": true,
    "daily_limit_usd": 5.0,
    "monthly_limit_usd": 50.0,
    "warn_at_percent": 80
  }
}
```

## scheduler

Background task scheduler for cron-like jobs.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `true` | Enable the scheduler |
| `max_tasks` | u32 | `64` | Maximum scheduled tasks |
| `max_concurrent` | u32 | `4` | Maximum concurrently running tasks |

```json
{
  "scheduler": {
    "enabled": true,
    "max_tasks": 64,
    "max_concurrent": 4
  }
}
```

## session

Session management and identity linking across channels.

| Key | Type | Default | Description |
|---|---|---|---|
| `dm_scope` | enum | `"per_channel_peer"` | How DM sessions are scoped |
| `idle_minutes` | u32 | `60` | Session idle timeout (minutes) |
| `typing_interval_secs` | u32 | `5` | Typing indicator interval |
| `identity_links` | array | `[]` | Cross-channel identity mappings |

**DmScope values:**

| Value | Behavior |
|---|---|
| `main` | Single global session for all DMs |
| `per_peer` | One session per user, shared across channels |
| `per_channel_peer` | One session per user per channel (default) |
| `per_account_channel_peer` | One session per user per channel per account |

**Identity links** let you unify a user's identity across platforms:

```json
{
  "session": {
    "dm_scope": "per_channel_peer",
    "idle_minutes": 60,
    "identity_links": [
      {
        "canonical": "alice",
        "peers": ["telegram:123456", "discord:789012"]
      }
    ]
  }
}
```

Alternatively, use the map format:

```json
{
  "session": {
    "identity_links": {
      "alice": ["telegram:123456", "discord:789012"],
      "bob": ["telegram:654321", "slack:U001"]
    }
  }
}
```

## hardware

Hardware integration for embedded devices and microcontrollers.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable hardware support |
| `transport` | enum | `"none"` | Communication transport |
| `serial_port` | string? | `null` | Serial port path (e.g. `/dev/ttyACM0`) |
| `baud_rate` | u32 | `115200` | Serial baud rate |
| `probe_target` | string? | `null` | Debug probe target chip |

```json
{
  "hardware": {
    "enabled": true,
    "transport": "serial",
    "serial_port": "/dev/ttyACM0",
    "baud_rate": 115200
  }
}
```

## peripherals

Peripheral and development board management.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable peripheral support |
| `datasheet_dir` | string? | `null` | Directory containing datasheets |
| `boards` | array | `[]` | List of board definitions |

```json
{
  "peripherals": {
    "enabled": true,
    "datasheet_dir": "/home/user/datasheets",
    "boards": []
  }
}
```

## browser

Browser automation for web interaction.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable browser tool |
| `backend` | string | `"agent_browser"` | Browser backend |
| `native_headless` | bool | `true` | Run in headless mode |
| `native_webdriver_url` | string | `"http://127.0.0.1:9515"` | WebDriver endpoint URL |
| `allowed_domains` | string[] | `[]` | Domain allowlist (empty = all allowed) |

```json
{
  "browser": {
    "enabled": true,
    "backend": "agent_browser",
    "native_headless": true,
    "allowed_domains": ["docs.example.com", "github.com"]
  }
}
```

## http_request

Direct HTTP request tool for API calls.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable HTTP request tool |
| `max_response_size` | u32 | `1000000` | Max response body size (bytes) |
| `timeout_secs` | u64 | `30` | Request timeout |
| `allowed_domains` | string[] | `[]` | Domain allowlist (empty = all allowed) |

```json
{
  "http_request": {
    "enabled": true,
    "max_response_size": 1000000,
    "timeout_secs": 30,
    "allowed_domains": ["api.example.com"]
  }
}
```

## composio

Integration with [Composio](https://composio.dev) for third-party tool access.

| Key | Type | Default | Description |
|---|---|---|---|
| `enabled` | bool | `false` | Enable Composio integration |
| `api_key` | string? | `null` | Composio API key |
| `entity_id` | string | `"default"` | Composio entity identifier |

```json
{
  "composio": {
    "enabled": true,
    "api_key": "cmp_...",
    "entity_id": "default"
  }
}
```

## runtime

Controls how tool commands are executed — natively or inside a Docker container.

| Key | Type | Default | Description |
|---|---|---|---|
| `kind` | string | `"native"` | Runtime kind: `"native"` or `"docker"` |
| `docker.image` | string | `"alpine:3.20"` | Docker image |
| `docker.network` | string | `"none"` | Docker network mode |
| `docker.memory_limit_mb` | u64? | `512` | Container memory limit (MB) |
| `docker.cpu_limit` | f64? | `1.0` | Container CPU limit (cores) |
| `docker.read_only_rootfs` | bool | `true` | Mount root filesystem as read-only |
| `docker.mount_workspace` | bool | `true` | Mount workspace directory into container |

```json
{
  "runtime": {
    "kind": "docker",
    "docker": {
      "image": "alpine:3.20",
      "network": "none",
      "memory_limit_mb": 512,
      "cpu_limit": 1.0,
      "read_only_rootfs": true,
      "mount_workspace": true
    }
  }
}
```

## diagnostics

Observability and telemetry configuration.

| Key | Type | Default | Description |
|---|---|---|---|
| `backend` | string | `"none"` | Diagnostics backend: `"none"` or `"otel"` |
| `otel.endpoint` | string? | `null` | OpenTelemetry collector endpoint |
| `otel.service_name` | string? | `null` | Service name for traces |

```json
{
  "diagnostics": {
    "backend": "otel",
    "otel": {
      "endpoint": "http://localhost:4317",
      "service_name": "nullclaw"
    }
  }
}
```

## secrets

Controls encryption of sensitive values (API keys) stored in the config.

| Key | Type | Default | Description |
|---|---|---|---|
| `encrypt` | bool | `true` | Encrypt secrets at rest |

When enabled, nullclaw encrypts API keys and tokens using ChaCha20-Poly1305 before writing them to disk. The encryption key is derived from the machine's keychain.

```json
{
  "secrets": {
    "encrypt": true
  }
}
```

---

## Advanced Example: Multi-Account, Multi-Provider Setup

This example shows a production-like configuration with multiple bot accounts on different platforms, several agents backed by different providers, bindings that route conversations to the right agent, reliability with fallback and key rotation, model routing, and cross-channel identity links.

**Scenario:** you run two Telegram bots (personal assistant and a work bot), a Discord bot, and a Slack bot. You have three agents: a general-purpose one on OpenRouter, a coding specialist on Anthropic, and a fast responder on Groq. Different channels route to different agents.

```json
{
  "default_provider": "openrouter",
  "default_temperature": 0.7,

  "models": {
    "providers": {
      "openrouter": { "api_key": "sk-or-v1-..." },
      "anthropic": { "api_key": "sk-ant-..." },
      "groq": { "api_key": "gsk_..." },
      "deepseek": { "api_key": "sk-..." }
    }
  },

  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/claude-sonnet-4" },
      "heartbeat": { "enabled": true, "every": "30m" }
    },
    "list": [
      {
        "id": "general",
        "name": "General Assistant",
        "provider": "openrouter",
        "model": "anthropic/claude-sonnet-4",
        "system_prompt": "You are a helpful personal assistant.",
        "max_depth": 5
      },
      {
        "id": "coder",
        "name": "Code Agent",
        "provider": "anthropic",
        "model": "claude-sonnet-4",
        "system_prompt": "You are a senior software engineer. Write clean, tested code.",
        "temperature": 0.2,
        "max_depth": 3
      },
      {
        "id": "fast",
        "name": "Quick Responder",
        "provider": "groq",
        "model": "llama-3.3-70b-versatile",
        "system_prompt": "You are a fast, concise assistant. Keep answers short.",
        "temperature": 0.5,
        "max_depth": 1
      }
    ]
  },

  "channels": {
    "cli": true,

    "telegram": {
      "accounts": {
        "personal": {
          "bot_token": "111111:AAA-personal-bot-token",
          "allow_from": ["123456789"],
          "group_policy": "allowlist",
          "group_allow_from": ["my_group_id"]
        },
        "work": {
          "bot_token": "222222:BBB-work-bot-token",
          "allow_from": ["123456789", "987654321"],
          "group_policy": "allowlist"
        }
      }
    },

    "discord": {
      "accounts": {
        "default": {
          "token": "MTIz...discord-bot-token",
          "guild_id": "1100000000000000000",
          "require_mention": true,
          "intents": 37377
        }
      }
    },

    "slack": {
      "mode": "socket",
      "bot_token": "xoxb-...",
      "app_token": "xapp-...",
      "dm_policy": "allow",
      "group_policy": "mention_only"
    }
  },

  "bindings": [
    {
      "agent_id": "general",
      "comment": "Personal Telegram bot -> general assistant",
      "match": { "channel": "telegram", "account_id": "personal" }
    },
    {
      "agent_id": "coder",
      "comment": "Work Telegram bot -> code agent",
      "match": { "channel": "telegram", "account_id": "work" }
    },
    {
      "agent_id": "coder",
      "comment": "Discord server -> code agent",
      "match": { "channel": "discord" }
    },
    {
      "agent_id": "fast",
      "comment": "Slack -> quick responder",
      "match": { "channel": "slack" }
    }
  ],

  "model_routes": [
    {
      "hint": "reasoning",
      "provider": "anthropic",
      "model": "claude-opus-4"
    },
    {
      "hint": "cheap",
      "provider": "deepseek",
      "model": "deepseek-chat"
    },
    {
      "hint": "vision",
      "provider": "openrouter",
      "model": "anthropic/claude-sonnet-4"
    }
  ],

  "reliability": {
    "provider_retries": 3,
    "provider_backoff_ms": 500,
    "fallback_providers": ["anthropic", "deepseek"],
    "api_keys": ["sk-or-v1-backup-key-1", "sk-or-v1-backup-key-2"],
    "model_fallbacks": [
      {
        "model": "anthropic/claude-sonnet-4",
        "fallbacks": ["anthropic/claude-haiku", "deepseek-chat"]
      },
      {
        "model": "claude-opus-4",
        "fallbacks": ["claude-sonnet-4", "gpt-4o"]
      }
    ]
  },

  "session": {
    "dm_scope": "per_account_channel_peer",
    "idle_minutes": 120,
    "identity_links": [
      {
        "canonical": "me",
        "peers": [
          "telegram:123456789",
          "discord:9900000000000000",
          "slack:U01MYUSERID"
        ]
      },
      {
        "canonical": "colleague",
        "peers": [
          "telegram:987654321",
          "slack:U02THEIRID"
        ]
      }
    ]
  },

  "memory": {
    "backend": "sqlite",
    "auto_save": true,
    "hygiene_enabled": true,
    "archive_after_days": 14,
    "purge_after_days": 90,
    "embedding_provider": "openrouter",
    "embedding_model": "text-embedding-3-small",
    "vector_weight": 0.7,
    "keyword_weight": 0.3
  },

  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 50,
    "allowed_commands": ["git", "zig", "npm", "python3", "curl"]
  },

  "gateway": {
    "port": 3000,
    "host": "127.0.0.1",
    "require_pairing": true
  },

  "tunnel": {
    "provider": "cloudflare",
    "cloudflare": { "token": "eyJ..." }
  },

  "cost": {
    "enabled": true,
    "daily_limit_usd": 25.0,
    "monthly_limit_usd": 300.0,
    "warn_at_percent": 75
  },

  "tools": {
    "media": {
      "audio": {
        "enabled": true,
        "models": [{ "provider": "groq", "model": "whisper-large-v3" }]
      }
    }
  },

  "mcp_servers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["/home/user/projects"]
    }
  }
}
```

### What's happening here

**Providers.** Four providers configured — OpenRouter as default (broad model access), Anthropic for direct Claude API (lower latency for the code agent), Groq for fast inference, DeepSeek as a cheap fallback. API keys set in config; alternatively, use env vars (`OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, etc.).

**Three agents with different roles:**
- `general` — general-purpose, uses OpenRouter with Claude Sonnet, high delegation depth (5) for complex multi-step tasks
- `coder` — coding specialist, uses Anthropic directly, lower temperature (0.2) for precise code generation
- `fast` — quick responses on Groq/Llama, low delegation depth (1) to keep it fast and simple

**Multi-account channels.**
- Two Telegram bots: `personal` (your private assistant, restricted to your user ID) and `work` (shared with a colleague). Each has its own token and allowlist.
- One Discord bot locked to a specific guild with `require_mention` — only responds when @mentioned.
- One Slack bot in socket mode with `mention_only` for groups.

**Bindings route channels to agents.** This is the key — without bindings, all channels go to the default agent. Here:
- Messages to the personal Telegram bot → `general` agent
- Messages to the work Telegram bot → `coder` agent
- Discord messages → `coder` agent
- Slack messages → `fast` agent

Bindings match top-down; first match wins. You can filter by `channel`, `account_id`, `guild_id`, `team_id`, `roles`, and specific `peer` (direct/group with ID).

**Model routes** define named shortcuts. Any agent or delegation can request `"hint:reasoning"` to route to Claude Opus, `"hint:cheap"` to route to DeepSeek, or `"hint:vision"` for vision tasks. This works across all agents regardless of their default provider.

**Reliability chain.** If OpenRouter fails:
1. Retry up to 3 times with exponential backoff (500ms → 1s → 2s)
2. Rotate through backup API keys (`api_keys`)
3. Fall back to Anthropic, then DeepSeek (`fallback_providers`)
4. If the specific model fails everywhere, try the model fallback chain (e.g. Sonnet → Haiku → DeepSeek Chat)

**Session scope** is `per_account_channel_peer` — the most granular: your conversation with the personal Telegram bot is separate from the work Telegram bot, even though both are Telegram. The `identity_links` tie your accounts across platforms so memory recall works across channels — when you ask in Slack, nullclaw can recall memories stored from your Telegram conversations.

**Tunnel** — Cloudflare tunnel exposes the gateway to the internet so Telegram/WhatsApp/LINE webhooks can reach it. Without a tunnel, these channels fall back to long-polling (Telegram) or won't work (WhatsApp, LINE).

**Cost tracking** is enabled with a $25/day limit. At 75% usage, nullclaw warns you before hitting the cap.

**Audio transcription** is on — Telegram voice messages get transcribed via Groq Whisper before being sent to the agent.

**MCP server** adds external tools from `mcp-server-filesystem`, available to all agents alongside built-in tools.

---

## Full Example

A realistic configuration showing the most commonly used sections with placeholder values:

```json
{
  "default_provider": "openrouter",
  "default_temperature": 0.7,
  "max_tokens": 4096,

  "models": {
    "providers": {
      "openrouter": {
        "api_key": "YOUR_API_KEY"
      },
      "anthropic": {
        "api_key": "YOUR_API_KEY"
      }
    }
  },

  "agents": {
    "defaults": {
      "model": { "primary": "anthropic/claude-sonnet-4" },
      "heartbeat": { "enabled": false, "every": "30m" }
    },
    "list": [
      {
        "id": "main",
        "name": "Assistant",
        "provider": "openrouter",
        "model": "anthropic/claude-sonnet-4",
        "max_depth": 3
      }
    ]
  },

  "channels": {
    "telegram": {
      "bot_token": "YOUR_BOT_TOKEN"
    }
  },

  "bindings": [
    {
      "agent_id": "main",
      "comment": "All Telegram messages to main agent",
      "match": {
        "channel": "telegram",
        "account_id": null,
        "guild_id": null,
        "team_id": null,
        "roles": [],
        "peer": null
      }
    }
  ],

  "reliability": {
    "provider_retries": 2,
    "provider_backoff_ms": 500,
    "channel_initial_backoff_secs": 2,
    "channel_max_backoff_secs": 60,
    "fallback_providers": ["anthropic"],
    "model_fallbacks": [
      { "model": "claude-sonnet-4", "fallbacks": ["gpt-4o"] }
    ]
  },

  "memory": {
    "backend": "sqlite",
    "auto_save": true,
    "hygiene_enabled": true,
    "archive_after_days": 7,
    "purge_after_days": 30,
    "embedding_provider": "none"
  },

  "security": {
    "sandbox": {
      "enabled": null,
      "backend": "auto"
    },
    "resources": {
      "max_memory_mb": 512,
      "max_cpu_percent": 80,
      "max_subprocesses": 10
    },
    "audit": {
      "enabled": true,
      "log_path": "audit.log",
      "retention_days": 90
    }
  },

  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 20,
    "require_approval_for_medium_risk": true,
    "block_high_risk_commands": true,
    "allowed_commands": ["git", "npm", "zig"],
    "allowed_paths": []
  },

  "gateway": {
    "port": 3000,
    "host": "127.0.0.1",
    "require_pairing": true,
    "allow_public_bind": false,
    "webhook_rate_limit_per_minute": 60
  },

  "cost": {
    "enabled": true,
    "daily_limit_usd": 10.0,
    "monthly_limit_usd": 100.0,
    "warn_at_percent": 80
  },

  "scheduler": {
    "enabled": true,
    "max_tasks": 64,
    "max_concurrent": 4
  },

  "session": {
    "dm_scope": "per_channel_peer",
    "idle_minutes": 60
  },

  "secrets": {
    "encrypt": true
  }
}
```
