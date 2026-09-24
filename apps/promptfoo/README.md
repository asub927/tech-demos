# apps/promptfoo — LLM evals & CI gates

[Bun](https://bun.sh) wrapper around [Promptfoo](https://github.com/promptfoo/promptfoo) (MIT): sample RAG + red-team evals, CLI runner, and a **local scorecard UI** (not Promptfoo Cloud).

## Modes

| Mode | Command | API keys |
| --- | --- | --- |
| **Fixture (default)** | `bun run eval` | None — uses `providers/mockRag.js` |
| **Live OpenAI** | `bun run eval:live` | `OPENAI_API_KEY` required |
| **UI only** | `bun run dev` | None — uses `output/latest-results.json` or `fixtures/sample-results.json` |

## Prerequisites

1. **Bun** — install deps and run the scorecard server.
2. **Node.js ≥ 22.22** — Promptfoo CLI requirement when running `bun run eval`. Check with `bun run check:node`.

## Quick start

```bash
cd apps/promptfoo
bun install
bun run demo    # eval (fixture) + scorecard UI on http://localhost:3456/
```

### Scripts

| Script | Description |
| --- | --- |
| `bun run eval` | Run Promptfoo with `promptfooconfig.yaml` (mock provider) |
| `bun run eval:live` | Run `promptfooconfig.live.yaml` (needs `OPENAI_API_KEY`) |
| `bun run dev` | Start Bun scorecard UI (`PORT` optional, default `3456`) |
| `bun run demo` | `eval` then `dev` |
| `bun run check:node` | Verify Node version for Promptfoo CLI |

Eval output is written to `output/latest-results.json`.

## Validation media (in-repo)

PR and review artifacts for this demo live in the repo (durable links):

| Asset | Path |
| --- | --- |
| Scorecard screenshot | [docs/validation/promptfoo-scorecard.png](docs/validation/promptfoo-scorecard.png) |
| Scorecard demo video | [docs/validation/promptfoo-scorecard-demo.mp4](docs/validation/promptfoo-scorecard-demo.mp4) |

## Sample config

- **RAG-style cases**: refund window, shipping policy (deterministic assertions: `contains`, `icontains`).
- **Red-team probes**: prompt-injection and secret-exfil prompts with safety assertions.

Live config uses fewer tests and `llm-rubric` assertions against `openai:gpt-4o-mini`.

## CI

See [`.github/workflows/promptfoo-gate.yml`](../../.github/workflows/promptfoo-gate.yml). The workflow runs **fixture mode only** (no secrets). Optional live evals are for local use when `OPENAI_API_KEY` is set.

## Environment

Copy `.env.example` if you use live mode locally:

```bash
export OPENAI_API_KEY=sk-...   # only for eval:live
export PROMPTFOO_DISABLE_TELEMETRY=1
```
