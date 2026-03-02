# Deployment

NullClaw Chat UI builds to a fully static bundle that can be served from any static hosting provider or CDN. No server-side runtime is required.

## Build Process

### Production Build

```bash
npm ci
npm run test
npm run check
npm run build
```

The build output is generated into the `build/` directory.

### Build Configuration

The project uses `@sveltejs/adapter-static` with the following settings:

- **Output directory:** `build/`
- **Fallback:** `index.html` (enables client-side SPA routing)
- **SSR:** disabled (`ssr = false`)

This means the entire app is a client-side SPA — all routing is handled in the browser.

## Hosting Options

Since the output is a static bundle, you can deploy it anywhere that serves static files:

| Host | Notes |
|---|---|
| GitHub Pages | Enable SPA fallback via a `404.html` that copies `index.html` |
| Netlify | Add `_redirects` file: `/* /index.html 200` |
| Vercel | Works out of the box with the SPA framework preset |
| Cloudflare Pages | Configure `index.html` as the 404 fallback |
| Nginx | Use `try_files $uri $uri/ /index.html` |
| Apache | Use `.htaccess` with `FallbackResource /index.html` |
| S3 + CloudFront | Set the error document to `index.html` with status 200 |

### Important: SPA Fallback

Because the app uses client-side routing, your hosting must be configured to serve `index.html` for all routes that don't match a static file. Without this, direct navigation to `/chat` or page refreshes will return 404.

### Nginx Example

```nginx
server {
    listen 80;
    server_name chat.example.com;
    root /var/www/nullclaw-chat-ui/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Runtime Configuration

### WebSocket Endpoint

The WebSocket endpoint is **not** configured at build time. Instead, the user enters it in the pairing screen at runtime. The default value is:

```
ws://127.0.0.1:32123/ws
```

To change the default endpoint, edit the initial `url` value in `src/lib/components/PairingScreen.svelte`.

### No Environment Variables

The Chat UI does not read any environment variables at runtime. All configuration is either entered by the user (endpoint, PIN) or persisted in `localStorage` (theme, effects, auth).

## Sensitive Data Handling

### localStorage Keys

The app stores session credentials in `localStorage` under the key `nullclaw_ui_auth_v1`:

| Field | Description |
|---|---|
| `endpoint` | WebSocket URL |
| `access_token` | Bearer token from pairing |
| `shared_key` | Base64url-encoded E2E encryption key |
| `expires_at` | Token expiry timestamp |

### Security Expectations

- **Cleared on logout** — all auth data is removed when the user logs out.
- **Cleared on `unauthorized`** — if the backend rejects the token, all credentials are wiped.
- **TTL enforcement** — expired tokens are not used for session restore; the stored payload is cleaned up.
- **No untrusted environments** — avoid deploying to shared or public kiosk machines where other users can inspect `localStorage`.

### HTTPS in Production

Always serve the Chat UI over HTTPS in production. The WebSocket connection should use `wss://` rather than `ws://` to ensure encryption in transit, in addition to the E2E encryption applied at the application layer.

## Troubleshooting

### Pairing Does Not Start

- **Check the endpoint format.** It must be a valid WebSocket URL (e.g., `ws://host:port/ws` or `wss://host:port/ws`).
- **Verify the backend is reachable.** Open the endpoint URL in a browser or use `curl` to confirm connectivity.
- **Check the PIN.** It must be exactly 6 digits.
- **Check for CORS or proxy issues.** If the gateway is behind a reverse proxy, ensure WebSocket upgrade headers are forwarded.

### Messages Are Not Sent

- **Check client state.** Messages can only be sent in the `paired` or `chatting` state. The status bar shows the current state.
- **Check for socket closure.** The WebSocket may have closed or the token may have been rejected.
- **Check the error bar.** The chat screen displays a persistent error message when something goes wrong.

### Session Does Not Restore After Reload

- **Token expired.** The stored `expires_at` timestamp has passed. The user must re-pair.
- **Invalid shared key.** The stored key is corrupted. Clear `localStorage` and re-pair.
- **Backend rejects the token.** The gateway may have restarted or invalidated the token. An `unauthorized` error clears local state automatically.

### White Screen After Deploy

- **Missing SPA fallback.** The hosting provider is returning 404 for client-side routes. Configure the `index.html` fallback as described in [Hosting Options](#hosting-options).
- **Asset path mismatch.** Ensure assets are served from the correct base path. The default build assumes the app is served from `/`.

### Release Checklist

1. Ensure docs match current runtime behavior.
2. Run `npm run test` and `npm run check`.
3. Manual verification: pairing, chat, approvals, logout.
4. Build the production bundle.
5. Confirm the diagnostics panel reflects actual E2E and runtime details.
6. Deploy and verify SPA routing works on the target host.
