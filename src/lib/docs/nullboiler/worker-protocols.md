# Worker Protocols

Protocol behavior is implemented in `src/worker_protocol.zig`, `src/dispatch.zig`, and `src/worker_response.zig`.

## Supported Protocols

- `webhook`
- `api_chat`
- `openai_chat`

## Registration Rules

### `webhook`

- URL must include explicit path
- valid: `http://127.0.0.1:9999/webhook`
- invalid: `http://127.0.0.1:9999`

### `openai_chat`

- requires `model` field in worker registration/config

## Dispatcher Request Shapes

### `webhook`

```json
{
  "message": "...",
  "text": "...",
  "session_key": "run_<RUN_ID>_step_<STEP_ID>",
  "session_id": "run_<RUN_ID>_step_<STEP_ID>"
}
```

### `api_chat`

```json
{
  "message": "...",
  "session_id": "run_<RUN_ID>_step_<STEP_ID>"
}
```

### `openai_chat`

```json
{
  "model": "anthropic/claude-sonnet-4-6",
  "stream": false,
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

## Accepted Worker Responses

NullBoiler accepts one of:

- `{ "response": "..." }`
- `{ "reply": "..." }`
- OpenAI-style `choices[0].message.content`

A pure ack payload without output (for example `{ "status": "received" }`) is treated as step failure (`ack_without_output`).
