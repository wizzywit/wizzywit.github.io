import { shouldIncludeDrafts } from '@/shared/config';
import { publishable } from '@/shared/lib';
import { mapProjectEntry } from '../adapter/projectContentAdapter';
import { loadProjectEntries } from '../adapter/projectContentSource';
import { sortProjects } from '../services/projectOrdering';
import type { Project } from '../types/project';

export async function getProjects(): Promise<Project[]> {
  const projects = (await loadProjectEntries()).map(mapProjectEntry);
  return sortProjects(publishable(projects, shouldIncludeDrafts()));
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
