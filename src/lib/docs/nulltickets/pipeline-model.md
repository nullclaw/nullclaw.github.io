# Pipeline Model

Pipeline definitions are stored as JSON (`definition_json`) and validated before insert.

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

From `src/domain.zig`:

- non-empty `initial`
- non-empty `states`
- non-empty `transitions`
- `initial` must exist in `states`
- each transition `from`/`to` must reference known state
- at least one state must be `terminal=true`
- each non-terminal state must have at least one outgoing transition

## Task Creation Extensions

`POST /tasks` supports:

- `retry_policy`: `max_attempts`, `retry_delay_ms`, `dead_letter_stage`
- `dependencies`: list of task ids
- `assigned_agent_id` + `assigned_by`

These feed claim/transition behavior directly.

## Transition Guardrails

`POST /runs/{id}/transition` supports optional optimistic checks:

- `expected_stage`
- `expected_task_version`

Potential conflict responses:

- `required_gates_not_passed`
- `expected_stage_mismatch`
- `task_version_mismatch`
