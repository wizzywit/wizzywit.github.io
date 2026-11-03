import { describe, expect, it } from 'vitest';
import { buildClassifiedsViewModel } from './classifiedsViewModel';

describe('buildClassifiedsViewModel', () => {
  it('points the main action at the contact page and carries the email', () => {
    const vm = buildClassifiedsViewModel('a@b.co', false);
    expect(vm.writeHref).toBe('/contact/');
    expect(vm.emailHref).toBe('mailto:a@b.co');
  });

  it('offers the CV only when it exists', () => {
    expect(buildClassifiedsViewModel('a@b.co', false).cvHref).toBeNull();
    expect(buildClassifiedsViewModel('a@b.co', true).cvHref).toBe('/cv.pdf');
  });

  it('states what the owner is open to, from the résumé', () => {
    expect(buildClassifiedsViewModel('a@b.co', false).text).toMatch(/Munich-based, hybrid and remote roles in Germany/);
  });
});
