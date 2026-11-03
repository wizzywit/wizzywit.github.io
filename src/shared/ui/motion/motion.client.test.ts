// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initMotion, type MotionEnv } from './motion.client';

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let callback: Callback = () => {};
const unobserve = vi.fn();
class FakeObserver {
  constructor(cb: Callback) {
    callback = cb;
  }
  observe() {}
  unobserve = unobserve;
}

function env(over: Partial<MotionEnv> = {}): MotionEnv {
  let time = 0;
  return {
    root: document,
    motionAllowed: () => true,
    IO: FakeObserver as unknown as typeof IntersectionObserver,
    raf: (step) => { time += 1000; step(time); },
    now: () => time,
    ...over,
  };
}

beforeEach(() => {
  document.body.innerHTML = `
    <h2 data-reveal id="a">A</h2><p data-reveal id="b">B</p><p data-reveal id="c">C</p>
    <dl><dt id="n"><span data-count aria-hidden="true">30+</span><span class="vh">30+</span></dt><dt><span data-count id="aa">AA</span></dt></dl>`;
  document.documentElement.className = 'motion';
  unobserve.mockClear();
});
afterEach(() => {
  document.documentElement.className = '';
});

describe('initMotion', () => {
  it('reveals everything at once when motion is not welcome', () => {
    initMotion(env({ motionAllowed: () => false }));
    expect([...document.querySelectorAll('[data-reveal]')].every((el) => el.classList.contains('is-in'))).toBe(true);
    expect(document.getElementById('n')?.textContent).toContain('30+');
  });

  it('reveals everything at once when IntersectionObserver is missing', () => {
    initMotion(env({ IO: undefined }));
    expect(document.querySelectorAll('[data-reveal].is-in')).toHaveLength(3);
  });

  it('keeps elements hidden until they intersect, then reveals and stops watching them', () => {
    initMotion(env());
    expect(document.querySelectorAll('.is-in')).toHaveLength(0);
    callback([{ isIntersecting: true, target: document.getElementById('a')! }]);
    expect(document.getElementById('a')?.classList.contains('is-in')).toBe(true);
    expect(document.getElementById('b')?.classList.contains('is-in')).toBe(false);
    expect(unobserve).toHaveBeenCalledTimes(1);
  });

  it('ignores entries that are not intersecting', () => {
    initMotion(env());
    callback([{ isIntersecting: false, target: document.getElementById('a')! }]);
    expect(document.getElementById('a')?.classList.contains('is-in')).toBe(false);
  });

  it('staggers elements that arrive together', () => {
    initMotion(env());
    callback(['a', 'b', 'c'].map((id) => ({ isIntersecting: true, target: document.getElementById(id)! })));
    expect(['a', 'b', 'c'].map((id) => document.getElementById(id)!.style.getPropertyValue('--reveal-delay'))).toEqual(['0ms', '90ms', '180ms']);
  });

  it('reveals everything and stays quiet if the observer cannot be created', () => {
    class Broken {
      constructor() {
        throw new Error('boom');
      }
    }
    expect(() => initMotion(env({ IO: Broken as unknown as typeof IntersectionObserver }))).not.toThrow();
    expect(document.querySelectorAll('[data-reveal].is-in')).toHaveLength(3);
    expect(document.documentElement.classList.contains('motion-live')).toBe(false);
  });

  it('marks itself live so the bootstrap failsafe stands down', () => {
    initMotion(env());
    expect(document.documentElement.classList.contains('motion-live')).toBe(true);
  });

  it('counts a figure up to its exact final text when it is revealed', () => {
    initMotion(env());
    const figure = document.querySelector('[data-count]') as HTMLElement;
    callback([{ isIntersecting: true, target: figure }]);
    expect(figure.textContent).toBe('30+');
  });

  it('never rewrites a figure that is not a number', () => {
    initMotion(env());
    const aa = document.getElementById('aa')!;
    callback([{ isIntersecting: true, target: aa }]);
    expect(aa.textContent).toBe('AA');
  });
});
