import { describe, expect, it } from 'vitest';
import type { Project } from '../types/project';
import { describeProjectLink, extraProjectLinks } from './projectLinks';

const make = (patch: Partial<Project>): Project => ({
  slug: 'x', title: 'X', section: 'Platform', kicker: '', summary: '', role: '', href: null, external: false,
  hasCaseStudy: false, order: 1, draft: false, image: null, links: [], ...patch,
});

describe('describeProjectLink', () => {
  it('says nothing for an entry with no destination', () => {
    expect(describeProjectLink(make({}))).toBeNull();
  });

  it('names a case study', () => {
    expect(describeProjectLink(make({ href: '/work/wired/', hasCaseStudy: true }))).toBe('Read the case study');
  });

  it('names a decision record', () => {
    expect(describeProjectLink(make({ href: '/decisions/five-layers/' }))).toBe('Read the decision');
  });

  it('names a GitHub repository or organisation', () => {
    expect(describeProjectLink(make({ href: 'https://github.com/WebSuckIt', external: true }))).toBe('View on GitHub');
    expect(describeProjectLink(make({ href: 'https://www.github.com/wizzywit/wired', external: true }))).toBe('View on GitHub');
  });

  it('names any other outside site', () => {
    expect(describeProjectLink(make({ href: 'https://vreg.gov.ng', external: true }))).toBe('Visit the site');
  });

  it('does not mistake a lookalike host for GitHub', () => {
    expect(describeProjectLink(make({ href: 'https://notgithub.com.example.org/x', external: true }))).toBe('Visit the site');
  });
});

describe('extraProjectLinks', () => {
  it('lists further links but never repeats the main destination', () => {
    const project = make({ href: 'https://github.com/wizzywit/wired', external: true, links: [{ label: 'Source', href: 'https://github.com/wizzywit/wired' }, { label: 'Docs', href: 'https://x.dev/docs' }] });
    expect(extraProjectLinks(project)).toEqual([{ label: 'Docs', href: 'https://x.dev/docs' }]);
  });

  it('is empty when there are none', () => {
    expect(extraProjectLinks(make({}))).toEqual([]);
  });
});
