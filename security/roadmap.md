# Security Improvement Roadmap

## Current State: Strong Foundation

nullclaw has excellent application-layer and OS-level security:

- Command allowlist (not blocklist)
- Path traversal protection
- Command injection blocking (`$(...)`, backticks, `&&`, `>`)
- Secret isolation (API keys not leaked to shell)
- Rate limiting (configurable actions/hour)
- Channel authorization (empty = deny all, `*` = allow all)
- Risk classification (Low/Medium/High)
- Environment variable sanitization
- Forbidden paths blocking
- OS-level sandboxing (Landlock, Firejail, Bubblewrap, Docker)
- Resource limits (memory, CPU, disk)
- Audit logging with HMAC signatures
- Encrypted secrets (ChaCha20-Poly1305)
- 1,639 tests

## Comparison Matrix

| Feature | PicoClaw | ZeroClaw | **nullclaw** |
|---------|----------|----------|--------------|
| **Binary Size** | ~8 MB | 3.4 MB | **639 KB** |
| **RAM Usage** | < 10 MB | < 5 MB | **~1 MB** |
| **Startup Time** | < 1 s | < 10 ms | **< 2 ms** |
| **Command Allowlist** | Unknown | Yes | **Yes** |
| **Path Blocking** | Unknown | Yes | **Yes** |
| **Injection Protection** | Unknown | Yes | **Yes** |
| **OS Sandbox** | No | No | **Yes (4 backends)** |
| **Resource Limits** | No | No | **Yes** |
| **Audit Logging** | No | No | **Yes (HMAC-signed)** |
| **Encrypted Secrets** | No | No | **Yes (ChaCha20)** |
| **Tests** | — | 1,017 | **1,639** |

## Roadmap

### Phase 1: Hardening (Near-Term)

| Task | Status | Impact |
|------|--------|--------|
| seccomp syscall filtering (Linux) | Planned | High |
| Certificate pinning for channels | Planned | Medium |
| Signed config verification | Planned | Medium |
| SIEM-compatible audit export | Planned | Medium |
| Security self-test (`nullclaw audit --check`) | Planned | Low |

### Phase 2: Enterprise Features (Future)

| Task | Status | Impact |
|------|--------|--------|
| mTLS for gateway | Planned | High |
| RBAC (role-based access control) | Planned | High |
| Multi-tenant isolation | Planned | Medium |
| Compliance reporting | Planned | Medium |

## Security Is Agnostic

All security features are implemented as vtable interfaces — swappable like providers and channels:

```zig
// Swap security backends via config
{
  "security": {
    "sandbox": { "backend": "auto" }     // or "landlock", "firejail", etc.
  }
}
```

Security features add negligible overhead:

| Feature | Binary Impact | RAM Overhead |
|---------|--------------|--------------|
| Sandbox detection | ~5 KB | ~10 KB |
| Resource monitoring | ~3 KB | ~5 KB |
| Audit logging | ~4 KB | ~20 KB (buffered) |
| **Total** | **~12 KB** | **~35 KB** |

Even with full security, nullclaw uses <0.5% of RAM on $5 hardware.

## CLI Preview

```bash
# Security status
nullclaw doctor
# → Sandbox: Landlock active
# → Audit logging: enabled (42 events today)
# → Resource limits: 512 MB mem, 80% CPU

# Audit queries
nullclaw audit --user @alice --since 24h
nullclaw audit --risk high --violations-only
nullclaw audit --verify-signatures
```
