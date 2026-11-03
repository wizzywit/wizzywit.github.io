import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE_URL } from './site';

describe('SITE_URL', () => {
  it('matches the site configured for Astro, so canonical links and sitemaps agree', () => {
    const config = readFileSync(new URL('../../../astro.config.mjs', import.meta.url), 'utf8');
    expect(config).toContain(`site: '${SITE_URL}'`);
  });

  it('has no trailing slash', () => {
    expect(SITE_URL.endsWith('/')).toBe(false);
  });
});
