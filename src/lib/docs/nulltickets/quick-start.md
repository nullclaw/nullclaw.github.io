# Quick Start

This flow is aligned with current `nulltickets` behavior in `build.zig`, `src/main.zig`, `src/api.zig`, `src/store.zig`, `src/domain.zig`, and `tests/test_e2e.sh`.

## Prerequisites

- Zig **0.15.2**
- `curl`
- `python3` (optional for JSON extraction in shell scripts)

## Working Flow

### 1. Build + run

```bash
cd /Users/igorsomov/Code/nulltickets
zig build -Doptimize=ReleaseSmall
./zig-out/bin/nulltickets --port 7700 --db /tmp/nulltickets.db
```

### 2. Health + schema discovery

```bash
curl -s http://127.0.0.1:7700/health
curl -s http://127.0.0.1:7700/openapi.json
curl -s http://127.0.0.1:7700/.well-known/openapi.json
```

### 3. Create pipeline

```bash
curl -s -X POST http://127.0.0.1:7700/pipelines \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "dev-pipeline",
    "definition": {
      "initial": "research",
      "states": {
        "research": { "agent_role": "researcher" },
        "coding": { "agent_role": "coder" },
        "review": { "agent_role": "reviewer" },
        "done": { "terminal": true }
      },
      "transitions": [
        { "from": "research", "to": "coding", "trigger": "complete" },
        { "from": "coding", "to": "review", "trigger": "complete", "required_gates": ["tests_passed"] },
        { "from": "review", "to": "done", "trigger": "approve" },
        { "from": "review", "to": "coding", "trigger": "reject" }
      ]
    }
  }'
```

### 4. Create task

```bash
curl -s -X POST http://127.0.0.1:7700/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "pipeline_id": "<PIPELINE_ID>",
    "title": "Implement feature X",
    "description": "Deliver API + tests",
    "priority": 3
  }'
```

### 5. Claim work as role

```bash
curl -s -X POST http://127.0.0.1:7700/leases/claim \
  -H 'Content-Type: application/json' \
  -d '{"agent_id":"researcher-1","agent_role":"researcher","lease_ttl_ms":60000}'
```

Claim response includes:

- `task`
- `run`
- `lease_id`
- `lease_token`
- `expires_at_ms`

### 6. Work loop with lease token

Heartbeat:

```bash
curl -s -X POST http://127.0.0.1:7700/leases/<LEASE_ID>/heartbeat \
  -H 'Authorization: Bearer <LEASE_TOKEN>'
```

Emit event:

```bash
curl -s -X POST http://127.0.0.1:7700/runs/<RUN_ID>/events \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <LEASE_TOKEN>' \
  -d '{"kind":"step","data":{"message":"Research complete"}}'
```

Transition stage:

```bash
curl -s -X POST http://127.0.0.1:7700/runs/<RUN_ID>/transition \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <LEASE_TOKEN>' \
  -d '{"trigger":"complete","instructions":"handoff to coding"}'
```

## Important Notes

- Write endpoints support optional `Idempotency-Key`.
- Lease-protected run mutations (`events`, `gates`, `transition`, `fail`) require bearer lease token.
- Transition can be blocked with `409 required_gates_not_passed` when pipeline transition requires gates.

## Next Steps

- [Overview](/nulltickets/docs/overview)
- [Architecture](/nulltickets/docs/architecture)
- [Pipeline Model](/nulltickets/docs/pipeline-model)
- [API](/nulltickets/docs/api)
- [Operations](/nulltickets/docs/operations)
