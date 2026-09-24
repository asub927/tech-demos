import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const appRoot = path.resolve(import.meta.dir, '..');
const outputDir = path.join(appRoot, 'output');
const mode = process.env.PROMPTFOO_MODE === 'live' ? 'live' : 'fixture';

if (mode === 'live' && !process.env.OPENAI_API_KEY) {
  console.error('PROMPTFOO_MODE=live requires OPENAI_API_KEY.');
  process.exit(1);
}

const configFile =
  mode === 'live' ? 'promptfooconfig.live.yaml' : 'promptfooconfig.yaml';

mkdirSync(outputDir, { recursive: true });

const check = Bun.spawnSync(['bun', 'run', 'scripts/check-node.ts'], {
  cwd: appRoot,
  stdout: 'inherit',
  stderr: 'inherit',
});
if (check.exitCode !== 0) {
  process.exit(check.exitCode ?? 1);
}

console.log(`Running Promptfoo eval (${mode}) with ${configFile}...`);

const cli = Bun.spawnSync(
  ['bunx', 'promptfoo', 'eval', '-c', configFile, '--no-share'],
  {
    cwd: appRoot,
    stdout: 'inherit',
    stderr: 'inherit',
    env: { ...process.env, PROMPTFOO_DISABLE_TELEMETRY: '1' },
  },
);

if (cli.exitCode !== 0) {
  process.exit(cli.exitCode ?? 1);
}

const resultsPath = path.join(outputDir, 'latest-results.json');
if (!existsSync(resultsPath)) {
  console.error(`Expected results at ${resultsPath}`);
  process.exit(1);
}

console.log(`Results written to ${resultsPath}`);
