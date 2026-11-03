import { readFileSync } from 'node:fs';
import postcss, { type AtRule, type Declaration, type Rule } from 'postcss';
import { describe, expect, it } from 'vitest';

const root = postcss.parse(readFileSync(new URL('./motion.css', import.meta.url), 'utf8'));

function insideKeyframes(decl: Declaration): boolean {
  let parent = decl.parent;
  while (parent && parent.type !== 'root') {
    if (parent.type === 'atrule' && (parent as AtRule).name.endsWith('keyframes')) return true;
    parent = parent.parent;
  }
  return false;
}

/** A declaration that leaves content invisible or squashed until its reveal runs. */
const HIDING = (decl: Declaration): boolean =>
  (decl.prop === 'opacity' && decl.value.trim() === '0') ||
  (decl.prop === 'transform' && /scale[XY]?\(0\)|translate/.test(decl.value)) ||
  (decl.prop === 'background-size' && /^0/.test(decl.value.trim()));

describe('motion.css', () => {
  it('hides content only under html.motion, which the bootstrap sets for visitors who allow motion', () => {
    const offenders: string[] = [];
    let hiding = 0;
    root.walkDecls((decl) => {
      if (insideKeyframes(decl) || !HIDING(decl)) return;
      hiding += 1;
      const selector = (decl.parent as Rule).selector ?? '';
      if (!selector.split(',').every((part) => part.trim().startsWith('html.motion'))) offenders.push(`${selector} { ${decl.prop}: ${decl.value} }`);
    });
    expect(offenders).toEqual([]);
    expect(hiding).toBeGreaterThan(3);
  });

  it('only ever hides things that have not yet been revealed', () => {
    root.walkRules((rule) => {
      if (!rule.selector.startsWith('html.motion')) return;
      let hides = false;
      rule.walkDecls((decl) => { if (HIDING(decl)) hides = true; });
      if (hides) expect(rule.selector, rule.selector).toContain(':not(.is-in)');
    });
  });

  it('does not depend on scroll-driven animation support', () => {
    expect(root.toString()).not.toContain('animation-timeline');
  });
});
