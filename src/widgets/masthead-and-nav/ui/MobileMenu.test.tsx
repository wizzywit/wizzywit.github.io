// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileMenu } from './MobileMenu';

beforeEach(() => {
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} }));
});
afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
  vi.unstubAllGlobals();
});

describe('MobileMenu', () => {
  it('starts closed with an unexpanded Menu button', () => {
    render(<MobileMenu current="work" />);
    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('marks itself ready so the static nav can step aside', async () => {
    render(<MobileMenu current="work" />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('data-ready')).toBe('true'));
  });

  it('opens a dialog with the five sections and the current page marked', async () => {
    render(<MobileMenu current="work" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const dialog = screen.getByRole('dialog', { name: 'Site menu' });
    expect(dialog.querySelectorAll('nav a')).toHaveLength(5);
    expect(dialog.querySelector('a[aria-current="page"]')?.textContent).toContain('Work');
    expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')).toBe('true');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('closes on Escape, returns focus to the Menu button and releases scrolling', async () => {
    render(<MobileMenu current="front" />);
    const button = screen.getByRole('button', { name: 'Open menu' });
    await userEvent.click(button);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(button);
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps Tab inside the dialog', async () => {
    render(<MobileMenu current="front" />);
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>('a[href], button');
    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;
    last.focus();
    await userEvent.tab();
    expect(document.activeElement).toBe(first);
    await userEvent.tab({ shift: true });
    expect(document.activeElement).toBe(last);
  });
});
