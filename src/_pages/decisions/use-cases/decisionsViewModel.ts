import { formatDecisionNumber, formatDecisionStatus, getDecisions, sortDecisions, type Decision } from '@/entities/decision';

export type DecisionRow = { number: string; title: string; why: string; area: string; status: string; href: string };
export type DecisionsViewModel = { rows: DecisionRow[]; emptyText: string | null };

export function buildDecisionsViewModel(decisions: Decision[]): DecisionsViewModel {
  const rows = sortDecisions(decisions).map((decision) => ({
    number: formatDecisionNumber(decision.number),
    title: decision.title,
    why: decision.why,
    area: decision.area,
    status: formatDecisionStatus(decision.status),
    href: `/decisions/${decision.slug}/`,
  }));
  return { rows, emptyText: rows.length === 0 ? 'No decisions are published yet. They appear here as they are written up.' : null };
}

export async function loadDecisionsViewModel(): Promise<DecisionsViewModel> {
  return buildDecisionsViewModel(await getDecisions());
}

export function decisionsMeta(): { title: string; description: string } {
  return {
    title: 'Decisions — Wisdom Emmanuel Praise',
    description: 'Architecture decision records: the context, the options, what was chosen and what it cost.',
  };
}
