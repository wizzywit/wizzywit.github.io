import { describe, expect, it } from 'vitest';
import { buildFooterViewModel } from './footerViewModel';

const links = { github: 'https://github.com/wizzywit', linkedin: 'https://www.linkedin.com/in/wisdom-praise', gitlab: 'https://gitlab.com/wizzywit' };

describe('buildFooterViewModel', () => {
  it('lists email, GitHub, LinkedIn and back to top', () => {
    const vm = buildFooterViewModel({ name: 'W', email: 'a@b.co', links }, false);
    expect(vm.links.map((l) => l.label)).toEqual(['Email', 'GitHub', 'LinkedIn', 'Back to top ↑']);
    expect(vm.links[0]?.href).toBe('mailto:a@b.co');
  });

  it('adds the CV link only when a CV file exists', () => {
    const withCv = buildFooterViewModel({ name: 'W', email: 'a@b.co', links }, true);
    expect(withCv.links.map((l) => l.label)).toContain('CV (PDF)');
    expect(withCv.links.find((l) => l.label === 'CV (PDF)')?.href).toBe('/cv.pdf');
  });

  it('marks outside links as external', () => {
    const vm = buildFooterViewModel({ name: 'W', email: 'a@b.co', links }, false);
    expect(vm.links.find((l) => l.label === 'GitHub')?.external).toBe(true);
    expect(vm.links.find((l) => l.label === 'Back to top ↑')?.external).toBe(false);
  });
});
