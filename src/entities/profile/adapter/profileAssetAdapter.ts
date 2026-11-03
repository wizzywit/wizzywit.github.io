import { existsSync } from 'node:fs';
import path from 'node:path';

/** True when the owner has supplied public/cv.pdf (a PDF without a phone number). */
export function cvPdfExists(publicDir: string): boolean {
  return existsSync(path.join(publicDir, 'cv.pdf'));
}

const PORTRAIT_FILES = ['portrait.jpg', 'portrait.jpeg', 'portrait.png', 'portrait.webp'];

/** The owner's portrait, if one has been dropped into src/assets under one of the accepted names. */
export function portraitFile(assetsDir: string): string | null {
  return PORTRAIT_FILES.find((name) => existsSync(path.join(assetsDir, name))) ?? null;
}
