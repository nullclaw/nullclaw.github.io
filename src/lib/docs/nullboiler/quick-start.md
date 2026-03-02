# Quick Start

This flow is aligned with current behavior in `build.zig`, `src/main.zig`, `src/api.zig`, `src/engine.zig`, `src/dispatch.zig`, and `tests/mock_worker.py`.

## Prerequisites

- Zig `0.15.2`
- Python 3
- `curl`

## 1. Clone And Build

```bash
git clone https://github.com/nullclaw/nullboiler.git
cd nullboiler
zig build -Doptimize=ReleaseSmall
```

## 2. Start Mock Worker (Terminal A)

```bash
python3 tests/mock_worker.py 9999
```

The mock worker accepts `POST /webhook` and returns a synchronous `response` field.

## 3. Start NullBoiler (Terminal B)

```bash
./zig-out/bin/nullboiler --port 8080 --db /tmp/nullboiler.db
```

## 4. Register Worker

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

## 5. Create Run

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

## 6. Verify Run Progress

```bash
curl -s http://127.0.0.1:8080/health
curl -s http://127.0.0.1:8080/runs
curl -s http://127.0.0.1:8080/runs/<RUN_ID>/steps
curl -s http://127.0.0.1:8080/runs/<RUN_ID>/events
```

## Optional: Auth + Idempotency

Enable token:

```bash
./zig-out/bin/nullboiler --token my-secret
```

Then call protected endpoints with:

```bash
-H 'Authorization: Bearer my-secret'
```

Run creation idempotency is supported via request header (`Idempotency-Key`) or body field (`idempotency_key`).

## Common Failure Modes

- `webhook protocol requires explicit URL path`: use `/webhook`, not only host:port.
- run has no progress: worker tags do not match step `worker_tags`.
- `401 unauthorized`: token mode enabled but bearer header missing/invalid.

## Next Steps

1. [Step Types](/nullboiler/docs/step-types)
2. [Worker Protocols](/nullboiler/docs/worker-protocols)
3. [API](/nullboiler/docs/api)
4. [Operations](/nullboiler/docs/operations)
