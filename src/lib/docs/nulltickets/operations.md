# Operations

## Start + Runtime Params

```bash
./zig-out/bin/nulltickets --port 7700 --db /tmp/nulltickets.db
```

Defaults:

- bind: `127.0.0.1`
- port: `7700`
- db: `nulltickets.db`

## Common Operational Queries

```bash
curl -s http://127.0.0.1:7700/health
curl -s http://127.0.0.1:7700/ops/queue
curl -s 'http://127.0.0.1:7700/tasks?limit=50'
curl -s 'http://127.0.0.1:7700/artifacts?limit=50'
```

## Idempotency Strategy

For retries of write calls from external orchestrators:

```bash
-H 'Idempotency-Key: <stable-request-key>'
```

If same key is reused with different payload, API returns `409 idempotency_conflict`.

## Lease Lifecycle Tips

- store `lease_id` + `lease_token` from claim response
- heartbeat before expiry for long tasks
- pass lease token to all run mutations (`events`, `gates`, `transition`, `fail`)

Common auth/lease failures:

- `401 unauthorized` (invalid/missing token)
- `404 not_found` (lease/run not active)
- `410 expired` (lease expired)

## Retry + Dead Letter Behavior

Set retry policy when creating tasks:

```json
"retry_policy": {
  "max_attempts": 3,
  "retry_delay_ms": 1000,
  "dead_letter_stage": "done"
}
```

After repeated failure beyond policy, task can be moved to dead-letter stage and marked with reason (for example `max_attempts_exceeded`).

## OTLP Ingest Notes

- JSON OTLP payloads are parsed and spans extracted
- non-JSON payloads can still be stored as raw batch blobs
- use `run_id`/`task_id` attributes for correlation into task execution data
