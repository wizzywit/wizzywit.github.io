import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import fixture from './__fixtures__/profile.entry.json';
import { mapProfileEntry } from './profileContentAdapter';

describe('mapProfileEntry', () => {
  it('maps a collection entry to a Profile', () => {
    const profile = mapProfileEntry(fixture);
    expect(profile.name).toBe('Wisdom Emmanuel Praise');
    expect(profile.links.github).toBe('https://github.com/wizzywit');
    expect(profile.ticker).toEqual([{ id: 'mcp-tools', text: 'MCP server: 35 permission-scoped tools for agents' }]);
  });

  it('rejects an entry without an email', () => {
    expect(() => mapProfileEntry({ id: 'profile', data: { ...fixture.data, email: '' } })).toThrow(/email/);
  });

  it('rejects an entry without a ticker array', () => {
    expect(() => mapProfileEntry({ id: 'profile', data: { ...fixture.data, ticker: undefined } })).toThrow(/ticker/);
  });
});

describe('content/profile.json', () => {
  const real = JSON.parse(readFileSync(new URL('../../../../content/profile.json', import.meta.url), 'utf8'));
  const profile = mapProfileEntry({ id: 'profile', data: real });

  it('carries the four ticker figures from the design', () => {
    expect(profile.ticker.map((t) => t.id)).toEqual(['mcp-tools', 'extension-accounts', 'odudu-conformance', 'micro-frontends']);
  });

  it('lists every employer on the résumé in order', () => {
    expect(profile.experience.map((e) => e.org)).toEqual([
      'Censhare GmbH', 'Agile Robots SE', 'FYEO Inc', 'Outsource Global Technologies', 'Access Solutions Ltd',
    ]);
  });

  it('carries the years of experience from the résumé summary', () => {
    expect(profile.yearsExperience).toBe(7);
  });

  it('uses the résumé email', () => {
    expect(profile.email).toBe('wisdompraise968@gmail.com');
  });
});
