---
title: nullclaw — Tiny AI Assistant
description: nullclaw (Null Claw, NullClaw) — the smallest fully autonomous AI assistant. 1 MB binary, zero dependencies, written in Zig.
keywords: nullclaw, null claw, NullClaw, AI assistant, Zig, OpenClaw, lightweight AI, autonomous agent
---

**The smallest fully autonomous AI assistant.**

1 MB binary · Zero dependencies · Written in Zig

[**GitHub Repository**](https://github.com/nullclaw/nullclaw){: .btn}

---

## What is nullclaw?

nullclaw (also written as *Null Claw* or *NullClaw*) is a lightweight autonomous AI assistant — part of the [OpenClaw](https://github.com/openclaw) family alongside ZeroClaw, NanoClaw and others.

Built from scratch in [Zig](https://ziglang.org), it runs on anything from a Raspberry Pi to a cloud VM with no runtime dependencies.

## Quick Start

```bash
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall

./zig-out/bin/nullclaw onboard --interactive
./zig-out/bin/nullclaw agent -m "Hello!"
```

## Stats

| | |
|---|---|
| Binary | ~1 MB (ReleaseSmall) |
| Peak RAM | ~27 MB under full test load |
| Startup | < 2 ms |
| Tests | 2,775 |
| Providers | 22+ (OpenAI, Anthropic, Ollama, Gemini …) |
| Channels | 13 (Telegram, Discord, Slack, WhatsApp …) |
| Dependencies | 0 (besides libc + optional SQLite) |
| Language | Zig 0.15 |

## Links

- [GitHub](https://github.com/nullclaw/nullclaw)
- [Architecture](architecture.md)
- [Security](security/overview.md)
- [Deployment](deployment/network.md)
