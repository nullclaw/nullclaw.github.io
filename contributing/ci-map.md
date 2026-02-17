# CI Workflow Map

What each GitHub workflow does, when it runs, and whether it blocks merges.

## Merge-Blocking vs Optional

Merge-blocking checks stay small and deterministic. Optional checks are useful but don't block development.

### Merge-Blocking

| Workflow | Purpose |
|----------|---------|
| **CI** | Zig validation: `zig build`, `zig build test --summary all`, ReleaseSmall build smoke. Docs quality checks when docs change. |
| **Workflow Sanity** | Lint GitHub workflow files (actionlint, tab checks). |

### Non-Blocking but Important

| Workflow | Purpose |
|----------|---------|
| **Docker** | PR docker smoke check; publish images on `main`/tag pushes. |
| **Security Audit** | Dependency advisories and license checks. |
| **Release** | Build tagged release artifacts and publish GitHub releases. |

### Optional Automation

| Workflow | Purpose |
|----------|---------|
| **PR Labeler** | Scope/path labels + size/risk labels + module labels. |
| **Auto Response** | First-time contributor guidance + label-driven routing. |
| **Stale** | Stale issue/PR lifecycle automation. |
| **PR Hygiene** | Nudge stale-but-active PRs to rebase/re-run checks. |

## Trigger Map

| Workflow | Trigger |
|----------|---------|
| CI | push to `main`, PRs to `main` |
| Docker | push to `main`, tag push (`v*`), PRs touching docker/workflow files |
| Release | tag push (`v*`) |
| Security Audit | push to `main`, PRs to `main`, weekly schedule |
| Workflow Sanity | PR/push when `.github/workflows/**` change |
| PR Labeler | `pull_request_target` lifecycle events |
| Auto Response | issue opened/labeled, `pull_request_target` opened/labeled |
| Stale | daily schedule |
| PR Hygiene | every 12 hours schedule |

## Fast Triage Guide

1. **CI gate failing:** inspect CI workflow logs — build errors, test failures, or docs lint.
2. **Docker failures on PRs:** inspect Docker workflow `pr-smoke` job.
3. **Release failures on tags:** inspect Release workflow.
4. **Security failures:** inspect Security Audit workflow.
5. **Workflow syntax errors:** inspect Workflow Sanity.

## Maintenance Rules

- Keep merge-blocking checks deterministic and reproducible.
- Prefer explicit workflow permissions (least privilege).
- Use path filters for expensive workflows when practical.
- Keep docs quality checks low-noise (markdownlint + offline link checks).
- Avoid mixing onboarding/community automation with merge-gating logic.
