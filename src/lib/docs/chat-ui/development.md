# Development

## Requirements

- Node.js 20+
- npm 10+

## Local Run

```bash
git clone https://github.com/nullclaw/nullclaw-chat-ui.git
cd nullclaw-chat-ui
npm install
npm run dev
```

Default local URL: `http://localhost:5173`

For end-to-end runtime connection, complete [Quick Start](/chat-ui/docs/quick-start).

## NPM Scripts

From `package.json`:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`
- `npm run test:watch`
- `npm run check`
- `npm run check:watch`

## Source Structure

```text
src/
  routes/                     route shell + main page
  lib/components/             UI components
  lib/protocol/               protocol types/client/crypto
  lib/session/                controller + auth storage
  lib/stores/                 session timeline store
  lib/ui/                     UI preference helpers
  lib/theme.ts                theme/effects handling
```

## Feature Development Flow

1. Update protocol/store/controller logic first.
2. Bind UI component behavior to updated state contracts.
3. Add/update tests in matching layer.
4. Run `npm run test` and `npm run check`.
