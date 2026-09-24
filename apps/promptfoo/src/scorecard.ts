export type AssertionResult = {
  pass: boolean;
  assertion?: { type?: string; value?: string };
};

export type EvalRow = {
  id: string;
  description: string;
  success: boolean;
  score: number;
  latencyMs?: number;
  output: string;
  vars: Record<string, string>;
  assertions: AssertionResult[];
  tags: string[];
};

export type ScorecardModel = {
  mode: 'fixture' | 'live' | 'sample';
  evalId: string | null;
  timestamp: string | null;
  providerLabel: string;
  stats: {
    successes: number;
    failures: number;
    errors: number;
    passRate: number;
  };
  rows: EvalRow[];
};

type PromptfooExport = {
  evalId?: string | null;
  results?: {
    timestamp?: string;
    stats?: {
      successes?: number;
      failures?: number;
      errors?: number;
    };
    prompts?: Array<{ provider?: string; label?: string }>;
    results?: Array<{
      id?: string;
      success?: boolean;
      score?: number;
      latencyMs?: number;
      response?: { output?: string };
      testCase?: {
        description?: string;
        vars?: Record<string, string>;
      };
      gradingResult?: {
        componentResults?: AssertionResult[];
      };
    }>;
  };
};

function rowTags(description: string): string[] {
  const tags: string[] = [];
  const lower = description.toLowerCase();
  if (lower.includes('red team')) tags.push('red-team');
  if (lower.includes('rag')) tags.push('rag');
  return tags;
}

export function parsePromptfooExport(raw: PromptfooExport, mode: ScorecardModel['mode']): ScorecardModel {
  const stats = raw.results?.stats ?? {};
  const successes = stats.successes ?? 0;
  const failures = stats.failures ?? 0;
  const errors = stats.errors ?? 0;
  const total = successes + failures + errors;
  const passRate = total > 0 ? Math.round((successes / total) * 100) : 0;

  const providerLabel =
    raw.results?.prompts?.[0]?.label ??
    raw.results?.prompts?.[0]?.provider ??
    (mode === 'live' ? 'OpenAI (live)' : 'Mock RAG (fixture)');

  const rows: EvalRow[] = (raw.results?.results ?? []).map((r, index) => {
    const description = r.testCase?.description ?? `Test ${index + 1}`;
    return {
      id: r.id ?? `row-${index}`,
      description,
      success: Boolean(r.success),
      score: r.score ?? 0,
      latencyMs: r.latencyMs,
      output: r.response?.output ?? '',
      vars: r.testCase?.vars ?? {},
      assertions: r.gradingResult?.componentResults ?? [],
      tags: rowTags(description),
    };
  });

  return {
    mode,
    evalId: raw.evalId ?? null,
    timestamp: raw.results?.timestamp ?? null,
    providerLabel,
    stats: { successes, failures, errors, passRate },
    rows,
  };
}

export function renderScorecardHtml(model: ScorecardModel): string {
  const statusClass =
    model.stats.failures + model.stats.errors === 0 ? 'status-pass' : 'status-fail';
  const statusLabel =
    model.stats.failures + model.stats.errors === 0 ? 'All checks passed' : 'Some checks failed';

  const rowsHtml = model.rows
    .map((row) => {
      const badge = row.success
        ? '<span class="badge pass">PASS</span>'
        : '<span class="badge fail">FAIL</span>';
      const tagHtml = row.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
      const assertions = row.assertions
        .map((a) => {
          const ok = a.pass ? 'ok' : 'bad';
          const type = a.assertion?.type ?? 'assert';
          const value = a.assertion?.value ?? '';
          return `<li class="${ok}"><code>${escapeHtml(type)}</code> ${escapeHtml(String(value))}</li>`;
        })
        .join('');

      return `<article class="row ${row.success ? 'pass' : 'fail'}">
        <header>
          ${badge}
          <h3>${escapeHtml(row.description)}</h3>
          ${tagHtml}
        </header>
        <dl class="vars">
          ${Object.entries(row.vars)
            .map(
              ([k, v]) =>
                `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`,
            )
            .join('')}
        </dl>
        <p class="output">${escapeHtml(row.output)}</p>
        <ul class="assertions">${assertions}</ul>
      </article>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Promptfoo scorecard — tech-demos</title>
  <style>
    :root {
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      --bg: #0f1419;
      --panel: #1a2332;
      --text: #e7ecf3;
      --muted: #9aa7b8;
      --pass: #3dd68c;
      --fail: #ff6b6b;
      --accent: #6cb6ff;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--text); line-height: 1.5; }
    main { max-width: 960px; margin: 0 auto; padding: 2rem 1.25rem 3rem; }
    h1 { font-size: 1.75rem; margin: 0 0 0.25rem; }
    .sub { color: var(--muted); margin-bottom: 1.5rem; }
    .hero {
      background: linear-gradient(135deg, #1a2332 0%, #243047 100%);
      border: 1px solid #2d3a4f;
      border-radius: 12px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .metrics { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }
    .metric {
      background: var(--panel);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      min-width: 120px;
    }
    .metric span { display: block; color: var(--muted); font-size: 0.8rem; }
    .metric strong { font-size: 1.35rem; }
    .status-pass { color: var(--pass); }
    .status-fail { color: var(--fail); }
    .mode { display: inline-block; background: #2a3750; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem; }
    .row {
      border: 1px solid #2d3a4f;
      border-radius: 10px;
      padding: 1rem 1.1rem;
      margin-bottom: 1rem;
      background: var(--panel);
    }
    .row header { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
    .row h3 { margin: 0; font-size: 1rem; flex: 1; }
    .badge { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.45rem; border-radius: 4px; }
    .badge.pass { background: rgba(61, 214, 140, 0.2); color: var(--pass); }
    .badge.fail { background: rgba(255, 107, 107, 0.2); color: var(--fail); }
    .tag { font-size: 0.65rem; background: #334155; padding: 0.15rem 0.4rem; border-radius: 999px; color: var(--accent); }
    .vars { display: grid; gap: 0.35rem; margin: 0.75rem 0; font-size: 0.85rem; }
    .vars dt { color: var(--muted); display: inline; }
    .vars dt::after { content: ': '; }
    .vars dd { display: inline; margin: 0; }
    .output { font-size: 0.9rem; background: #121820; padding: 0.65rem 0.75rem; border-radius: 6px; }
    .assertions { margin: 0.5rem 0 0; padding-left: 1.1rem; font-size: 0.85rem; }
    .assertions li.ok { color: var(--pass); }
    .assertions li.bad { color: var(--fail); }
    code { font-size: 0.8em; }
    footer { margin-top: 2rem; color: var(--muted); font-size: 0.85rem; }
  </style>
</head>
<body>
  <main>
    <h1>Promptfoo eval scorecard</h1>
    <p class="sub">Local pass/fail view for the tech-demos <code>apps/promptfoo</code> sample — not Promptfoo Cloud.</p>
    <section class="hero">
      <div><span class="mode">mode: ${escapeHtml(model.mode)}</span> · ${escapeHtml(model.providerLabel)}</div>
      <div class="metrics">
        <div class="metric"><span>Pass rate</span><strong>${model.stats.passRate}%</strong></div>
        <div class="metric"><span>Passed</span><strong>${model.stats.successes}</strong></div>
        <div class="metric"><span>Failed</span><strong>${model.stats.failures}</strong></div>
        <div class="metric"><span>Errors</span><strong>${model.stats.errors}</strong></div>
      </div>
      <p class="${statusClass}" style="margin: 1rem 0 0;"><strong>${statusLabel}</strong></p>
      ${
        model.timestamp
          ? `<p class="sub" style="margin:0.5rem 0 0;">Eval ${escapeHtml(model.evalId ?? 'n/a')} · ${escapeHtml(model.timestamp)}</p>`
          : ''
      }
    </section>
    ${rowsHtml}
    <footer>
      Run <code>bun run eval</code> to refresh results. Set <code>OPENAI_API_KEY</code> and <code>bun run eval:live</code> for live LLM rubric checks.
    </footer>
  </main>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
