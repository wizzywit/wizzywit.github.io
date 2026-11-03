import { describe, expect, it } from 'vitest';
import fixture from './__fixtures__/odudu.entry.json';
import { mapProjectEntry } from './projectContentAdapter';

describe('mapProjectEntry', () => {
  it('maps a collection entry to a Project', () => {
    expect(mapProjectEntry(fixture)).toEqual({
      slug: 'odudu',
      title: 'Odudu',
      section: 'Identity',
      kicker: 'Identity · Open source',
      summary: fixture.data.summary,
      role: 'Creator, maintainer',
      href: '/work/odudu/',
      external: false,
      hasCaseStudy: true,
      order: 5,
      draft: false,
    });
  });

  it('treats a missing href as unlinked', () => {
    const project = mapProjectEntry({ id: 'x', data: { ...fixture.data, href: undefined } });
    expect(project.href).toBeNull();
    expect(project.external).toBe(false);
    expect(project.hasCaseStudy).toBe(false);
  });

  it('marks https links as external and not a case study', () => {
    const project = mapProjectEntry({ id: 'x', data: { ...fixture.data, href: 'https://github.com/wizzywit/wired' } });
    expect(project.external).toBe(true);
    expect(project.hasCaseStudy).toBe(false);
  });

  it('keeps an internal decision link out of case-study status', () => {
    const project = mapProjectEntry({ id: 'x', data: { ...fixture.data, href: '/decisions/five-layers/' } });
    expect(project.external).toBe(false);
    expect(project.hasCaseStudy).toBe(false);
  });

  it('carries the draft flag', () => {
    expect(mapProjectEntry({ id: 'x', data: { ...fixture.data, draft: true } }).draft).toBe(true);
  });

  it('rejects an unknown section', () => {
    expect(() => mapProjectEntry({ id: 'x', data: { ...fixture.data, section: 'Gardening' } })).toThrow(/Gardening/);
  });
});
