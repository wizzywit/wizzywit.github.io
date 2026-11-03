import { describe, expect, it } from 'vitest';
import { buildContactViewModel } from './contactViewModel';

const profile = { email: 'a@b.co', links: { github: 'https://github.com/x', linkedin: 'https://linkedin.com/in/x', gitlab: 'https://gitlab.com/x' } };

describe('buildContactViewModel', () => {
  it('lists email first as a mailto link, then the profiles', () => {
    const vm = buildContactViewModel(profile, false);
    expect(vm.rows.map((r) => r.label)).toEqual(['Email', 'LinkedIn', 'GitHub', 'GitLab']);
    expect(vm.rows[0]).toMatchObject({ text: 'a@b.co', href: 'mailto:a@b.co', external: false });
    expect(vm.rows[1]?.external).toBe(true);
  });

  it('adds the CV row only when the PDF exists', () => {
    expect(buildContactViewModel(profile, true).rows.at(-1)).toMatchObject({ label: 'CV', href: '/cv.pdf', text: 'Download PDF' });
    expect(buildContactViewModel(profile, false).rows.some((r) => r.label === 'CV')).toBe(false);
  });

  it('does not promise a response time the owner has not given', () => {
    expect(buildContactViewModel(profile, false).intro).not.toMatch(/within|working days|hours/i);
  });
});
