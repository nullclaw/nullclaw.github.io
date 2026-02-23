---
title: Channels
description: Channel setup and configuration for nullclaw
---

# Channels

nullclaw supports 17 messaging platforms. Each channel is a vtable implementation of the `Channel` interface — swap or stack them via config without code changes.

## Multi-Account Support

All channels except CLI support running multiple accounts simultaneously. Use the `accounts` object to define named accounts:

```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": { "bot_token": "123:ABC" },
        "secondary": { "bot_token": "456:DEF" }
      }
    }
  }
}
```

Single-account shorthand is also supported — just put the config fields directly:

```json
{
  "channels": {
    "telegram": { "bot_token": "123:ABC" }
  }
}
```

**Account priority:** when resolving the default account, nullclaw checks `account_id="default"` first, then `"main"`, then falls back to the first entry.

---

## 1. CLI

Built-in REPL. Always available, no setup required.

The CLI channel starts an interactive prompt in your terminal. It is the default channel when no others are configured.

**Config:**

```json
{
  "channels": {
    "cli": true
  }
}
```

No required or optional fields. Set `true` to enable, `false` to disable (useful when running in daemon mode with other channels).

---

## 2. Telegram

Long-polling bot via the Telegram Bot API. Supports private chats, groups, and voice transcription.

**Connection:** Long-polling (`getUpdates`) by default. Can also receive updates via gateway webhook at `/telegram`.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `bot_token` | Yes | — | Bot token from @BotFather |
| `allow_from` | No | — | Array of allowed usernames |
| `group_allow_from` | No | — | Array of allowed usernames in groups |
| `group_policy` | No | `"allowlist"` | Group message policy |
| `reply_in_private` | No | `true` | Reply in DM instead of group |
| `proxy` | No | — | SOCKS5 or HTTP proxy URL |

**Setup:**

1. Open Telegram and message [@BotFather](https://t.me/BotFather).
2. Send `/newbot`, follow the prompts to create your bot.
3. Copy the bot token into your config.
4. Optionally restrict access with `allow_from`.

**Config example:**

```json
{
  "channels": {
    "telegram": {
      "bot_token": "123456789:ABCdef-ghIJKLmnopQRSTuvwxyz",
      "allow_from": ["myusername"],
      "group_policy": "allowlist",
      "reply_in_private": true
    }
  }
}
```

**Notes:** Voice messages are automatically transcribed if a provider with audio support is configured. No inbound port is needed for long-polling mode.

---

## 3. Discord

WebSocket gateway bot with full message content intent support.

**Connection:** WebSocket gateway (`wss://gateway.discord.gg`). Outbound only — no inbound port needed.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `token` | Yes | — | Bot token from Discord Developer Portal |
| `guild_id` | No | — | Restrict to a specific server |
| `allow_bots` | No | `false` | Whether to respond to other bots |
| `allow_from` | No | — | Array of allowed user IDs or names |
| `require_mention` | No | `false` | Only respond when @mentioned |
| `intents` | No | `37377` | Gateway intents bitmask |

**Setup:**

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications) and create a new application.
2. Navigate to **Bot** and click **Add Bot**.
3. Under **Privileged Gateway Intents**, enable **MESSAGE CONTENT INTENT**.
4. Copy the bot token into your config.
5. Use the OAuth2 URL generator to invite the bot to your server with the `bot` scope and `Send Messages` + `Read Message History` permissions.

**Config example:**

```json
{
  "channels": {
    "discord": {
      "token": "MTIzNDU2Nzg5.ABCDEF.ghijklmnop",
      "guild_id": "1234567890",
      "require_mention": true,
      "allow_bots": false
    }
  }
}
```

**Notes:** The default intents value `37377` covers guilds, guild messages, message content, and direct messages. Adjust if you need additional intents.

---

## 4. Slack

Socket Mode (WebSocket) or HTTP Events API bot.

**Connection:** Socket Mode uses a WebSocket connection (outbound only, no port needed). HTTP mode receives events at the configurable webhook path.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `bot_token` | Yes | — | Bot token (`xoxb-...`) |
| `mode` | No | `"socket"` | `"socket"` or `"http"` |
| `app_token` | No | — | App-level token for socket mode (`xapp-...`) |
| `signing_secret` | No | — | Signing secret for HTTP mode verification |
| `webhook_path` | No | `"/slack/events"` | HTTP endpoint path |
| `channel_id` | No | — | Restrict to a specific channel |
| `allow_from` | No | — | Array of allowed user IDs |
| `dm_policy` | No | `"pairing"` | DM handling policy |
| `group_policy` | No | `"mention_only"` | Group message policy |

**Setup:**

1. Create a new Slack app at [api.slack.com/apps](https://api.slack.com/apps).
2. Add bot token scopes: `chat:write`, `im:read`, `im:history`, `channels:read`, `channels:history`, `app_mentions:read`.
3. For Socket Mode: enable it under **Socket Mode**, generate an app-level token with `connections:write` scope.
4. For HTTP mode: set your **Request URL** to `https://your-domain/slack/events` and copy the signing secret.
5. Install the app to your workspace.

**Config example (Socket Mode):**

```json
{
  "channels": {
    "slack": {
      "bot_token": "xoxb-1234567890-abcdefghij",
      "mode": "socket",
      "app_token": "xapp-1-A0123456789-1234567890123-abc123",
      "group_policy": "mention_only"
    }
  }
}
```

**Config example (HTTP mode):**

```json
{
  "channels": {
    "slack": {
      "bot_token": "xoxb-1234567890-abcdefghij",
      "mode": "http",
      "signing_secret": "abc123def456",
      "webhook_path": "/slack/events"
    }
  }
}
```

---

## 5. WhatsApp

WhatsApp Business API via Meta's Cloud API.

**Connection:** Webhook (push) at `/whatsapp`. Requires a public URL for Meta to deliver events.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `access_token` | Yes | — | Permanent access token from Meta |
| `phone_number_id` | Yes | — | WhatsApp phone number ID |
| `verify_token` | Yes | — | Webhook verification token (you define it) |
| `app_secret` | No | — | App secret for HMAC payload verification |
| `allow_from` | No | — | Array of allowed phone numbers |
| `group_allow_from` | No | — | Array of allowed senders in groups |
| `groups` | No | — | Array of allowed group IDs |
| `group_policy` | No | `"allowlist"` | Group message policy |

**Setup:**

1. Create a Meta developer account at [developers.facebook.com](https://developers.facebook.com).
2. Create an app and add the **WhatsApp** product.
3. Under **WhatsApp > API Setup**, note your phone number ID and generate a permanent access token.
4. Configure the webhook URL to `https://your-domain/whatsapp` and set your verify token.
5. Subscribe to the `messages` webhook field.

**Config example:**

```json
{
  "channels": {
    "whatsapp": {
      "access_token": "EAABs...",
      "phone_number_id": "123456789012345",
      "verify_token": "my-secret-verify-token",
      "app_secret": "abcdef1234567890",
      "allow_from": ["+15551234567"]
    }
  }
}
```

**Notes:** WhatsApp requires a publicly reachable HTTPS endpoint. Use a tunnel (Tailscale, ngrok, Cloudflare) if running behind NAT. See [Network Deployment](deployment/network.md) for tunnel setup.

---

## 6. Matrix

Connects to any Matrix homeserver via the Client-Server API.

**Connection:** Long-polling via `/_matrix/client/v3/sync`. Outbound only — no inbound port needed.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `homeserver` | Yes | — | Homeserver URL (e.g. `https://matrix.org`) |
| `access_token` | Yes | — | Bot user's access token |
| `room_id` | Yes | — | Room to listen in (e.g. `!abc:matrix.org`) |
| `user_id` | No | — | Bot's full Matrix user ID |
| `allow_from` | No | — | Array of allowed Matrix user IDs |
| `group_allow_from` | No | — | Array of allowed senders in rooms |
| `group_policy` | No | `"allowlist"` | Room message policy |

**Setup:**

1. Register a bot account on your homeserver (Synapse, Dendrite, Conduit, or any spec-compliant server).
2. Log in and obtain an access token (e.g. via `/_matrix/client/v3/login`).
3. Invite the bot to the target room and accept the invite.
4. Copy the room ID and access token into your config.

**Config example:**

```json
{
  "channels": {
    "matrix": {
      "homeserver": "https://matrix.example.com",
      "access_token": "syt_abc123_def456",
      "room_id": "!abcdef:matrix.example.com",
      "user_id": "@nullclaw:matrix.example.com",
      "allow_from": ["@alice:matrix.example.com"]
    }
  }
}
```

**Notes:** Works with any Matrix homeserver implementation including Synapse, Dendrite, and Conduit.

---

## 7. Signal

Connects to [signal-cli](https://github.com/AsamK/signal-cli) running in daemon mode.

**Connection:** SSE (Server-Sent Events) at `/api/v1/events` for receiving messages. JSON-RPC over HTTP for sending.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `http_url` | Yes | — | signal-cli HTTP daemon URL |
| `account` | Yes | — | Phone number in E.164 format (e.g. `+15551234567`) |
| `allow_from` | No | — | Array of allowed phone numbers |
| `group_allow_from` | No | — | Array of allowed senders in groups |
| `group_policy` | No | `"allowlist"` | Group message policy |
| `ignore_attachments` | No | `false` | Skip processing attachments |
| `ignore_stories` | No | `false` | Ignore story updates |

**Environment variable overrides:** `SIGNAL_HTTP_URL`, `SIGNAL_ACCOUNT`

**Setup:**

1. Install signal-cli: `brew install signal-cli` (macOS) or from [GitHub releases](https://github.com/AsamK/signal-cli/releases).
2. Register or link an account: `signal-cli -a +15551234567 register` or `signal-cli link`.
3. Start the daemon: `signal-cli --account +15551234567 daemon --http 127.0.0.1:8080`
4. Configure nullclaw to connect to the daemon.

**Config example:**

```json
{
  "channels": {
    "signal": {
      "http_url": "http://127.0.0.1:8080",
      "account": "+15551234567",
      "allow_from": ["+15559876543"],
      "group_policy": "allowlist"
    }
  }
}
```

**Notes:** signal-cli must be running as a daemon before starting nullclaw. The SSE connection is outbound only — no inbound port needed.

---

## 8. iMessage

Reads from the iMessage database and sends via AppleScript. macOS only.

**Connection:** SQLite polling (reads `chat.db` every 3 seconds). AppleScript for sending messages.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `enabled` | No | `false` | Must be explicitly enabled |
| `allow_from` | No | — | Array of allowed phone numbers or emails |
| `group_allow_from` | No | — | Array of allowed senders in groups |
| `group_policy` | No | `"allowlist"` | Group message policy |
| `db_path` | No | — | Custom path to `chat.db` |

**Environment variable override:** `IMESSAGE_CHAT_DB_PATH`

**Setup:**

1. Grant **Full Disk Access** to your terminal (System Settings > Privacy & Security > Full Disk Access).
2. Enable the channel in config with `"enabled": true`.
3. nullclaw will read from `~/Library/Messages/chat.db` by default.

**Config example:**

```json
{
  "channels": {
    "imessage": {
      "enabled": true,
      "allow_from": ["+15551234567", "alice@example.com"],
      "group_policy": "allowlist"
    }
  }
}
```

**Notes:** macOS only. Requires Full Disk Access because `chat.db` is protected by TCC. The channel is disabled by default and must be explicitly enabled.

---

## 9. IRC

Classic IRC client with TLS, NickServ, and SASL support.

**Connection:** TLS socket (outbound). Communicates via PRIVMSG.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `host` | Yes | — | IRC server hostname |
| `nick` | Yes | — | Bot's nickname |
| `port` | No | `6697` | Server port |
| `username` | No | — | IRC username (ident) |
| `channels` | No | — | Array of channels to join (e.g. `["#general"]`) |
| `allow_from` | No | — | Array of allowed nicknames |
| `server_password` | No | — | Server connection password |
| `nickserv_password` | No | — | NickServ identification password |
| `sasl_password` | No | — | SASL PLAIN password |
| `tls` | No | `true` | Enable TLS |

**Setup:**

1. Choose your IRC network and server.
2. Register a nickname if using NickServ or SASL.
3. Configure nullclaw with the server, nick, and channels.

**Three authentication methods:**

- **Server password:** Sent on connect. Used by some bouncers (ZNC) and networks.
- **NickServ:** Sends `IDENTIFY <password>` after registration.
- **SASL PLAIN:** Authenticates during connection (before joining channels). Most secure.

**Config example:**

```json
{
  "channels": {
    "irc": {
      "host": "irc.libera.chat",
      "nick": "nullclaw",
      "port": 6697,
      "tls": true,
      "channels": ["#mychannel"],
      "sasl_password": "hunter2",
      "allow_from": ["alice", "bob"]
    }
  }
}
```

---

## 10. Email

IMAP polling for incoming mail, SMTP for sending replies.

**Connection:** IMAP (polling at configurable interval), SMTP for outbound.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `imap_host` | No | — | IMAP server hostname |
| `smtp_host` | No | — | SMTP server hostname |
| `imap_port` | No | `993` | IMAP port (TLS) |
| `smtp_port` | No | `587` | SMTP port (STARTTLS) |
| `imap_folder` | No | `"INBOX"` | IMAP folder to poll |
| `smtp_tls` | No | `true` | Enable TLS for SMTP |
| `username` | No | — | Email account username |
| `password` | No | — | Email account password |
| `from_address` | No | — | Sender address for replies |
| `poll_interval_secs` | No | `60` | How often to check for new mail (seconds) |
| `allow_from` | No | — | Array of allowed sender addresses |
| `consent_granted` | No | `true` | Acknowledge email access consent |

**Setup:**

1. Enable IMAP access on your email account.
2. Generate an app-specific password if using Gmail, Outlook, etc.
3. Configure IMAP and SMTP server details.

**Config example:**

```json
{
  "channels": {
    "email": {
      "imap_host": "imap.gmail.com",
      "smtp_host": "smtp.gmail.com",
      "imap_port": 993,
      "smtp_port": 587,
      "username": "nullclaw@gmail.com",
      "password": "app-specific-password",
      "from_address": "nullclaw@gmail.com",
      "poll_interval_secs": 30,
      "allow_from": ["alice@example.com"]
    }
  }
}
```

**Notes:** All fields have sensible defaults. The channel works with any standard IMAP/SMTP provider.

---

## 11. Mattermost

WebSocket-based bot for Mattermost servers.

**Connection:** WebSocket for real-time events, REST API for sending messages.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `bot_token` | Yes | — | Bot account token |
| `base_url` | Yes | — | Mattermost server URL |
| `allow_from` | No | — | Array of allowed usernames |
| `group_allow_from` | No | — | Array of allowed senders in channels |
| `dm_policy` | No | `"allowlist"` | Direct message policy |
| `group_policy` | No | `"allowlist"` | Channel message policy |
| `chatmode` | No | `"oncall"` | Trigger mode: `"oncall"`, `"onmessage"`, or `"onchar"` |
| `onchar_prefixes` | No | `[">", "!"]` | Trigger prefixes for `"onchar"` mode |
| `require_mention` | No | `true` | Only respond when @mentioned in channels |

**Setup:**

1. In Mattermost, go to **Integrations > Bot Accounts** and create a bot.
2. Copy the bot token.
3. Configure the base URL of your Mattermost instance.

**Chat modes:**

- `oncall` — Responds when explicitly called (default).
- `onmessage` — Responds to every message in allowed channels.
- `onchar` — Responds when a message starts with a trigger prefix (`>` or `!` by default).

**Config example:**

```json
{
  "channels": {
    "mattermost": {
      "bot_token": "abcdefghijklmnop1234567890",
      "base_url": "https://mattermost.example.com",
      "chatmode": "oncall",
      "require_mention": true,
      "dm_policy": "allowlist",
      "allow_from": ["alice", "bob"]
    }
  }
}
```

---

## 12. LINE

LINE Messaging API bot with webhook delivery.

**Connection:** Webhook at `/line`. Uses Reply API for responding to events and Push API for proactive messages.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `access_token` | Yes | — | Channel access token |
| `channel_secret` | Yes | — | Channel secret for signature verification |
| `port` | No | `3000` | Local webhook port |
| `allow_from` | No | — | Array of allowed LINE user IDs |

**Setup:**

1. Create a channel in the [LINE Developers Console](https://developers.line.biz/).
2. Under **Messaging API**, issue a channel access token.
3. Copy the channel secret from the **Basic settings** tab.
4. Set the webhook URL to `https://your-domain/line`.

**Config example:**

```json
{
  "channels": {
    "line": {
      "access_token": "your-channel-access-token",
      "channel_secret": "your-channel-secret",
      "port": 3000,
      "allow_from": ["U1234567890abcdef"]
    }
  }
}
```

**Notes:** LINE uses HMAC-SHA256 signature verification on all incoming webhooks. The `channel_secret` is required for this verification. Requires a public HTTPS endpoint.

---

## 13. Lark / Feishu

Supports both Lark (international) and Feishu (China) via the same channel.

**Connection:** Webhook at `/lark` (default) or WebSocket receive mode.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `app_id` | Yes | — | App ID from Lark/Feishu console |
| `app_secret` | Yes | — | App secret |
| `encrypt_key` | No | — | Event encryption key |
| `verification_token` | No | — | Event verification token |
| `use_feishu` | No | `false` | Use Feishu CN endpoints instead of Lark international |
| `allow_from` | No | — | Array of allowed user IDs |
| `receive_mode` | No | `"websocket"` | `"websocket"` or `"webhook"` |
| `port` | No | — | Local webhook port (for webhook mode) |

**Dual-region support:**

- `use_feishu: false` (default) — Lark international (`open.larksuite.com`)
- `use_feishu: true` — Feishu China (`open.feishu.cn`)

**Setup:**

1. Create an app in the [Lark Developer Console](https://open.larksuite.com/app) or [Feishu Console](https://open.feishu.cn/app).
2. Note the App ID and App Secret.
3. Configure event subscription (webhook URL or enable WebSocket mode).
4. Add required permissions: `im:message`, `im:message.create_v1`.

**Config example:**

```json
{
  "channels": {
    "lark": {
      "app_id": "cli_abcdef123456",
      "app_secret": "your-app-secret",
      "verification_token": "your-verification-token",
      "use_feishu": false,
      "receive_mode": "websocket"
    }
  }
}
```

**Notes:** Allowlist matching uses **exact match** (case-sensitive), unlike most other channels.

---

## 14. DingTalk

DingTalk bot using WebSocket Stream Mode.

**Connection:** WebSocket Stream Mode (outbound only). Replies are sent via per-session webhook URLs.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `client_id` | Yes | — | App Key / Client ID |
| `client_secret` | Yes | — | App Secret / Client Secret |
| `allow_from` | No | — | Array of allowed user IDs |

**Setup:**

1. Create a robot application in the [DingTalk Developer Console](https://open-dev.dingtalk.com/).
2. Note the Client ID (AppKey) and Client Secret (AppSecret).
3. Enable **Stream Mode** in the robot configuration.

**Config example:**

```json
{
  "channels": {
    "dingtalk": {
      "client_id": "dingxxxxxxxx",
      "client_secret": "your-client-secret",
      "allow_from": ["user123"]
    }
  }
}
```

**Notes:** No inbound port needed — DingTalk Stream Mode uses an outbound WebSocket. Allowlist matching uses **exact match** (case-sensitive), unlike most other channels.

---

## 15. QQ

QQ Bot via the official QQ Bot API with WebSocket gateway.

**Connection:** WebSocket gateway (`wss://api.sgroup.qq.com/websocket`). Full gateway lifecycle: HELLO, IDENTIFY, HEARTBEAT, DISPATCH.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `app_id` | Yes | — | QQ Bot App ID |
| `app_secret` | Yes | — | QQ Bot App Secret |
| `bot_token` | Yes | — | QQ Bot token |
| `sandbox` | No | `false` | Use sandbox environment |
| `group_policy` | No | `"allow"` | `"allow"` or `"allowlist"` |
| `allowed_groups` | No | — | Array of allowed group IDs (for `"allowlist"` policy) |
| `allow_from` | No | — | Array of allowed user IDs |

**Setup:**

1. Register at the [QQ Bot Platform](https://q.qq.com/).
2. Create a bot application and note the App ID, App Secret, and Bot Token.
3. Enable the intents your bot needs (public guild messages, direct messages, etc.).
4. Use `sandbox: true` during development to test in the sandbox environment.

**Config example:**

```json
{
  "channels": {
    "qq": {
      "app_id": "12345678",
      "app_secret": "your-app-secret",
      "bot_token": "your-bot-token",
      "sandbox": false,
      "group_policy": "allow"
    }
  }
}
```

---

## 16. OneBot

OneBot v11 protocol adapter. Works with go-cqhttp, NapCat, Lagrange, and other OneBot implementations.

**Connection:** WebSocket (OneBot v11 protocol) for receiving events. HTTP POST for sending messages.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `url` | No | `"ws://localhost:6700"` | OneBot WebSocket endpoint |
| `access_token` | No | — | Authentication token |
| `group_trigger_prefix` | No | — | Prefix to trigger bot in groups |
| `allow_from` | No | — | Array of allowed QQ numbers |

**Setup:**

1. Install a OneBot v11 implementation:
   - [go-cqhttp](https://github.com/Mrs4s/go-cqhttp)
   - [NapCat](https://github.com/NapNeko/NapCatQQ)
   - [Lagrange](https://github.com/LagrangeDev/Lagrange.Core)
2. Configure it to expose a WebSocket server (default: `ws://localhost:6700`).
3. Point nullclaw at the WebSocket URL.

**Config example:**

```json
{
  "channels": {
    "onebot": {
      "url": "ws://localhost:6700",
      "access_token": "your-secret-token",
      "group_trigger_prefix": "/ai",
      "allow_from": ["123456789"]
    }
  }
}
```

---

## 17. MaixCam

IoT channel for MaixCam and other embedded vision devices. Communicates via a newline-delimited JSON protocol over TCP.

**Connection:** TCP server. nullclaw listens for device connections.

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `port` | No | `7777` | TCP listen port |
| `host` | No | `"0.0.0.0"` | Bind address |
| `allow_from` | No | — | Array of allowed device identifiers |
| `name` | No | `"maixcam"` | Device name for logging |

**Setup:**

1. Configure your MaixCam device to connect to the nullclaw host on the configured port.
2. The device sends newline-delimited JSON messages over TCP.
3. nullclaw responds in the same format.

**Config example:**

```json
{
  "channels": {
    "maixcam": {
      "port": 7777,
      "host": "0.0.0.0",
      "name": "maixcam",
      "allow_from": ["device-001"]
    }
  }
}
```

---

## Permission System

nullclaw uses two policy types to control who can interact with the bot.

### DM Policy

Controls direct / private messages.

| Value | Behavior |
|-------|----------|
| `allow` | Accept DMs from everyone |
| `deny` | Reject all DMs |
| `allowlist` | Only accept DMs from senders in `allow_from` |

### Group Policy

Controls messages in group chats, channels, and rooms.

| Value | Behavior |
|-------|----------|
| `open` | Respond to all group messages |
| `mention_only` | Only respond when the bot is @mentioned |
| `allowlist` | Only respond to senders in `group_allow_from` |

**Allowlist matching** is case-insensitive for most channels. Exceptions: Lark and DingTalk use exact (case-sensitive) matching. Setting `allow_from` to `["*"]` allows all senders.

---

## Gateway Webhook Endpoints

When running in daemon mode with the gateway enabled, nullclaw exposes the following HTTP endpoints for webhook-based channels:

| Endpoint | Method | Channel |
|----------|--------|---------|
| `/telegram` | POST | Telegram |
| `/whatsapp` | GET/POST | WhatsApp |
| `/slack/events` | POST | Slack (configurable path) |
| `/line` | POST | LINE |
| `/lark` | POST | Lark/Feishu |
| `/health` | GET | Health check |
| `/ready` | GET | Readiness check |
| `/pair` | POST | Device pairing |
| `/webhook` | POST | Generic webhook |

Channels that need a public URL (WhatsApp, LINE, Lark in webhook mode) require either a public IP or a tunnel. See [Network Deployment](deployment/network.md) for tunnel configuration with Tailscale, ngrok, or Cloudflare.
