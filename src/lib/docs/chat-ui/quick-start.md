# Quick Start

This flow is validated against current `nullclaw-chat-ui` and `nullclaw` source behavior.

## Prerequisites

- Node.js 20+
- npm 10+
- running NullClaw runtime with working provider config

## 1. Start NullClaw Runtime

```bash
# in nullclaw repo
zig build -Doptimize=ReleaseSmall
./zig-out/bin/nullclaw onboard --provider openrouter --api-key <YOUR_API_KEY>
```

Ensure `channels.web` exists in `~/.nullclaw/config.json`:

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

## 2. Start Chat UI

```bash
git clone https://github.com/nullclaw/nullclaw-chat-ui.git
cd nullclaw-chat-ui
npm install
npm run dev
```

Open `http://localhost:5173`.

## 3. Pair

In pairing screen:

- endpoint: `ws://127.0.0.1:32123/ws`
- PIN: `123456`

## Verify It Works

- connection state moves `connecting -> pairing -> paired`
- sending a message produces streamed timeline entries
- reconnect keeps session if token is still valid

## Common Failure Modes

- `channels.web` not configured in NullClaw
- wrong endpoint scheme/host/port/path
- runtime unavailable on configured endpoint
- token invalid/expired (`unauthorized` event)
