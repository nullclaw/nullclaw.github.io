# Step Types

Step type enum is defined in `src/types.zig` and executed by `src/engine.zig`.

## Available Types

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

## Validation-Enforced Requirements (Create Run)

`src/workflow_validation.zig` enforces specific fields for some types:

- `loop`: requires `body`
- `sub_workflow`: requires `workflow`
- `wait`: requires one of `duration_ms`, `until_ms`, or `signal`
- `router`: requires `routes`
- `saga`: requires `body`
- `debate`: requires `count`
- `group_chat`: requires `participants`

Also enforced:

- unique non-empty step ids
- `depends_on` must be array of known step ids
- no duplicate dependency items
- retry/timeout controls must be positive integers when set

## Example: Simple DAG

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

## Example: Wait + Signal

```json
{
  "steps": [
    {
      "id": "wait_release",
      "type": "wait",
      "signal": "deploy_ready"
    }
  ]
}
```

Resume:

```bash
POST /runs/{id}/steps/{step_id}/signal
```
