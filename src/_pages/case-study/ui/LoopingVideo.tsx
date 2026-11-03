import { useLoopingVideo } from '../use-cases/useLoopingVideo';
import './LoopingVideo.css';

type Props = { src: string; poster: string; label: string };

export function LoopingVideo({ src, poster, label }: Props) {
  const { videoRef, viewModel, toggle } = useLoopingVideo();
  return (
    <div className="looping-video">
      <video ref={videoRef} src={src} poster={poster} aria-label={label} muted loop playsInline preload="metadata" />
      <button type="button" onClick={toggle} hidden={!viewModel.ready} aria-label={viewModel.buttonLabel}>
        {viewModel.playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
