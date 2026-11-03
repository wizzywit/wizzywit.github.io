import { afterEach, describe, expect, it, vi } from 'vitest';
import { shouldIncludeDrafts } from './drafts';

afterEach(() => vi.unstubAllEnvs());

describe('shouldIncludeDrafts', () => {
  it('is false by default', () => {
    vi.stubEnv('INCLUDE_DRAFTS', '');
    expect(shouldIncludeDrafts()).toBe(false);
  });

  it('is true only for the value 1', () => {
    vi.stubEnv('INCLUDE_DRAFTS', '1');
    expect(shouldIncludeDrafts()).toBe(true);
    vi.stubEnv('INCLUDE_DRAFTS', 'true');
    expect(shouldIncludeDrafts()).toBe(false);
  });
});
