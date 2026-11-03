// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {},
  }));
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  vi.unstubAllGlobals();
});

describe('ThemeToggle', () => {
  it('starts unpressed as the night edition switch', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Night edition' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('flags itself ready once it is interactive', async () => {
    render(<ThemeToggle />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Night edition' }).getAttribute('data-ready')).toBe('true'));
  });

  it('switches to dark, updates the document and persists the choice', async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button', { name: 'Night edition' }));
    expect(screen.getByRole('button', { name: 'Night edition' }).getAttribute('aria-pressed')).toBe('true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('wep-theme')).toBe('dark');
  });

  it('restores a stored dark preference after mount', async () => {
    localStorage.setItem('wep-theme', 'dark');
    render(<ThemeToggle />);
    expect(await screen.findByRole('button', { name: 'Night edition', pressed: true })).toBeTruthy();
    await waitFor(() => expect(document.documentElement.getAttribute('data-theme')).toBe('dark'));
  });

  it('ignores an invalid stored value', async () => {
    localStorage.setItem('wep-theme', 'purple');
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Night edition' })).toBeTruthy();
  });
});
