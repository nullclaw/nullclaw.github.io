# Quick Start

This flow is aligned with current `nullboiler` behavior in `build.zig`, `src/main.zig`, `src/api.zig`, `src/engine.zig`, `src/dispatch.zig`, and `tests/mock_worker.py`.

## Prerequisites

- Zig **0.15.2**
- Python 3 (for test mock worker)
- `curl`

## Working Flow (From Real Repo Components)

### 1. Build

```bash
cd /Users/igorsomov/Code/NullBoiler
zig build -Doptimize=ReleaseSmall
```

### 2. Start a worker endpoint (terminal A)

Use the mock worker shipped in repo tests:

```bash
python3 tests/mock_worker.py 9999
```

It serves `POST /webhook` and returns JSON with a `response` field, which is exactly what `nullboiler` parser accepts.

### 3. Start NullBoiler (terminal B)

```bash
./zig-out/bin/nullboiler --port 8080 --db /tmp/nullboiler.db
```

Health check:

```bash
curl -s http://127.0.0.1:8080/health
```

### 4. Register worker

`webhook` protocol requires explicit URL path.

```bash
curl -s -X POST http://127.0.0.1:8080/workers \
  -H 'Content-Type: application/json' \
  -d '{
    "id":"test-worker-1",
    "url":"http://127.0.0.1:9999/webhook",
    "token":"dev-token",
    "protocol":"webhook",
    "tags":["tester"],
    "max_concurrent":2
  }'
```

### 5. Create a run

```bash
curl -s -X POST http://127.0.0.1:8080/runs \
  -H 'Content-Type: application/json' \
  -d '{
    "steps":[
      {
        "id":"step1",
        "type":"task",
        "worker_tags":["tester"],
        "prompt_template":"Hello {{input.name}}"
      }
    ],
    "input":{"name":"World"}
  }'
```

### 6. Inspect run + steps

```bash
curl -s http://127.0.0.1:8080/runs
curl -s http://127.0.0.1:8080/runs/<RUN_ID>
curl -s http://127.0.0.1:8080/runs/<RUN_ID>/steps
curl -s http://127.0.0.1:8080/runs/<RUN_ID>/events
```

## Approval + Signal Quick Check

Approval steps move to `waiting_approval` and are resumed by API calls:

```bash
curl -s -X POST http://127.0.0.1:8080/runs/<RUN_ID>/steps/<STEP_ID>/approve
curl -s -X POST http://127.0.0.1:8080/runs/<RUN_ID>/steps/<STEP_ID>/reject
curl -s -X POST http://127.0.0.1:8080/runs/<RUN_ID>/steps/<STEP_ID>/signal \
  -H 'Content-Type: application/json' \
  -d '{"signal":"deploy_ready","data":{"version":"1.0"}}'
```

## Important Notes

- Optional API auth is enabled by `--token` (or config `api_token`).
- With auth enabled, all endpoints except `/health` and `/metrics` require `Authorization: Bearer <token>`.
- `POST /runs` supports idempotency by `idempotency_key` in body.
- Workflow payload is validated before DB writes (duplicate step ids, unknown dependencies, missing required fields for specific step types).

## Next Steps

- [Overview](/nullboiler/docs/overview)
- [Architecture](/nullboiler/docs/architecture)
- [Step Types](/nullboiler/docs/step-types)
- [Worker Protocols](/nullboiler/docs/worker-protocols)
- [API](/nullboiler/docs/api)
