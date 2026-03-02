# Quick Start

This flow is validated against current `nullclaw-chat-ui` and `nullclaw` source behavior.

## 1. Start NullClaw Runtime (Core Repo)

```bash
zig build -Doptimize=ReleaseSmall
./zig-out/bin/nullclaw onboard --provider openrouter --api-key <YOUR_API_KEY>
```

Add `channels.web` to `~/.nullclaw/config.json`:

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

Start runtime:

```bash
./zig-out/bin/nullclaw gateway
```

## 2. Start Chat UI (UI Repo)

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## 3. Pair

In the UI pairing screen, enter:

- Endpoint: `ws://127.0.0.1:32123/ws`
- PIN: `123456`

## Notes

- UI endpoint is user-entered (default value in `PairingScreen.svelte` is `ws://127.0.0.1:32123/ws`).
- Pairing requires an active `channels.web` listener.
- Local `channels.web` pairing mode currently uses fixed PIN `123456`.
