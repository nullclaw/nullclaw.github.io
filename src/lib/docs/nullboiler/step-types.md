# Step Types

Step type enum is defined in `src/types.zig`; validation rules are in `src/workflow_validation.zig`; execution behavior is in `src/engine.zig`.

## Supported Types

- `task`
- `fan_out`
- `map`
- `reduce`
- `condition`
- `approval`
- `transform`
- `wait`
- `router`
- `loop`
- `sub_workflow`
- `debate`
- `group_chat`
- `saga`

## Validation Rules On `POST /runs`

- step ids must be unique and non-empty
- `depends_on` must be an array of known step ids
- duplicate dependency entries are rejected
- `retry.max_attempts` and `timeout_ms` must be positive integers

Type-specific requirements:

- `loop`: requires `body`
- `sub_workflow`: requires `workflow`
- `wait`: requires one of `duration_ms`, `until_ms`, `signal`
- `router`: requires `routes`
- `saga`: requires `body`
- `debate`: requires `count`
- `group_chat`: requires `participants`

## Example: Minimal DAG

```json
{
  "steps": [
    {
      "id": "research",
      "type": "task",
      "worker_tags": ["researcher"],
      "prompt_template": "Research {{input.topic}}"
    },
    {
      "id": "write",
      "type": "task",
      "depends_on": ["research"],
      "worker_tags": ["writer"],
      "prompt_template": "Write summary: {{steps.research.output}}"
    }
  ],
  "input": { "topic": "DAG engines" }
}
```
