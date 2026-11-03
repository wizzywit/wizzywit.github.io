import { describe, expect, it } from 'vitest';
import type { Project } from '../types/project';
import { describeProjectCount, filterProjects } from './projectFiltering';

const make = (slug: string, section: Project['section']): Project => ({
  slug, title: slug, section, kicker: section, summary: '', role: '', href: null, external: false, hasCaseStudy: false, order: 1, draft: false,
});
const projects = [make('a', 'Platform'), make('b', 'Security'), make('c', 'Platform'), make('d', 'Security')];

describe('filterProjects', () => {
  it('returns every project for All', () => {
    expect(filterProjects(projects, 'All')).toHaveLength(4);
  });

  it('returns only the chosen section', () => {
    expect(filterProjects(projects, 'Security').map((p) => p.slug)).toEqual(['b', 'd']);
  });

  it('returns an empty list for a section with no entries', () => {
    expect(filterProjects(projects, 'Rust')).toEqual([]);
  });
});

describe('describeProjectCount', () => {
  it('uses the singular for one entry', () => {
    expect(describeProjectCount(1, 'All')).toBe('1 entry');
  });

  it('uses the plural otherwise, including zero', () => {
    expect(describeProjectCount(8, 'All')).toBe('8 entries');
    expect(describeProjectCount(0, 'Rust')).toBe('0 entries in Rust');
  });

  it('names the section when filtered', () => {
    expect(describeProjectCount(3, 'Platform')).toBe('3 entries in Platform');
  });
});
