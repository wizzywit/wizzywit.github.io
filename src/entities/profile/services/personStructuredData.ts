import type { Profile } from '../types/profile';

const absolute = (path: string, siteUrl: string): string => new URL(path, siteUrl).href;

export function buildPersonJsonLd(profile: Profile, siteUrl: string): object {
  const employer = profile.experience[0];
  const school = profile.education[0];
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${absolute('/', siteUrl)}#person`,
    name: profile.name,
    jobTitle: profile.role,
    url: absolute('/', siteUrl),
    sameAs: [profile.links.github, profile.links.linkedin, profile.links.gitlab],
    ...(employer ? { worksFor: { '@type': 'Organization', name: employer.org } } : {}),
    ...(school ? { alumniOf: { '@type': 'CollegeOrUniversity', name: school.school } } : {}),
  };
}

export function buildWebSiteJsonLd(name: string, siteUrl: string): object {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name, url: absolute('/', siteUrl) };
}

export function buildProfilePageJsonLd(siteUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absolute('/profile/', siteUrl),
    mainEntity: { '@id': `${absolute('/', siteUrl)}#person` },
  };
}
