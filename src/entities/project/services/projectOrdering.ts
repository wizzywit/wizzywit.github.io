import type { Project } from '../types/project';

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => a.order - b.order);
}
