# Operations

## Start Command

```bash
./zig-out/bin/nulltickets --port 7700 --db /tmp/nulltickets.db
```

Defaults:

- bind: `127.0.0.1`
- port: `7700`
- db: `nulltickets.db`

## Basic Operational Queries

```bash
curl -s http://127.0.0.1:7700/health
curl -s http://127.0.0.1:7700/ops/queue
curl -s 'http://127.0.0.1:7700/tasks?limit=50'
curl -s 'http://127.0.0.1:7700/artifacts?limit=50'
```

## Idempotency Usage

For retries from external orchestrators, reuse a stable key:

```bash
-H 'Idempotency-Key: <stable-request-key>'
```

Same key with a different request body returns `409 idempotency_conflict`.

## Lease Lifecycle Checklist

- persist `lease_id` and `lease_token` from claim response
- heartbeat before expiry
- send lease bearer token on run mutations (`events`, `gates`, `transition`, `fail`)

Common lease/auth failures:

- `401 unauthorized`
- `404 not_found`
- `410 expired`

## Retry + Dead Letter

Example task retry policy:

```json
"retry_policy": {
  "max_attempts": 3,
  "retry_delay_ms": 1000,
  "dead_letter_stage": "done"
}
```

After repeated failure beyond policy, task can be moved to dead-letter stage.

## OTLP Notes

- JSON OTLP payloads are parsed into span records
- non-JSON payloads can still be stored as raw batch blobs
- include run/task attributes for better trace-to-task correlation
