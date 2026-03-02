# API

## Auth

When `--token` or config `api_token` is set:

- all endpoints require `Authorization: Bearer <token>`
- except `GET /health` and `GET /metrics`

## Health + Metrics

- `GET /health`
- `GET /metrics`

## Runs

- `POST /runs`
- `GET /runs`
- `GET /runs/{id}`
- `POST /runs/{id}/cancel`
- `POST /runs/{id}/retry`

`POST /runs` requires body with `steps` array and supports:

- `input` (optional)
- `callbacks` (optional)
- `idempotency_key` (optional)

## Steps

- `GET /runs/{id}/steps`
- `GET /runs/{id}/steps/{step_id}`
- `POST /runs/{id}/steps/{step_id}/approve`
- `POST /runs/{id}/steps/{step_id}/reject`
- `POST /runs/{id}/steps/{step_id}/signal`
- `GET /runs/{id}/steps/{step_id}/chat`

## Events

- `GET /runs/{id}/events`

## Workers

- `GET /workers`
- `POST /workers`
- `DELETE /workers/{id}`

## Admin

- `POST /admin/drain`

When drain mode is enabled, new `POST /runs` returns `503`.

## Minimal Run Payload

```json
{
  "steps": [
    {
      "id": "step1",
      "type": "task",
      "worker_tags": ["tester"],
      "prompt_template": "Hello {{input.name}}"
    }
  ],
  "input": { "name": "World" }
}
```

## Error Format

```json
{
  "error": {
    "code": "bad_request",
    "message": "steps must be an array"
  }
}
```
