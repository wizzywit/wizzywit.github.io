import { existsSync } from 'node:fs';
import path from 'node:path';

/** True when the owner has supplied public/cv.pdf (a PDF without a phone number). */
export function cvPdfExists(publicDir: string): boolean {
  return existsSync(path.join(publicDir, 'cv.pdf'));
}
