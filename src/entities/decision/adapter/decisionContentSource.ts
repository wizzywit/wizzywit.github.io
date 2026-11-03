import { getCollection } from 'astro:content';
import type { DecisionEntry } from './decisionContentAdapter';

export async function loadDecisionEntries(): Promise<DecisionEntry[]> {
  const entries = await getCollection('decisions');
  return entries.map((entry) => ({ id: entry.id, data: entry.data }));
}
