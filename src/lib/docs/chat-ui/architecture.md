# Architecture

NullClaw Chat UI follows a strict 5-layer architecture that keeps data flow predictable, isolates transport logic from visual components, and supports safe session restoration after page reloads.

## Design Goals

- Keep data flow predictable from transport to UI.
- Isolate protocol and transport logic from visual components.
- Support safe session restoration after page reload.
- Prefer explicit state transitions and explicit error handling.

## 5-Layer Architecture

```text
+----------------------------------------------------------+
|  1. Presentation                                          |
|     src/routes/  +  src/lib/components/                   |
+----------------------------------------------------------+
|  2. Application Orchestration                             |
|     src/lib/session/connection-controller.svelte.ts       |
+----------------------------------------------------------+
|  3. Domain State                                          |
|     src/lib/stores/session.svelte.ts                      |
+----------------------------------------------------------+
|  4. Transport + Protocol                                  |
|     src/lib/protocol/client.svelte.ts                     |
|     src/lib/protocol/types.ts                             |
|     src/lib/protocol/e2e.ts                               |
+----------------------------------------------------------+
|  5. Persistence + UI Preferences                          |
|     src/lib/session/auth-storage.ts                       |
|     src/lib/ui/preferences.ts  +  src/lib/theme.ts        |
+----------------------------------------------------------+
```

### Layer 1 — Presentation

**Location:** `src/routes/`, `src/lib/components/`

- `+page.svelte` is the top-level composition root.
- Components in `src/lib/components/*` are presentation-focused and do not own transport logic.
- User actions are passed through callbacks: `onSend`, `onConnect`, `onApproval`, `onLogout`.

### Layer 2 — Application Orchestration

**Location:** `src/lib/session/connection-controller.svelte.ts`

The connection controller creates and manages the lifecycle of `NullclawClient`. It orchestrates:

- `connectWithPairing(url, code)` — initiate a new pairing session
- `restoreSavedSession()` — reconnect from persisted auth
- `sendMessage(content)` — send a user message
- `sendApproval(id, requestId, approved)` — respond to an approval request
- `logout()` — disconnect and clear credentials

The controller bridges transport events into session store updates and persists/restores auth and the shared encryption key via `auth-storage`.

### Layer 3 — Domain State

**Location:** `src/lib/stores/session.svelte.ts`

A single timeline store that holds:

- **messages** — user and assistant messages
- **toolCalls** — tool call / result pairs
- **approvals** — approval requests and responses
- **error** — local error state

Responsibilities:

- Normalize incoming protocol envelopes for rendering.
- Manage the assistant streaming lifecycle (chunk append and finalization).
- Ensure stream cleanup when an error arrives mid-stream.

### Layer 4 — Transport + Protocol

**Location:** `src/lib/protocol/`

| File | Purpose |
|---|---|
| `client.svelte.ts` | WebSocket lifecycle, envelope parsing/validation, reconnect policy (exponential backoff + jitter), E2E encryption/decryption, client state transitions |
| `types.ts` | Protocol event and payload types, envelope constructors |
| `e2e.ts` | X25519 key exchange, SHA-256 key derivation, ChaCha20-Poly1305 symmetric crypto |

See [WebChannel v1 Protocol](/chat-ui/docs/protocol) for full event and encryption details.

### Layer 5 — Persistence + UI Preferences

**Location:** `src/lib/session/auth-storage.ts`, `src/lib/ui/preferences.ts`, `src/lib/theme.ts`

- **auth-storage** — persists endpoint URL, access token, shared key, and expiry with TTL validation and payload integrity checks.
- **preferences + theme** — loads, saves, and applies theme and CRT effects settings via `localStorage` and `document.body` class mutations.

See [Theming](/chat-ui/docs/theming) for details on themes and effects.

## Data Flow

```text
User Action
    |
    v
+page.svelte  ──>  connectionController
                         |
                         v
                    NullclawClient  (WebSocket)
                         |
                    onEvent callback
                         |
                         v
                connectionController
                         |
                         v
               session.handleEvent(event)
                         |
                         v
                  Reactive store data
                         |
                         v
                   UI re-renders
```

1. `+page.svelte` creates the `connectionController`.
2. The controller subscribes to `NullclawClient.onEvent`.
3. The controller forwards envelopes to `session.handleEvent(event)`.
4. UI components render reactive store data.
5. User actions flow back to controller APIs.

## Client State Machine

`NullclawClient` tracks a reactive `state` property with these values:

```text
                          connect()
  disconnected ──────────────────────> connecting
       ^                                   |
       |                              onopen
       |                                   |
       |                     ┌─────────────┴──────────────┐
       |                     v                            v
  disconnect()           pairing                       paired
  socket close       (no token)                    (has token)
       ^                     |                            |
       |            pairing_result                   sendMessage()
       |                     |                            |
       |                     v                            v
       +<───────────────  paired ───────────────────> chatting
                                                         |
                                                         v
                                                    disconnected
                                                   (reconnect?)
```

### Transitions

| From | Trigger | To |
|---|---|---|
| `disconnected` | `connect()` | `connecting` |
| `connecting` | `onopen` (with token) | `paired` |
| `connecting` | `onopen` (no token) | `pairing` |
| `pairing` | successful `pairing_result` | `paired` |
| `paired` | `sendMessage()` | `chatting` |
| `paired` / `chatting` | `disconnect()` or socket close | `disconnected` |
| `disconnected` | auto-reconnect (if eligible) | `connecting` |

## Key Invariants

1. **UI components must not create or own WebSocket connections.** Only the controller and client manage transport.
2. **Only controller code writes auth persistence.** Components and stores never touch `localStorage` for auth.
3. **The session store must not perform network calls.** It is a pure state container.
4. **Errors during streaming must always clear in-flight streaming state.** No dangling partial messages.
5. **`unauthorized` must clear all local auth and session artifacts.** Token, shared key, and session data are wiped.

## Extending the System

### Adding a New Protocol Event

1. Add the event and payload type to `types.ts`.
2. Allow the event in `EVENT_TYPES` in `client.svelte.ts`.
3. Handle the event in `session.handleEvent()`.
4. Render it in the appropriate UI component.
5. Add tests for protocol, store, and component behavior.

### Adding a New UI Preference

1. Add persistence and coercion logic in `theme.ts` or a dedicated module.
2. Wire through `preferences.ts`.
3. Connect it from `+page.svelte` to the relevant component.
