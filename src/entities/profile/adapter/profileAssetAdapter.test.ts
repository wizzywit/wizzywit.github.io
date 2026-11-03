import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { cvPdfExists, portraitFile } from './profileAssetAdapter';

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

describe('portraitFile', () => {
  const dir = (files: string[]) => {
    const root = mkdtempSync(path.join(tmpdir(), 'assets-'));
    files.forEach((name) => writeFileSync(path.join(root, name), 'x'));
    return root;
  };

  it('is null when no portrait has been added', () => {
    expect(portraitFile(dir(['other.png']))).toBeNull();
    expect(portraitFile('/definitely/not/here')).toBeNull();
  });

  it('finds portrait.jpg, .jpeg, .png or .webp', () => {
    for (const name of ['portrait.jpg', 'portrait.jpeg', 'portrait.png', 'portrait.webp']) {
      expect(portraitFile(dir([name]))).toBe(name);
    }
  });

  it('prefers a jpg when several exist, and ignores other file names', () => {
    expect(portraitFile(dir(['portrait.png', 'portrait.jpg', 'me.jpg']))).toBe('portrait.jpg');
  });
});
