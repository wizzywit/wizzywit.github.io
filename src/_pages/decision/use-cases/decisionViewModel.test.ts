import { describe, expect, it } from 'vitest';
import type { Decision } from '@/entities/decision';
import { buildDecisionViewModel } from './decisionViewModel';

const make = (slug: string, number: number, patch: Partial<Decision> = {}): Decision => ({
  slug, number, title: `Title ${slug}`, why: '', area: 'Area', status: 'accepted', decidedOn: null, related: [],
  context: ['c'], options: [{ name: 'o', pros: 'p', cons: 'c', chosen: true }], decision: 'd', consequences: { better: ['b'], harder: ['h'] }, draft: false,
  ...patch,
});

describe('buildDecisionViewModel', () => {
  it('numbers the decision, labels its status and lists related decisions with links', () => {
    const current = make('b', 2, { related: ['a', 'ghost'] });
    const vm = buildDecisionViewModel(current, [make('a', 1), current]);
    expect(vm.number).toBe('ADR 02');
    expect(vm.status).toBe('Accepted');
    expect(vm.related).toEqual([{ label: 'ADR 01 · Title a', href: '/decisions/a/' }]);
  });

  it('builds the table of contents from the sections that have content', () => {
    const vm = buildDecisionViewModel(make('a', 1), []);
    expect(vm.toc.map((t) => t.id)).toEqual(['context', 'options', 'decision', 'consequences']);
    const bare = buildDecisionViewModel(make('a', 1, { context: [], options: [] }), []);
    expect(bare.toc.map((t) => t.id)).toEqual(['decision', 'consequences']);
  });

  it('marks each option as chosen or rejected in words, not only styling', () => {
    const vm = buildDecisionViewModel(make('a', 1, { options: [{ name: 'x', pros: '', cons: '', chosen: false }, { name: 'y', pros: '', cons: '', chosen: true }] }), []);
    expect(vm.options.map((o) => o.outcome)).toEqual(['Rejected', 'Chosen']);
  });

  it('shows the decided date only when known', () => {
    expect(buildDecisionViewModel(make('a', 1), []).decidedOn).toBeNull();
    expect(buildDecisionViewModel(make('a', 1, { decidedOn: '2025' }), []).decidedOn).toBe('2025');
  });
});
