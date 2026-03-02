# Quick Start

This page is aligned with current behavior in `build.zig`, `build.zig.zon`, `src/main.zig`, `src/onboard.zig`, `src/config.zig`, and `src/channels/web.zig`.

## Prerequisites

- Zig `0.15.2`
- Git
- Any provider API key (for example OpenRouter/OpenAI/Anthropic)

## Fastest Working Path (CLI Agent)

```bash
git clone https://github.com/nullclaw/nullclaw.git
cd nullclaw
zig build -Doptimize=ReleaseSmall

./zig-out/bin/nullclaw onboard --provider openrouter --api-key <YOUR_API_KEY>
./zig-out/bin/nullclaw agent -m "Hello from nullclaw"
```

## Verify It Works

```bash
./zig-out/bin/nullclaw status
./zig-out/bin/nullclaw doctor
./zig-out/bin/nullclaw capabilities --json
```

If `doctor` passes and `agent` returns text, your base runtime is healthy.

## Add Chat UI (WebChannel)

`nullclaw gateway` alone is not enough for browser pairing. Add `channels.web` to `~/.nullclaw/config.json`.

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

Run runtime:

```bash
./zig-out/bin/nullclaw gateway
```

In Chat UI pairing screen use:

- endpoint: `ws://127.0.0.1:32123/ws`
- PIN (local pairing mode): `123456`

## Common Failure Modes

- `No config found`: run `nullclaw onboard` first.
- Chat UI cannot pair: `channels.web` is missing or disabled at build time.
- Feature configured but unavailable: rebuild with needed feature flags (`-Dchannels=...`, `-Dengines=...`).

## Next Steps

1. [Configuration](/nullclaw/docs/configuration)
2. [Channels](/nullclaw/docs/channels)
3. [Tools](/nullclaw/docs/tools)
4. [Architecture](/nullclaw/docs/architecture)
