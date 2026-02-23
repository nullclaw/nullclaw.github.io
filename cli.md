---
title: CLI Reference
description: Command-line interface reference for nullclaw
---

# CLI Reference

## Usage

```
nullclaw <command> [options]
```

## Commands

### agent

Start the AI agent loop.

```bash
nullclaw agent                          # interactive REPL
nullclaw agent -m "Hello!"              # single message
nullclaw agent -s myproject -m "..."    # named session
```

| Flag | Description |
|------|-------------|
| `-m, --message` | Single-message mode (non-interactive) |
| `-s, --session` | Session ID for persistence |

### gateway

Start the HTTP/webhook gateway server.

```bash
nullclaw gateway --port 8080 --host 0.0.0.0
```

| Flag | Description |
|------|-------------|
| `-p, --port` | Gateway port (default: from config) |
| `--host` | Bind address (default: from config) |

### daemon

Start long-running runtime (gateway + channels + heartbeat + scheduler).

```bash
nullclaw daemon --port 3000
```

| Flag | Description |
|------|-------------|
| `-p, --port` | Gateway port |
| `--host` | Bind address |

### service

Manage OS service lifecycle (launchd on macOS, systemd on Linux).

```bash
nullclaw service install
nullclaw service start
nullclaw service stop
nullclaw service status
nullclaw service uninstall
```

### status

Show system status (provider, memory, tools, channels).

```bash
nullclaw status
```

### version

Show version.

```bash
nullclaw version
nullclaw --version
nullclaw -V
```

### onboard

Initialize workspace and configuration.

```bash
nullclaw onboard                           # interactive 8-step wizard
nullclaw onboard --channels-only           # configure channels only
nullclaw onboard --api-key sk-... --provider anthropic  # quick setup
```

| Flag | Description |
|------|-------------|
| `--interactive` | Run interactive wizard |
| `--channels-only` | Only configure channels |
| `--api-key` | API key for quick setup |
| `--provider` | Provider name for quick setup |
| `--memory` | Memory backend for quick setup |

### doctor

Run diagnostics (provider connectivity, tool availability, channel health).

```bash
nullclaw doctor
```

### cron

Manage scheduled tasks.

```bash
nullclaw cron list
nullclaw cron add "*/5 * * * *" "echo heartbeat"
nullclaw cron once 30m "nullclaw agent -m 'daily summary'"
nullclaw cron remove <id>
nullclaw cron pause <id>
nullclaw cron resume <id>
nullclaw cron run <id>
nullclaw cron runs <id>
nullclaw cron update <id> --expression "0 */2 * * *" --enable
```

| Subcommand | Description |
|------------|-------------|
| `list` | List all scheduled tasks |
| `add <expr> <cmd>` | Add recurring cron job |
| `once <delay> <cmd>` | Add one-shot delayed task |
| `remove <id>` | Remove a task |
| `pause <id>` | Pause a task |
| `resume <id>` | Resume a paused task |
| `run <id>` | Force-run immediately |
| `runs <id>` | Show run history |
| `update <id>` | Update expression, command, or enable/disable |

### channel

Manage messaging channels.

```bash
nullclaw channel list
nullclaw channel start telegram
nullclaw channel start signal
nullclaw channel doctor
nullclaw channel add <type>
nullclaw channel remove <name>
```

| Subcommand | Description |
|------------|-------------|
| `list` | List configured channels |
| `start [channel]` | Start a channel (default: first available) |
| `doctor` | Run channel health checks |
| `add <type>` | Guide for adding a channel |
| `remove <name>` | Guide for removing a channel |

### skills

Manage installable plugins.

```bash
nullclaw skills list
nullclaw skills install ./my-skill
nullclaw skills install https://github.com/user/skill
nullclaw skills remove my-skill
nullclaw skills info my-skill
```

| Subcommand | Description |
|------------|-------------|
| `list` | List installed skills |
| `install <source>` | Install from path or GitHub URL |
| `remove <name>` | Remove a skill |
| `info <name>` | Show skill details |

### hardware

Discover and manage connected hardware.

```bash
nullclaw hardware scan
```

| Subcommand | Description |
|------------|-------------|
| `scan` | Scan for connected devices |
| `flash <file>` | Flash firmware (planned) |
| `monitor` | Monitor devices (planned) |

### migrate

Migrate data from other agent runtimes.

```bash
nullclaw migrate openclaw --dry-run --source ~/openclaw-workspace
```

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview without writing |
| `--source <path>` | Source workspace path |

### models

Manage provider model catalogs.

```bash
nullclaw models list
nullclaw models info <model>
nullclaw models refresh
nullclaw models benchmark
```

| Subcommand | Description |
|------------|-------------|
| `list` | List available models with current config |
| `info <model>` | Show model details |
| `refresh` | Refresh model catalog from providers |
| `benchmark` | Run latency benchmark (planned) |

### auth

Manage OAuth authentication.

```bash
nullclaw auth login openai-codex
nullclaw auth login openai-codex --import-codex
nullclaw auth status openai-codex
nullclaw auth logout openai-codex
```

| Subcommand | Description |
|------------|-------------|
| `login <provider>` | Authenticate via device code flow |
| `status <provider>` | Show auth status (token expiry, account) |
| `logout <provider>` | Remove stored credentials |

| Flag | Description |
|------|-------------|
| `--import-codex` | Import from Codex CLI (~/.codex/auth.json) |

### update

Check for and install updates.

```bash
nullclaw update --check
nullclaw update --yes
```

| Flag | Description |
|------|-------------|
| `--check` | Check only, don't install |
| `--yes` | Auto-confirm installation |

### help

Show usage help.

```bash
nullclaw help
nullclaw --help
nullclaw -h
```

## Common Workflows

### Interactive development

```bash
nullclaw agent
```

### Run a single task

```bash
nullclaw agent -m "Refactor the auth module to use JWT"
```

### Telegram bot as a service

```bash
nullclaw service install
nullclaw service start
nullclaw service status
```

### Scheduled tasks

```bash
nullclaw cron add "0 9 * * *" "nullclaw agent -m 'morning summary'"
nullclaw cron list
```

### Multi-channel daemon

```bash
nullclaw daemon --port 3000
```

### OAuth setup (Codex)

```bash
nullclaw auth login openai-codex
nullclaw auth status openai-codex
```
