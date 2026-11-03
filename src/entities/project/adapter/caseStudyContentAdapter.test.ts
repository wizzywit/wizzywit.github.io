import { describe, expect, it } from 'vitest';
import fixture from './__fixtures__/odudu-case.entry.json';
import { mapCaseStudyEntry } from './caseStudyContentAdapter';

describe('mapCaseStudyEntry', () => {
  const study = mapCaseStudyEntry(fixture);

  it('maps the headline fields', () => {
    expect(study).toMatchObject({ slug: 'odudu', kicker: 'Identity · Open source · Case study', decisions: ['conformance-ci-gate', 'agent-permissions'] });
    expect(study.meta.links).toEqual([{ label: 'Source', href: 'https://github.com/wizzywit/odudu' }]);
  });

  it('carries the short name, hero, gallery and video fields', () => {
    expect(study.name).toBe('Odudu');
    expect(study.hero).toEqual({ light: 'odudu/overview-light.webp', dark: 'odudu/overview-dark.webp', alt: 'Console overview' });
    expect(study.sections[1]?.media).toEqual([{ image: 'odudu/flow-light.webp', alt: 'Sign-in flow', caption: 'The flow' }]);
    expect(study.sections[1]?.video).toEqual({ src: '/media/x.mp4', poster: 'odudu/console-poster.png', label: 'Console demo', caption: 'In use' });
    expect(study.sections[1]?.diagram).toBe('odudu-architecture');
  });

  it('has no media by default', () => {
    expect(study.sections[0]?.media).toEqual([]);
    expect(study.sections[0]?.video).toBeNull();
    expect(study.sections[0]?.diagram).toBeNull();
  });

  it('defaults a section draft flag to false and keeps the explicit one', () => {
    expect(study.sections.map((s) => s.draft)).toEqual([true, false]);
  });
});
