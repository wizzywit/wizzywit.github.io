// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { themeBootstrapScript } from './themeBootstrap';

function run(): void {
  new Function(themeBootstrapScript)();
}

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('themeBootstrapScript', () => {
  it('is short enough to inline', () => {
    expect(themeBootstrapScript.split('\n').length).toBeLessThanOrEqual(10);
  });

  it('sets the stored explicit theme before first paint', () => {
    localStorage.setItem('wep-theme', 'dark');
    run();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('leaves the attribute unset for system or invalid values', () => {
    localStorage.setItem('wep-theme', 'system');
    run();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    localStorage.setItem('wep-theme', 'purple');
    run();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('does not throw when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('blocked', 'SecurityError');
    });
    expect(run).not.toThrow();
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });
});
