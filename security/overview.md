# Security Overview

nullclaw enforces security at every layer with defense-in-depth: no single bypass grants full access.

## Security Layers

| # | Layer | Status | How |
|---|-------|--------|-----|
| 1 | **Gateway not publicly exposed** | Done | Binds `127.0.0.1` by default. Refuses `0.0.0.0` without tunnel or explicit `allow_public_bind`. |
| 2 | **Pairing required** | Done | 6-digit one-time code on startup. Exchange via `POST /pair` for bearer token. |
| 3 | **Filesystem scoped** | Done | `workspace_only = true` by default. Null byte injection blocked. Symlink escape detection. |
| 4 | **Access via tunnel only** | Done | Gateway refuses public bind without active tunnel. Supports Tailscale, Cloudflare, ngrok, or custom. |
| 5 | **Sandbox isolation** | Done | Auto-detects best backend: Landlock, Firejail, Bubblewrap, or Docker. |
| 6 | **Encrypted secrets** | Done | API keys encrypted with ChaCha20-Poly1305 using local key file. |
| 7 | **Resource limits** | Done | Configurable memory, CPU, disk, and subprocess limits. |
| 8 | **Audit logging** | Done | Signed event trail with configurable retention. |

## Channel Allowlists

- Empty allowlist = **deny all inbound messages**
- `"*"` = **allow all** (explicit opt-in)
- Otherwise = exact-match allowlist

## Autonomy Levels

| Level | Description |
|-------|-------------|
| `readonly` | Inspection and low-risk tasks only. No writes, no shell. |
| `supervised` | Human oversight on medium/high-risk actions. Default. |
| `full` | Broader autonomous execution for approved workflows. |

## Security Architecture (Zig)

nullclaw's security is implemented as vtable interfaces — swappable like everything else:

```zig
pub const Sandbox = struct {
    ptr: *anyopaque,
    vtable: *const VTable,

    pub const VTable = struct {
        wrapCommand: *const fn (ptr: *anyopaque, ...) anyerror!void,
        isAvailable: *const fn (ptr: *anyopaque) bool,
        name: *const fn (ptr: *anyopaque) []const u8,
    };
};
```

Implementations: `LandlockSandbox`, `FirejailSandbox`, `BubblewrapSandbox`, `DockerSandbox`.

Auto-detection tries them in order and falls back to application-layer security (allowlists, path blocking, injection protection) if no OS-level sandbox is available.

## Configuration

```json
{
  "security": {
    "sandbox": { "backend": "auto" },
    "resources": { "max_memory_mb": 512, "max_cpu_percent": 80 },
    "audit": { "enabled": true, "retention_days": 90 }
  },
  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 20
  }
}
```

## Related Docs

- [Sandboxing](sandboxing.md) — OS-level containment strategies
- [Audit Logging](audit-logging.md) — tamper-evident event trail
- [Resource Limits](resource-limits.md) — CPU, memory, disk enforcement
- [Security Roadmap](roadmap.md) — improvement phases
