import { useEffect, useState } from 'react';
import { motionPreferenceAdapter } from '../adapter/motionPreferenceAdapter';

/** null until the browser has been asked, so server and first client render agree. */
export function useMotionPreferenceRepository(): { reduced: boolean | null } {
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => setReduced(motionPreferenceAdapter.prefersReducedMotion()), []);
  return { reduced };
}
