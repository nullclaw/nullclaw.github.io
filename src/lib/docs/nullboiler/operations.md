# Operations

## Start Modes

Default values (from `src/config.zig`):

- host: `127.0.0.1`
- port: `8080`
- db: `nullboiler.db`

Run with config file:

```bash
./zig-out/bin/nullboiler --config config.json
```

CLI flags override config:

- `--host`
- `--port`
- `--db`
- `--token`

## Quick Health Checks

```bash
curl -s http://127.0.0.1:8080/health
curl -s http://127.0.0.1:8080/workers
curl -s 'http://127.0.0.1:8080/runs?limit=20&offset=0'
```

## Auth Mode Check

```bash
./zig-out/bin/nullboiler --token my-secret

curl -s http://127.0.0.1:8080/health
curl -s http://127.0.0.1:8080/runs -H 'Authorization: Bearer my-secret'
```

## Drain Mode

```bash
curl -s -X POST http://127.0.0.1:8080/admin/drain
```

After drain is enabled, new `POST /runs` requests return `503`.

## Worker Hygiene Checklist

- protocol explicitly set (`webhook`, `api_chat`, `openai_chat`)
- webhook URLs include explicit path
- tags align with workflow `worker_tags`
- `max_concurrent` matches real worker capacity

## Stuck Run Playbook

1. check run status (`GET /runs/{id}`)
2. inspect steps (`GET /runs/{id}/steps`)
3. inspect event stream (`GET /runs/{id}/events`)
4. verify worker availability and tag match (`GET /workers`)
