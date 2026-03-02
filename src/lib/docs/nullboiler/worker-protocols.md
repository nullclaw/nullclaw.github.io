# Worker Protocols

Worker protocol behavior is implemented in `src/worker_protocol.zig`, `src/dispatch.zig`, and `src/worker_response.zig`.

## Supported Protocols

- `webhook`
- `api_chat`
- `openai_chat`

## Registration Rules

## `webhook`

- URL **must** include explicit path.
- Example valid URL: `http://127.0.0.1:9999/webhook`
- Example invalid URL: `http://127.0.0.1:9999`

## `openai_chat`

- Requires `model` field in worker registration/config.

## Request Shapes Sent By Dispatcher

## `webhook`

```json
{
  "message": "...",
  "text": "...",
  "session_key": "run_<RUN_ID>_step_<STEP_ID>",
  "session_id": "run_<RUN_ID>_step_<STEP_ID>"
}
```

## `api_chat`

```json
{
  "message": "...",
  "session_id": "run_<RUN_ID>_step_<STEP_ID>"
}
```

## `openai_chat`

```json
{
  "model": "anthropic/claude-sonnet-4-6",
  "stream": false,
  "messages": [
    { "role": "user", "content": "..." }
  ]
}
```

## Accepted Worker Response Formats

`nullboiler` parser accepts one of:

- `{ "response": "..." }`
- `{ "reply": "..." }`
- OpenAI-style `choices[0].message.content`

If worker returns `{ "status": "received" }` without synchronous output, dispatcher treats it as failure for current step (`ack_without_output`).
