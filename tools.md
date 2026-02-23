---
title: Tools
description: Built-in tools reference for nullclaw
---

# Tools Reference

nullclaw ships with 30+ built-in tools that the agent can call via LLM function calling. Tools are organized into categories: file operations, shell and git, web, memory, scheduling, communication, delegation, media, hardware, and integrations.

## Tool Sets

nullclaw exposes three tool sets depending on context:

| Set | Tools | When Used |
|---|---|---|
| **Default** | `shell`, `file_read`, `file_write`, `file_edit` | Minimal setup, subcommands |
| **Full** | All default + `git_operations`, `image_info`, `memory_store`, `memory_recall`, `memory_forget`, `delegate`, `schedule`, `spawn`, and conditional tools (`http_request`, `browser`, `screenshot`, `composio`, `browser_open`, hardware tools, MCP tools) | Main agent loop |
| **Subagent** | `shell`, `file_read`, `file_write`, `file_edit`, `git_operations`, `http_request` (if enabled) | Delegated/spawned subagents |

Subagents intentionally exclude `message`, `spawn`, `delegate`, `schedule`, `memory_*`, `composio`, and `browser` to prevent infinite delegation chains and cross-channel side effects.

---

## File Operations

### file_read

Read the contents of a file in the workspace.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | yes | Relative path to the file within the workspace |

**Security:**
- Workspace scoping enforced -- all paths resolved relative to `workspace_dir`
- Path traversal (`..`) blocked via `isPathSafe()` check
- Symlink escape detection -- resolved path must stay within workspace or `allowed_paths`
- System blocklist rejects paths under `/System`, `/Library`, `/bin`, `/sbin`, `/usr/bin`, `/etc`, `/dev`, `/proc`, `C:\Windows`, `C:\Program Files`, etc.
- Maximum file size: 10 MB (configurable via `max_file_size_bytes`)

### file_write

Write contents to a file in the workspace. Creates parent directories as needed.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | yes | Relative path to the file within the workspace |
| `content` | string | yes | Content to write to the file |

**Security:** Same workspace scoping, path traversal blocking, symlink resolution, and system blocklist as `file_read`.

### file_edit

Find and replace text in a file.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | yes | Relative path to the file within the workspace |
| `old_text` | string | yes | Text to find in the file |
| `new_text` | string | yes | Replacement text |

**Security:** Same workspace scoping and path security as `file_read`. Maximum file size: 10 MB (configurable).

### file_append

Append content to the end of a file. Creates the file if it does not exist.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | yes | Relative path to the file within the workspace |
| `content` | string | yes | Content to append |

**Security:** Same workspace scoping and path security as `file_read`. Maximum file size: 10 MB (configurable).

### image_info

Read image file metadata (format, dimensions, size).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `path` | string | yes | Path to the image file |
| `include_base64` | boolean | no | Include base64-encoded image data (default: `false`) |

Maximum file size: 5 MB.

---

## Shell and Git

### shell

Execute a shell command in the workspace directory.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `command` | string | yes | The shell command to execute |
| `cwd` | string | no | Working directory (absolute path within `allowed_paths`; defaults to workspace) |

**Security:**
- Environment sanitized -- only safe variables passed through: `PATH`, `HOME`, `TERM`, `LANG`, `LC_ALL`, `LC_CTYPE`, `USER`, `SHELL`, `TMPDIR`. All other environment variables (including API keys) are stripped to prevent leaks (CWE-200).
- Configurable timeout (default: 60 seconds)
- Maximum output capture: 1 MB (configurable via `shell_max_output_bytes`)
- `cwd` must be an absolute path within configured `allowed_paths`
- Security policy validation -- commands checked against `SecurityPolicy` if configured, blocking disallowed or high-risk commands
- Executed via platform shell (`sh -c` on Unix, `cmd.exe /c` on Windows)

### git_operations

Perform structured Git operations.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `operation` | enum | yes | One of: `status`, `diff`, `log`, `branch`, `commit`, `add`, `checkout`, `stash` |
| `message` | string | no | Commit message (for `commit`) |
| `paths` | string | no | File paths (for `add`) |
| `branch` | string | no | Branch name (for `checkout`) |
| `files` | string | no | Files to diff |
| `cached` | boolean | no | Show staged changes (for `diff`) |
| `limit` | integer | no | Log entry count (default: 10) |
| `cwd` | string | no | Repository directory (absolute path within `allowed_paths`; defaults to workspace) |

**Security:** Git arguments are sanitized to block injection vectors:
- Dangerous option prefixes: `--exec=`, `--upload-pack=`, `--receive-pack=`, `--pager=`, `--editor=`
- Dangerous exact flags: `--no-verify`
- Shell metacharacters: `$(`, `` ` ``, `|`, `;`, `>`

---

## Web

### http_request

Make HTTP requests to external APIs. **Conditional** -- requires `http_request.enabled: true` in config.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | HTTP or HTTPS URL to request |
| `method` | string | no | HTTP method: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `HEAD`, `OPTIONS` (default: `GET`) |
| `headers` | object | no | Optional HTTP headers as key-value pairs |
| `body` | string | no | Optional request body |

**Security:**
- Only `http://` and `https://` schemes allowed
- SSRF protection with DNS-rebinding hardening -- hostname resolved once, validated for global (non-private) address, connected directly to resolved IP
- Domain allowlist support (`allowed_domains`) -- when configured, only listed domains are permitted
- Local and private hosts blocked (127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, ::1, etc.)

### web_fetch

Fetch a web page and extract its text content. Converts HTML to readable text with markdown formatting.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | URL to fetch (HTTP or HTTPS) |
| `max_chars` | integer | no | Maximum characters to return (default: 50,000) |

**Security:** Same SSRF protection as `http_request` -- DNS-rebinding hardening, local/private host blocking.

### web_search

Search the web using Brave Search API. Requires `BRAVE_API_KEY` environment variable.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Search query |
| `count` | integer | no | Number of results, 1-10 (default: 5) |

Returns titles, URLs, and descriptions. Free API key available at [brave.com/search/api](https://brave.com/search/api/).

### browser

Browse web pages with programmatic actions. **Conditional** -- requires `browser.enabled: true` in config.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | enum | yes | One of: `open`, `screenshot`, `click`, `type`, `scroll`, `read` |
| `url` | string | no | URL to open |
| `selector` | string | no | CSS selector for `click`/`type` actions |
| `text` | string | no | Text to type |

The `open` action launches a URL in the system browser. The `read` action fetches page content via curl (max 8 KB). Actions `click`, `type`, `scroll`, and `screenshot` require CDP (Chrome DevTools Protocol) support.

### browser_open

Open an approved HTTPS URL in the default browser. **Conditional** -- requires `browser.allowed_domains` in config.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `url` | string | yes | HTTPS URL to open in browser |

**Security:**
- HTTPS-only (HTTP rejected)
- Domain allowlist enforced -- only domains listed in `browser.allowed_domains` are permitted
- Opens via `open` (macOS) or `xdg-open` (Linux)

---

## Memory

### memory_store

Store a fact, preference, or note in long-term memory.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | yes | Unique key for this memory |
| `content` | string | yes | The information to remember |
| `category` | enum | no | Memory category: `core` (permanent facts), `daily` (session notes), `conversation` (chat context) |

### memory_recall

Search long-term memory for relevant facts, preferences, or context.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | string | yes | Keywords or phrase to search for in memory |
| `limit` | integer | no | Max results to return (default: 5) |

### memory_forget

Remove a memory entry by key. Use to delete outdated facts or sensitive data.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `key` | string | yes | The key of the memory to forget |

---

## Scheduling

### schedule

Manage scheduled tasks through a unified interface. Delegates to the CronScheduler for persistent job management.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | enum | yes | One of: `create`, `add`, `once`, `list`, `get`, `cancel`, `remove`, `pause`, `resume` |
| `expression` | string | no | Cron expression for recurring tasks (e.g. `*/5 * * * *`) |
| `delay` | string | no | Delay for one-shot tasks (e.g. `30m`, `2h`) |
| `command` | string | no | Shell command to execute |
| `id` | string | no | Task ID (for `get`, `cancel`, `remove`, `pause`, `resume`) |

### cron_add

Create a scheduled cron job. Provide either `expression` (cron syntax) or `delay` (one-shot).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `expression` | string | no | Cron expression (e.g. `*/5 * * * *`) |
| `delay` | string | no | Delay for one-shot tasks (e.g. `30m`, `2h`) |
| `command` | string | yes | Shell command to execute |
| `name` | string | no | Optional job name |

### cron_list

List all scheduled cron jobs with their status and next run time.

No parameters.

### cron_remove

Remove a scheduled cron job by its ID.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `job_id` | string | yes | ID of the cron job to remove |

### cron_run

Force-run a cron job immediately by its ID, regardless of schedule.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `job_id` | string | yes | The ID of the cron job to run |

### cron_runs

List recent execution history for a cron job.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `job_id` | string | yes | ID of the cron job |
| `limit` | integer | no | Max runs to show (default: 10) |

### cron_update

Update a cron job's expression, command, or enabled state.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `job_id` | string | yes | ID of the cron job to update |
| `expression` | string | no | New cron expression |
| `command` | string | no | New command to execute |
| `enabled` | boolean | no | Enable or disable the job |

---

## Communication

### message

Send a message to a channel. Used for cross-channel routing, cron delivery, and subagent announcements.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `content` | string | yes | Message text to send |
| `channel` | string | no | Target channel (`telegram`, `discord`, `slack`, etc.). Defaults to current. |
| `chat_id` | string | no | Target chat/room ID. Defaults to current. |

### pushover

Send a push notification via Pushover.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `message` | string | yes | The notification message |
| `title` | string | no | Optional title |
| `priority` | integer | no | Priority from -2 to 2 (default: 0) |
| `sound` | string | no | Optional sound name |

Requires `PUSHOVER_TOKEN` and `PUSHOVER_USER_KEY` in the workspace `.env` file.

---

## Delegation

### delegate

Delegate a subtask to a specialized agent with a different provider/model configuration.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `agent` | string | yes | Name of the agent to delegate to (must match a named agent in config) |
| `prompt` | string | yes | The task/prompt to send to the sub-agent |
| `context` | string | no | Optional context to prepend |

**Security:** Maximum delegation depth enforced (default: 3) to prevent infinite delegation chains.

### spawn

Spawn a background subagent to work on a task asynchronously. Returns a task ID immediately; results are delivered as system messages when complete.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `task` | string | yes | The task/prompt for the subagent |
| `label` | string | no | Optional human-readable label for tracking |

---

## Media

### screenshot

Capture a screenshot of the current screen. **Conditional** -- requires `screenshot.enabled: true` in config.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `filename` | string | no | Filename for the screenshot (default: `screenshot.png`). Saved in workspace. |

Platform support:
- **macOS:** `screencapture -x`
- **Linux:** `import` (ImageMagick)

---

## Hardware

All hardware tools are **conditional** -- they require `hardware.boards` to be configured.

### hardware_board_info

Return board info (chip, architecture, memory map) for connected hardware.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `board` | string | no | Board name (e.g. `nucleo-f401re`). If omitted, returns info for first configured board. |

Supported boards: `nucleo-f401re`, `nucleo-f411re`, `arduino-uno`, `arduino-uno-q`, `esp32`, `rpi-gpio`.

### hardware_memory

Read/write hardware memory maps via probe-rs or serial. Supports Nucleo boards connected via USB.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | enum | yes | `read` or `write` |
| `address` | string | no | Memory address in hex (e.g. `0x20000000`) |
| `length` | integer | no | Bytes to read (default: 128, max: 256) |
| `value` | string | no | Hex value to write (for `write` action) |
| `board` | string | no | Board name (optional if only one configured) |

### i2c

I2C hardware tool for detecting buses, scanning devices, and reading/writing registers. **Linux only.**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | enum | yes | One of: `detect`, `scan`, `read`, `write` |
| `bus` | integer | no | I2C bus number (e.g. `1` for `/dev/i2c-1`) |
| `address` | string | no | Device address in hex (`0x03`-`0x77`) |
| `register` | integer | no | Register number to read/write |
| `value` | integer | no | Byte value to write (0-255) |
| `length` | integer | no | Number of bytes to read (default: 1) |

### spi

SPI hardware tool for device interaction. **Linux only** -- uses `/dev/spidevX.Y` via ioctl.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | enum | yes | One of: `list`, `transfer`, `read` |
| `device` | string | no | SPI device path (default: `/dev/spidev0.0`) |
| `data` | string | no | Hex bytes to send (e.g. `FF 0A 3B`) |
| `speed_hz` | integer | no | SPI clock speed in Hz (default: 1,000,000) |
| `mode` | integer | no | SPI mode 0-3 (default: 0) |
| `bits_per_word` | integer | no | Bits per word (default: 8) |

---

## Integration

### composio

Execute actions on 1000+ apps via the Composio managed tool platform. **Conditional** -- requires `composio.api_key` in config.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `action` | enum | yes | One of: `list`, `execute`, `connect` |
| `app` | string | no | App/toolkit filter for `list`, or app for `connect` |
| `action_name` | string | no | Action identifier to execute |
| `tool_slug` | string | no | Preferred v3 tool slug (alias of `action_name`) |
| `params` | object | no | Parameters for the action |
| `entity_id` | string | no | Entity/user ID for multi-user setups |
| `auth_config_id` | string | no | Optional v3 auth config ID for `connect` |
| `connected_account_id` | string | no | Optional connected account ID for `execute` |

Supports OAuth integrations with Gmail, Notion, GitHub, Slack, and hundreds more. Uses Composio v3 API endpoints with v2 fallback.

---

## MCP Server Tools

External tools can be added via the [Model Context Protocol](https://modelcontextprotocol.io/) (JSON-RPC 2.0 over stdio). MCP tools are discovered at startup via `tools/list` and executed via `tools/call`, then injected alongside built-in tools.

### Configuration

```json
{
  "mcp_servers": {
    "my-server": {
      "command": "mcp-server-binary",
      "args": ["--flag", "value"],
      "env": {
        "API_KEY": "..."
      }
    }
  }
}
```

Each MCP server is launched as a child process. Tools it advertises become available to the agent with the same interface as built-in tools.

---

## Security Reference

### Path Security

All file and shell tools enforce a layered path security model:

1. **System blocklist** -- always rejected, even if they match `allowed_paths`:

   | Unix | Windows |
   |---|---|
   | `/System`, `/Library` | `C:\Windows` |
   | `/bin`, `/sbin`, `/usr/bin`, `/usr/sbin` | `C:\Program Files` |
   | `/usr/lib`, `/usr/libexec` | `C:\Program Files (x86)` |
   | `/etc`, `/private/etc`, `/private/var` | `C:\ProgramData` |
   | `/dev`, `/boot`, `/proc`, `/sys` | `C:\System32`, `C:\Recovery` |

2. **Path traversal** -- `..` components blocked via `isPathSafe()`.

3. **Symlink escape detection** -- paths are resolved to their real location; the resolved path must fall within the workspace or an entry in `allowed_paths`.

4. **Workspace scoping** -- relative paths are joined with `workspace_dir`. Absolute paths are only accepted when `allowed_paths` is configured.

### Tool Configuration

Tool limits are configurable in the `tools` section of `config.json`:

```json
{
  "tools": {
    "shell_timeout_secs": 60,
    "shell_max_output_bytes": 1048576,
    "max_file_size_bytes": 10485760,
    "web_fetch_max_chars": 50000
  }
}
```

| Key | Type | Default | Description |
|---|---|---|---|
| `shell_timeout_secs` | integer | `60` | Maximum shell command execution time in seconds |
| `shell_max_output_bytes` | integer | `1048576` | Maximum shell output capture (1 MB) |
| `max_file_size_bytes` | integer | `10485760` | Maximum file size for read/edit/append operations (10 MB) |
| `web_fetch_max_chars` | integer | `50000` | Maximum characters returned by `web_fetch` |

### Schema Compatibility

Tool parameter schemas are automatically cleaned for cross-provider compatibility. The `SchemaCleanr` normalizes JSON schemas depending on the target LLM provider:

- **Gemini** (most restrictive) -- removes `$ref`, `$schema`, `additionalProperties`, `minLength`, `maxLength`, `pattern`, `format`, `minimum`, `maximum`, `multipleOf`, `minItems`, `maxItems`, `uniqueItems`, `examples`
- **Anthropic** -- removes `$ref`, `$defs`, `definitions`
- **OpenAI** (most permissive) -- no keywords removed
- **Conservative** -- removes `$ref`, `$defs`, `definitions`, `additionalProperties`

All strategies also resolve local `$ref` entries, flatten `anyOf`/`oneOf` unions with null variants, and convert `const` to single-value `enum`.
