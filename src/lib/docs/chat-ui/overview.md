# NullClaw Chat UI

NullClaw Chat UI is a terminal-style web interface for interacting with a [NullClaw](/nullclaw/docs/getting-started) agent. It connects over WebSocket using the **WebChannel v1** protocol and provides a full-featured chat experience with end-to-end encryption, streaming responses, tool-call rendering, and an approval flow.

The app is a static SPA built with **Svelte 5** and **SvelteKit 2**. No server-side rendering is required — just serve the build output from any static host or CDN.

## Key Features

- **E2E Encryption** — X25519 key exchange + ChaCha20-Poly1305 message encryption, negotiated during the pairing handshake.
- **Streaming Responses** — Assistant output arrives as `assistant_chunk` events and is rendered incrementally until `assistant_final` closes the stream.
- **Tool Timeline** — `tool_call` and `tool_result` events are rendered inline so you can follow what the agent is doing step by step.
- **Approval Flow** — When the agent requests permission (`approval_request`), the UI presents an approve/reject prompt and sends the decision back.
- **Session Restore** — Auth credentials and the shared encryption key are persisted in `localStorage` with TTL expiration, so page reloads reconnect automatically.
- **5 Themes + CRT Effects** — Matrix, Dracula, Synthwave, Amber, and Light themes with optional CRT scanline and glow effects. See [Theming](/chat-ui/docs/theming).

## Tech Stack

| Dependency | Version |
|---|---|
| Svelte | 5 (Runes API) |
| SvelteKit | 2 |
| Vite | 7 |
| TypeScript | 5 |
| Vitest | 4 |
| @noble/ciphers | 2 (ChaCha20-Poly1305) |
| marked | 17 (Markdown rendering) |
| highlight.js | 11 (Syntax highlighting) |

The app is built as a static site using `@sveltejs/adapter-static` with `fallback: index.html` and `ssr = false`.

## Quick Start

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

### Install and Run

```bash
git clone https://github.com/nullclaw/nullclaw-chat-ui.git
cd nullclaw-chat-ui
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Pair with an Agent

1. Enter the WebSocket endpoint (default: `ws://127.0.0.1:32123/ws`).
2. Enter the 6-digit pairing PIN displayed by the gateway.
3. After a successful `pairing_result`, the UI switches to chat mode.

## Connecting to NullClaw

The Chat UI is a frontend-only application. It requires a running NullClaw gateway that exposes a WebSocket endpoint. To set one up:

```bash
# In the nullclaw project directory
./zig-out/bin/nullclaw gateway
```

The gateway will display a pairing PIN on startup. Enter that PIN along with the WebSocket URL in the Chat UI pairing screen.

For full gateway setup instructions, see [NullClaw Getting Started](/nullclaw/docs/getting-started).

## What's Next

- [Architecture](/chat-ui/docs/architecture) — 5-layer design, state machine, data flow
- [WebChannel v1 Protocol](/chat-ui/docs/protocol) — Envelope format, events, encryption
- [Development](/chat-ui/docs/development) — Local setup, conventions, testing
- [Deployment](/chat-ui/docs/deployment) — Build, hosting, troubleshooting
- [Theming](/chat-ui/docs/theming) — Themes, CSS variables, CRT effects
