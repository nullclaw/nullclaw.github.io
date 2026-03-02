# Configuration

NullClaw reads config from `~/.nullclaw/config.json` (`src/config.zig`, `src/config_parse.zig`).

## Minimal Config That Runs

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

## Add Chat UI Support (`channels.web`)

```json
{
  "channels": {
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
}
```

Without this, Chat UI cannot pair.

## Key Sections

- `models.providers`: credentials and endpoint settings
- `agents.defaults.model.primary`: default provider/model route
- `channels`: channel accounts and channel policy
- `memory`: backend and memory behavior
- `autonomy`: tool/path/command restrictions
- `security`: sandbox and audit settings
- `gateway`: bind, pairing, and public bind behavior

## Verify Effective Config

```bash
nullclaw doctor
nullclaw status
nullclaw capabilities --json
```

## Build Flags vs Config

Config may declare features missing from your binary.

Typical mismatch:

- configured channel removed via `-Dchannels=...`
- configured memory backend removed via `-Dengines=...`

Use `capabilities` as source of truth.
