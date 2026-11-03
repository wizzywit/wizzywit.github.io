import { getCollection } from 'astro:content';
import type { ProjectEntry } from './projectContentAdapter';

export async function loadProjectEntries(): Promise<ProjectEntry[]> {
  const entries = await getCollection('projects');
  return entries.map((entry) => ({ id: entry.id, data: entry.data }));
}
