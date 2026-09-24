---
name: project-planning
description: Plan a new demo or feature in the tech-demos monorepo. Use when scoping work under apps/<slug>/ before implementation.
---

# Project planning (tech-demos)

Use this skill to turn a demo idea into a shippable MVP under `apps/<slug>/`.

## Workflow

1. **Goal** — One sentence: what the demo proves or teaches.
2. **Constraints** — Bun, monorepo layout, licenses, secrets/fixture vs live, PR artifacts (screenshot + video).
3. **MVP scope** — Smallest set of features that satisfy acceptance; explicitly list out-of-scope items.
4. **Acceptance checks** — Verifiable bullets (commands, UI states, CI behavior).
5. **File layout** — Tree under `apps/<slug>/` plus any root touchpoints.

## Template (copy into `apps/<slug>/PLAN.md`)

```markdown
# Plan: <slug>

## Goal

## Constraints

## MVP scope

### In scope

### Out of scope

## Acceptance checks

- [ ] ...

## File layout

apps/<slug>/
  ...
```

## Monorepo reminders

- Demo code stays in `apps/<slug>/`.
- Root may hold shared docs, `tracking/seen-bookmarks.json`, and workspace `package.json`.
- Prefer fixture/demo mode without API keys; document `OPENAI_API_KEY` (or similar) for live runs.
- Ship with README run instructions and Bun scripts named in the README.
