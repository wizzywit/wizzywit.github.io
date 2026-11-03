import type { ProjectEntry } from './projectContentAdapter';

export async function loadProjectEntries(): Promise<ProjectEntry[]> {
  // Content collections exist only at build time; this guard lets client bundles drop the import.
  if (!import.meta.env.SSR) throw new Error('Content is only available at build time');
  const { getCollection } = await import('astro:content');
  const entries = await getCollection('projects');
  return entries.map((entry) => ({ id: entry.id, data: entry.data }));
}
