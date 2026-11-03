export { PROJECT_SECTIONS } from './types/project';
export type { Project, ProjectSection } from './types/project';
export { describeProjectCount, filterProjects } from './services/projectFiltering';
export { describeProjectLink, extraProjectLinks } from './services/projectLinks';
export { sortProjects } from './services/projectOrdering';
export type { CaseStudy, CaseStudySection } from './types/caseStudy';
export { getProject, getProjects } from './repository/projectRepository';
export { getCaseStudy, getCaseStudySlugs } from './repository/caseStudyRepository';
// The adapter is intentionally not exported.
