# Development

## Prerequisites

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

## Most Useful Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run test`
- `npm run test:watch`
- `npm run check`
- `npm run check:watch`

## Source Map

```text
src/
  routes/                     route shell + main page
  lib/components/             UI components
  lib/protocol/               protocol types/client/crypto
  lib/session/                controller + auth storage
  lib/stores/                 session timeline store
  lib/ui/                     preference helpers
  lib/theme.ts                theme/effects logic
```

## Safe Feature Workflow

1. update protocol/store/controller contracts first
2. connect UI components to updated contracts
3. add or update tests near changed layer
4. run `npm run test` and `npm run check`
