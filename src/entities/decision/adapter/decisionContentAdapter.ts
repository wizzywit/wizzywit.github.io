import { DECISION_STATUSES, type Decision, type DecisionOption, type DecisionStatus } from '../types/decision';

export type DecisionEntry = {
  id: string;
  data: {
    number: number;
    title: string;
    why: string;
    area: string;
    status: string;
    decidedOn?: string | undefined;
    related?: string[] | undefined;
    context: string[];
    options: DecisionOption[];
    decision: string;
    consequences: { better: string[]; harder: string[] };
    draft?: boolean | undefined;
  };
};

function toStatus(value: string): DecisionStatus {
  const found = DECISION_STATUSES.find((status) => status === value);
  if (!found) throw new Error(`Unknown decision status: ${value}`);
  return found;
}

export function mapDecisionEntry(entry: DecisionEntry): Decision {
  const { data } = entry;
  return {
    slug: entry.id,
    number: data.number,
    title: data.title,
    why: data.why,
    area: data.area,
    status: toStatus(data.status),
    decidedOn: data.decidedOn ?? null,
    related: data.related ?? [],
    context: data.context,
    options: data.options,
    decision: data.decision,
    consequences: data.consequences,
    draft: data.draft ?? false,
  };
}
