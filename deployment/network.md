# Network Deployment

Deploying nullclaw on a Raspberry Pi, local network, or remote server.

## Overview

| Mode | Inbound port needed? | Use case |
|------|----------------------|----------|
| **Telegram polling** | No | nullclaw polls Telegram API; works from anywhere |
| **Discord/Slack** | No | Outbound only (long-polling / WebSocket) |
| **Gateway webhook** | Yes | POST /webhook, WhatsApp, etc. need a public URL |
| **Gateway pairing** | Yes | Client pairing via the gateway |

**Key:** Telegram, Discord, and Slack use **outbound connections** — nullclaw makes requests to their APIs. No port forwarding or public IP required.

## nullclaw on Raspberry Pi

### Prerequisites

- Raspberry Pi (3/4/5) with Raspberry Pi OS
- Zig 0.15+ (cross-compile from host or build on device)
- USB peripherals (Arduino, Nucleo) if using serial transport
- Optional: native GPIO via sysfs

### Build

```bash
# Build on the Pi (or cross-compile from host)
zig build -Doptimize=ReleaseSmall
# → 639 KB binary, runs on any ARM Linux
```

### Configure

Edit `~/.nullclaw/config.json`:

```json
{
  "default_provider": "openrouter",
  "api_key": "sk-...",

  "gateway": {
    "port": 3000,
    "require_pairing": true,
    "allow_public_bind": false
  },

  "telegram": {
    "bot_token": "YOUR_BOT_TOKEN",
    "allowed_users": ["*"]
  }
}
```

### Run (Local Only)

```bash
nullclaw daemon
```

- Gateway binds to `127.0.0.1` — not reachable from other machines
- Telegram channel works: nullclaw polls Telegram API (outbound)
- No firewall or port forwarding needed

## Binding to 0.0.0.0 (LAN Access)

To allow other devices on your LAN to reach the gateway:

### Option A: Explicit Opt-In

```json
{
  "gateway": {
    "host": "0.0.0.0",
    "port": 3000,
    "allow_public_bind": true
  }
}
```

**Security:** `allow_public_bind: true` exposes the gateway to your local network. Only use on trusted LANs.

### Option B: Tunnel (Recommended for Webhooks)

If you need a **public URL** (e.g. WhatsApp webhook, external clients):

1. Run gateway on localhost (default)
2. Configure a tunnel:

```json
{
  "tunnel": {
    "provider": "tailscale"
  }
}
```

nullclaw will refuse `0.0.0.0` unless `allow_public_bind` is true or a tunnel is active.

## Tunnel Options

| Provider | Setup | Use Case |
|----------|-------|----------|
| **Tailscale** | `"provider": "tailscale"` | Private mesh network, `*.ts.net` URLs |
| **ngrok** | `"provider": "ngrok"` | Quick public URL for testing |
| **Cloudflare** | `"provider": "cloudflare"` | Production tunnels with custom domains |
| **Custom** | `"provider": "custom"`, `"command": "..."` | Any tunnel binary |

## Telegram (No Inbound Port)

Telegram uses **long-polling** by default:

- nullclaw calls `https://api.telegram.org/bot{token}/getUpdates`
- No inbound port or public IP needed
- Works behind NAT, on RPi, in a home lab

```json
{
  "telegram": {
    "bot_token": "YOUR_BOT_TOKEN",
    "allowed_users": ["*"]
  }
}
```

Run `nullclaw daemon` — Telegram channel starts automatically.

## Webhook Channels (WhatsApp, Custom)

Webhook-based channels need a **public URL** so Meta (WhatsApp) or your client can POST events.

### Tailscale Funnel

Tailscale Funnel exposes your gateway via a `*.ts.net` URL. No port forwarding.

### ngrok

```bash
ngrok http 3000
# Use the HTTPS URL for your webhook
```

### Cloudflare Tunnel

Configure Cloudflare Tunnel to forward to `127.0.0.1:3000`, then set your webhook URL to the tunnel's public hostname.

## RPi Deployment Checklist

- [ ] Build with `zig build -Doptimize=ReleaseSmall`
- [ ] Configure channels and provider in `~/.nullclaw/config.json`
- [ ] Run `nullclaw daemon` (Telegram works without `0.0.0.0`)
- [ ] For LAN access: set `allow_public_bind: true`
- [ ] For webhooks: configure Tailscale, ngrok, or Cloudflare tunnel
- [ ] Optional: `nullclaw service install` for systemd management
