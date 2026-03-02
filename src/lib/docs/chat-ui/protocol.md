# WebChannel v1 Protocol

Protocol types are defined in `src/lib/protocol/types.ts`, client parsing in `client.svelte.ts`.

## Envelope Shape

```json
{
  "v": 1,
  "type": "event_name",
  "session_id": "string",
  "agent_id": "optional",
  "request_id": "optional",
  "payload": {}
}
```

Validation rules in client:

- `v === 1`
- `type` is one of known event names
- `session_id` is non-empty string

## Event Types

### Client → Runtime

- `pairing_request`
- `user_message`
- `approval_response`

### Runtime → Client

- `pairing_result`
- `assistant_chunk`
- `assistant_final`
- `tool_call`
- `tool_result`
- `approval_request`
- `error`

## Pairing Flow

1. Connect to WebSocket endpoint.
2. Send `pairing_request` with pairing code and optional client public key.
3. Receive `pairing_result` with `access_token` and optional E2E public key.
4. Derive shared key and persist auth/session info.

## E2E Payload

When enabled, message data is sent as:

```json
{
  "nonce": "base64url",
  "ciphertext": "base64url"
}
```

Crypto path in code:

- key exchange: X25519
- key derivation: SHA-256 over domain-separated input
- symmetric encryption: ChaCha20-Poly1305

## Reconnect Logic

Client reconnect attempts require:

- unexpected socket close
- previous state was `paired` or `chatting`
- valid access token present
- reconnect flag enabled

Backoff parameters in source:

- base delay: 1000 ms
- max delay: 30000 ms
- jitter: 50-100%
