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

nullclaw (also written as *Null Claw* or *NullClaw*) is a lightweight autonomous AI assistant — part of the [OpenClaw](https://github.com/openclaw) family (formerly MoltBot → ClawdBot) alongside ZeroClaw, PicoClaw, nanobot and others.

Built from scratch in [Zig](https://ziglang.org), it runs on anything from a Raspberry Pi to a cloud VM with no runtime dependencies.

## Quick Start

```bash
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall

./zig-out/bin/nullclaw onboard   # interactive setup wizard
./zig-out/bin/nullclaw agent -m "Hello!"
```

See the [Getting Started guide](getting-started.md) for a full walkthrough.

## Stats

| | |
|---|---|
| Binary | ~1 MB (ReleaseSmall) |
| Peak RAM | ~27 MB under full test load |
| Startup | < 2 ms |
| Tests | 3,371 |
| Providers | 50+ (9 core + 41 compatible services) |
| Channels | 17 (Telegram, Discord, Slack, WhatsApp …) |
| Tools | 30+ built-in |
| Dependencies | 0 (besides libc + optional SQLite) |
| Language | Zig 0.15 |

## Feature Highlights

- **50+ providers** — OpenRouter, OpenAI, Anthropic, Gemini, Ollama, Groq, Mistral, DeepSeek, xAI + 41 compatible services
- **17 channels** — Telegram, Discord, Slack, WhatsApp, Matrix, Signal, iMessage, IRC, Email, Mattermost, LINE, Lark/Feishu, DingTalk, QQ, OneBot, MaixCam
- **Cross-channel model switching** — route different models to different conversations via hints
- **Multi-account channels** — run multiple bot accounts per platform
- **Reliability chain** — automatic retries, provider fallback, API key rotation, model fallback
- **30+ tools** — file ops, shell, git, web, memory, scheduling, delegation, hardware, integrations

## Links

- [GitHub](https://github.com/nullclaw/nullclaw)
- [Getting Started](getting-started.md)
- [Configuration](configuration.md)
- [Providers](providers.md)
- [Channels](channels.md)
- [Tools](tools.md)
- [CLI Reference](cli.md)
- [Architecture](architecture.md)
- [Security](security/overview.md)
- [Deployment](deployment/network.md)
