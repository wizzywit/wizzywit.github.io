// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { themeStorageAdapter } from './themeStorageAdapter';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('themeStorageAdapter', () => {
  it('writes and reads the raw preference string', () => {
    themeStorageAdapter.write('dark');
    expect(localStorage.getItem('wep-theme')).toBe('dark');
    expect(themeStorageAdapter.read()).toBe('dark');
  });

  it('returns null when nothing is stored', () => {
    expect(themeStorageAdapter.read()).toBeNull();
  });

  it('returns null instead of throwing when reading is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(themeStorageAdapter.read()).toBeNull();
  });

  it('does not throw when writing is blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError');
    });
    expect(() => themeStorageAdapter.write('light')).not.toThrow();
  });
});
