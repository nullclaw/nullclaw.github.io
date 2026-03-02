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

## Start Behavior

- `nullclaw channel start <channel>` starts a single channel path.
- `nullclaw channel start --all` is intentionally rejected.
- `nullclaw gateway` is the correct command for full runtime orchestration.

## WebChannel For Chat UI

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

Code-derived behavior (`src/config_types.zig`, `src/channels/web.zig`):

- defaults: `transport=local`, `path=/ws`, `message_auth_mode=pairing`
- local pairing PIN is fixed to `123456`
- non-loopback bind requires upgrade token
- `message_auth_mode=token` is valid only for local transport

## Build Gating

Channel support is compile-time controlled by `-Dchannels=...` in `build.zig`.

If config contains disabled channels, runtime emits rebuild hints.
