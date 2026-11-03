import { useEffect, useRef, useState, type RefObject } from 'react';
import { useMotionPreferenceRepository } from '../repository/useMotionPreferenceRepository';

export function useLoopingVideo(): {
  videoRef: RefObject<HTMLVideoElement | null>;
  viewModel: { ready: boolean; playing: boolean; buttonLabel: string };
  toggle: () => void;
} {
  const { reduced } = useMotionPreferenceRepository();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (reduced === null) return;
    if (reduced) {
      setPlaying(false);
      return;
    }
    void Promise.resolve(videoRef.current?.play()).then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [reduced]);

  function toggle(): void {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
      setPlaying(false);
    } else {
      void Promise.resolve(video.play()).then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }

  return {
    videoRef,
    viewModel: { ready: reduced !== null, playing, buttonLabel: playing ? 'Pause animation' : 'Play animation' },
    toggle,
  };
}
