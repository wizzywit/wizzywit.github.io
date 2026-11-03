import { describe, expect, it } from 'vitest';
import type { CaseStudy } from '../types/caseStudy';
import { publishableSections } from './caseStudyPublishing';

const study: CaseStudy = {
  slug: 'x', name: 'X', title: 't', kicker: 'k', deck: 'd', hero: { light: 'a.png', dark: null, alt: 'a' },
  meta: { role: 'r', type: 't', stack: 's', links: [] }, glance: { problem: 'p', approach: 'a', result: 'r' }, decisions: [],
  sections: [
    { id: 'a', heading: 'A', paragraphs: [], draft: false, media: [], video: null, diagram: null },
    { id: 'b', heading: 'B', paragraphs: [], draft: true, media: [], video: null, diagram: null },
  ],
};

describe('publishableSections', () => {
  it('drops draft sections from a production build', () => {
    expect(publishableSections(study, false).sections.map((s) => s.id)).toEqual(['a']);
  });

  it('keeps every section in preview', () => {
    expect(publishableSections(study, true).sections.map((s) => s.id)).toEqual(['a', 'b']);
  });
});
