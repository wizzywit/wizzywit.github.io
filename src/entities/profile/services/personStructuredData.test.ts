import { describe, expect, it } from 'vitest';
import type { Profile } from '../types/profile';
import { buildPersonJsonLd, buildProfilePageJsonLd, buildWebSiteJsonLd } from './personStructuredData';

const profile: Profile = {
  name: 'Wisdom Emmanuel Praise', role: 'Senior Frontend Engineer, Frontend Platform & Architecture', location: 'Munich area, Germany', summary: 's',
  yearsExperience: 7, email: 'a@b.co',
  links: { github: 'https://github.com/wizzywit', linkedin: 'https://www.linkedin.com/in/wisdom-praise', gitlab: 'https://gitlab.com/wizzywit' },
  skills: [], experience: [{ title: 'T', org: 'Censhare GmbH', location: 'L', period: 'P', context: '', stack: [], highlights: [] }],
  education: [{ degree: 'B.Eng.', school: 'Federal University of Technology, Minna, Nigeria', period: 'P', note: 'N' }], languages: [],
  workAuthorization: 'w', ticker: [],
};
const site = 'https://wizzywit.github.io';

describe('buildPersonJsonLd', () => {
  const json = buildPersonJsonLd(profile, site) as Record<string, unknown>;

  it('is a schema.org Person identified by the home page', () => {
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('Person');
    expect(json['@id']).toBe('https://wizzywit.github.io/#person');
    expect(json['name']).toBe('Wisdom Emmanuel Praise');
    expect(json['jobTitle']).toBe('Senior Frontend Engineer, Frontend Platform & Architecture');
    expect(json['url']).toBe('https://wizzywit.github.io/');
  });

  it('links the outside profiles and does not expose the email address', () => {
    expect(json['sameAs']).toEqual(['https://github.com/wizzywit', 'https://www.linkedin.com/in/wisdom-praise', 'https://gitlab.com/wizzywit']);
    expect(JSON.stringify(json)).not.toContain('a@b.co');
  });

  it('names the current employer and school from the profile', () => {
    expect(json['worksFor']).toEqual({ '@type': 'Organization', name: 'Censhare GmbH' });
    expect(json['alumniOf']).toEqual({ '@type': 'CollegeOrUniversity', name: 'Federal University of Technology, Minna, Nigeria' });
  });
});

describe('buildWebSiteJsonLd', () => {
  it('describes the site with an absolute url', () => {
    expect(buildWebSiteJsonLd(profile.name, site)).toMatchObject({ '@type': 'WebSite', name: 'Wisdom Emmanuel Praise', url: 'https://wizzywit.github.io/' });
  });

  it('tolerates a trailing slash on the site url', () => {
    expect((buildWebSiteJsonLd('W', 'https://wizzywit.github.io/') as Record<string, unknown>)['url']).toBe('https://wizzywit.github.io/');
  });
});

describe('buildProfilePageJsonLd', () => {
  it('points at the profile page and the person', () => {
    expect(buildProfilePageJsonLd(site)).toEqual({
      '@context': 'https://schema.org', '@type': 'ProfilePage', url: 'https://wizzywit.github.io/profile/',
      mainEntity: { '@id': 'https://wizzywit.github.io/#person' },
    });
  });
});
