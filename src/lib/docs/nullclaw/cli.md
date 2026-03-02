# CLI Reference

Top-level command routing lives in `src/main.zig`.

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

## Core Workflows

### Initialize and run runtime

```bash
nullclaw onboard --interactive
nullclaw gateway
```

### Run one-shot or interactive agent loop

```bash
nullclaw agent -m "hello"
nullclaw agent
```

### Diagnose and inspect

```bash
nullclaw status
nullclaw doctor
nullclaw capabilities --json
```

## Important Command Groups

### `cron`

`list`, `add`, `add-agent`, `once`, `once-agent`, `remove`, `pause`, `resume`, `run`, `update`, `runs`

### `channel`

`list`, `start`, `status`, `add`, `remove`

### `skills`

`list`, `install`, `remove`, `info`

### `hardware`

`scan`, `flash`, `monitor`

### `memory`

`stats`, `count`, `reindex`, `search`, `get`, `list`, `drain-outbox`, `forget`

### `workspace`

`reset-md` with options (`--dry-run`, `--include-bootstrap`, `--clear-memory-md`)

### `models`

`list`, `info`, `benchmark`, `refresh`

### `auth`

`login`, `status`, `logout` (provider-oriented auth management)

### `service`

`install`, `start`, `stop`, `restart`, `status`, `uninstall`

## Short Notes

- `channel start --all` is intentionally redirected; use `gateway` for full runtime orchestration.
- For mismatches between config and binary features, prefer `capabilities` output over assumptions.
- `help` output in CLI is generated from `printUsage()` in `main.zig`.
