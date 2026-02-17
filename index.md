# nullclaw Documentation

**Null overhead. Null compromise. 100% Zig. 100% Agnostic.**

nullclaw is the smallest fully autonomous AI assistant infrastructure — a complete Zig rewrite of [ZeroClaw](https://github.com/zeroclaw-labs/zeroclaw), delivering a 639 KB binary with ~1 MB peak RAM.

## Quick Links

### Architecture
- [Architecture Overview](architecture.md) — vtable design, module layout, allocation patterns

### Security
- [Security Overview](security/overview.md) — defense-in-depth summary
- [Sandboxing](security/sandboxing.md) — Landlock, Firejail, Bubblewrap, Docker
- [Audit Logging](security/audit-logging.md) — tamper-evident event trail
- [Resource Limits](security/resource-limits.md) — CPU, memory, disk enforcement
- [Security Roadmap](security/roadmap.md) — improvement phases

### Deployment
- [Network Deployment](deployment/network.md) — Raspberry Pi, tunnels, webhook channels

### Contributing
- [PR Workflow](contributing/pr-workflow.md) — pull request governance
- [Reviewer Playbook](contributing/reviewer-playbook.md) — review execution guide
- [CI Map](contributing/ci-map.md) — GitHub Actions workflow map

## Getting Started

```bash
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall

nullclaw onboard --interactive
nullclaw agent -m "Hello, nullclaw!"
```

## Project Stats

```
Language:     Zig 0.15
Binary:       639 KB (ReleaseSmall)
Peak RSS:     ~1 MB
Startup:      <2 ms (Apple Silicon)
Tests:        1,639
Providers:    22+
Channels:     11
Dependencies: 0 (besides libc + optional SQLite)
```

## Links

- [GitHub Repository](https://github.com/nullclaw/nullclaw)
- [README](../README.md)
- [LICENSE](../LICENSE)
