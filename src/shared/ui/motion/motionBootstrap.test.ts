// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { motionBootstrapScript } from './motionBootstrap';

function run(allowed: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: allowed && query.includes('no-preference') }));
  new Function(motionBootstrapScript)();
}

beforeEach(() => {
  vi.useFakeTimers();
  document.documentElement.className = '';
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('motionBootstrapScript', () => {
  it('turns motion on before first paint when the visitor allows it', () => {
    run(true);
    expect(document.documentElement.classList.contains('motion')).toBe(true);
  });

  it('leaves everything visible and static when the visitor prefers reduced motion', () => {
    run(false);
    expect(document.documentElement.classList.contains('motion')).toBe(false);
  });

  it('gives up on motion if the runtime never starts, so nothing stays hidden', () => {
    run(true);
    vi.advanceTimersByTime(4100);
    expect(document.documentElement.classList.contains('motion')).toBe(false);
  });

  it('keeps motion on when the runtime has started', () => {
    run(true);
    document.documentElement.classList.add('motion-live');
    vi.advanceTimersByTime(4100);
    expect(document.documentElement.classList.contains('motion')).toBe(true);
  });

  it('does not throw when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(() => new Function(motionBootstrapScript)()).not.toThrow();
    expect(document.documentElement.classList.contains('motion')).toBe(false);
  });
});
