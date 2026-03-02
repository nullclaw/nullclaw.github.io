# Quick Start

This page is aligned with current runtime behavior in `build.zig`, `src/main.zig`, `src/onboard.zig`, `src/config.zig`, and `src/channels/web.zig`.

## Prerequisites

- Zig **0.15.2**
- Git
- Provider API key (for example OpenRouter/OpenAI/Anthropic)

## Core Bot In Two Commands

After building once, the fastest working flow is:

```bash
./zig-out/bin/nullclaw onboard --provider openrouter --api-key <YOUR_API_KEY>
./zig-out/bin/nullclaw agent -m "Hello from nullclaw"
```

Build command (first time only):

```bash
zig build -Doptimize=ReleaseSmall
```

## Core Runtime + Chat UI (Working Flow)

`nullclaw gateway` alone is not enough for Chat UI. You also need a configured `channels.web` account.

### 1. Initialize config

```bash
./zig-out/bin/nullclaw onboard --provider openrouter --api-key <YOUR_API_KEY>
```

### 2. Add `channels.web` to `~/.nullclaw/config.json`

Add this under `channels`:

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

### 3. Start runtime

```bash
./zig-out/bin/nullclaw gateway
```

### 4. Start Chat UI (`nullclaw-chat-ui` repo)

```bash
npm install
npm run dev
```

### 5. Pair in browser

- URL: `ws://127.0.0.1:32123/ws`
- Pairing PIN (local pairing mode): `123456`

## Important Notes

- `onboard --interactive` and `onboard --channels-only` do not currently configure `channels.web`.
- Use `nullclaw gateway` for full runtime processing. `channel start` is not a substitute for full runtime orchestration.
- If you built without web channel support, rebuild with `-Dchannels=all` or include `web` in `-Dchannels=...`.

## Next Steps

- [Architecture](/nullclaw/docs/architecture)
- [Configuration](/nullclaw/docs/configuration)
- [Channels](/nullclaw/docs/channels)
- [CLI](/nullclaw/docs/cli)
