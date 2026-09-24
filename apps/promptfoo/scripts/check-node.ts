const MIN_NODE = [22, 22, 0];

function parseVersion(version: string): number[] {
  return version.replace(/^v/, '').split('.').map((n) => Number(n));
}

function meetsMinimum(current: number[], minimum: number[]): boolean {
  for (let i = 0; i < 3; i += 1) {
    const c = current[i] ?? 0;
    const m = minimum[i] ?? 0;
    if (c > m) return true;
    if (c < m) return false;
  }
  return true;
}

const proc = Bun.spawnSync(['node', '--version'], { stdout: 'pipe', stderr: 'pipe' });
if (proc.exitCode !== 0) {
  console.error('Promptfoo eval requires Node.js on PATH (>= 22.22.0). Install Node or use fnm/nvm.');
  process.exit(1);
}

const version = new TextDecoder().decode(proc.stdout).trim();
if (!meetsMinimum(parseVersion(version), MIN_NODE)) {
  console.error(`Promptfoo requires Node.js >= ${MIN_NODE.join('.')}. Detected: ${version}`);
  console.error('Tip: fnm install 22.22.0 && fnm use 22.22.0');
  process.exit(1);
}

console.log(`Node OK (${version})`);
