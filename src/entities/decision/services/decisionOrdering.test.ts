import { describe, expect, it } from 'vitest';
import type { Decision } from '../types/decision';
import { formatDecisionNumber, relatedDecisions, sortDecisions } from './decisionOrdering';

const make = (slug: string, number: number, related: string[] = []): Decision => ({
  slug, number, title: slug, why: '', area: '', status: 'accepted', decidedOn: null, related,
  context: [], options: [], decision: '', consequences: { better: [], harder: [] }, draft: false,
});

describe('formatDecisionNumber', () => {
  it('pads to two digits', () => {
    expect(formatDecisionNumber(2)).toBe('ADR 02');
  });

  it('does not truncate larger numbers', () => {
    expect(formatDecisionNumber(12)).toBe('ADR 12');
    expect(formatDecisionNumber(100)).toBe('ADR 100');
  });
});

describe('sortDecisions', () => {
  it('orders by number ascending without mutating the input', () => {
    const input = [make('c', 3), make('a', 1), make('b', 2)];
    expect(sortDecisions(input).map((d) => d.slug)).toEqual(['a', 'b', 'c']);
    expect(input.map((d) => d.slug)).toEqual(['c', 'a', 'b']);
  });
});

describe('relatedDecisions', () => {
  const all = [make('a', 1), make('b', 2), make('c', 3)];

  it('resolves related slugs in the order given', () => {
    expect(relatedDecisions(all, make('x', 9, ['c', 'a'])).map((d) => d.slug)).toEqual(['c', 'a']);
  });

  it('ignores unknown slugs and the decision itself', () => {
    expect(relatedDecisions(all, make('b', 2, ['b', 'ghost', 'a'])).map((d) => d.slug)).toEqual(['a']);
  });
});
