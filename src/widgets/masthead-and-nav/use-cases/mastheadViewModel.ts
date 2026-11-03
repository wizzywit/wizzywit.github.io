import { getProfile, type Profile } from '@/entities/profile';
import { navItems } from '@/shared/config';

export type MastheadViewModel = {
  name: string;
  roleLine: string;
  edition: string;
  openTo: string;
  nav: typeof navItems;
};

export function buildMastheadViewModel(
  profile: Pick<Profile, 'name' | 'role' | 'location' | 'yearsExperience'>,
  now: Date,
): MastheadViewModel {
  return {
    name: profile.name,
    roleLine: `${profile.role.replace(', ', ' · ')} · ${profile.yearsExperience}+ years`,
    edition: `Edition ${now.getUTCFullYear()} · ${profile.location}`,
    openTo: 'Open to Senior / Staff Frontend and Frontend Platform roles',
    nav: navItems,
  };
}

export async function loadMastheadViewModel(): Promise<MastheadViewModel> {
  return buildMastheadViewModel(await getProfile(), new Date());
}
