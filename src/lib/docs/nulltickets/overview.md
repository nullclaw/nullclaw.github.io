# Overview

NullTickets is the task control plane for autonomous delivery systems. It stores pipeline definitions, tasks, runs, leases, events, artifacts, and queue health.

## Start In 5 Minutes

1. Follow [Quick Start](/nulltickets/docs/quick-start).
2. Create one pipeline and one task.
3. Claim a lease and perform one transition.

## Choose NullTickets When

- you need persistent stage-based lifecycle for work items
- agents must claim work by role with lease tokens
- transitions must be controlled by gates and dependencies
- you need auditable task/run history and queue observability

## Do Not Use NullTickets Alone When

- you need orchestration DAG semantics for step graphs (use `nullboiler`)
- you need direct prompt/tool/provider runtime execution (use `nullclaw`)

## What It Owns

- stage lifecycle and transition guardrails
- role-based claim + lease model
- retries/dead-letter behavior for tasks
- artifacts and operations queue metrics

## Naming

In ecosystem communication, this component may also be called **nulltracker**.

## Read Next

1. [Quick Start](/nulltickets/docs/quick-start)
2. [Pipeline Model](/nulltickets/docs/pipeline-model)
3. [API](/nulltickets/docs/api)
4. [Operations](/nulltickets/docs/operations)
