import type { DecisionEntry } from './decisionContentAdapter';

export async function loadDecisionEntries(): Promise<DecisionEntry[]> {
  // Content collections exist only at build time; this guard lets client bundles drop the import.
  if (!import.meta.env.SSR) throw new Error('Content is only available at build time');
  const { getCollection } = await import('astro:content');
  const entries = await getCollection('decisions');
  return entries.map((entry) => ({ id: entry.id, data: entry.data }));
}
