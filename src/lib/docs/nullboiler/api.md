# API

## Conventions

- Content type: `application/json`
- Optional auth: set `--token` or `api_token`
- In token mode, `/health` and `/metrics` remain public
- Run creation idempotency: `Idempotency-Key` header or `idempotency_key` body field

## Endpoint Groups

### Health

- `GET /health`
- `GET /metrics`

### Runs

- `POST /runs`
- `GET /runs`
- `GET /runs/{id}`
- `POST /runs/{id}/cancel`
- `POST /runs/{id}/retry`

### Steps

- `GET /runs/{id}/steps`
- `GET /runs/{id}/steps/{step_id}`
- `POST /runs/{id}/steps/{step_id}/approve`
- `POST /runs/{id}/steps/{step_id}/reject`
- `POST /runs/{id}/steps/{step_id}/signal`
- `GET /runs/{id}/steps/{step_id}/chat`

### Events

- `GET /runs/{id}/events`

### Workers

- `GET /workers`
- `POST /workers`
- `DELETE /workers/{id}`

### Admin

- `POST /admin/drain`

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

## Typical Run Debug Sequence

```bash
curl -s http://127.0.0.1:8080/runs/<RUN_ID>
curl -s http://127.0.0.1:8080/runs/<RUN_ID>/steps
curl -s http://127.0.0.1:8080/runs/<RUN_ID>/events
```

## Error Shape

```json
{
  "error": {
    "code": "bad_request",
    "message": "steps must be an array"
  }
}
```
