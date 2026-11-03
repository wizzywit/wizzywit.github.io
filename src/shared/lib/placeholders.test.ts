import { describe, expect, it } from 'vitest';
import { findPlaceholders } from './placeholders';

describe('findPlaceholders', () => {
  it('finds bracketed placeholder tokens', () => {
    expect(findPlaceholders('Hello [Your words] x')).toEqual(['[Your words]']);
  });

  it('finds several tokens in order', () => {
    expect(findPlaceholders('[A one] and [B two]')).toEqual(['[A one]', '[B two]']);
  });

  it('ignores Markdown links', () => {
    expect(findPlaceholders('See [the repo](https://github.com/wizzywit/odudu).')).toEqual([]);
  });

  it('returns nothing for clean text', () => {
    expect(findPlaceholders('Plain text with no brackets.')).toEqual([]);
  });

  it('flags dead hash links in HTML', () => {
    expect(findPlaceholders('<a href="#">x</a>')).toEqual(['href="#"']);
    expect(findPlaceholders("<a href='#'>x</a>")).toEqual(["href='#'"]);
  });

  it('flags dead hash links in Markdown', () => {
    expect(findPlaceholders('[Source](#)')).toEqual(['](#)']);
  });

  it('does not flag in-page anchors', () => {
    expect(findPlaceholders('<a href="#context">Context</a>')).toEqual([]);
  });
});
