# tech-demos

Sticky monorepo for public tech demos. Each pick gets one self-contained app under `apps/<slug>/` (Bun, enterprise-friendly licenses).

## Layout

| Path | Purpose |
| --- | --- |
| `apps/<slug>/` | Runnable demo (source, config, README) |
| `skills/` | Shared agent skills (e.g. project planning) |
| `tracking/seen-bookmarks.json` | Bookmark dedupe for demo picks |
| `AGENTS.md` | Rules for cloud agents working in this repo |

## Prerequisites

- [Bun](https://bun.sh) (primary runtime and package manager)
- For **Promptfoo live evals**: Node.js ≥ 22.22 (Promptfoo CLI requirement) and `OPENAI_API_KEY` — see [apps/promptfoo/README.md](apps/promptfoo/README.md)

## Demos

| Slug | Domain | Quick start |
| --- | --- | --- |
| [promptfoo](apps/promptfoo/) | LLM evals & CI quality gates | `cd apps/promptfoo && bun install && bun run demo` |

From the repo root (after `bun install`):

```bash
bun run promptfoo:demo
```

## Contributing demos

1. Plan with `skills/project-planning/SKILL.md` and add `apps/<slug>/PLAN.md`.
2. Implement under `apps/<slug>/` only.
3. Open a PR with **screenshot + video** of the running demo and clear run instructions.

See [AGENTS.md](AGENTS.md) for agent-specific rules.
