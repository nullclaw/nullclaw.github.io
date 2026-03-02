# Overview

## What NullTickets Is

`nulltickets` is a task control plane for autonomous software workflows.

It manages:

- pipeline definitions
- task lifecycle by stage
- role-based claim + lease loop
- transition and gate enforcement
- artifacts and queue observability

## What It Owns

- Persistent task state (`tasks`, `runs`, `leases`, `events`, `artifacts`)
- Stage transitions and guardrails (`required_gates`, optimistic stage/version checks)
- Claim arbitration by agent role and assignment/dependency constraints

## What It Does Not Own

- Prompt execution against LLM providers (that is `nullclaw`)
- Step DAG scheduling and protocol dispatch (that is `nullboiler`)

## Naming

In ecosystem discussions, this component may also be called **nulltracker**.

## Typical Use Cases

- Team-level backlog automation with agent roles (`researcher`, `coder`, `reviewer`)
- Controlled stage progression with quality gates before merge/release
- Auditable autonomous loops with events, retries, dead-lettering, and artifact records
