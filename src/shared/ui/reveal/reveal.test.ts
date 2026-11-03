import { readFileSync } from 'node:fs';
import postcss, { type AtRule, type Container, type Declaration } from 'postcss';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./reveal.css', import.meta.url), 'utf8');
const root = postcss.parse(css);

function ancestors(node: Container | Declaration): AtRule[] {
  const found: AtRule[] = [];
  let current = node.parent;
  while (current && current.type !== 'root') {
    if (current.type === 'atrule') found.push(current as AtRule);
    current = current.parent;
  }
  return found;
}

const MOTION_PROPS = ['animation', 'animation-timeline', 'animation-range', 'opacity', 'transform'];

describe('reveal.css', () => {
  it('defines the reveal-in keyframes', () => {
    let found = false;
    root.walkAtRules('keyframes', (rule) => {
      if (rule.params === 'reveal-in') found = true;
    });
    expect(found).toBe(true);
  });

  it('applies motion only inside the supports and no-preference guards', () => {
    const unguarded: string[] = [];
    let guarded = 0;
    root.walkDecls((decl) => {
      if (!MOTION_PROPS.includes(decl.prop)) return;
      const parents = ancestors(decl);
      if (parents.some((p) => p.name === 'keyframes')) return;
      const hasSupports = parents.some((p) => p.name === 'supports' && p.params.includes('animation-timeline: view()'));
      const hasMedia = parents.some((p) => p.name === 'media' && p.params.includes('prefers-reduced-motion: no-preference'));
      if (hasSupports && hasMedia) guarded += 1;
      else unguarded.push(`${decl.prop}: ${decl.value}`);
    });
    expect(unguarded).toEqual([]);
    expect(guarded).toBeGreaterThan(0);
  });

  it('never hides content outside a keyframe', () => {
    let hidden = false;
    root.walkDecls('opacity', (decl) => {
      if (decl.value === '0' && !ancestors(decl).some((p) => p.name === 'keyframes')) hidden = true;
    });
    expect(hidden).toBe(false);
  });
});
