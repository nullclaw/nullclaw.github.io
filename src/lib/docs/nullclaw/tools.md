# Tools

Tool interface and assembly are implemented in `src/tools/root.zig`.

## Core Runtime Tools

Always assembled in base `allTools` path:

- `shell`
- `file_read`
- `file_write`
- `file_edit`
- `git_operations`
- `image_info`
- `memory_store`
- `memory_recall`
- `memory_list`
- `memory_forget`
- `delegate`
- `schedule`
- `spawn`

## Optional Tools (Config/Capability Dependent)

- `http_request`
- `web_search`
- `web_fetch`
- `browser`
- `screenshot`
- `composio`
- `browser_open`
- `hardware_board_info`
- `hardware_memory`
- `i2c`

## Additional Declared Tool Specs

- `cron_add`, `cron_list`, `cron_remove`, `cron_run`, `cron_runs`, `cron_update`
- `message`, `pushover`, `file_append`, `spi`

## Verify What Is Actually Enabled

```bash
nullclaw capabilities
nullclaw capabilities --json
```

This output is the source of truth for your current binary + config.

## Security Boundaries

Tool execution is constrained by:

- policy checks (`src/security/policy.zig`)
- allowed command/path constraints
- sandbox backend selection
- workspace restrictions
