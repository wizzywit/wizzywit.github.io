import { describe, expect, it } from 'vitest';
import { navItems } from './routes';

describe('navItems', () => {
  it('lists the five sections in reading order', () => {
    expect(navItems.map((item) => item.key)).toEqual(['front', 'work', 'decisions', 'profile', 'contact']);
  });

  it('uses trailing-slash paths from the site root', () => {
    expect(navItems.map((item) => item.href)).toEqual(['/', '/work/', '/decisions/', '/profile/', '/contact/']);
  });
});
