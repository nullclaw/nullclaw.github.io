# NullClaw Chat UI Overview

NullClaw Chat UI is a static SvelteKit client for interacting with a NullClaw `channels.web` endpoint over WebSocket (`WebChannel v1`).

## Start In 5 Minutes

1. Start NullClaw with `channels.web` enabled.
2. Run Chat UI with `npm run dev`.
3. Pair with endpoint + 6-digit PIN.

See [Quick Start](/chat-ui/docs/quick-start).

## What It Does

- WebChannel pairing UX
- optional E2E bootstrap (X25519 + ChaCha20-Poly1305 path)
- streaming assistant rendering (`assistant_chunk` / `assistant_final`)
- tool timeline and approval flow visualization
- session restore from localStorage with TTL

## What It Does Not Do

- run providers or tools itself
- replace runtime channel configuration (`channels.web` still required in NullClaw)

## Key Source Anchors

- `src/lib/protocol/types.ts`
- `src/lib/protocol/client.svelte.ts`
- `src/lib/session/connection-controller.svelte.ts`
- `src/lib/stores/session.svelte.ts`
- `src/lib/session/auth-storage.ts`

## Read Next

1. [Quick Start](/chat-ui/docs/quick-start)
2. [Protocol](/chat-ui/docs/protocol)
3. [Architecture](/chat-ui/docs/architecture)
4. [Operations](/chat-ui/docs/operations)
