# Security

Security logic is implemented under `src/security/*` and enforced during runtime/tool execution.

## Security Components

- `pairing.zig`: pairing/token flow and guardrails
- `policy.zig`: command/path risk policy and approval logic
- `sandbox.zig` + backend adapters:
  - `landlock.zig`
  - `firejail.zig`
  - `bubblewrap.zig`
  - `docker.zig`
  - `detect.zig` (backend selection)
- `audit.zig`: security event tracking support
- `secrets.zig`: secret storage helpers

## Default Safety Posture

From config defaults and command behavior:

- local gateway binding (`127.0.0.1`)
- pairing required unless explicitly disabled
- policy checks before sensitive command execution
- workspace/path restrictions for file and shell tools

## Operational Checks

```bash
nullclaw doctor
nullclaw status
nullclaw capabilities --json
```

Use these to verify effective security posture in your running build.

## High-Impact Config Areas

- `gateway.require_pairing`
- `gateway.allow_public_bind`
- `autonomy.allowed_commands`
- `autonomy.allowed_paths`
- `security.sandbox.backend`
- `security.audit.*`

## Practical Guidance

- Keep pairing enabled in non-local environments.
- Avoid wildcard command/path policies unless explicitly required.
- Treat `capabilities` output as the source of truth for what can execute in the current binary.
