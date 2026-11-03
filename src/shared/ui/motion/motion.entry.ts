import { initMotion } from './motion.client';

initMotion({
  root: document,
  motionAllowed: () => window.matchMedia('(prefers-reduced-motion: no-preference)').matches,
  IO: typeof IntersectionObserver === 'undefined' ? undefined : IntersectionObserver,
  raf: (step) => requestAnimationFrame(step),
  now: () => performance.now(),
});
