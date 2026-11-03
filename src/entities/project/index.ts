export { PROJECT_SECTIONS } from './types/project';
export type { Project, ProjectSection } from './types/project';
export { describeProjectCount, filterProjects } from './services/projectFiltering';
export { sortProjects } from './services/projectOrdering';
export type { CaseStudy, CaseStudySection } from './types/caseStudy';
export { getProject, getProjects } from './repository/projectRepository';
export { getCaseStudy } from './repository/caseStudyRepository';
// The adapter is intentionally not exported.
