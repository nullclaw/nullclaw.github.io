# WebChannel v1 Protocol

Protocol types are defined in `src/lib/protocol/types.ts`; runtime behavior in client is implemented in `src/lib/protocol/client.svelte.ts`.

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

Client validation requires:

- `v === 1`
- `type` in known event set
- non-empty `session_id`

## Event Types

### Client -> Runtime

- `pairing_request`
- `user_message`
- `approval_response`

### Runtime -> Client

- `pairing_result`
- `assistant_chunk`
- `assistant_final`
- `tool_call`
- `tool_result`
- `approval_request`
- `error`

## Pairing Flow

1. open websocket connection
2. send `pairing_request` (PIN + optional client pub key)
3. receive `pairing_result` with `access_token`
4. optionally derive E2E shared key and persist auth state

## E2E Payload Format

```json
{
  "nonce": "base64url",
  "ciphertext": "base64url"
}
```

Crypto path in code:

- X25519 key exchange
- SHA-256 based key derivation
- ChaCha20-Poly1305 payload encryption

## Reconnect Policy

Reconnect is attempted only when:

- close was unexpected
- previous state was `paired` or `chatting`
- valid access token exists

Backoff parameters:

- base delay: `1000ms`
- max delay: `30000ms`
- jitter: `delay * (0.5 + Math.random() * 0.5)`
