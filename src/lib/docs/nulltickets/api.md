# API

## Conventions

- content type: `application/json`
- write idempotency: optional `Idempotency-Key`
- lease-protected endpoints require `Authorization: Bearer <lease_token>`

## Discovery

- `GET /health`
- `GET /openapi.json`
- `GET /.well-known/openapi.json`

## OpenTelemetry Ingest

- `POST /v1/traces`
- `POST /otlp/v1/traces`

Correlation attributes recognized in spans:

- `nulltickets.run_id`
- `nulltickets.task_id`

## Main Endpoint Groups

### Pipelines

- `POST /pipelines`
- `GET /pipelines`
- `GET /pipelines/{id}`

### Tasks

- `POST /tasks`
- `POST /tasks/bulk`
- `GET /tasks`
- `GET /tasks/{id}`
- `POST /tasks/{id}/dependencies`
- `GET /tasks/{id}/dependencies`
- `POST /tasks/{id}/assignments`
- `GET /tasks/{id}/assignments`
- `DELETE /tasks/{id}/assignments/{agent_id}`

### Leases + Run Mutations

- `POST /leases/claim`
- `POST /leases/{id}/heartbeat` (Bearer)
- `POST /runs/{id}/events` (Bearer)
- `GET /runs/{id}/events`
- `POST /runs/{id}/gates` (Bearer)
- `GET /runs/{id}/gates`
- `POST /runs/{id}/transition` (Bearer)
- `POST /runs/{id}/fail` (Bearer)

### Artifacts + Ops

- `POST /artifacts`
- `GET /artifacts`
- `GET /ops/queue`

## Pagination Contract

Paginated endpoints return:

```json
{
  "items": [],
  "next_cursor": null
}
```

`next_cursor = null` means no more pages.

## Error Shape

```json
{
  "error": {
    "code": "not_found",
    "message": "Task not found"
  }
}
```
