export type DecisionStatus = 'proposed' | 'accepted' | 'superseded';
export const DECISION_STATUSES: readonly DecisionStatus[] = ['proposed', 'accepted', 'superseded'];

export type DecisionOption = { name: string; pros: string; cons: string; chosen: boolean };

export type Decision = {
  slug: string;
  number: number;
  title: string;
  /** One line shown in the decision log. */
  why: string;
  area: string;
  status: DecisionStatus;
  decidedOn: string | null;
  /** Slugs of related decisions. */
  related: string[];
  context: string[];
  options: DecisionOption[];
  decision: string;
  consequences: { better: string[]; harder: string[] };
  draft: boolean;
};
