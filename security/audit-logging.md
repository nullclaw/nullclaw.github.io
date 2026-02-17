# Audit Logging

## Problem

nullclaw logs actions but needs tamper-evident audit trails for:
- Who executed what command
- When and from which channel
- What resources were accessed
- Whether security policies were triggered

## Audit Event Format

```json
{
  "timestamp": "2026-02-16T12:34:56Z",
  "event_id": "evt_1a2b3c4d",
  "event_type": "command_execution",
  "actor": {
    "channel": "telegram",
    "user_id": "123456789",
    "username": "@alice"
  },
  "action": {
    "command": "ls -la",
    "risk_level": "low",
    "approved": false,
    "allowed": true
  },
  "result": {
    "success": true,
    "exit_code": 0,
    "duration_ms": 15
  },
  "security": {
    "policy_violation": false,
    "rate_limit_remaining": 19
  },
  "signature": "HMAC-SHA256:abc123..."
}
```

## Implementation

nullclaw implements audit logging in `src/security/audit.zig`:

```zig
pub const AuditLogger = struct {
    allocator: std.mem.Allocator,
    log_path: []const u8,
    signing_key: ?[32]u8,
    retention_days: u32,

    pub fn log(self: *AuditLogger, event: *const AuditEvent) !void {
        // Serialize event to JSON
        // Compute HMAC-SHA256 signature if key configured
        // Append to log file
        // Force flush for durability
    }

    pub fn search(self: *AuditLogger, filter: AuditFilter) ![]AuditEvent {
        // Search log file by filter criteria
    }

    pub fn verifySignatures(self: *AuditLogger) !VerifyResult {
        // Verify HMAC chain integrity
    }
};
```

Signature uses `std.crypto.auth.hmac.sha2.HmacSha256` — already available in Zig stdlib, no external dependencies.

## Event Types

| Type | Description |
|------|-------------|
| `command_execution` | Shell command executed |
| `file_access` | File read or write |
| `configuration_change` | Config modified |
| `auth_success` | Successful pairing/authentication |
| `auth_failure` | Failed authentication attempt |
| `policy_violation` | Security policy triggered |

## Configuration

```json
{
  "security": {
    "audit": {
      "enabled": true,
      "retention_days": 90,
      "sign_events": true,
      "log_commands": true,
      "log_file_access": true,
      "log_auth_events": true,
      "log_policy_violations": true
    }
  }
}
```

## CLI Queries

```bash
# Show all commands by user
nullclaw audit --user @alice

# Show high-risk commands
nullclaw audit --risk high

# Show violations from last 24 hours
nullclaw audit --since 24h --violations-only

# Export for analysis
nullclaw audit --format json --output audit.json

# Verify log integrity
nullclaw audit --verify-signatures
```

## Log Rotation

Audit logs rotate by size (default 100 MB) or age (configurable retention). Rotated files: `audit.log` -> `audit.log.1` -> `audit.log.2` -> ...

## Implementation Priority

| Phase | Feature | Effort | Security Value |
|-------|---------|--------|----------------|
| **P0** | Basic event logging | Low | Medium |
| **P1** | HMAC signing | Medium | High |
| **P2** | Query CLI | Medium | Medium |
| **P3** | Log rotation + archival | Low | Medium |
