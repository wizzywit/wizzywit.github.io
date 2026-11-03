import { describe, expect, it } from 'vitest';
import { findPlaceholders } from '@/shared/lib';
import type { Decision } from '@/entities/decision';
import type { Project } from '@/entities/project';
import { buildHomeViewModel } from './homeViewModel';

const project = (slug: string, order: number, href: string | null = null): Project => ({
  slug, title: slug.toUpperCase(), section: 'Platform', kicker: `Kicker ${slug}`, summary: `Summary ${slug}`, role: 'Role',
  href, external: href?.startsWith('http') ?? false, hasCaseStudy: href?.startsWith('/work/') ?? false, order, draft: false, image: null, links: [],
});
const decision = (slug: string, number: number): Decision => ({
  slug, number, title: `Title ${slug}`, why: `Why ${slug}`, area: 'Area', status: 'accepted', decidedOn: null, related: [],
  context: [], options: [], decision: '', consequences: { better: [], harder: [] }, draft: false,
});

const withImage = (p: Project): Project => ({ ...p, image: { name: `${p.slug}.png`, alt: `Alt ${p.slug}` } });
const projects = [
  withImage({ ...project('odudu', 5, '/work/odudu/'), hasCaseStudy: true }), withImage({ ...project('wired', 6, '/work/wired/'), hasCaseStudy: true }), withImage(project('websuckit', 7, 'https://github.com/WebSuckIt')),
  project('fyeo-domain-intelligence', 8), withImage(project('phishing-extension', 9)), project('dione', 10), project('nasims', 11),
  withImage(project('vreg', 12, 'https://vreg.gov.ng')), withImage(project('idec', 13)), withImage(project('outsource-global-website', 14, 'https://www.outsourceglobal.com/')),
  project('rust-side-projects', 15),
];
const decisions = [decision('five-layers', 1), decision('one-runtime', 2), decision('accessibility-in-dod', 3), decision('agent-permissions', 4)];

describe('buildHomeViewModel', () => {
  const vm = buildHomeViewModel(projects, decisions);

  it('leads with the five-layer architecture and links its decision when published', () => {
    expect(vm.lead.headline).toMatch(/One feature, five layers/);
    expect(vm.lead.decisionHref).toBe('/decisions/five-layers/');
  });

  it('drops the decision link when that decision is not published', () => {
    expect(buildHomeViewModel(projects, []).lead.decisionHref).toBeNull();
  });

  it('features Odudu, Wired and WebSuckIt in that order, keeping real links only', () => {
    expect(vm.featured.map((f) => f.slug)).toEqual(['odudu', 'wired', 'websuckit']);
    expect(vm.featured.map((f) => f.href)).toEqual(['/work/odudu/', '/work/wired/', 'https://github.com/WebSuckIt']);
  });

  it('gives each featured entry its picture, with alt text, for the page to show', () => {
    expect(vm.featured.map((f) => f.image)).toEqual([
      { name: 'odudu.png', alt: 'Alt odudu' }, { name: 'wired.png', alt: 'Alt wired' }, { name: 'websuckit.png', alt: 'Alt websuckit' },
    ]);
  });

  it('words each link as a call to action so a card clearly opens something', () => {
    expect(vm.featured.map((f) => f.cta)).toEqual(['Read the case study', 'Read the case study', 'View on GitHub']);
    expect(vm.more.map((m) => m.cta)).toEqual([null, 'Visit the site', null, 'Visit the site']);
  });

  it('skips a featured project that is not published', () => {
    const fewer = buildHomeViewModel(projects.filter((p) => p.slug !== 'wired'), decisions);
    expect(fewer.featured.map((f) => f.slug)).toEqual(['odudu', 'websuckit']);
  });

  it('lists four smaller entries that have pictures, from project data', () => {
    expect(vm.more.map((m) => m.title)).toEqual(['PHISHING-EXTENSION', 'VREG', 'IDEC', 'OUTSOURCE-GLOBAL-WEBSITE']);
    expect(vm.more[0]).toMatchObject({ kicker: 'Kicker phishing-extension', blurb: 'Summary phishing-extension', image: { name: 'phishing-extension.png', alt: 'Alt phishing-extension' } });
    expect(vm.more.map((m) => m.href)).toEqual([null, 'https://vreg.gov.ng', null, 'https://www.outsourceglobal.com/']);
  });

  it('shows the three chosen decisions that exist, in the chosen order', () => {
    expect(vm.decisions.map((d) => d.href)).toEqual(['/decisions/one-runtime/', '/decisions/accessibility-in-dod/', '/decisions/agent-permissions/']);
    expect(buildHomeViewModel(projects, decisions.slice(0, 2)).decisions).toHaveLength(1);
  });

  it('shows each featured decision with its own status, not a fixed word', () => {
    const mixed = [decision('one-runtime', 2), { ...decision('accessibility-in-dod', 3), status: 'proposed' as const }, { ...decision('agent-permissions', 4), status: 'superseded' as const }];
    expect(buildHomeViewModel(projects, mixed).decisions.map((d) => d.status)).toEqual(['Accepted', 'Proposed', 'Superseded']);
  });

  it('has no decisions section content when none are published', () => {
    expect(buildHomeViewModel(projects, []).decisions).toEqual([]);
  });

  it('states the six résumé facts in brief', () => {
    expect(vm.inBrief.map((i) => i.figure)).toEqual(['13', '30+', '10+', '35', '2M+', 'AA']);
  });

  it('never carries placeholder markers or dead links', () => {
    const strings: string[] = [];
    JSON.stringify(vm, (_key, value) => {
      if (typeof value === 'string') strings.push(value);
      return value;
    });
    expect(findPlaceholders(strings.join('\n'))).toEqual([]);
    expect(strings).not.toContain('#');
  });
});
