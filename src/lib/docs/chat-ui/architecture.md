# Architecture

Chat UI is intentionally layered so transport/session logic stays outside presentation components.

## Layer Model

### 1. Presentation Layer

- `src/routes/+page.svelte`
- `src/lib/components/*`

Responsibility: render state and emit user intent.

### 2. Connection Orchestration

- `src/lib/session/connection-controller.svelte.ts`

Responsibility:

- create/replace `NullclawClient`
- pairing/connect lifecycle
- auth restore/logout handling
- feed protocol events into session store

### 3. Session Store

- `src/lib/stores/session.svelte.ts`

Responsibility:

- chat timeline
- tool call/result timeline
- approval requests
- streaming/error cleanup

### 4. Transport + Protocol

- `src/lib/protocol/client.svelte.ts`
- `src/lib/protocol/types.ts`
- `src/lib/protocol/e2e.ts`

Responsibility:

- envelope validation
- websocket state machine
- reconnect backoff
- E2E encrypt/decrypt helpers

### 5. Persistence + Preferences

- `src/lib/session/auth-storage.ts`
- `src/lib/theme.ts`
- `src/lib/ui/preferences.ts`

Responsibility: auth TTL storage + theme/effects storage.

## Client States

`NullclawClient` states:

- `disconnected`
- `connecting`
- `pairing`
- `paired`
- `chatting`

## Core Invariants

- components do not manage websocket lifecycle directly
- unauthorized session invalidates persisted auth
- timeline rendering is store-driven from protocol envelopes
