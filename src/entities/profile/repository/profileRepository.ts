import { mapProfileEntry } from '../adapter/profileContentAdapter';
import { loadProfileEntry } from '../adapter/profileContentSource';
import type { Profile } from '../types/profile';

export async function getProfile(): Promise<Profile> {
  return mapProfileEntry(await loadProfileEntry());
}
