# NullClaw Chat UI Overview

NullClaw Chat UI is a static SvelteKit client for connecting to a NullClaw `channels.web` endpoint over WebSocket (`WebChannel v1`).

## What It Does

- pairing flow with 6-digit PIN
- E2E bootstrap (X25519 + ChaCha20-Poly1305 path)
- streamed assistant rendering (`assistant_chunk` / `assistant_final`)
- tool call/result timeline
- approval request/response UX
- session restore with token TTL in localStorage

## Core Source Files

- `src/lib/protocol/types.ts`
- `src/lib/protocol/client.svelte.ts`
- `src/lib/session/connection-controller.svelte.ts`
- `src/lib/stores/session.svelte.ts`
- `src/lib/session/auth-storage.ts`

## Start Here

1. [Quick Start](/chat-ui/docs/quick-start)
2. [Architecture](/chat-ui/docs/architecture)
3. [WebChannel v1 Protocol](/chat-ui/docs/protocol)
4. [Development](/chat-ui/docs/development)
5. [Operations](/chat-ui/docs/operations)
