# Configuration

NullClaw loads config from `~/.nullclaw/config.json` (`src/config.zig` + `src/config_parse.zig`).

## Minimal Bot Config

```json
{
  "models": {
    "providers": {
      "openrouter": { "api_key": "YOUR_KEY" }
    }
  },
  "agents": {
    "defaults": {
      "model": { "primary": "openrouter/anthropic/claude-sonnet-4" }
    }
  },
  "channels": {
    "cli": true
  },
  "gateway": {
    "host": "127.0.0.1",
    "port": 3000,
    "require_pairing": true
  }
}
```

## Chat UI Requires `channels.web`

Add this under `channels` for browser WebSocket clients:

```json
{
  "web": {
    "accounts": {
      "default": {
        "listen": "127.0.0.1",
        "port": 32123,
        "path": "/ws",
        "message_auth_mode": "pairing"
      }
    }
  }
}
```

Without `channels.web`, Chat UI cannot pair even if `nullclaw gateway` is running.

## Main Sections

- `models.providers`: provider credentials and optional base URLs
- `agents.defaults.model.primary`: default model route (`provider/model`)
- `channels`: channel accounts and policies
- `memory`: backend + retrieval/lifecycle settings
- `autonomy`: command/path limits and approval behavior
- `security`: sandbox and audit controls
- `gateway`: host/port/pairing/public-bind behavior
- `runtime`: runtime type and docker sandbox options

## Build vs Config

Config values do not guarantee runtime support if feature flags were excluded at build time.

Typical mismatch cases:

- channel configured but excluded via `-Dchannels=...`
- memory backend configured but excluded via `-Dengines=...`

Use:

```bash
nullclaw capabilities
nullclaw capabilities --json
```

## Validation

```bash
nullclaw doctor
nullclaw status
```

`doctor` is the fastest check for broken provider/channel setups.
