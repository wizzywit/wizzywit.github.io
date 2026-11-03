import type { ProfileEntry } from './profileContentAdapter';

export async function loadProfileEntry(): Promise<ProfileEntry> {
  // Content collections exist only at build time; this guard lets client bundles drop the import.
  if (!import.meta.env.SSR) throw new Error('Content is only available at build time');
  const { getEntry } = await import('astro:content');
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('content/profile.json is missing');
  return { id: entry.id, data: entry.data };
}
