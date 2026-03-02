# WebChannel v1 Protocol

The Chat UI communicates with NullClaw over WebSocket using the **WebChannel v1** envelope format. This page covers the envelope structure, all supported events, the pairing handshake, end-to-end encryption, error handling, and the reconnection policy.

## Envelope Format

Every protocol message — in both directions — uses this envelope:

```json
{
  "v": 1,
  "type": "event_name",
  "session_id": "string",
  "agent_id": "optional string",
  "request_id": "optional string",
  "payload": {}
}
```

### Validation Rules

The client (`src/lib/protocol/client.svelte.ts`) validates every incoming envelope:

- `v` must equal `1`.
- `type` must be a known event name.
- `session_id` must be a non-empty string.

Envelopes that fail validation are silently ignored.

### Request Correlation

The `request_id` field correlates related events:

- `tool_call` and `tool_result` share the same `request_id`.
- `approval_request` and `approval_response` share the same `request_id`.

If a `tool_result` arrives without a `request_id`, the session store falls back to the latest unresolved tool call.

## Supported Events

### UI to Core

| Event | Payload | Description |
|---|---|---|
| `pairing_request` | `pairing_code`, `client_pub` | Initiates the pairing handshake |
| `user_message` | `content` (or `e2e`) | Sends a user message |
| `approval_response` | `approved` (boolean) | Responds to an approval request |

### Core to UI

| Event | Payload | Description |
|---|---|---|
| `pairing_result` | `access_token`, `expires_in?`, `e2e.agent_pub?` | Completes the pairing handshake |
| `assistant_chunk` | `content` (or `e2e`) | Streamed partial assistant response |
| `assistant_final` | `content` (or `e2e`) | Final assistant response (closes stream) |
| `tool_call` | tool call details | Agent is invoking a tool |
| `tool_result` | tool execution result | Result of a tool invocation |
| `approval_request` | approval prompt details | Agent requests user permission |
| `error` | `message`, `code?` | Error from the backend |

## Pairing Flow

The pairing handshake establishes identity, grants an access token, and optionally bootstraps end-to-end encryption.

```text
  Chat UI                                     NullClaw Gateway
    |                                               |
    |  1. WebSocket connect                         |
    |  ─────────────────────────────────────────>   |
    |                                               |
    |  2. onopen → state = "pairing"                |
    |                                               |
    |  3. pairing_request                           |
    |     { pairing_code, client_pub }              |
    |  ─────────────────────────────────────────>   |
    |                                               |
    |  4. pairing_result                            |
    |     { access_token, e2e: { agent_pub } }      |
    |  <─────────────────────────────────────────   |
    |                                               |
    |  5. Derive shared key → state = "paired"      |
    |                                               |
    |  6. Persist auth + shared key to localStorage |
    |                                               |
```

### Step by Step

1. The UI opens a WebSocket connection to the gateway endpoint.
2. On `onopen`, the client transitions to the `pairing` state.
3. The UI generates an X25519 key pair, then sends a `pairing_request` containing:
   - `pairing_code` — the 6-digit PIN displayed by the gateway.
   - `client_pub` — the client's public key, base64url-encoded.
4. The gateway validates the PIN and responds with `pairing_result`:
   - `access_token` — bearer token for subsequent requests.
   - `expires_in` (optional) — token TTL in seconds.
   - `e2e.agent_pub` (optional) — the agent's X25519 public key for E2E encryption.
5. If `agent_pub` is present, the client derives a shared symmetric key and enables E2E mode.
6. Auth credentials and the shared key are persisted to `localStorage` for session restore.

## E2E Encryption

End-to-end encryption is negotiated during pairing and, once enabled, protects all user and assistant messages.

**Implementation:** `src/lib/protocol/e2e.ts`

### Cryptographic Primitives

| Step | Algorithm |
|---|---|
| Key exchange | X25519 (via WebCrypto) |
| Key derivation | SHA-256 over `"webchannel-e2e-v1" \|\| shared_secret` |
| Symmetric encryption | ChaCha20-Poly1305 (via `@noble/ciphers`) |
| Nonce | Random 12 bytes per message |

### E2E Payload Format

When E2E is active, the `payload.e2e` field replaces the plaintext content:

```json
{
  "nonce": "base64url-encoded 12-byte nonce",
  "ciphertext": "base64url-encoded encrypted data"
}
```

### Outgoing Messages

When `sendMessage(content)` is called:

- **E2E key exists:** The plaintext object (`content`, `sender_id`) is serialized, encrypted, and sent as `payload.e2e`.
- **No E2E key:** The content is sent as `payload.content` in plaintext.

### Incoming Messages

For `assistant_chunk` and `assistant_final` events:

- If `payload.e2e` is present, the client attempts decryption with the shared key.
- If decryption fails, the event is still processed safely — the UI does not crash.

## Error Handling

### Error Event

When the gateway sends `type = "error"`, the expected payload is:

```json
{
  "message": "Human-readable error description",
  "code": "optional_error_code"
}
```

Malformed error payloads (missing `message`) produce a local client-side error event.

### Unauthorized Handling

When `payload.code === "unauthorized"`:

1. The client clears in-memory auth (`accessToken`, E2E key).
2. The controller clears persisted auth from `localStorage`.
3. The session store is fully reset.

The user is returned to the pairing screen.

### Streaming Error Recovery

If an error arrives while an assistant response is being streamed (`assistant_chunk` in progress), the streaming state is forcibly cleared. This prevents dangling partial messages.

## Reconnection Policy

The client automatically attempts to reconnect when **all** of these conditions hold:

1. The WebSocket closes unexpectedly (not a clean disconnect).
2. The previous state was `paired` or `chatting`.
3. An access token exists in memory.
4. Reconnect is enabled (`shouldReconnect = true`).

### Backoff Strategy

| Parameter | Value |
|---|---|
| Base delay | 1,000 ms |
| Growth | Exponential |
| Maximum delay | 30,000 ms |
| Jitter | 50-100% of the computed delay |

The jitter prevents thundering-herd reconnection storms when multiple clients lose connectivity at the same time.

### Reconnection Flow

```text
Socket closes unexpectedly
    |
    v
Check: was state paired/chatting? ──no──> stay disconnected
    |
   yes
    |
    v
Check: access token exists? ──no──> stay disconnected
    |
   yes
    |
    v
Wait (backoff + jitter)
    |
    v
connect() → state = "connecting"
    |
    v
onopen → state = "paired" (token sent automatically)
```

If reconnection fails, the backoff delay increases exponentially until the 30-second cap.
