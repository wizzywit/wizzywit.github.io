import type { Profile } from '../types/profile';

type PartialProfile = { [K in keyof Profile]?: Profile[K] | undefined };

export type ProfileEntry = { id: string; data: PartialProfile };

function required<K extends keyof Profile>(data: PartialProfile, key: K): Profile[K] {
  const value = data[key];
  if (value === undefined || value === null || value === '') throw new Error(`Profile is missing "${key}"`);
  return value;
}

export function mapProfileEntry(entry: ProfileEntry): Profile {
  const { data } = entry;
  const ticker = required(data, 'ticker');
  if (!Array.isArray(ticker)) throw new Error('Profile "ticker" must be an array');
  return {
    name: required(data, 'name'),
    role: required(data, 'role'),
    location: required(data, 'location'),
    summary: required(data, 'summary'),
    email: required(data, 'email'),
    links: required(data, 'links'),
    skills: required(data, 'skills'),
    experience: required(data, 'experience'),
    education: required(data, 'education'),
    languages: required(data, 'languages'),
    workAuthorization: required(data, 'workAuthorization'),
    ticker,
  };
}
