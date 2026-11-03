export { PROJECT_SECTIONS } from './types/project';
export type { Project, ProjectSection } from './types/project';
export { describeProjectCount, filterProjects } from './services/projectFiltering';
export { sortProjects } from './services/projectOrdering';
export { getProject, getProjects } from './repository/projectRepository';
// The adapter is intentionally not exported.
