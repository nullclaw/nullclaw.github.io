# Channels

Channel metadata is defined in `src/channel_catalog.zig`.

## Known Channel Keys

- `cli`
- `telegram`
- `discord`
- `slack`
- `webhook`
- `imessage`
- `matrix`
- `mattermost`
- `whatsapp`
- `irc`
- `lark`
- `dingtalk`
- `signal`
- `email`
- `line`
- `qq`
- `onebot`
- `maixcam`
- `nostr`
- `web`

## Runtime Behavior

- `nullclaw channel start <channel>` starts a single channel path.
- `nullclaw channel start --all` is intentionally rejected.
- Use `nullclaw gateway` to run full runtime orchestration.

## Lifecycle Modes

Catalog listener modes:

- `none`
- `polling`
- `gateway_loop`
- `webhook_only`
- `send_only`

Mode controls daemon supervision and start behavior.

## Web Channel For Chat UI

Chat UI depends on `channels.web` (not just gateway HTTP port).

Minimal working local config:

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

Implementation details from `src/config_types.zig` + `src/channels/web.zig`:

- defaults: `transport=local`, `path=/ws`, `message_auth_mode=pairing`
- local pairing code is fixed to `123456`
- if you bind to non-loopback (`0.0.0.0`), websocket upgrade token is required
- `message_auth_mode=token` is only valid for local transport

## Build Gating

Channel support is compile-time controlled by `-Dchannels=...` in `build.zig`.

If a channel is configured but disabled in the binary, runtime prints rebuild hints.
