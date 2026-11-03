import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { cvPdfExists } from './profileAssetAdapter';

describe('cvPdfExists', () => {
  it('is false when public/cv.pdf is missing', () => {
    expect(cvPdfExists(mkdtempSync(path.join(tmpdir(), 'pub-')))).toBe(false);
  });

  it('is true when public/cv.pdf exists', () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'pub-'));
    writeFileSync(path.join(dir, 'cv.pdf'), '%PDF-1.4');
    expect(cvPdfExists(dir)).toBe(true);
  });

  it('is false when the directory does not exist', () => {
    expect(cvPdfExists('/definitely/not/here')).toBe(false);
  });
});
