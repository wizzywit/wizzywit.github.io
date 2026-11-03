import { mapProfileEntry } from '../adapter/profileContentAdapter';
import { cvPdfExists, portraitFile } from '../adapter/profileAssetAdapter';
import { loadProfileEntry } from '../adapter/profileContentSource';
import type { Portrait, Profile } from '../types/profile';

export async function getProfile(): Promise<Profile> {
  return mapProfileEntry(await loadProfileEntry());
}

export async function hasCvPdf(): Promise<boolean> {
  return cvPdfExists('public');
}

export async function getPortrait(): Promise<Portrait | null> {
  const name = portraitFile('src/assets');
  return name ? { name, alt: `Portrait of ${(await getProfile()).name}` } : null;
}
