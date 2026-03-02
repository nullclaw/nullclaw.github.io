# Configuration

NullClaw is configured through a single JSON file. All settings -- providers, channels, memory, security, autonomy -- live in one place.

## Config File Location

```
~/.nullclaw/config.json
```

This file is created by `nullclaw onboard`. You can also create or edit it manually.

## Full Annotated Example

```json
{
  "default_temperature": 0.7,

  "models": {
    "providers": {
      "openrouter": { "api_key": "sk-or-..." },
      "groq": { "api_key": "gsk_..." },
      "anthropic": {
        "api_key": "sk-ant-...",
        "base_url": "https://api.anthropic.com"
      },
      "ollama": {
        "base_url": "http://localhost:11434"
      }
    }
  },

  "agents": {
    "defaults": {
      "model": { "primary": "openrouter/anthropic/claude-sonnet-4" },
      "heartbeat": { "every": "30m" }
    },
    "list": [
      {
        "id": "researcher",
        "model": { "primary": "openrouter/anthropic/claude-opus-4" },
        "system_prompt": "You are a research assistant."
      }
    ]
  },

  "channels": {
    "cli": true,
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "123:ABC",
          "allow_from": [123456789],
          "reply_in_private": true
        }
      }
    },
    "discord": {
      "accounts": {
        "main": {
          "token": "disc-token",
          "guild_id": "12345",
          "allow_from": ["user1"],
          "allow_bots": false
        }
      }
    }
  },

  "memory": {
    "profile": "markdown_only",
    "backend": "markdown",
    "search": { "enabled": true, "provider": "auto" },
    "embedding_provider": "none",
    "chunking": { "max_tokens": 512 },
    "query": { "max_results": 5 },
    "vector_weight": 0.7,
    "keyword_weight": 0.3,
    "cache": { "max_size": 500 },
    "lifecycle": {
      "archival_threshold_days": 90,
      "purge_after_days": 365
    }
  },

  "reliability": {
    "provider_retries": 2,
    "retry_backoff_ms": 1000,
    "fallback_providers": ["groq/llama-3.3-70b-versatile"]
  },

  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 20,
    "allowed_commands": ["*"],
    "allowed_paths": ["*"]
  },

  "gateway": {
    "port": 3000,
    "host": "127.0.0.1",
    "require_pairing": true,
    "allow_public_bind": false
  },

  "security": {
    "sandbox": { "backend": "auto" },
    "resources": {
      "max_memory_mb": 512,
      "max_cpu_percent": 80
    },
    "audit": {
      "enabled": true,
      "retention_days": 90
    }
  },

  "runtime": {
    "kind": "native",
    "docker": {
      "image": "alpine:3.20",
      "network": "none",
      "memory_limit_mb": 512,
      "read_only_rootfs": true
    }
  },

  "tunnel": { "provider": "none" },
  "secrets": { "encrypt": true },
  "identity": { "format": "openclaw" }
}
```

## Section Reference

### models.providers

Defines the AI providers and their credentials. Each key is a provider name; the value contains at minimum an `api_key` and optionally a `base_url`.

```json
{
  "models": {
    "providers": {
      "openrouter": { "api_key": "sk-or-..." },
      "anthropic": { "api_key": "sk-ant-...", "base_url": "https://api.anthropic.com" },
      "ollama": { "base_url": "http://localhost:11434" }
    }
  }
}
```

API keys can be stored encrypted (see [Secret Encryption](#secret-encryption) below). For the full list of supported providers, see [Providers](/nullclaw/docs/providers).

### agents

Configure the default model, heartbeat interval, and define named agents with custom models and system prompts.

```json
{
  "agents": {
    "defaults": {
      "model": { "primary": "openrouter/anthropic/claude-sonnet-4" },
      "heartbeat": { "every": "30m" }
    },
    "list": [
      {
        "id": "researcher",
        "model": { "primary": "openrouter/anthropic/claude-opus-4" },
        "system_prompt": "You are a research assistant focused on technical topics."
      }
    ]
  }
}
```

- `defaults.model.primary`: The model used for all agent interactions unless overridden. Format is `provider/model-name`.
- `defaults.heartbeat.every`: How often the heartbeat engine runs periodic tasks from `HEARTBEAT.md`. Set to `"0"` to disable.
- `list`: Named agents with their own models and prompts. These can be targeted via the `delegate` and `spawn` tools.

### channels

Configure messaging channels. Each channel type supports one or more named accounts under an `accounts` wrapper. For full channel configuration details, see [Channels](/nullclaw/docs/channels).

```json
{
  "channels": {
    "cli": true,
    "telegram": {
      "accounts": {
        "main": { "bot_token": "...", "allow_from": [123456789] }
      }
    }
  }
}
```

Setting a channel to `true` (like `"cli": true`) enables it with default settings. Channels with `accounts` support multiple concurrent connections to the same service.

### memory

Configure the memory backend, search, embeddings, and lifecycle policies.

```json
{
  "memory": {
    "backend": "sqlite",
    "embedding_provider": "openai",
    "vector_weight": 0.7,
    "keyword_weight": 0.3,
    "cache": { "max_size": 500 },
    "lifecycle": {
      "archival_threshold_days": 90,
      "purge_after_days": 365
    }
  }
}
```

- `backend`: Storage engine (`sqlite`, `markdown`, `redis`, `postgres`, `lancedb`, `api`, `memory_lru`, `lucid`, `none`)
- `profile`: Preset configuration (`markdown_only`, etc.)
- `embedding_provider`: Which embedding service to use (`openai`, `gemini`, `voyage`, `ollama`, `none`)
- `vector_weight` / `keyword_weight`: Balance between vector similarity and FTS5 keyword search
- `cache.max_size`: Number of entries in the semantic cache
- `lifecycle`: Automatic archival and purge thresholds

For complete details, see [Memory](/nullclaw/docs/memory).

### reliability

Configure provider retry logic and fallback chains.

```json
{
  "reliability": {
    "provider_retries": 2,
    "retry_backoff_ms": 1000,
    "fallback_providers": ["groq/llama-3.3-70b-versatile"]
  }
}
```

- `provider_retries`: How many times to retry a failed provider call before falling back
- `retry_backoff_ms`: Delay between retries (multiplied by attempt number)
- `fallback_providers`: Ordered list of alternative models to try if the primary fails

### autonomy

Control what the agent is allowed to do.

```json
{
  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 20,
    "allowed_commands": ["git", "ls", "cat"],
    "allowed_paths": ["/home/user/project"]
  }
}
```

- `level`: `"supervised"` (asks for approval on risky actions), `"full"` (no approval needed)
- `workspace_only`: Restrict file operations to the workspace directory
- `max_actions_per_hour`: Rate limit on tool executions
- `allowed_commands`: Shell commands the agent can run. `["*"]` allows everything.
- `allowed_paths`: Filesystem paths the agent can access. `["*"]` allows everything except system-protected paths.

### gateway

Configure the HTTP gateway server.

```json
{
  "gateway": {
    "port": 3000,
    "host": "127.0.0.1",
    "require_pairing": true,
    "allow_public_bind": false
  }
}
```

- `port`: HTTP listen port (default: 3000)
- `host`: Bind address (default: `127.0.0.1`)
- `require_pairing`: Require the 6-digit pairing handshake before accepting API calls
- `allow_public_bind`: Must be explicitly set to `true` to bind to `0.0.0.0` without a tunnel

### security

Configure sandbox, resource limits, and audit logging. See [Security](/nullclaw/docs/security) for full details.

```json
{
  "security": {
    "sandbox": { "backend": "auto" },
    "resources": { "max_memory_mb": 512, "max_cpu_percent": 80 },
    "audit": { "enabled": true, "retention_days": 90 }
  }
}
```

### runtime

Configure the execution runtime.

```json
{
  "runtime": {
    "kind": "native",
    "docker": {
      "image": "alpine:3.20",
      "network": "none",
      "memory_limit_mb": 512,
      "read_only_rootfs": true
    }
  }
}
```

- `kind`: `"native"` (default), `"docker"`, or `"wasm"`
- The `docker` section is only used when `kind` is `"docker"`

### tunnel

Configure external access via tunnels.

```json
{
  "tunnel": {
    "provider": "cloudflare"
  }
}
```

Options: `"none"`, `"cloudflare"`, `"tailscale"`, `"ngrok"`, `"custom"`.

### tools

Configure tool-specific settings like audio transcription and web search.

```json
{
  "tools": {
    "media": {
      "audio": {
        "enabled": true,
        "language": "en",
        "models": [{ "provider": "groq", "model": "whisper-large-v3" }]
      }
    }
  },
  "http_request": {
    "search_provider": "auto",
    "search_base_url": "https://searx.example.com",
    "search_fallback_providers": ["jina", "duckduckgo"]
  }
}
```

### mcp_servers

Configure Model Context Protocol servers for additional tool sources.

```json
{
  "mcp_servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    }
  }
}
```

## Secret Encryption

API keys and sensitive values can be stored encrypted in the config file. NullClaw uses ChaCha20-Poly1305 symmetric encryption with a local key file.

Encrypted values are prefixed with `enc2:`:

```json
{
  "models": {
    "providers": {
      "openrouter": { "api_key": "enc2:a1b2c3d4e5f6..." }
    }
  },
  "channels": {
    "nostr": { "private_key": "enc2:f6e5d4c3b2a1..." }
  }
}
```

The `nullclaw onboard` wizard encrypts secrets automatically. You can also encrypt values manually through the config -- any `api_key` or `private_key` field set to a plaintext value will be encrypted on the next startup if `secrets.encrypt` is `true`.

## Build-Time Options

These flags are passed to `zig build`:

| Flag | Description | Example |
|------|-------------|---------|
| `-Doptimize` | Optimization level | `-Doptimize=ReleaseSmall` |
| `-Dchannels` | Compile only selected channels | `-Dchannels=telegram,discord,cli` |
| `-Dsqlite` | Include vendored SQLite | `-Dsqlite=true` |
| `-Dtarget` | Cross-compilation target | `-Dtarget=aarch64-linux-gnu` |

Selective channel compilation reduces binary size when you only need specific channels:

```bash
# Only Telegram and CLI -- smaller binary
zig build -Doptimize=ReleaseSmall -Dchannels=telegram,cli

# Everything (default)
zig build -Doptimize=ReleaseSmall
```

## OpenClaw Compatibility

NullClaw uses the same config structure as OpenClaw (snake_case keys). If you are migrating from OpenClaw, your existing config should work with minimal changes. Use the migration tool for memory import:

```bash
nullclaw migrate openclaw --dry-run    # Preview what would be migrated
nullclaw migrate openclaw              # Run the migration
```

See [CLI Reference](/nullclaw/docs/cli) for more migration options.
