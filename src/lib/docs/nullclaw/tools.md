# Tools

Tools are the capabilities that NullClaw's agent can use during conversations. When a provider responds with a tool call, the agent dispatches it to the appropriate tool implementation, collects the result, and feeds it back to the model. NullClaw ships with 36+ built-in tools covering file operations, shell access, networking, memory, scheduling, media, hardware, and integrations.

All tools implement the same vtable interface and are registered in the tool factory. Tool execution respects the configured [security](/nullclaw/docs/security) scope -- sandbox, workspace restrictions, and allowlists.

## File Operations

| Tool | Description |
|------|-------------|
| `file_read` | Read the contents of a file. Supports line ranges for large files. |
| `file_write` | Write content to a file, creating it if it does not exist. |
| `file_edit` | Make targeted edits to a file using search-and-replace. |
| `file_append` | Append content to the end of a file. |

File tools respect `workspace_only` and `allowed_paths` settings. When `workspace_only` is `true` (the default), file operations are restricted to the workspace directory. Symlink escape detection and null byte injection blocking are enforced at the path security layer.

## Shell

| Tool | Description |
|------|-------------|
| `shell` | Execute a shell command and return its output. |

The shell tool runs commands within the configured sandbox (Landlock, Firejail, Bubblewrap, or Docker). Commands are checked against the `allowed_commands` allowlist before execution.

```json
{
  "autonomy": {
    "allowed_commands": ["git", "ls", "cat", "grep", "find", "python3"],
    "workspace_only": true
  }
}
```

Set `"allowed_commands": ["*"]` to allow all commands. Even with wildcard access, the sandbox provides isolation.

## Network

| Tool | Description |
|------|-------------|
| `http_request` | Make HTTP requests (GET, POST, PUT, DELETE) to arbitrary URLs. |
| `web_search` | Search the web using a configured search provider. |
| `web_fetch` | Fetch and extract content from a web page. |
| `browser` | Control a headless browser for complex web interactions. |
| `browser_open` | Open a URL in a headless browser and return the rendered content. |

### Web Search Providers

The `web_search` tool supports multiple search backends. Configure the provider in `http_request.search_provider`:

| Provider | Config Value | API Key Required | Notes |
|----------|-------------|-----------------|-------|
| SearXNG | `searxng` | No | Self-hosted, privacy-focused. Set `search_base_url`. |
| DuckDuckGo | `duckduckgo` / `ddg` | No | No API key needed. |
| Brave | `brave` | Yes (`BRAVE_API_KEY`) | High-quality results. |
| Tavily | `tavily` | Yes (`TAVILY_API_KEY`) | AI-optimized search. |
| Firecrawl | `firecrawl` | Yes (`FIRECRAWL_API_KEY`) | Web scraping + search. |
| Perplexity | `perplexity` | Yes (`PERPLEXITY_API_KEY`) | AI-powered search. |
| Exa | `exa` | Yes (`EXA_API_KEY`) | Semantic search. |
| Jina | `jina` | Yes (`JINA_API_KEY`) | Reader + search. |
| Auto | `auto` | Varies | Tries available providers in order. |

Configuration example:

```json
{
  "http_request": {
    "search_provider": "auto",
    "search_base_url": "https://searx.example.com",
    "search_fallback_providers": ["jina", "duckduckgo"]
  }
}
```

- `search_provider`: Primary search backend
- `search_base_url`: URL for SearXNG instances (accepts root URL or `/search` endpoint)
- `search_fallback_providers`: Ordered list of fallback providers when the primary fails

API keys can be set via environment variables or in the config. The shared `WEB_SEARCH_API_KEY` variable works where supported.

## Git

| Tool | Description |
|------|-------------|
| `git` | Run git commands (status, diff, log, commit, branch, etc.). |

The git tool provides safe access to git operations within the workspace. It supports common workflows like checking status, viewing diffs, creating commits, and managing branches.

## Memory

| Tool | Description |
|------|-------------|
| `memory_store` | Store a piece of information in long-term memory. |
| `memory_recall` | Search memory for relevant information using hybrid search. |
| `memory_list` | List stored memories with optional filtering. |
| `memory_forget` | Remove a specific memory entry. |

Memory tools interface with the configured [memory backend](/nullclaw/docs/memory). Recall uses hybrid search (vector similarity + FTS5 keyword matching) when embeddings are configured, or pure keyword search otherwise.

## Scheduling

| Tool | Description |
|------|-------------|
| `cron_add` | Add a new recurring scheduled task with a cron expression. |
| `cron_list` | List all scheduled tasks. |
| `cron_remove` | Remove a scheduled task by ID. |
| `cron_run` | Manually trigger a scheduled task. |
| `cron_update` | Update an existing scheduled task. |
| `cron_runs` | View execution history of scheduled tasks. |
| `schedule` | Schedule a one-shot task at a specific time. |

Cron tasks persist across restarts via JSON storage. The scheduler runs within the gateway runtime.

```bash
# Manage cron tasks from the CLI
nullclaw cron list
nullclaw cron add --expression "0 9 * * *" --command "Check morning news"
nullclaw cron runs
```

## Media

| Tool | Description |
|------|-------------|
| `screenshot` | Take a screenshot of the current screen or a specific window. |
| `image` | Process, analyze, or generate images. |

Audio transcription is available when configured with a speech-to-text provider:

```json
{
  "tools": {
    "media": {
      "audio": {
        "enabled": true,
        "language": "en",
        "models": [{ "provider": "groq", "model": "whisper-large-v3" }]
      }
    }
  }
}
```

## Hardware

| Tool | Description |
|------|-------------|
| `hardware_info` | Get system hardware information (CPU, memory, disk, OS). |
| `hardware_memory` | Detailed memory usage statistics. |
| `i2c` | Read from and write to I2C devices. |
| `spi` | Communicate with SPI peripherals. |

Hardware tools enable NullClaw to interact with physical devices on edge hardware. The `i2c` and `spi` tools are designed for IoT and embedded scenarios where NullClaw runs on ARM SBCs, Raspberry Pi, Arduino-connected boards, or STM32/Nucleo platforms.

```bash
# Scan for connected hardware
nullclaw hardware scan

# Monitor hardware in real-time
nullclaw hardware monitor
```

## Communication

| Tool | Description |
|------|-------------|
| `message` | Send a message to a user or channel. |
| `pushover` | Send push notifications via the Pushover API. |

## Agent Coordination

| Tool | Description |
|------|-------------|
| `delegate` | Delegate a task to a named agent from the `agents.list` config. |
| `spawn` | Spawn a sub-agent for parallel task execution. |
| `composio` | Access external integrations via the Composio platform. |

The `delegate` tool sends a task to a specific agent (defined in `agents.list`) and waits for its response. The `spawn` tool creates ephemeral sub-agents for parallel work, useful for research tasks or divide-and-conquer workflows.

## Utility

| Tool | Description |
|------|-------------|
| `process_util` | Process management utilities (list, signal, resource usage). |
| `path_security` | Validate and sanitize file paths against security policy. |
| `schema` | Inspect tool schemas and available capabilities. |

## Security Scope

All tool execution is governed by the [security](/nullclaw/docs/security) and autonomy configuration:

- **Sandbox**: Shell commands and file operations run within the configured sandbox backend (Landlock, Firejail, Bubblewrap, Docker, or auto-detected)
- **Workspace scoping**: When `workspace_only` is `true`, file and shell tools are restricted to the workspace directory
- **Command allowlists**: The `allowed_commands` list controls which shell commands the agent can execute
- **Path allowlists**: The `allowed_paths` list controls which filesystem paths are accessible
- **Rate limiting**: `max_actions_per_hour` caps the total number of tool executions per hour
- **Autonomy level**: When set to `"supervised"`, the agent asks for human approval before executing medium-risk actions

```json
{
  "autonomy": {
    "level": "supervised",
    "workspace_only": true,
    "max_actions_per_hour": 20,
    "allowed_commands": ["git", "ls", "cat"],
    "allowed_paths": ["/home/user/project"]
  }
}
```

## MCP (Model Context Protocol)

NullClaw supports external tool sources via MCP servers. Configure them in `mcp_servers`:

```json
{
  "mcp_servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem"]
    }
  }
}
```

MCP tools are discovered at startup and made available alongside built-in tools.

## Further Reading

- [Memory](/nullclaw/docs/memory) -- memory tool backends and search
- [Security](/nullclaw/docs/security) -- sandbox and access controls
- [Configuration](/nullclaw/docs/configuration) -- tool and autonomy settings
- [CLI Reference](/nullclaw/docs/cli) -- cron and hardware CLI commands
