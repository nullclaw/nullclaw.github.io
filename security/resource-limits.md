# Resource Limits

## Problem

Rate limiting (actions/hour) prevents abuse, but without resource caps a runaway agent could:
- Exhaust available memory
- Spin CPU at 100%
- Fill disk with logs/output
- Fork-bomb via subprocesses

## Enforcement Strategies

### Memory Monitoring

nullclaw tracks heap usage and kills operations that exceed limits. Zig's explicit allocator model makes this natural — wrap the allocator with a counting layer.

```zig
pub const LimitedAllocator = struct {
    inner: std.mem.Allocator,
    max_bytes: usize,
    used: std.atomic.Value(usize),

    pub fn alloc(self: *LimitedAllocator, len: usize, ...) ?[*]u8 {
        const current = self.used.fetchAdd(len, .monotonic);
        if (current + len > self.max_bytes) {
            self.used.fetchSub(len, .monotonic);
            return null; // OOM instead of crash
        }
        return self.inner.alloc(len, ...);
    }
};
```

### CPU Timeout

Every tool execution has a configurable timeout. Shell commands use `std.process.Child` with a deadline — if the child doesn't exit in time, it's killed.

### cgroups v2 (Linux)

When running as a systemd service, cgroups enforce hard limits:

```ini
[Service]
MemoryMax=512M
CPUQuota=100%
IOReadBandwidthMax=/dev/sda 10M
IOWriteBandwidthMax=/dev/sda 10M
TasksMax=100
```

### Process Limits

Maximum concurrent subprocesses prevents fork-bomb scenarios. Each `std.process.Child.init()` checks the active count before spawning.

## Configuration

```json
{
  "security": {
    "resources": {
      "max_memory_mb": 512,
      "max_memory_per_command_mb": 128,
      "max_cpu_percent": 80,
      "max_cpu_time_seconds": 60,
      "max_subprocesses": 10,
      "max_log_size_mb": 100,
      "max_temp_storage_mb": 500
    }
  }
}
```

## Implementation Priority

| Phase | Feature | Effort | Impact |
|-------|---------|--------|--------|
| **P0** | Memory monitoring + OOM | Low | High |
| **P1** | CPU timeout per command | Low | High |
| **P2** | cgroups integration (Linux) | Medium | Very High |
| **P3** | Disk I/O limits | Medium | Medium |

## Hardware Compatibility

Even with full resource enforcement, nullclaw stays lightweight:

| Hardware | RAM | Base | With Limits | Status |
|----------|-----|------|-------------|--------|
| **Raspberry Pi Zero** | 512 MB | ~0.2% | ~0.3% | Works |
| **Orange Pi Zero** | 512 MB | ~0.2% | ~0.3% | Works |
| **Rock64** | 1 GB | ~0.1% | ~0.15% | Works |
| **Any $5 SBC** | 256 MB | ~0.4% | ~0.5% | Works |
