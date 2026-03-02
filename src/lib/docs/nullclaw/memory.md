# Memory

Memory runtime is implemented in `src/memory/*` with backend descriptors in `src/memory/engines/registry.zig`.

## Known Backend Names

- `none`
- `markdown`
- `memory`
- `api`
- `sqlite`
- `lucid`
- `redis`
- `lancedb`
- `postgres`

Actual availability depends on build flags (`-Dengines=...`).

## Memory CLI

Implemented in `runMemory` (`src/main.zig`):

```bash
nullclaw memory stats
nullclaw memory count
nullclaw memory reindex
nullclaw memory search "query" --limit 6
nullclaw memory get <key>
nullclaw memory list --category session --limit 20
nullclaw memory drain-outbox
nullclaw memory forget <key>
```

## Runtime Layers

- `engines/*`: backend implementations
- `retrieval/*`: candidate fusion and ranking pipeline
- `lifecycle/*`: hygiene, cache, snapshot and lifecycle helpers
- `vector/*`: embedding/vector sync utilities and stores

## Diagnosis Pattern

1. Check backend/build reality:

```bash
nullclaw capabilities
```

2. Validate config and runtime wiring:

```bash
nullclaw doctor
nullclaw memory stats
```

3. Verify retrieval behavior:

```bash
nullclaw memory search "<query>" --limit 6
```

## Notes

- `memory forget` behavior depends on backend mutability.
- `reindex` and `drain-outbox` are especially relevant when vector sync layers are enabled.
- If backend init fails, CLI prints specific hints for unknown/disabled backends.
