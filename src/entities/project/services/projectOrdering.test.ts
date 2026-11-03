import { describe, expect, it } from 'vitest';
import type { Project } from '../types/project';
import { sortProjects } from './projectOrdering';

const make = (slug: string, order: number): Project => ({
  slug, title: slug, section: 'Platform', kicker: '', summary: '', role: '', href: null, external: false, hasCaseStudy: false, order, draft: false,
});

describe('sortProjects', () => {
  it('orders by the order field ascending without mutating the input', () => {
    const input = [make('c', 3), make('a', 1), make('b', 2)];
    expect(sortProjects(input).map((p) => p.slug)).toEqual(['a', 'b', 'c']);
    expect(input.map((p) => p.slug)).toEqual(['c', 'a', 'b']);
  });
});
