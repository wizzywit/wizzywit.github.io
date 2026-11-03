import type { Project, ProjectSection } from '../types/project';

export function filterProjects(projects: Project[], section: ProjectSection | 'All'): Project[] {
  return section === 'All' ? projects : projects.filter((project) => project.section === section);
}

export function describeProjectCount(count: number, section: ProjectSection | 'All'): string {
  const noun = count === 1 ? 'entry' : 'entries';
  return section === 'All' ? `${count} ${noun}` : `${count} ${noun} in ${section}`;
}
