import { getEntry } from 'astro:content';
import type { ProfileEntry } from './profileContentAdapter';

export async function loadProfileEntry(): Promise<ProfileEntry> {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('content/profile.json is missing');
  return { id: entry.id, data: entry.data };
}
