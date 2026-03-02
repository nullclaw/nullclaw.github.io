# Architecture

Chat UI architecture is layered to keep transport logic separate from UI rendering.

## Layering

### 1. Presentation

- `src/routes/+page.svelte`
- `src/lib/components/*`

Components render state and emit user actions. They do not own WebSocket transport.

### 2. Connection Orchestration

- `src/lib/session/connection-controller.svelte.ts`

Responsibilities:

- create/replace `NullclawClient`
- pairing flow execution
- session restore from storage
- forwarding envelopes into session store
- logout/disconnect lifecycle

### 3. Session Store

- `src/lib/stores/session.svelte.ts`

Tracks:

- chat message timeline
- tool call/result timeline
- approval requests
- error state and streaming lifecycle cleanup

### 4. Transport and Protocol

- `src/lib/protocol/client.svelte.ts`
- `src/lib/protocol/types.ts`
- `src/lib/protocol/e2e.ts`

Contains:

- envelope parsing/validation
- websocket connection state machine
- reconnect policy
- E2E payload encrypt/decrypt helpers

### 5. Persistence and Preferences

- `src/lib/session/auth-storage.ts`
- `src/lib/theme.ts`
- `src/lib/ui/preferences.ts`

Manages auth TTL persistence, theme class application, and effect toggles.

## Client States

`NullclawClient` state values:

- `disconnected`
- `connecting`
- `pairing`
- `paired`
- `chatting`

## Core Invariants

- WebSocket lifecycle is owned by protocol + controller layers, not components.
- Store handles event-to-UI projection and stream finalization.
- `unauthorized` events clear auth artifacts and reset session.
