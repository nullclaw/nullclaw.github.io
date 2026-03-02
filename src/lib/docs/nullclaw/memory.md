# Memory

Memory runtime lives in `src/memory/*` with backend descriptors in `src/memory/engines/registry.zig`.

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

## Fast Verification Flow

```bash
nullclaw capabilities
nullclaw doctor
nullclaw memory stats
nullclaw memory search "hello" --limit 5
```

## Memory CLI Commands

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

## Internal Layers

- `engines/*`: backend implementations
- `retrieval/*`: ranking/fusion pipeline
- `lifecycle/*`: hygiene and lifecycle tasks
- `vector/*`: embedding/vector sync helpers

## Common Issues

- backend configured but unavailable: rebuild with needed engine flags
- forget/reindex behavior differs by backend mutability
- retrieval quality issues often come from backend index state (run `reindex`)
