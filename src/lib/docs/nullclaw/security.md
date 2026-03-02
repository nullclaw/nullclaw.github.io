# Security

NullClaw enforces security at every layer -- from network binding to filesystem access, from secret storage to audit trails. The system is locked down by default: the gateway binds to localhost only, pairing is required, the filesystem is scoped to the workspace, and all secrets are encrypted at rest.

## Security Layers

| Layer | What It Does |
|-------|-------------|
| Gateway binding | Binds `127.0.0.1` by default. Refuses `0.0.0.0` without a tunnel or explicit `allow_public_bind`. |
| Pairing | 6-digit one-time code exchanged for a bearer token. Required by default. |
| Secret encryption | API keys encrypted with ChaCha20-Poly1305 using a local key file. |
| Sandbox isolation | Landlock, Firejail, Bubblewrap, or Docker. Auto-detected by default. |
| Filesystem scoping | Workspace-only access. Symlink escape and null byte injection blocked. |
| Channel allowlists | Per-channel user allowlists. Empty = deny all. |
| Resource limits | Configurable memory, CPU, disk, and subprocess caps. |
| Audit logging | Signed event trail with configurable retention. |
| Access policy | Centralized policy engine for authorization decisions. |

## Pairing

When `require_pairing` is `true` (the default), NullClaw prints a 6-digit one-time code on startup. Clients must exchange this code for a bearer token before they can use the API.

The handshake:

1. NullClaw starts and prints: `Pairing code: 482917`
2. Client sends: `POST /pair` with header `X-Pairing-Code: 482917`
3. NullClaw returns a bearer token
4. All subsequent requests use: `Authorization: Bearer <token>`

```json
{
  "gateway": {
    "require_pairing": true
  }
}
```

The pairing code is single-use and time-limited. After a successful exchange, the code is invalidated. If pairing is disabled (`require_pairing: false`), the API is open to any client that can reach the gateway -- only appropriate for fully trusted local environments.

## Secret Encryption

NullClaw encrypts sensitive configuration values (API keys, tokens, private keys) using ChaCha20-Poly1305 symmetric authenticated encryption. Encrypted values are stored in the config file with the `enc2:` prefix.

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

The encryption key is stored in a separate local key file with restricted permissions. Secrets are decrypted into memory only when needed and zeroed after use.

When `secrets.encrypt` is `true`:

```json
{
  "secrets": { "encrypt": true }
}
```

Any plaintext `api_key`, `bot_token`, `private_key`, or `password` field is automatically encrypted on the next startup or config write. The `nullclaw onboard` wizard encrypts all secrets during setup.

## Sandbox

The sandbox isolates shell command execution and restricts what processes spawned by the agent can access. NullClaw supports multiple sandbox backends and auto-detects the best available option for the current platform.

| Backend | Platform | Mechanism | Notes |
|---------|----------|-----------|-------|
| Landlock | Linux 5.13+ | LSM (Linux Security Module) | Kernel-level filesystem access control. No root required. Preferred on modern Linux. |
| Firejail | Linux | Seccomp + namespaces | Widely available. Install via package manager. |
| Bubblewrap | Linux | User namespaces | Lightweight. Used by Flatpak. |
| Docker | Linux, macOS | Container isolation | Full process isolation. Heavier weight. |
| Auto | Any | Best available | Tries Landlock, then Firejail, then Bubblewrap, then Docker. |

```json
{
  "security": {
    "sandbox": {
      "backend": "auto"
    }
  }
}
```

Set a specific backend if you want deterministic behavior:

```json
{
  "security": {
    "sandbox": {
      "backend": "landlock"
    }
  }
}
```

When running in Docker runtime mode, the Docker sandbox is used automatically:

```json
{
  "runtime": {
    "kind": "docker",
    "docker": {
      "image": "alpine:3.20",
      "network": "none",
      "memory_limit_mb": 512,
      "read_only_rootfs": true
    }
  }
}
```

## Filesystem Scoping

By default, the agent can only access files within the workspace directory:

```json
{
  "autonomy": {
    "workspace_only": true,
    "allowed_paths": ["/home/user/project"]
  }
}
```

Filesystem scoping enforces several protections:

- **Workspace restriction**: File operations (read, write, edit, append) are confined to the workspace and `allowed_paths`
- **Symlink escape detection**: Symlinks that resolve outside the allowed paths are blocked
- **Null byte injection**: Null bytes in file paths are rejected to prevent path truncation attacks
- **Path traversal**: `../` sequences that escape the workspace are blocked

Setting `"allowed_paths": ["*"]` allows access to all paths except system-protected directories (`/etc/shadow`, `/proc`, etc.).

## Allowlists

Every channel has an `allow_from` field that controls which users can interact with the bot:

| Value | Behavior |
|-------|----------|
| Omitted or `[]` | **Deny all** inbound messages. Locked down by default. |
| `["*"]` | **Allow all** users. Explicit opt-in. |
| `[id1, id2, ...]` | Only listed users can interact. |

```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "...",
          "allow_from": [123456789]
        }
      }
    },
    "discord": {
      "accounts": {
        "main": {
          "token": "...",
          "allow_from": ["user_id_1"],
          "allow_bots": false
        }
      }
    }
  }
}
```

The ID format depends on the channel:

- **Telegram**: Numeric user IDs
- **Discord**: String user IDs, plus `allow_bots` flag
- **Slack**: Slack user IDs (e.g., `U12345678`)
- **Signal**: Phone numbers (e.g., `+1234567890`)
- **IRC**: Nick names
- **Nostr**: Hex public keys. The `owner_pubkey` is always allowed regardless of `dm_allowed_pubkeys`.
- **WhatsApp**: Phone numbers

## Audit Logging

When enabled, NullClaw records a signed event trail of all agent actions, tool executions, and security-relevant events.

```json
{
  "security": {
    "audit": {
      "enabled": true,
      "retention_days": 90
    }
  }
}
```

- `enabled`: Turn audit logging on or off
- `retention_days`: How long to keep audit records before automatic cleanup

The audit log captures:

- Tool invocations (what tool, what arguments, who triggered it)
- Security events (pairing attempts, auth failures, sandbox violations)
- Channel activity (inbound messages, outbound responses, allowlist checks)
- Configuration changes

Events are signed to detect tampering. The audit trail is stored locally and can be reviewed for compliance, debugging, or forensics.

## Resource Limits

Cap the resources the agent can consume:

```json
{
  "security": {
    "resources": {
      "max_memory_mb": 512,
      "max_cpu_percent": 80
    }
  },
  "autonomy": {
    "max_actions_per_hour": 20
  }
}
```

- `max_memory_mb`: Maximum memory usage for spawned processes
- `max_cpu_percent`: CPU usage cap for spawned processes
- `max_actions_per_hour`: Rate limit on tool executions per hour

## Access Policy

The policy engine (`security/policy.zig`) centralizes authorization decisions. It evaluates whether a given action is allowed based on the combination of:

- Autonomy level (`supervised` vs `full`)
- Command allowlists
- Path allowlists
- Rate limits
- Sandbox state

In `supervised` mode, medium-risk actions (writing files, running shell commands, making network requests) require explicit human approval. In `full` mode, the agent acts autonomously within the configured limits.

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

## Network Security

The gateway refuses to bind to `0.0.0.0` (public) unless either:

- An active tunnel is configured (Cloudflare, Tailscale, ngrok, custom), or
- `allow_public_bind` is explicitly set to `true`

This prevents accidental exposure of the API to the internet.

```json
{
  "gateway": {
    "host": "127.0.0.1",
    "allow_public_bind": false
  },
  "tunnel": {
    "provider": "cloudflare"
  }
}
```

With a tunnel, external traffic is routed securely without exposing the gateway port directly.

## Security Checklist

A summary of NullClaw's default security posture:

1. Gateway binds to `127.0.0.1` only
2. Pairing required (6-digit one-time code)
3. Filesystem scoped to workspace (`workspace_only: true`)
4. Public bind refused without tunnel or explicit override
5. Sandbox auto-detected and enabled
6. API keys encrypted with ChaCha20-Poly1305
7. Resource limits enforced (memory, CPU, actions/hour)
8. Audit logging enabled with 90-day retention
9. Channel allowlists deny by default
10. Symlink escape and path traversal blocked

## Further Reading

- [Configuration](/nullclaw/docs/configuration) -- security and autonomy config
- [Channels](/nullclaw/docs/channels) -- per-channel allowlist setup
- [Tools](/nullclaw/docs/tools) -- tool security scope
- [Architecture](/nullclaw/docs/architecture) -- security module design
