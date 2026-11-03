import { describe, expect, it } from 'vitest';
import { publishable } from './drafts';

const entries = [
  { id: 'a', draft: false },
  { id: 'b', draft: true },
  { id: 'c', draft: false },
];

describe('publishable', () => {
  it('drops drafts when drafts are not included', () => {
    expect(publishable(entries, false).map((e) => e.id)).toEqual(['a', 'c']);
  });

  it('keeps every entry when drafts are included', () => {
    expect(publishable(entries, true).map((e) => e.id)).toEqual(['a', 'b', 'c']);
  });

  it('keeps input order and does not mutate the input', () => {
    const copy = [...entries];
    publishable(entries, false);
    expect(entries).toEqual(copy);
  });
});
