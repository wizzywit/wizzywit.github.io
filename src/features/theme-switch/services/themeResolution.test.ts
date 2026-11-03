import { describe, expect, it } from 'vitest';
import { parseStoredPreference, resolveTheme } from './themeResolution';

describe('parseStoredPreference', () => {
  it('accepts the three valid values', () => {
    expect(parseStoredPreference('light')).toBe('light');
    expect(parseStoredPreference('dark')).toBe('dark');
    expect(parseStoredPreference('system')).toBe('system');
  });

  it('falls back to system for null, empty and invalid values', () => {
    expect(parseStoredPreference(null)).toBe('system');
    expect(parseStoredPreference('')).toBe('system');
    expect(parseStoredPreference('purple')).toBe('system');
    expect(parseStoredPreference('{"theme":"dark"}')).toBe('system');
  });
});

describe('resolveTheme', () => {
  it('follows the system for the system preference', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('lets an explicit preference win over the system', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });
});
