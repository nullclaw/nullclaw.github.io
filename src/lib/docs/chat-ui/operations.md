# Operations

Chat UI is a static web app and depends on an external NullClaw `channels.web` websocket endpoint.

## Build Pipeline

```bash
npm ci
npm run test
npm run check
npm run build
```

Output directory: `build/`

## Deployment Model

- static hosting is enough
- enable SPA fallback to `index.html`
- runtime websocket endpoint is entered by operator during pairing

## Runtime Contract

Expected local endpoint values:

- `ws://127.0.0.1:32123/ws`
- local pairing PIN: `123456`

Typical local two-terminal flow:

```bash
# terminal 1 (nullclaw)
./zig-out/bin/nullclaw gateway

# terminal 2 (chat-ui)
npm run dev
```

## Client-Side Stored Keys

- `nullclaw_ui_auth_v1`
- `nullclaw_ui_theme`
- `nullclaw_ui_effects`

Auth storage enforces expiry and removes invalid payloads.

## Troubleshooting Checklist

- `channels.web` absent or misconfigured in NullClaw
- wrong websocket URL (scheme/host/port/path)
- runtime not reachable from browser host
- `unauthorized` protocol errors
- missing SPA fallback in production host config
