# Testing

Testing is implemented with Vitest and Testing Library across protocol, session, and UI layers.

## Commands

```bash
npm run test
npm run test:watch
npm run check
```

## Current Test Files

- `src/lib/protocol/types.test.ts`
- `src/lib/protocol/e2e.test.ts`
- `src/lib/protocol/client.test.ts`
- `src/lib/session/auth-storage.test.ts`
- `src/lib/session/connection-controller.test.ts`
- `src/lib/stores/session.test.ts`
- `src/lib/components/PairingScreen.test.ts`
- `src/lib/components/StatusBar.test.ts`
- `src/lib/theme.test.ts`
- `src/lib/ui/preferences.test.ts`

## Coverage Focus

- envelope construction/validation
- E2E key and encrypt/decrypt behavior
- connect/pair/send/reconnect client flow
- session timeline updates for chunk/final/tool/approval/error events
- auth storage TTL cleanup behavior
- pairing/status/theming UI interactions

## Pre-Merge Minimum

1. `npm run test`
2. `npm run check`
3. manual smoke: pair, chat, tool event render, logout, restore
