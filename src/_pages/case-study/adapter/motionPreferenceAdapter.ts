const QUERY = '(prefers-reduced-motion: reduce)';

export const motionPreferenceAdapter = {
  prefersReducedMotion(): boolean {
    return typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;
  },
};
