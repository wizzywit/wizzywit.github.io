import { describe, expect, it } from 'vitest';
import fixture from './__fixtures__/odudu-case.entry.json';
import { mapCaseStudyEntry } from './caseStudyContentAdapter';

describe('mapCaseStudyEntry', () => {
  const study = mapCaseStudyEntry(fixture);

  it('maps the headline fields', () => {
    expect(study).toMatchObject({ slug: 'odudu', kicker: 'Identity · Open source · Case study', decisions: ['conformance-ci-gate', 'agent-permissions'] });
    expect(study.meta.links).toEqual([{ label: 'Source', href: 'https://github.com/wizzywit/odudu' }]);
  });

  it('defaults a section draft flag to false and keeps the explicit one', () => {
    expect(study.sections.map((s) => s.draft)).toEqual([true, false]);
  });
});
