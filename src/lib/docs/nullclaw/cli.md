# CLI Reference

Top-level command routing is implemented in `src/main.zig`.

## First Commands To Learn

```bash
nullclaw onboard --interactive
nullclaw agent -m "hello"
nullclaw gateway
nullclaw status
nullclaw doctor
nullclaw capabilities --json
```

## Top-Level Commands

- `onboard`
- `agent`
- `gateway`
- `service`
- `status`
- `version`
- `doctor`
- `cron`
- `channel`
- `skills`
- `hardware`
- `migrate`
- `memory`
- `workspace`
- `capabilities`
- `models`
- `auth`
- `update`
- `help`

## High-Value Command Groups

### `cron`

`list`, `add`, `add-agent`, `once`, `once-agent`, `remove`, `pause`, `resume`, `run`, `update`, `runs`

### `channel`

`list`, `start`, `status`, `add`, `remove`

### `memory`

`stats`, `count`, `reindex`, `search`, `get`, `list`, `drain-outbox`, `forget`

### `service`

`install`, `start`, `stop`, `restart`, `status`, `uninstall`

## Important Behavior Notes

- `channel start --all` is intentionally rejected. Use `gateway` for full runtime orchestration.
- For feature availability questions, `capabilities` is more reliable than config assumptions.
- `help` output is generated from `printUsage()` in `src/main.zig`.
