import { describe, expect, it } from 'vitest';
import type { Decision } from '@/entities/decision';
import { buildDecisionsViewModel } from './decisionsViewModel';

const make = (slug: string, number: number, status: Decision['status'] = 'accepted'): Decision => ({
  slug, number, title: `Title ${slug}`, why: `Why ${slug}`, area: `Area ${slug}`, status, decidedOn: null, related: [],
  context: [], options: [], decision: '', consequences: { better: [], harder: [] }, draft: false,
});

describe('buildDecisionsViewModel', () => {
  it('lists rows in number order with formatted numbers, labels and links', () => {
    const vm = buildDecisionsViewModel([make('b', 2), make('a', 1, 'proposed')]);
    expect(vm.rows).toEqual([
      { number: 'ADR 01', title: 'Title a', why: 'Why a', area: 'Area a', status: 'Proposed', href: '/decisions/a/' },
      { number: 'ADR 02', title: 'Title b', why: 'Why b', area: 'Area b', status: 'Accepted', href: '/decisions/b/' },
    ]);
  });

  it('explains an empty log instead of showing an empty table', () => {
    const vm = buildDecisionsViewModel([]);
    expect(vm.rows).toEqual([]);
    expect(vm.emptyText).toMatch(/No decisions are published yet/);
  });

  it('has no empty text when there are rows', () => {
    expect(buildDecisionsViewModel([make('a', 1)]).emptyText).toBeNull();
  });
});
