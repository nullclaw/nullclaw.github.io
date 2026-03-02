# Channels

Channels are the messaging interfaces that connect NullClaw to the outside world. Each channel implements the same vtable interface, handling inbound message parsing, user authentication, session routing, and outbound response delivery. NullClaw ships with 19 channels spanning chat platforms, social protocols, enterprise tools, and hardware.

## Channel Matrix

| Channel | Protocol | Transport |
|---------|----------|-----------|
| CLI | Local terminal | stdin/stdout |
| Telegram | Bot API | Webhook / long-polling |
| Discord | Gateway API | WebSocket |
| Slack | Events API + Socket Mode | WebSocket |
| Signal | Signal CLI | D-Bus / JSON-RPC |
| Nostr | NIP-17 / NIP-04 | WebSocket (relays) |
| Matrix | Client-Server API | HTTP long-polling |
| WhatsApp | Cloud API | Webhook |
| IRC | RFC 1459/2812 | TCP/TLS |
| iMessage | AppleScript bridge | Local |
| Email | IMAP/SMTP | TCP/TLS |
| Web | WebChannel v1 | WebSocket |
| Lark / Feishu | Bot API | Webhook |
| DingTalk | Bot API | Webhook |
| LINE | Messaging API | Webhook |
| OneBot | OneBot v11 | WebSocket |
| QQ | OneBot protocol | WebSocket |
| Mattermost | Bot API | WebSocket |
| MaixCAM | Serial / HTTP | USB / Network |

## General Configuration

Channels are configured under the `channels` key in `config.json`. Most channels use an `accounts` wrapper that supports multiple named connections:

```json
{
  "channels": {
    "cli": true,
    "telegram": {
      "accounts": {
        "main": { ... },
        "secondary": { ... }
      }
    }
  }
}
```

Setting a channel to `true` (like `"cli": true`) enables it with defaults. The `accounts` structure allows running multiple bots or connections for the same channel type simultaneously.

## Channel Configuration

### Telegram

Requires a bot token from [@BotFather](https://t.me/BotFather).

```json
{
  "channels": {
    "telegram": {
      "accounts": {
        "main": {
          "bot_token": "123456:ABC-DEF...",
          "allow_from": [123456789, 987654321],
          "reply_in_private": true,
          "proxy": "socks5://127.0.0.1:1080"
        }
      }
    }
  }
}
```

- `bot_token`: Your Telegram bot token
- `allow_from`: Array of numeric Telegram user IDs that can interact with the bot
- `reply_in_private`: When true, replies are sent as direct messages instead of in the group
- `proxy`: Optional SOCKS5 proxy for restricted networks

### Discord

Requires a bot token from the Discord Developer Portal.

```json
{
  "channels": {
    "discord": {
      "accounts": {
        "main": {
          "token": "disc-token...",
          "guild_id": "123456789",
          "allow_from": ["user_id_1", "user_id_2"],
          "allow_bots": false
        }
      }
    }
  }
}
```

- `token`: Discord bot token
- `guild_id`: The server (guild) ID to operate in
- `allow_from`: Array of Discord user IDs
- `allow_bots`: Whether to respond to other bots (default: false)

### Slack

Requires a bot token and app token from the Slack API dashboard.

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "main": {
          "bot_token": "xoxb-...",
          "app_token": "xapp-...",
          "allow_from": ["U12345678"]
        }
      }
    }
  }
}
```

- `bot_token`: Slack bot OAuth token (starts with `xoxb-`)
- `app_token`: Slack app-level token for Socket Mode (starts with `xapp-`)
- `allow_from`: Array of Slack user IDs

### Signal

Uses Signal CLI as a bridge.

```json
{
  "channels": {
    "signal": {
      "accounts": {
        "main": {
          "phone_number": "+1234567890",
          "allow_from": ["+1987654321"],
          "signal_cli_path": "/usr/local/bin/signal-cli"
        }
      }
    }
  }
}
```

### Nostr

NullClaw speaks Nostr natively via NIP-17 (gift-wrapped private DMs) and NIP-04 (legacy DMs). Requires [`nak`](https://github.com/fiatjaf/nak) in your `$PATH`.

```json
{
  "channels": {
    "nostr": {
      "private_key": "enc2:...",
      "owner_pubkey": "hex-pubkey-of-owner",
      "relays": [
        "wss://relay.damus.io",
        "wss://nos.lol",
        "wss://relay.nostr.band"
      ],
      "dm_allowed_pubkeys": ["*"],
      "display_name": "NullClaw",
      "about": "AI assistant on Nostr",
      "nip05": "nullclaw@yourdomain.com"
    }
  }
}
```

- `private_key`: Bot's Nostr private key, encrypted at rest with ChaCha20-Poly1305 (`enc2:` prefix). Decrypted into memory only while the channel is running; zeroed on stop.
- `owner_pubkey`: Your public key (npub or hex). Always allowed through the DM policy regardless of other settings.
- `relays`: WebSocket relay URLs for publishing and subscribing
- `dm_allowed_pubkeys`: Public keys allowed to DM the bot. `["*"]` allows everyone.

On startup, NullClaw announces DM inbox relays (kind:10050), then listens for NIP-17 gift wraps and NIP-04 encrypted DMs. Outbound messages mirror the sender's protocol. Multi-relay rumor deduplication prevents duplicate responses.

Setup via the wizard: `nullclaw onboard --interactive` (step 7 configures Nostr).

### Matrix

```json
{
  "channels": {
    "matrix": {
      "accounts": {
        "main": {
          "homeserver": "https://matrix.org",
          "user_id": "@nullclaw:matrix.org",
          "access_token": "syt_...",
          "allow_from": ["@user:matrix.org"]
        }
      }
    }
  }
}
```

### IRC

Supports multiple simultaneous connections with different servers, nicks, and channels.

```json
{
  "channels": {
    "irc": {
      "accounts": {
        "libera": {
          "host": "irc.libera.chat",
          "port": 6697,
          "nick": "nullclaw",
          "channel": "#nullclaw",
          "tls": true,
          "allow_from": ["trusted_nick"]
        },
        "meshrelay": {
          "host": "irc.meshrelay.xyz",
          "port": 6697,
          "nick": "nullclaw",
          "channels": ["#agents", "#ai"],
          "tls": true,
          "nickserv_password": "YOUR_PASSWORD",
          "allow_from": ["*"]
        }
      }
    }
  }
}
```

- `channel` (string) for a single channel, or `channels` (array) for multiple
- `nickserv_password`: Optional NickServ identification
- `tls`: Enable TLS encryption (recommended)

### Web

The Web channel connects NullClaw to browser-based UIs via WebSocket.

```json
{
  "channels": {
    "web": {
      "accounts": {
        "default": {
          "transport": "local",
          "listen": "127.0.0.1",
          "port": 32123,
          "path": "/ws",
          "auth_token": "replace-with-long-random-token",
          "message_auth_mode": "pairing",
          "allowed_origins": [
            "http://localhost:5173",
            "chrome-extension://your-extension-id"
          ]
        }
      }
    }
  }
}
```

- `transport`: `"local"` for direct WebSocket, `"relay"` for relay-mediated connections
- `message_auth_mode`: `"pairing"` (6-digit code exchange) or `"token"` (static token)
- `allowed_origins`: CORS origins allowed to connect

A relay transport is also available for remote access:

```json
{
  "transport": "relay",
  "relay_url": "wss://relay.nullclaw.io/ws/agent",
  "relay_agent_id": "default",
  "relay_token": "replace-with-relay-token"
}
```

### WhatsApp

Uses the Meta Cloud API. Requires a webhook endpoint.

```json
{
  "channels": {
    "whatsapp": {
      "accounts": {
        "main": {
          "phone_number_id": "123456",
          "access_token": "EAA...",
          "verify_token": "my-verify-token",
          "allow_from": ["+1234567890"]
        }
      }
    }
  }
}
```

### Email

```json
{
  "channels": {
    "email": {
      "accounts": {
        "main": {
          "imap_host": "imap.gmail.com",
          "imap_port": 993,
          "smtp_host": "smtp.gmail.com",
          "smtp_port": 465,
          "username": "bot@example.com",
          "password": "enc2:...",
          "allow_from": ["user@example.com"]
        }
      }
    }
  }
}
```

### iMessage

macOS only. Uses AppleScript to send and receive iMessages.

```json
{
  "channels": {
    "imessage": {
      "accounts": {
        "main": {
          "allow_from": ["+1234567890"]
        }
      }
    }
  }
}
```

### LINE

```json
{
  "channels": {
    "line": {
      "accounts": {
        "main": {
          "channel_secret": "...",
          "channel_access_token": "...",
          "allow_from": ["U1234567890"]
        }
      }
    }
  }
}
```

### Lark / Feishu

```json
{
  "channels": {
    "lark": {
      "accounts": {
        "main": {
          "app_id": "cli_...",
          "app_secret": "...",
          "verification_token": "...",
          "allow_from": ["ou_1234567890"]
        }
      }
    }
  }
}
```

### DingTalk

```json
{
  "channels": {
    "dingtalk": {
      "accounts": {
        "main": {
          "app_key": "...",
          "app_secret": "...",
          "robot_code": "...",
          "allow_from": ["user_id"]
        }
      }
    }
  }
}
```

### OneBot / QQ

Uses the OneBot v11 protocol, compatible with go-cqhttp and other OneBot implementations.

```json
{
  "channels": {
    "onebot": {
      "accounts": {
        "main": {
          "ws_url": "ws://127.0.0.1:6700",
          "access_token": "...",
          "allow_from": ["12345678"]
        }
      }
    }
  }
}
```

QQ uses the same OneBot protocol:

```json
{
  "channels": {
    "qq": {
      "accounts": {
        "main": {
          "ws_url": "ws://127.0.0.1:6700",
          "allow_from": ["12345678"]
        }
      }
    }
  }
}
```

### Mattermost

```json
{
  "channels": {
    "mattermost": {
      "accounts": {
        "main": {
          "url": "https://mattermost.example.com",
          "token": "bot-token",
          "team_id": "...",
          "allow_from": ["user_id"]
        }
      }
    }
  }
}
```

### MaixCAM

For the Sipeed MaixCAM hardware platform. Connects via serial or HTTP.

```json
{
  "channels": {
    "maixcam": {
      "accounts": {
        "main": {
          "transport": "serial",
          "device": "/dev/ttyUSB0",
          "baud_rate": 115200
        }
      }
    }
  }
}
```

## Allowlists and DM Policy

Every channel supports an `allow_from` field that controls who can interact with the bot:

- **Empty array or omitted**: Deny all inbound messages (locked down by default)
- **`["*"]`**: Allow all users (explicit opt-in)
- **Specific IDs**: Only listed users can interact

```json
{
  "allow_from": [123456789, 987654321]
}
```

The ID format depends on the channel: numeric user IDs for Telegram, string user IDs for Discord and Slack, phone numbers for Signal and WhatsApp, IRC nicks for IRC, hex pubkeys for Nostr.

For Discord, the additional `allow_bots` flag (default: `false`) controls whether messages from other bots are processed.

## Channel Health

Check the status of all configured channels:

```bash
nullclaw channel status
```

This shows each channel's connection state, account name, uptime, and any errors. Channels that fail to connect are retried with exponential backoff by the daemon supervisor.

Start specific channels individually:

```bash
nullclaw channel start telegram
nullclaw channel start discord
```

## Further Reading

- [Configuration](/nullclaw/docs/configuration) -- full config reference
- [Security](/nullclaw/docs/security) -- allowlists, pairing, encryption
- [CLI Reference](/nullclaw/docs/cli) -- channel management commands
