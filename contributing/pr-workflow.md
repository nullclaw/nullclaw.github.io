# PR Workflow

This document defines how nullclaw handles pull requests while maintaining quality, security, and merge throughput.

Related docs:
- [CI Map](ci-map.md) — per-workflow ownership, triggers, and triage
- [Reviewer Playbook](reviewer-playbook.md) — day-to-day reviewer execution

## Governance Goals

1. Keep merge throughput predictable under heavy PR load.
2. Keep CI signal quality high (fast feedback, low false positives).
3. Keep security review explicit for risky surfaces.
4. Keep changes easy to reason about and easy to revert.
5. Keep repository artifacts free of personal/sensitive data leakage.

## Required Repository Settings

Branch protection on `main`:

- Require status checks before merge.
- Require pull request reviews before merge.
- Dismiss stale approvals when new commits are pushed.
- Restrict force-push on protected branches.

## PR Lifecycle

### Step A: Intake

- Contributor opens PR with completed template.
- Labels applied: scope/path, size, risk, module (e.g. `channel:telegram`, `provider:openai`, `tool:shell`).
- Contributor tiers by merged PR count: `experienced` >=10, `principal` >=20, `distinguished` >=50.

### Step B: Validation

- CI gate must pass: `zig build`, `zig build test`, release build smoke check.
- Docs-only PRs skip Zig compilation jobs.

### Step C: Review

- Reviewers prioritize by risk and size labels.
- Security-sensitive paths (`src/security/`, `src/gateway.zig`, CI workflows) require maintainer attention.
- Large PRs (`size: L`/`size: XL`) should be split unless strongly justified.

### Step D: Merge

- Prefer **squash merge** for compact history.
- PR title follows Conventional Commit style.
- Merge only when rollback path is documented.

## PR Readiness

### Definition of Ready (before review)

- PR template fully completed.
- Scope boundary is explicit (what changed / what did not).
- Validation evidence attached.
- Security and rollback fields completed for risky paths.

### Definition of Done (merge-ready)

- CI gate is green.
- Required reviewers approved.
- Risk class labels match touched paths.
- Rollback path is concrete and fast.

## PR Size Policy

| Label | Lines Changed |
|-------|---------------|
| `size: XS` | <= 80 |
| `size: S` | <= 250 |
| `size: M` | <= 500 |
| `size: L` | <= 1000 |
| `size: XL` | > 1000 |

Target `XS/S/M` by default. `L/XL` PRs need explicit justification.

## AI/Agent Contribution Policy

AI-assisted PRs are welcome. Required:

1. Clear PR summary with scope boundary.
2. Explicit test/validation evidence.
3. Security impact and rollback notes for risky changes.

Review emphasis for AI-heavy PRs:
- Contract compatibility
- Security boundaries
- Error handling and fallback behavior

## Security and Stability Rules

Changes in these areas require stricter review:

- `src/security/**`
- `src/gateway.zig`
- `src/tools/**` (execution capability)
- CI/CD workflows

Minimum for risky PRs:
- Threat/risk statement
- Mitigation notes
- Rollback steps

## Failure Recovery

If a merged PR causes regressions:

1. Revert PR immediately on `main`.
2. Open a follow-up issue with root-cause analysis.
3. Re-introduce fix only with regression tests.

## Agent Handoff Contract

When one contributor hands off to another:

1. Scope boundary (what changed / what did not).
2. Validation evidence.
3. Open risks and unknowns.
4. Suggested next action.
