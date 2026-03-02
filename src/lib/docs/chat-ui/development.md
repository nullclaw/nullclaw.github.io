# Development

This guide covers local development setup, project structure, code conventions, testing, and how to add new features to NullClaw Chat UI.

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

Verify your versions:

```bash
node -v   # v20.x or higher
npm -v    # 10.x or higher
```

## Setup

```bash
git clone https://github.com/nullclaw/nullclaw-chat-ui.git
cd nullclaw-chat-ui
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build to `build/` |
| `npm run preview` | Preview the production build |
| `npm run test` | Run Vitest test suite |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run check` | SvelteKit sync + svelte-check (type checking) |
| `npm run check:watch` | Type checking in watch mode |

## Project Structure

```text
src/
  routes/
    +layout.svelte          App shell
    +layout.ts              SSR disabled
    +page.svelte            Main page (composition root)
  lib/
    components/             UI components
      PairingScreen.svelte  Connection + PIN entry
      ChatScreen.svelte     Message list + input
      StatusBar.svelte      Endpoint, session info, settings
      MessageBubble.svelte  Individual message rendering
      ToolCallBlock.svelte  Tool call/result timeline
      ApprovalPrompt.svelte Approve/reject prompt
    protocol/               WebChannel client + types + crypto
      client.svelte.ts      WebSocket lifecycle, reconnect, E2E
      types.ts              Protocol types + envelope constructors
      e2e.ts                X25519 + ChaCha20-Poly1305
    session/                Orchestration + auth storage
      connection-controller.svelte.ts
      auth-storage.ts
    stores/                 Reactive state
      session.svelte.ts     Timeline store (messages, tools, approvals)
    ui/                     UI preferences
      preferences.ts        Load/save/apply preferences
    theme.ts                Theme + effects persistence
```

## Code Conventions

### Svelte 5 Runes

The project uses Svelte 5 runes exclusively:

```svelte
<script lang="ts">
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    console.log('count changed:', count);
  });
</script>
```

- Use `$state` for reactive variables.
- Use `$derived` for computed values.
- Use `$effect` for side effects.
- Avoid legacy `$:` reactive declarations.

### Architecture Rules

- **Keep components thin.** Place orchestration and side effects in dedicated modules (`connection-controller`, `session store`), not in `.svelte` files.
- **Keep transport logic in `protocol/*` and `connection-controller`.** Components must never create or own WebSocket connections.
- **Guard all unknown payloads.** Use `asObject`, `asString`, `asBoolean`-style checks when processing protocol data.
- **Isolate side effects.** WebSocket, `localStorage`, and `document` class mutations belong in dedicated modules, not in components.

### TypeScript

- Strict mode is enabled.
- All protocol types are defined in `src/lib/protocol/types.ts`.
- Use explicit return types on public functions.

## Testing

The project uses **Vitest** with a `jsdom` environment and **@testing-library/svelte** for component tests.

### Running Tests

```bash
npm run test          # Single run
npm run test:watch    # Watch mode
```

### Test Coverage

Tests cover three layers:

**Protocol layer:**

- Envelope constructor correctness
- Key generation, shared-key derivation, encrypt/decrypt roundtrip
- Connect, pair, and send flows
- `pairing_result`, `assistant_final`, `assistant_chunk` handling
- Reconnect and backoff behavior
- Guards against duplicate connect and send-on-closed-socket

**Session and persistence layer:**

- Streaming chunk/final behavior
- Legacy content fallback
- Tool and approval correlation
- Error handling
- Auth save/load/clear flows, malformed/expired payload cleanup
- Session restore and local send-error behavior

**UI layer:**

- PIN sanitization and submit validation
- Endpoint/session rendering
- Theme/effects persistence and body class behavior

### Testing Principles

- One test should assert one behavioral guarantee.
- Prefer observable behavior over private implementation details.
- Use a mocked `WebSocket` for transport tests.
- Use in-memory mocked `Storage` for persistence tests.
- Use user-level interactions (`@testing-library/user-event`) for component tests.

### Pre-Merge Checklist

Before merging any change:

1. `npm run test` — all tests pass
2. `npm run check` — no type errors
3. Manual smoke test: pairing, send message, error handling, logout, reconnect

## Adding Features

### 1. Identify the Target Layer

Determine which layer your feature touches:

- **Protocol event** — a new message type on the wire
- **Session model** — new state to track in the timeline store
- **UI behavior** — a new component or interaction

### 2. Implement

1. Add or update protocol types and validation in `types.ts`.
2. Handle the event in `connection-controller` and/or `session.handleEvent()`.
3. Update or create UI components.
4. Add tests for protocol, store, and component behavior.

### 3. Verify

```bash
npm run test
npm run check
```

## Debugging Tips

- **StatusBar diagnostics** — Click the status bar to open the diagnostics modal. It shows the current endpoint, session state, E2E status, and connection info.
- **Reconnect testing** — Force-close the WebSocket on the backend to verify reconnect behavior and backoff timing.
- **Session restore** — Inspect and reset `localStorage` keys (`nullclaw_ui_auth_v1`, `nullclaw_ui_theme`, `nullclaw_ui_effects`) when debugging restore logic.
- **Check the error bar** — The chat screen shows a persistent error bar when the client encounters issues. Check it first before diving into console logs.
