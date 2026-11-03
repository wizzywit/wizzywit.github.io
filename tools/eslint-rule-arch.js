import path from 'node:path';

const LAYERS = ['shared', 'entities', 'features', 'widgets', '_pages', 'app'];
const SLICED = new Set(['entities', 'features', 'widgets', '_pages']);
const SEGMENTS = ['ui', 'use-cases', 'repository', 'services', 'adapter', 'types'];

const FORBIDDEN_SEGMENTS = {
  ui: ['repository', 'services', 'adapter'],
  'use-cases': ['adapter'],
  repository: ['use-cases', 'ui'],
  services: ['repository', 'adapter', 'ui', 'use-cases'],
  adapter: ['repository', 'services', 'use-cases', 'ui'],
  types: ['repository', 'services', 'adapter', 'ui', 'use-cases'],
};
const SERVICE_FORBIDDEN_EXTERNALS = /^(react|react-dom|zustand|astro:.*|@tanstack\/.*)$/;

/** Splits a repo-relative path under src/ into layer, slice, segment and depth. */
function classify(rel) {
  const parts = rel.split('/');
  if (parts[0] !== 'src' || !LAYERS.includes(parts[1])) return null;
  const layer = parts[1];
  if (!SLICED.has(layer)) return { layer, slice: null, segment: SEGMENTS.includes(parts[2]) ? parts[2] : null, isPublic: true };
  const slice = parts[2] ?? null;
  const segment = SEGMENTS.includes(parts[3]) ? parts[3] : null;
  const isPublic = parts.length <= 3 || (parts.length === 4 && /^index(\.|$)/.test(parts[3] ?? ''));
  return { layer, slice, segment, isPublic };
}

function toRepoRelative(source, fromRel) {
  if (source.startsWith('@/')) return `src/${source.slice(2)}`;
  if (source.startsWith('.')) return path.posix.normalize(path.posix.join(path.posix.dirname(fromRel), source));
  return null;
}

export const archImports = {
  meta: { type: 'problem', schema: [], messages: { bad: '{{reason}}' } },
  create(context) {
    const fromRel = path.relative(context.cwd, context.filename).split(path.sep).join('/');
    const from = classify(fromRel);
    if (!from) return {};

    function check(node, source) {
      if (typeof source !== 'string') return;
      const report = (reason) => context.report({ node, messageId: 'bad', data: { reason } });

      if (source.startsWith('astro:content') && from.segment !== 'adapter') {
        return report('astro:content may only be used inside an adapter');
      }
      if (from.segment === 'services' && SERVICE_FORBIDDEN_EXTERNALS.test(source)) {
        return report(`services must not import "${source}"; pass side effects in as dependencies`);
      }

      const targetRel = toRepoRelative(source, fromRel);
      if (!targetRel) return;
      const target = classify(targetRel);
      if (!target) return;

      const sameSlice = target.layer === from.layer && target.slice === from.slice;
      if (!sameSlice) {
        const up = LAYERS.indexOf(target.layer) > LAYERS.indexOf(from.layer);
        const sideways = target.layer === from.layer && SLICED.has(from.layer);
        if (up) return report(`"${source}" points to a higher layer`);
        if (sideways) return report(`"${source}" is a different slice on the same layer`);
        if (SLICED.has(target.layer) && !target.isPublic) {
          return report(`"${source}" is a deep import; use the slice's index.ts`);
        }
        return;
      }
      const forbidden = FORBIDDEN_SEGMENTS[from.segment] ?? [];
      if (target.segment && forbidden.includes(target.segment)) {
        report(`${from.segment} must not import from ${target.segment}`);
      }
    }

    return {
      ImportDeclaration: (n) => check(n, n.source.value),
      ExportNamedDeclaration: (n) => n.source && check(n, n.source.value),
      ExportAllDeclaration: (n) => check(n, n.source.value),
      ImportExpression: (n) => n.source.type === 'Literal' && check(n, n.source.value),
    };
  },
};
