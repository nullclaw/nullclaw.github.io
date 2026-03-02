# Operations

## Running With Config File

Defaults:

- host: `127.0.0.1`
- port: `8080`
- db: `nullboiler.db`

Run:

```bash
./zig-out/bin/nullboiler --config config.json
```

CLI flags override config:

- `--host`
- `--port`
- `--db`
- `--token`

## Common Checks

```bash
curl -s http://127.0.0.1:8080/health
curl -s http://127.0.0.1:8080/workers
curl -s http://127.0.0.1:8080/runs?limit=20&offset=0
```

## Auth-Enabled Example

```bash
./zig-out/bin/nullboiler --token my-secret

curl -s http://127.0.0.1:8080/health
curl -s http://127.0.0.1:8080/runs \
  -H 'Authorization: Bearer my-secret'
```

## Drain Mode

```bash
curl -s -X POST http://127.0.0.1:8080/admin/drain
```

After drain mode is on, orchestrator stops accepting new runs.

## Worker Hygiene

- Prefer explicit protocol selection (`webhook`, `api_chat`, `openai_chat`)
- Keep `tags` consistent with workflow `worker_tags`
- Ensure webhook URLs include path
- Set realistic `max_concurrent` by worker capacity

## Debugging Stuck Runs

1. Check run status: `GET /runs/{id}`
2. Inspect steps: `GET /runs/{id}/steps`
3. Inspect event stream: `GET /runs/{id}/events`
4. Verify workers: `GET /workers` (status/capacity/tag mismatch is common)
