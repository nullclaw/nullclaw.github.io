# Pipeline Model

Pipeline definitions are JSON objects validated before insert (`src/domain.zig`).

## Definition Shape

```json
{
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
```

## Validation Rules

- `initial` must be non-empty and present in `states`
- `states` and `transitions` must be non-empty
- each transition `from`/`to` must reference known states
- at least one state must be terminal (`terminal=true`)
- each non-terminal state must have outgoing transitions

## Task Extensions That Affect Execution

`POST /tasks` accepts:

- `retry_policy` (`max_attempts`, `retry_delay_ms`, `dead_letter_stage`)
- `dependencies`
- `assigned_agent_id` and `assigned_by`

These directly affect claim eligibility and transition behavior.

## Transition Guardrails

`POST /runs/{id}/transition` supports optional optimistic checks:

- `expected_stage`
- `expected_task_version`

Common conflict responses:

- `required_gates_not_passed`
- `expected_stage_mismatch`
- `task_version_mismatch`
