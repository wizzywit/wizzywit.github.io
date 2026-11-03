import { shouldIncludeDrafts } from '@/shared/config';
import { publishable } from '@/shared/lib';
import { mapDecisionEntry } from '../adapter/decisionContentAdapter';
import { loadDecisionEntries } from '../adapter/decisionContentSource';
import { sortDecisions } from '../services/decisionOrdering';
import type { Decision } from '../types/decision';

export async function getDecisions(): Promise<Decision[]> {
  const decisions = (await loadDecisionEntries()).map(mapDecisionEntry);
  return sortDecisions(publishable(decisions, shouldIncludeDrafts()));
}

export async function getDecision(slug: string): Promise<Decision | undefined> {
  return (await getDecisions()).find((decision) => decision.slug === slug);
}
