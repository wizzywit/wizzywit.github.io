import { describe, expect, it } from 'vitest';
import type { CaseStudy } from '@/entities/project';
import type { Decision } from '@/entities/decision';
import { buildCaseStudyViewModel } from './caseStudyViewModel';

const study = {
  slug: 'odudu', title: 'T', kicker: 'K', deck: 'D',
  meta: { role: 'r', type: 't', stack: 's', links: [] }, glance: { problem: 'p', approach: 'a', result: 'r' },
  decisions: ['agent-permissions', 'conformance-ci-gate', 'ghost'], sections: [],
} satisfies CaseStudy;
const decision = (slug: string): Decision => ({
  slug, number: 1, title: `Title ${slug}`, why: '', area: '', status: 'accepted', decidedOn: null, related: [],
  context: [], options: [], decision: '', consequences: { better: [], harder: [] }, draft: false,
});

describe('buildCaseStudyViewModel', () => {
  it('lists the study decisions that are published, in the study order', () => {
    const vm = buildCaseStudyViewModel(study, [decision('conformance-ci-gate'), decision('agent-permissions')]);
    expect(vm.decisions).toEqual([
      { title: 'Title agent-permissions', href: '/decisions/agent-permissions/', status: 'Accepted' },
      { title: 'Title conformance-ci-gate', href: '/decisions/conformance-ci-gate/', status: 'Accepted' },
    ]);
  });

  it('has an empty list when none of them are published', () => {
    expect(buildCaseStudyViewModel(study, []).decisions).toEqual([]);
  });
});
