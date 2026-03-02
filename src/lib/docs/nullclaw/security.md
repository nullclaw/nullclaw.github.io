# Security

Security controls are implemented in `src/security/*` and enforced during runtime/tool execution.

## Core Security Modules

- `pairing.zig`: pairing and token guards
- `policy.zig`: command/path risk controls
- `sandbox.zig` + adapters (`landlock`, `firejail`, `bubblewrap`, `docker`, `detect`)
- `audit.zig` and `tracker.zig`: security-relevant event tracking
- `secrets.zig`: secret handling helpers

## Default Security Posture

- local-first bind defaults
- pairing required by default
- policy checks before sensitive operations
- path and command restrictions on tool execution

## Operational Verification

```bash
nullclaw doctor
nullclaw status
nullclaw capabilities --json
```

## High-Impact Config Keys

- `gateway.require_pairing`
- `gateway.allow_public_bind`
- `autonomy.allowed_commands`
- `autonomy.allowed_paths`
- `security.sandbox.backend`
- `security.audit.*`

## Production Guidance

- keep pairing enabled outside trusted localhost workflows
- avoid broad command/path allowlists
- treat `capabilities` output as final authority for what can execute
