# CLI Reference

NullClaw is controlled entirely through its CLI. Every command follows the format:

```bash
nullclaw <command> [subcommand] [options]
```

If you have not installed the binary globally, prefix with the build output path:

```bash
zig-out/bin/nullclaw <command> [options]
```

## Commands

### agent

Start the AI agent in single-message or interactive mode.

```bash
# Single message -- send one prompt, get one response, exit
nullclaw agent -m "Summarize the latest news about Zig"

# Interactive mode -- ongoing conversation
nullclaw agent
```

In interactive mode, the agent maintains conversation context across messages and has access to all configured [tools](/nullclaw/docs/tools). Type your messages at the prompt. Press Ctrl+C or type `exit` to quit.

Options:

| Flag | Description |
|------|-------------|
| `-m`, `--message` | Send a single message and exit |

### gateway

Start the long-running runtime. This launches the HTTP gateway, all configured channels, the heartbeat engine, and the cron scheduler.

```bash
# Default: 127.0.0.1:3000
nullclaw gateway

# Custom port and host
nullclaw gateway --port 8080 --host 127.0.0.1
```

The gateway exposes these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check (always public) |
| `/pair` | POST | Exchange pairing code for bearer token |
| `/webhook` | POST | Send a message (requires auth) |
| `/whatsapp` | GET/POST | WhatsApp webhook verification and messages |

Options:

| Flag | Description |
|------|-------------|
| `--port` | HTTP listen port (default: 3000) |
| `--host` | Bind address (default: 127.0.0.1) |

### onboard

Run the setup wizard to create or update `~/.nullclaw/config.json`.

```bash
# Quick setup with a specific provider
nullclaw onboard --api-key sk-or-... --provider openrouter

# Full interactive wizard (walks through all settings)
nullclaw onboard --interactive

# Reconfigure channels and allowlists only
nullclaw onboard --channels-only
```

The interactive wizard covers:

1. Provider selection and API key entry
2. Default model configuration
3. Channel setup (Telegram, Discord, Signal, Nostr, IRC, etc.)
4. Memory backend selection
5. Security settings (sandbox, pairing, encryption)
6. Autonomy level and workspace scoping
7. Nostr configuration (if selected)

Options:

| Flag | Description |
|------|-------------|
| `--api-key` | API key for the provider |
| `--provider` | Provider name (e.g., `openrouter`, `anthropic`, `openai`) |
| `--interactive` | Run the full interactive wizard |
| `--channels-only` | Only configure channels and allowlists |

### service

Manage NullClaw as a background system service. This installs and controls a persistent process that runs the gateway.

```bash
nullclaw service install     # Install as system service
nullclaw service start       # Start the service
nullclaw service stop        # Stop the service
nullclaw service status      # Check service status
nullclaw service uninstall   # Remove the system service
```

Subcommands:

| Subcommand | Description |
|------------|-------------|
| `install` | Register NullClaw as a system service (systemd/launchd) |
| `start` | Start the background service |
| `stop` | Stop the background service |
| `status` | Show whether the service is running |
| `uninstall` | Remove the service registration |

### status

Show the full system status including runtime state, active channels, memory backend, provider health, and resource usage.

```bash
nullclaw status
```

### doctor

Run comprehensive system diagnostics. Checks configuration validity, provider connectivity, sandbox availability, channel health, and system dependencies.

```bash
nullclaw doctor
```

The doctor checks:

- Config file exists and parses correctly
- Provider API keys are valid and endpoints respond
- Sandbox backend is available
- Channel configurations are complete
- Required system tools are installed (e.g., `nak` for Nostr, `signal-cli` for Signal)
- Memory backend is accessible

### channel

Manage and inspect messaging channels.

```bash
# Show health and status of all configured channels
nullclaw channel status

# Start a specific channel
nullclaw channel start telegram
nullclaw channel start discord
nullclaw channel start signal
```

Subcommands:

| Subcommand | Description |
|------------|-------------|
| `status` | Show connection state, uptime, and errors for all channels |
| `start <name>` | Start a specific channel |

### cron

Manage scheduled tasks. Cron tasks run within the gateway runtime and persist across restarts.

```bash
# List all scheduled tasks
nullclaw cron list

# Add a recurring task with a cron expression
nullclaw cron add --expression "0 9 * * *" --command "Check morning news and summarize"

# Add a recurring agent task (runs as a full agent conversation)
nullclaw cron add-agent --expression "0 */6 * * *" --prompt "Review system logs for anomalies"

# Schedule a one-shot task
nullclaw cron once --at "2026-03-15T09:00:00" --command "Send project reminder"

# Schedule a one-shot agent task
nullclaw cron once-agent --at "2026-03-15T09:00:00" --prompt "Generate weekly report"

# Remove a task by ID
nullclaw cron remove --id task_abc123

# Pause and resume a task
nullclaw cron pause --id task_abc123
nullclaw cron resume --id task_abc123

# Manually trigger a task
nullclaw cron run --id task_abc123

# Update a task
nullclaw cron update --id task_abc123 --expression "0 10 * * *"

# View execution history
nullclaw cron runs
nullclaw cron runs --id task_abc123
```

Subcommands:

| Subcommand | Description |
|------------|-------------|
| `list` | List all scheduled tasks |
| `add` | Add a recurring task with a cron expression |
| `add-agent` | Add a recurring agent task |
| `once` | Schedule a one-shot command |
| `once-agent` | Schedule a one-shot agent task |
| `remove` | Remove a task by ID |
| `pause` | Pause a task |
| `resume` | Resume a paused task |
| `run` | Manually trigger a task now |
| `update` | Update a task's schedule or command |
| `runs` | View execution history |

### memory

Inspect and manage the memory system.

```bash
nullclaw memory
```

Shows memory backend status, entry count, storage size, and index health.

### skills

Manage skill packs -- downloadable capability bundles defined by TOML manifests and SKILL.md instruction files.

```bash
nullclaw skills list           # List installed skills
nullclaw skills install <name> # Install a skill pack
nullclaw skills remove <name>  # Remove a skill pack
nullclaw skills info <name>    # Show skill details
```

Subcommands:

| Subcommand | Description |
|------------|-------------|
| `list` | List all installed skill packs |
| `install` | Install a skill pack by name (from GitHub or local path) |
| `remove` | Remove an installed skill pack |
| `info` | Show details about a skill pack |

### hardware

Manage connected hardware devices for IoT and embedded scenarios.

```bash
nullclaw hardware scan         # Scan for connected devices
nullclaw hardware flash        # Flash firmware to a connected device
nullclaw hardware monitor      # Monitor hardware in real-time
```

Subcommands:

| Subcommand | Description |
|------------|-------------|
| `scan` | Discover connected hardware (serial, I2C, SPI, GPIO) |
| `flash` | Flash firmware to a connected device |
| `monitor` | Live monitoring of hardware metrics |

### models

Browse and inspect available AI models.

```bash
nullclaw models list                                      # List available models
nullclaw models info openrouter/anthropic/claude-sonnet-4  # Show model details
nullclaw models benchmark                                  # Run model benchmarks
```

Subcommands:

| Subcommand | Description |
|------------|-------------|
| `list` | List all available models across configured providers |
| `info` | Show details about a specific model (context window, pricing, capabilities) |
| `benchmark` | Run performance benchmarks against configured models |

### migrate

Import data and configuration from other tools.

```bash
# Preview what would be migrated (no changes made)
nullclaw migrate openclaw --dry-run

# Run the migration
nullclaw migrate openclaw

# Migrate from a specific source directory
nullclaw migrate openclaw --source /path/to/openclaw/data
```

Currently supports migration from OpenClaw. This imports memory entries, converts configuration, and generates embeddings for the new backend.

Options:

| Flag | Description |
|------|-------------|
| `--dry-run` | Preview changes without applying them |
| `--source` | Path to the source data directory |

### workspace

Manage the NullClaw workspace directory.

```bash
nullclaw workspace
```

Shows the current workspace path and contents.

### capabilities

List the capabilities available to the agent in the current configuration (tools, channels, memory, sandbox).

```bash
nullclaw capabilities
```

### auth

Manage authentication tokens and credentials.

```bash
nullclaw auth
```

### update

Check for and install NullClaw updates.

```bash
nullclaw update
```

### version

Print the current NullClaw version.

```bash
nullclaw version
nullclaw --version
nullclaw -V
```

NullClaw uses CalVer (`YYYY.M.D`) -- for example, `v2026.2.20`.

### help

Show help information.

```bash
nullclaw help
nullclaw --help
nullclaw -h

# Help for a specific command
nullclaw help agent
nullclaw agent --help
```

## Global Options

These flags work with any command:

| Flag | Description |
|------|-------------|
| `--help`, `-h` | Show help for the current command |
| `--version`, `-V` | Print version and exit |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NULLCLAW_CONFIG` | Override config file path (default: `~/.nullclaw/config.json`) |
| `NULLCLAW_WEB_TOKEN` | Web channel authentication token |
| `NULLCLAW_GATEWAY_TOKEN` | Gateway authentication token |
| `NULLCLAW_RELAY_TOKEN` | Relay transport authentication token |
| `BRAVE_API_KEY` | Brave Search API key |
| `FIRECRAWL_API_KEY` | Firecrawl API key |
| `TAVILY_API_KEY` | Tavily API key |
| `PERPLEXITY_API_KEY` | Perplexity API key |
| `EXA_API_KEY` | Exa API key |
| `JINA_API_KEY` | Jina API key |
| `WEB_SEARCH_API_KEY` | Shared web search API key |

## Further Reading

- [Getting Started](/nullclaw/docs/getting-started) -- installation and first steps
- [Configuration](/nullclaw/docs/configuration) -- full config reference
- [Tools](/nullclaw/docs/tools) -- what the agent can do
- [Channels](/nullclaw/docs/channels) -- messaging platform setup
