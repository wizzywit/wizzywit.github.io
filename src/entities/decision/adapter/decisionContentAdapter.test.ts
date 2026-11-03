import { describe, expect, it } from 'vitest';
import fixture from './__fixtures__/runtime.entry.json';
import { mapDecisionEntry } from './decisionContentAdapter';

describe('mapDecisionEntry', () => {
  it('maps a collection entry to a Decision', () => {
    const decision = mapDecisionEntry(fixture);
    expect(decision).toMatchObject({
      slug: 'one-runtime', number: 2, status: 'accepted', decidedOn: '2025', draft: true,
      related: ['five-layers', 'accessibility-in-dod'],
    });
    expect(decision.options.map((o) => o.chosen)).toEqual([false, true]);
    expect(decision.consequences.harder).toEqual(['Shared upgrades need coordination.']);
  });

  it('defaults decidedOn to null, related to empty and draft to false', () => {
    const { decidedOn: _d, related: _r, draft: _f, ...rest } = fixture.data;
    const decision = mapDecisionEntry({ id: 'x', data: rest });
    expect(decision.decidedOn).toBeNull();
    expect(decision.related).toEqual([]);
    expect(decision.draft).toBe(false);
  });

  it('rejects an unknown status', () => {
    expect(() => mapDecisionEntry({ id: 'x', data: { ...fixture.data, status: 'maybe' } })).toThrow(/maybe/);
  });
});
