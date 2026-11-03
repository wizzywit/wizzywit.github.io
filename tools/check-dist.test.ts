import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findDistProblems } from './check-dist.ts';

function dist(files: Record<string, string | Buffer>): string {
  const root = mkdtempSync(path.join(tmpdir(), 'dist-'));
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(root, rel);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, body);
  }
  return root;
}

const page = (body: string, head = '') => `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;

describe('findDistProblems', () => {
  it('accepts a clean site', () => {
    const root = dist({ 'index.html': page('<a href="/work/">Work</a>'), 'work/index.html': page('<p>Work</p>') });
    expect(findDistProblems(root)).toEqual([]);
  });

  it('fails when anything is published under /odudu/', () => {
    const root = dist({ 'index.html': page(''), 'odudu/index.html': page('') });
    expect(findDistProblems(root).join('\n')).toMatch(/odudu/);
  });

  it('flags placeholder text but ignores brackets inside scripts', () => {
    const bad = dist({ 'index.html': page('<p>Hello [Owner: write this.]</p>') });
    expect(findDistProblems(bad).join('\n')).toMatch(/Owner: write this/);
    const fine = dist({ 'index.html': page('<script type="application/ld+json">{"a":["b"]}</script><p>ok</p>') });
    expect(findDistProblems(fine)).toEqual([]);
  });

  it('flags a dead hash link', () => {
    expect(findDistProblems(dist({ 'index.html': page('<a href="#">x</a>') })).join('\n')).toMatch(/href="#"/);
  });

  it('flags an internal link whose page does not exist, but allows files and in-page anchors', () => {
    const root = dist({ 'index.html': page('<a href="/missing/">x</a><a href="/cv.pdf">cv</a><a href="#main">skip</a>'), 'cv.pdf': 'x' });
    const problems = findDistProblems(root);
    expect(problems).toHaveLength(1);
    expect(problems[0]).toMatch(/\/missing\//);
  });

  it('fails a page whose JavaScript, including imported chunks, exceeds the budget', () => {
    const big = randomBytes(6000).toString('base64');
    const root = dist({
      'index.html': page('<astro-island component-url="/_astro/island.js" renderer-url="/_astro/client.js"></astro-island>'),
      '_astro/island.js': `import "./chunk.js";export default 1;`,
      '_astro/chunk.js': `export const x="${big}";`,
      '_astro/client.js': 'export default 2;',
    });
    expect(findDistProblems(root, { jsBudgetBytes: 1000 }).join('\n')).toMatch(/JavaScript/);
    expect(findDistProblems(root, { jsBudgetBytes: 100_000 })).toEqual([]);
  });
});
