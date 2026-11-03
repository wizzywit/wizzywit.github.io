import { mapProfileEntry } from '../adapter/profileContentAdapter';
import { cvPdfExists } from '../adapter/profileAssetAdapter';
import { loadProfileEntry } from '../adapter/profileContentSource';
import type { Profile } from '../types/profile';

export async function getProfile(): Promise<Profile> {
  return mapProfileEntry(await loadProfileEntry());
}

export async function hasCvPdf(): Promise<boolean> {
  return cvPdfExists('public');
}
