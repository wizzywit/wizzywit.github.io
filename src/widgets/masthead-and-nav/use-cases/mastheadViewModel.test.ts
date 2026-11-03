import { describe, expect, it } from 'vitest';
import { buildMastheadViewModel } from './mastheadViewModel';

const profile = {
  name: 'Wisdom Emmanuel Praise',
  role: 'Senior Frontend Engineer, Frontend Platform & Architecture',
  location: 'Munich area, Germany',
  yearsExperience: 7,
};

describe('buildMastheadViewModel', () => {
  const vm = buildMastheadViewModel(profile, new Date('2026-11-03T10:00:00Z'));

  it('turns the role into the dotted role line with years', () => {
    expect(vm.roleLine).toBe('Senior Frontend Engineer · Frontend Platform & Architecture · 7+ years');
  });

  it('dates the edition from the supplied clock, not the system clock', () => {
    expect(vm.edition).toBe('Edition 2026 · Munich area, Germany');
    expect(buildMastheadViewModel(profile, new Date('2031-01-01T00:00:00Z')).edition).toBe('Edition 2031 · Munich area, Germany');
  });

  it('states availability and carries the name and nav', () => {
    expect(vm.openTo).toBe('Open to Senior / Staff Frontend and Frontend Platform roles');
    expect(vm.name).toBe('Wisdom Emmanuel Praise');
    expect(vm.nav.map((n) => n.label)).toEqual(['Front page', 'Work', 'Decisions', 'Profile', 'Contact']);
  });
});
