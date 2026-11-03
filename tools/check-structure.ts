import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SLICED_LAYERS = ['entities', 'features', 'widgets', '_pages'];
const SEGMENTS = ['ui', 'use-cases', 'repository', 'services', 'adapter', 'types'];
const SLICE_ROOT_ALLOWED = new Set([...SEGMENTS, '@x']);
const FORBIDDEN_FOLDERS = ['components', 'hooks', 'utils', 'helpers', 'model'];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? [full, ...walk(full)] : [full];
  });
}

/** Returns one message per structural rule violation under a src/ directory. */
export function checkStructure(srcDir: string): string[] {
  const problems: string[] = [];
  for (const layer of SLICED_LAYERS) {
    const layerDir = path.join(srcDir, layer);
    let slices: string[];
    try {
      slices = readdirSync(layerDir).filter((n) => statSync(path.join(layerDir, n)).isDirectory());
    } catch {
      continue;
    }
    for (const slice of slices) {
      const sliceDir = path.join(layerDir, slice);
      for (const name of readdirSync(sliceDir)) {
        const isDir = statSync(path.join(sliceDir, name)).isDirectory();
        if (isDir && !SLICE_ROOT_ALLOWED.has(name) && !FORBIDDEN_FOLDERS.includes(name)) {
          problems.push(`${layer}/${slice}/${name}: not an allowed segment (${SEGMENTS.join(', ')})`);
        }
      }
      for (const entry of walk(sliceDir)) {
        const rel = path.relative(srcDir, entry).split(path.sep).join('/');
        const parts = path.relative(sliceDir, entry).split(path.sep);
        if (statSync(entry).isDirectory() && FORBIDDEN_FOLDERS.includes(path.basename(entry))) {
          problems.push(`${rel}: folder name "${path.basename(entry)}" is not allowed inside a slice`);
        }
        const isSegmentIndex = parts.length === 2 && SEGMENTS.includes(parts[0] ?? '') && /^index\./.test(parts[1] ?? '');
        if (isSegmentIndex) problems.push(`${rel}: segment-level index files are not allowed`);
      }
      const indexFile = readdirSync(sliceDir).find((n) => /^index\./.test(n));
      if (indexFile) {
        const text = readFileSync(path.join(sliceDir, indexFile), 'utf8');
        if (/export[^;]*from\s+['"][^'"]*\/adapter\//.test(text)) {
          problems.push(`${layer}/${slice}/${indexFile}: an adapter must not be exported from the slice index`);
        }
      }
    }
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = checkStructure(path.resolve('src'));
  problems.forEach((p) => console.error(p));
  process.exit(problems.length ? 1 : 0);
}
