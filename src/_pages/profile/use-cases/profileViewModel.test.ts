import { describe, expect, it } from 'vitest';
import type { Profile } from '@/entities/profile';
import { buildProfileViewModel } from './profileViewModel';

const profile: Profile = {
  name: 'W', role: 'Senior Frontend Engineer, Frontend Platform & Architecture', location: 'Munich area, Germany', summary: 's', yearsExperience: 7,
  email: 'a@b.co', links: { github: 'g', linkedin: 'l', gitlab: 'x' },
  skills: [{ group: 'Languages', items: ['TypeScript'] }],
  experience: [
    { title: 'T1', org: 'Org1', location: 'L', period: 'P1', context: 'C1', stack: ['A'], highlights: ['H1'] },
    { title: 'T2', org: 'Org2', location: 'L', period: 'P2', context: '', stack: [], highlights: ['H2'] },
  ],
  education: [{ degree: 'D', school: 'S', period: 'P', note: 'N' }],
  languages: [{ language: 'English', level: 'Native' }],
  workAuthorization: 'Authorised.', ticker: [],
};

describe('buildProfileViewModel', () => {
  it('uses the role as the page heading and keeps jobs in résumé order', () => {
    const vm = buildProfileViewModel(profile, false);
    expect(vm.heading).toBe('Senior Frontend Engineer, Frontend Platform & Architecture');
    expect(vm.jobs.map((j) => j.org)).toEqual(['Org1', 'Org2']);
  });

  it('offers the PDF only when a CV file exists', () => {
    expect(buildProfileViewModel(profile, false).cvHref).toBeNull();
    expect(buildProfileViewModel(profile, true).cvHref).toBe('/cv.pdf');
  });

  it('states what the owner is looking for, languages and work authorisation', () => {
    const vm = buildProfileViewModel(profile, false);
    expect(vm.facts.map((f) => f.label)).toEqual(['Looking for', 'Works', 'Languages']);
    expect(vm.facts[2]?.value).toBe('English: Native');
    expect(vm.workAuthorization).toBe('Authorised.');
  });

  it('mentions the years of experience from the profile, not a literal', () => {
    expect(buildProfileViewModel({ ...profile, yearsExperience: 9 }, false).intro.join(' ')).toContain('9+ years');
  });

  it('carries no placeholder markers', () => {
    expect(JSON.stringify(buildProfileViewModel(profile, false))).not.toMatch(/\[[A-Z][^\]]*\]/);
  });
});
