# Operations

This project builds as a static app and depends on an external NullClaw `channels.web` endpoint.

## Production Build

```bash
npm ci
npm run test
npm run check
npm run build
```

Output directory: `build/`

## Deployment Model

- static hosting is sufficient
- configure SPA fallback to `index.html`
- runtime endpoint is entered by user at pairing time

## Runtime Dependency Contract

Chat UI expects reachable WebSocket endpoint matching `channels.web` config in NullClaw.

Typical local values:

- endpoint: `ws://127.0.0.1:32123/ws`
- local pairing PIN (`message_auth_mode=pairing`): `123456`

Typical local flow:

```bash
# in nullclaw repo
./zig-out/bin/nullclaw gateway

# in nullclaw-ui repo
npm run dev
```

## Stored Client Data

- `nullclaw_ui_auth_v1`
- `nullclaw_ui_theme`
- `nullclaw_ui_effects`

`auth-storage` enforces expiry and drops invalid payloads.

## Troubleshooting Checklist

- `channels.web` not configured in core runtime
- wrong `ws://` / `wss://` endpoint
- runtime not running or endpoint unreachable
- token rejected (`unauthorized` event)
- missing SPA fallback in host config
