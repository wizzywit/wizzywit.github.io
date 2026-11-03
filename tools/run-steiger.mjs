// Steiger only knows the layer name "pages". Astro reserves src/pages for routes, so the FSD
// pages layer lives in src/_pages. Lint a mirror where _pages is renamed to pages and the
// Astro route shells (src/pages) are left out.
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const mirror = '.steiger/src';
rmSync('.steiger', { recursive: true, force: true });
mkdirSync('.steiger', { recursive: true });
cpSync('src', mirror, { recursive: true, filter: (p) => !p.replaceAll('\\', '/').startsWith('src/pages') });
if (existsSync(`${mirror}/_pages`)) renameSync(`${mirror}/_pages`, `${mirror}/pages`);

const result = spawnSync('pnpm', ['exec', 'steiger', mirror], { stdio: 'inherit' });
rmSync('.steiger', { recursive: true, force: true });
process.exit(result.status ?? 1);
