// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoopingVideo } from './LoopingVideo';

const play = vi.fn(() => Promise.resolve());
const pause = vi.fn();

function mockMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'), media: query, addEventListener: () => {}, removeEventListener: () => {},
  }));
}

beforeEach(() => {
  play.mockClear();
  pause.mockClear();
  HTMLMediaElement.prototype.play = play;
  HTMLMediaElement.prototype.pause = pause;
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('LoopingVideo', () => {
  it('plays on its own when motion is welcome and offers a pause button', async () => {
    mockMotion(false);
    render(<LoopingVideo src="/media/x.mp4" poster="/p.png" label="Console demo" />);
    expect(await screen.findByRole('button', { name: 'Pause animation' })).toBeTruthy();
    expect(play).toHaveBeenCalled();
  });

  it('does not play when the visitor prefers reduced motion', async () => {
    mockMotion(true);
    render(<LoopingVideo src="/media/x.mp4" poster="/p.png" label="Console demo" />);
    expect(await screen.findByRole('button', { name: 'Play animation' })).toBeTruthy();
    expect(play).not.toHaveBeenCalled();
  });

  it('toggles between pause and play', async () => {
    mockMotion(false);
    render(<LoopingVideo src="/media/x.mp4" poster="/p.png" label="Console demo" />);
    await userEvent.click(await screen.findByRole('button', { name: 'Pause animation' }));
    expect(pause).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Play animation' })).toBeTruthy();
  });

  it('describes the video for assistive technology', () => {
    mockMotion(false);
    render(<LoopingVideo src="/media/x.mp4" poster="/p.png" label="Console demo" />);
    expect(screen.getByLabelText('Console demo')).toBeTruthy();
  });
});
