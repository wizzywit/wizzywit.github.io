import { formatCount, parseCount, staggerDelay } from './motionRules';

export type MotionEnv = {
  root: Document;
  motionAllowed: () => boolean;
  IO: typeof IntersectionObserver | undefined;
  raf: (step: (time: number) => void) => void;
  now: () => number;
};

const SELECTOR = '[data-reveal], [data-reveal-group], [data-rule], [data-count]';
const COUNT_MS = 900;

function countUp(el: HTMLElement, env: MotionEnv): void {
  const final = el.textContent ?? '';
  const parsed = parseCount(final);
  if (!parsed) return;
  const start = env.now();
  const tick = (time: number): void => {
    const progress = Math.min((time - start) / COUNT_MS, 1);
    const eased = 1 - (1 - progress) ** 3;
    el.textContent = progress >= 1 ? final : formatCount(parsed.value * eased, parsed.suffix);
    if (progress < 1) env.raf(tick);
  };
  el.textContent = formatCount(0, parsed.suffix);
  env.raf(tick);
}

export function initMotion(env: MotionEnv): void {
  const items = [...env.root.querySelectorAll<HTMLElement>(SELECTOR)];
  if (!env.motionAllowed() || !env.IO) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  let observer: IntersectionObserver;
  try {
    observer = new env.IO(
    (entries) => {
      let arrived = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.setProperty('--reveal-delay', `${staggerDelay(arrived)}ms`);
        arrived += 1;
        el.classList.add('is-in');
        observer.unobserve(el);
        if (el.hasAttribute('data-count')) countUp(el, env);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    items.forEach((el) => observer.observe(el));
  } catch {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  // Only now is motion really running; until then the bootstrap's failsafe may still switch it off.
  env.root.documentElement.classList.add('motion-live');
}
