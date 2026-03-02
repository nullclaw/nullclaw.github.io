# Tools

Tool interfaces and runtime assembly are defined in `src/tools/root.zig`.

## Core Runtime Tool Set

Core tools assembled by `allTools`:

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

## Optional Tool Set (Config-Dependent)

Optional tools are enabled by config toggles (see `src/capabilities.zig`):

- `http_request`
- `browser`
- `screenshot`
- `composio`
- `browser_open`
- `hardware_board_info`
- `hardware_memory`
- `i2c`

## Additional Declared Tool Specs

Additional `tool_name` declarations in source include:

- `cron_add`, `cron_list`, `cron_remove`, `cron_run`, `cron_runs`, `cron_update`
- `message`, `pushover`, `file_append`, `spi`, `web_search`, `web_fetch`

## Capability Inspection

```bash
nullclaw capabilities
nullclaw capabilities --json
```

This is the recommended way to verify what your current runtime can actually execute.

## Security Boundaries

Tool execution is constrained by:

- security policy (`src/security/policy.zig`)
- command allowlists / risk classes
- workspace and allowed-path restrictions
- configured sandbox backend

## Notes

- Subagents use a reduced tool set (`subagentTools`) to avoid uncontrolled side effects.
- Memory tools are bound to active memory runtime when available.
