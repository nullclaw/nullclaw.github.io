# Reviewer Playbook

Operational companion to [PR Workflow](pr-workflow.md). Reduces review latency without reducing quality.

## Review Objectives

- Keep queue throughput predictable.
- Keep risk review proportionate to change risk.
- Keep merge decisions reproducible and auditable.

## 5-Minute Intake Triage

For every new PR:

1. Confirm template completeness (`summary`, `validation`, `security`, `rollback`).
2. Confirm labels (`size:*`, `risk:*`, scope labels) are present and plausible.
3. Confirm CI signal status.
4. Confirm scope is one concern (reject mixed mega-PRs unless justified).

If any intake requirement fails, leave one actionable checklist comment instead of deep review.

## Risk-to-Depth Matrix

| Risk | Typical Paths | Minimum Review |
|------|---------------|----------------|
| `risk: low` | docs, tests, chore | 1 reviewer + CI gate |
| `risk: medium` | `src/providers/**`, `src/channels/**`, `src/memory/**`, `src/config.zig` | 1 subsystem-aware reviewer + behavior verification |
| `risk: high` | `src/security/**`, `src/gateway.zig`, `src/tools/**`, CI workflows | Fast triage + deep review, rollback and failure-mode checks |

When uncertain, treat as `risk: high`.

## Fast-Lane Checklist (All PRs)

- Scope boundary is explicit and believable.
- Validation commands are present and results are coherent.
- User-facing behavior changes are documented.
- Rollback path is concrete (not just "revert").
- No personal/sensitive data leakage in diff artifacts.
- Naming and architecture follow project conventions.

## Deep Review Checklist (High Risk)

- **Security boundaries:** deny-by-default preserved, no accidental scope broadening.
- **Failure modes:** error handling is explicit and degrades safely.
- **Contract stability:** CLI/config/API compatibility preserved or migration documented.
- **Observability:** failures are diagnosable without leaking secrets.
- **Rollback safety:** revert path and blast radius are clear.

## Issue Triage

- `r:needs-repro` for incomplete bug reports.
- `r:support` for usage/support questions.
- `duplicate` / `invalid` for non-actionable items.
- `no-stale` for accepted work waiting on external blockers.

## Review Comment Style

Prefer checklist-style comments:

- **Ready to merge** — explicitly say why.
- **Needs author action** — ordered list of blockers.
- **Needs deeper review** — state exact risk and requested evidence.

## PR Backlog Pruning

1. Keep active bug/security PRs (`size: XS/S`) at the top.
2. Ask overlapping PRs to consolidate; close older ones as `superseded`.
3. Mark dormant PRs as `stale-candidate`.
4. Require rebase + fresh validation before reopening stale work.

## Handoff Protocol

If handing off review:

1. Scope summary
2. Current risk class and why
3. What has been validated
4. Open blockers
5. Suggested next action

## Weekly Queue Hygiene

- Review stale queue — apply `no-stale` only to accepted-but-blocked work.
- Prioritize `size: XS/S` bug/security PRs first.
- Convert recurring support issues into docs updates.
