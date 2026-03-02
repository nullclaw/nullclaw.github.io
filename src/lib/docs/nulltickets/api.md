# API

## Conventions

- Content type: `application/json`
- Write idempotency: optional `Idempotency-Key`
- Lease-protected endpoints require `Authorization: Bearer <lease_token>`

## Discovery + Health

- `GET /health`
- `GET /openapi.json`
- `GET /.well-known/openapi.json`

## OpenTelemetry

- `POST /v1/traces`
- `POST /otlp/v1/traces`

OTLP attributes recognized for correlation:

- `nulltickets.run_id`
- `nulltickets.task_id`

## Pipelines

- `POST /pipelines`
- `GET /pipelines`
- `GET /pipelines/{id}`

## Tasks

- `POST /tasks`
- `POST /tasks/bulk`
- `GET /tasks?stage=&pipeline_id=&limit=&cursor=`
- `GET /tasks/{id}`

Dependencies/assignments:

- `POST /tasks/{id}/dependencies`
- `GET /tasks/{id}/dependencies`
- `POST /tasks/{id}/assignments`
- `GET /tasks/{id}/assignments`
- `DELETE /tasks/{id}/assignments/{agent_id}`

## Leases

- `POST /leases/claim`
- `POST /leases/{id}/heartbeat` (Bearer)

## Run Mutations

- `POST /runs/{id}/events` (Bearer)
- `GET /runs/{id}/events?limit=&cursor=`
- `POST /runs/{id}/gates` (Bearer)
- `GET /runs/{id}/gates`
- `POST /runs/{id}/transition` (Bearer)
- `POST /runs/{id}/fail` (Bearer)

## Artifacts + Ops

- `POST /artifacts`
- `GET /artifacts?task_id=&run_id=&limit=&cursor=`
- `GET /ops/queue?near_expiry_ms=&stuck_ms=`

## Pagination Contract

Paginated endpoints return:

```json
{
  "items": [],
  "next_cursor": null
}
```

`next_cursor = null` means end of list.

## Error Format

```json
{
  "error": {
    "code": "not_found",
    "message": "Task not found"
  }
}
```
