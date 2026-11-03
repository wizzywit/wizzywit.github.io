import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });

  it('is 1 for identical colors', () => {
    expect(contrastRatio('#A3171C', '#A3171C')).toBeCloseTo(1, 5);
  });

  it('is symmetric and accepts lowercase hex', () => {
    expect(contrastRatio('#151412', '#f3f0e8')).toBeCloseTo(contrastRatio('#F3F0E8', '#151412'), 5);
  });
});
