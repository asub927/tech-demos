# Plan: promptfoo

## Goal

Demonstrate LLM evaluation and CI-style quality gates with [Promptfoo](https://github.com/promptfoo/promptfoo) (MIT) in a Bun app, including a local scorecard UI and optional live OpenAI evals.

## Constraints

- Lives under `apps/promptfoo/` in the sticky monorepo; Bun for install/scripts/UI server.
- Promptfoo CLI runs via `bunx` and requires Node.js ≥ 22.22 on PATH.
- Default **fixture mode** (mock RAG provider) — no API keys.
- Live path uses `OPENAI_API_KEY` + `promptfooconfig.live.yaml` (LLM rubric assertions).
- Do not rehost Promptfoo Cloud; UI reads local JSON output only.
- PR must include screenshot + video committed under `docs/validation/` (in-repo paths in PR/README).

## MVP scope

### In scope

- Sample `promptfooconfig.yaml` with RAG-style cases and 2 red-team probes.
- `bun run eval`, `bun run dev`, `bun run demo` scripts.
- Thin HTML scorecard served by Bun.
- Bundled `fixtures/sample-results.json` for UI without a prior eval run.
- Optional GitHub Action gating on fixture eval (no secrets).
- README + this plan.

### Out of scope

- Promptfoo Cloud / share URLs in CI.
- Full red-team plugin suites or remote generation.
- Multi-provider matrix or large test CSVs.

## Acceptance checks

- [ ] `cd apps/promptfoo && bun install && bun run eval` completes with 4/4 passes in fixture mode.
- [ ] `bun run dev` serves scorecard at `http://localhost:3456/`.
- [ ] UI shows pass rate, per-test assertions, and red-team tags.
- [ ] `bun run eval:live` documented; fails fast without `OPENAI_API_KEY`.
- [ ] GitHub Action runs fixture eval without secrets.
- [ ] PR includes screenshot + video in `docs/validation/` linked from README/PR.

## File layout

```
apps/promptfoo/
  PLAN.md
  README.md
  package.json
  promptfooconfig.yaml
  promptfooconfig.live.yaml
  providers/mockRag.js
  scripts/check-node.ts
  scripts/run-eval.ts
  src/server.ts
  src/scorecard.ts
  fixtures/sample-results.json
  docs/validation/        # committed screenshot + video for PRs
  output/                 # gitignored eval output
.github/workflows/promptfoo-gate.yml
```
