import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from '@/shared/lib/contrast';
import { darkTokens, lightTokens, tokenPairs } from './tokens';

describe('design tokens', () => {
  for (const theme of ['light', 'dark'] as const) {
    for (const pair of tokenPairs[theme]) {
      it(`${theme}: ${pair.name} meets 4.5:1`, () => {
        expect(contrastRatio(pair.fg, pair.bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it('keeps tokens.css in sync with tokens.ts', () => {
    const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8').toLowerCase();
    for (const value of [...Object.values(lightTokens), ...Object.values(darkTokens)]) {
      expect(css).toContain(value.toLowerCase());
    }
  });
});
