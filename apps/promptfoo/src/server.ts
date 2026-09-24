import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parsePromptfooExport, renderScorecardHtml, type ScorecardModel } from './scorecard';

const appRoot = path.resolve(import.meta.dir, '..');
const port = Number(process.env.PORT ?? 3456);

function loadResults(): { model: ScorecardModel; source: string } {
  const livePath = path.join(appRoot, 'output', 'latest-results.json');
  const samplePath = path.join(appRoot, 'fixtures', 'sample-results.json');

  if (existsSync(livePath)) {
    const raw = JSON.parse(readFileSync(livePath, 'utf8'));
    const mode = process.env.PROMPTFOO_MODE === 'live' ? 'live' : 'fixture';
    return { model: parsePromptfooExport(raw, mode), source: livePath };
  }

  if (existsSync(samplePath)) {
    const raw = JSON.parse(readFileSync(samplePath, 'utf8'));
    return { model: parsePromptfooExport(raw, 'sample'), source: samplePath };
  }

  throw new Error('No results found. Run: bun run eval');
}

const server = Bun.serve({
  port,
  fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true });
    }

    if (url.pathname === '/api/results') {
      try {
        const { model, source } = loadResults();
        return Response.json({ ...model, _source: source });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 503 },
        );
      }
    }

    if (url.pathname === '/' || url.pathname === '/scorecard') {
      try {
        const { model } = loadResults();
        return new Response(renderScorecardHtml(model), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return new Response(`<pre>${message}</pre>`, {
          status: 503,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }
    }

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Scorecard UI: http://localhost:${server.port}/`);
