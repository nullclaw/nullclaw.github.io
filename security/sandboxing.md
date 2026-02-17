# Sandboxing

## Problem

Application-layer security (allowlists, path blocking, command injection protection) is necessary but not sufficient. If an attacker bypasses the allowlist, they run commands with nullclaw's user permissions. OS-level containment limits the blast radius.

## Sandbox Backends

nullclaw implements four sandbox backends behind a common vtable interface. Auto-detection picks the best available option at runtime.

### Priority Order

| Phase | Backend | Platform | Effort | Security Gain |
|-------|---------|----------|--------|---------------|
| **P0** | Landlock | Linux 5.13+ | Low | High (filesystem) |
| **P1** | Firejail | Linux | Low | Very High |
| **P2** | Bubblewrap | macOS/Linux | Medium | Very High |
| **P3** | Docker | All platforms | High | Complete |

### Option 1: Landlock (Linux Kernel LSM)

Landlock provides filesystem access control without containers or root. It restricts which paths the process can read/write using Linux Security Module hooks.

```zig
// src/security/landlock.zig
pub const LandlockSandbox = struct {
    allocator: std.mem.Allocator,
    readonly_paths: []const []const u8,
    readwrite_paths: []const []const u8,

    pub fn apply(self: *LandlockSandbox) !void {
        // Create ruleset, add path rules, restrict self
    }
};
```

**Config:**
```json
{
  "security": {
    "sandbox": {
      "backend": "landlock",
      "readonly_paths": ["/usr", "/bin", "/lib"],
      "readwrite_paths": ["~/.nullclaw/workspace", "/tmp/nullclaw"]
    }
  }
}
```

### Option 2: Firejail (User-Space, Linux)

Firejail wraps commands with namespace-based isolation. No root required. nullclaw detects if `firejail` is installed and wraps tool execution automatically.

```bash
firejail --private=home --private-dev --nosound --no3d --quiet -- <command>
```

### Option 3: Bubblewrap (Portable)

Bubblewrap uses user namespaces to create lightweight containers. Works on macOS and Linux without root.

```bash
bwrap --ro-bind /usr /usr \
      --dev /dev --proc /proc \
      --bind /workspace /workspace \
      --unshare-all --share-net \
      --die-with-parent \
      -- <command>
```

### Option 4: Docker (Complete Isolation)

Run agent tools inside ephemeral containers with memory/CPU limits and no network access.

```zig
// Ephemeral container per command
const args = .{
    "docker", "run", "--rm",
    "--memory", "512m",
    "--cpus", "1.0",
    "--network", "none",
    "--volume", workspace_mount,
    image, "sh", "-c", command,
};
```

## Auto-Detection

nullclaw probes available backends at startup:

```
Linux:   Landlock → Firejail → Bubblewrap → Docker → None
macOS:   Bubblewrap → Docker → None
Windows: Docker → None
```

If no OS-level sandbox is available, nullclaw falls back to application-layer security (command allowlists, path blocking, injection protection).

## Configuration

```json
{
  "security": {
    "sandbox": {
      "backend": "auto"
    }
  }
}
```

Valid backends: `auto`, `landlock`, `firejail`, `bubblewrap`, `docker`, `none`.

## Cross-Platform Behavior

| Platform | Builds | Runtime Behavior |
|----------|--------|------------------|
| **Linux ARM** (Raspberry Pi) | Yes | Landlock → Firejail → None |
| **Linux x86_64** | Yes | Landlock → Firejail → None |
| **macOS ARM** (Apple Silicon) | Yes | Bubblewrap → None |
| **macOS x86_64** | Yes | Bubblewrap → None |
| **Windows** | Yes | None (app-layer only) |
| **RISC-V Linux** | Yes | Landlock → None |

Same binary runs everywhere — it adapts protection level based on what's available.

## Binary Size Impact

| Feature | Code Size | RAM Overhead |
|---------|-----------|--------------|
| **Base nullclaw** | 639 KB | ~1 MB |
| **+ Landlock** | +~5 KB | +~10 KB |
| **+ Firejail wrapper** | +~5 KB | +0 KB (external) |
| **+ Bubblewrap wrapper** | +~5 KB | +0 KB (external) |
| **+ Docker wrapper** | +~5 KB | +0 KB (external) |

Sandbox adds negligible overhead. Zig comptime means unused backends aren't compiled.
