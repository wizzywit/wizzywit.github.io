import { describe, expect, it } from 'vitest';
import { mailtoHref } from './contactLinks';

describe('mailtoHref', () => {
  it('builds a plain mailto link', () => {
    expect(mailtoHref('wisdompraise968@gmail.com')).toBe('mailto:wisdompraise968@gmail.com');
  });

  it('encodes a subject', () => {
    expect(mailtoHref('a@b.co', 'Senior role & platform')).toBe('mailto:a@b.co?subject=Senior%20role%20%26%20platform');
  });

  it('ignores an empty subject', () => {
    expect(mailtoHref('a@b.co', '')).toBe('mailto:a@b.co');
  });
});
