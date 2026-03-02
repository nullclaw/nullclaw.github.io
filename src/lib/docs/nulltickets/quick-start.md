# Quick Start

This flow is aligned with current behavior in `build.zig`, `src/main.zig`, `src/api.zig`, `src/store.zig`, `src/domain.zig`, and `tests/test_e2e.sh`.

## Prerequisites

- Zig `0.15.2`
- `curl`

## 1. Clone, Build, Run

```bash
git clone https://github.com/nullclaw/nulltickets.git
cd nulltickets
zig build -Doptimize=ReleaseSmall
./zig-out/bin/nulltickets --port 7700 --db /tmp/nulltickets.db
```

## 2. Verify Service And Schema

```bash
curl -s http://127.0.0.1:7700/health
curl -s http://127.0.0.1:7700/openapi.json
curl -s http://127.0.0.1:7700/.well-known/openapi.json
```

## 3. Create Pipeline

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

## 4. Create Task

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

## 5. Claim Lease By Role

```bash
curl -s -X POST http://127.0.0.1:7700/leases/claim \
  -H 'Content-Type: application/json' \
  -d '{"agent_id":"researcher-1","agent_role":"researcher","lease_ttl_ms":60000}'
```

Claim response includes `lease_id`, `lease_token`, and `run` context.

## 6. Heartbeat + Event + Transition

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

## Common Failure Modes

- `401 unauthorized`: missing/invalid lease bearer token.
- `410 expired`: lease expired before mutation/heartbeat.
- `409 required_gates_not_passed`: transition blocked by gate policy.

## Next Steps

1. [Pipeline Model](/nulltickets/docs/pipeline-model)
2. [API](/nulltickets/docs/api)
3. [Operations](/nulltickets/docs/operations)
4. [Architecture](/nulltickets/docs/architecture)
