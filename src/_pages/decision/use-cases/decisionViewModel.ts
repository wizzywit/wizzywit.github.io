import {
  formatDecisionNumber,
  formatDecisionStatus,
  getDecision,
  getDecisions,
  relatedDecisions,
  type Decision,
} from '@/entities/decision';

export type DecisionViewModel = {
  slug: string;
  number: string;
  title: string;
  why: string;
  area: string;
  status: string;
  decidedOn: string | null;
  related: { label: string; href: string }[];
  toc: { id: string; label: string }[];
  context: string[];
  options: { name: string; pros: string; cons: string; outcome: 'Chosen' | 'Rejected' }[];
  decision: string;
  consequences: Decision['consequences'];
};

export function buildDecisionViewModel(decision: Decision, all: Decision[]): DecisionViewModel {
  const toc = [
    decision.context.length > 0 ? { id: 'context', label: 'Context' } : null,
    decision.options.length > 0 ? { id: 'options', label: 'Options' } : null,
    { id: 'decision', label: 'Decision' },
    { id: 'consequences', label: 'Consequences' },
  ].flatMap((entry) => (entry ? [entry] : []));

  return {
    slug: decision.slug,
    number: formatDecisionNumber(decision.number),
    title: decision.title,
    why: decision.why,
    area: decision.area,
    status: formatDecisionStatus(decision.status),
    decidedOn: decision.decidedOn,
    related: relatedDecisions(all, decision).map((related) => ({
      label: `${formatDecisionNumber(related.number)} · ${related.title}`,
      href: `/decisions/${related.slug}/`,
    })),
    toc,
    context: decision.context,
    options: decision.options.map((option) => ({ ...option, outcome: option.chosen ? 'Chosen' : 'Rejected' })),
    decision: decision.decision,
    consequences: decision.consequences,
  };
}

export async function loadDecisionViewModel(slug: string): Promise<DecisionViewModel> {
  const decision = await getDecision(slug);
  if (!decision) throw new Error(`No decision named "${slug}"`);
  return buildDecisionViewModel(decision, await getDecisions());
}

export async function loadDecisionSlugs(): Promise<string[]> {
  return (await getDecisions()).map((decision) => decision.slug);
}

export async function loadDecisionMeta(slug: string): Promise<{ title: string; description: string }> {
  const vm = await loadDecisionViewModel(slug);
  return { title: `${vm.number} — ${vm.title} — Wisdom Emmanuel Praise`, description: vm.why };
}
