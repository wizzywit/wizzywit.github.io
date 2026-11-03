import { describe, expect, it } from 'vitest';
import type { Project } from '@/entities/project';
import { dropUnpublishedDecisionLinks } from './dropUnpublishedLinks';

const make = (slug: string, href: string | null): Project => ({
  slug, title: slug, section: 'Platform', kicker: '', summary: '', role: '', href,
  external: href?.startsWith('http') ?? false, hasCaseStudy: false, order: 1, draft: false, image: null, links: [],
});

describe('dropUnpublishedDecisionLinks', () => {
  const projects = [
    make('a', '/decisions/five-layers/'),
    make('b', '/decisions/one-runtime/'),
    make('c', '/work/odudu/'),
    make('d', 'https://github.com/wizzywit/wired'),
    make('e', null),
  ];

  it('unlinks entries whose decision is not published', () => {
    const result = dropUnpublishedDecisionLinks(projects, ['one-runtime']);
    expect(result.map((p) => p.href)).toEqual([null, '/decisions/one-runtime/', '/work/odudu/', 'https://github.com/wizzywit/wired', null]);
  });

  it('keeps every link when all decisions are published', () => {
    expect(dropUnpublishedDecisionLinks(projects, ['five-layers', 'one-runtime']).map((p) => p.href)).toEqual(projects.map((p) => p.href));
  });

  it('leaves case studies and outside links alone and does not mutate the input', () => {
    const copy = JSON.parse(JSON.stringify(projects));
    dropUnpublishedDecisionLinks(projects, []);
    expect(projects).toEqual(copy);
  });
});
