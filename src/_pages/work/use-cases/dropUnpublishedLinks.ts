import type { Project } from '@/entities/project';

/** A work entry that points at a decision must not link to a page that is not published. */
export function dropUnpublishedDecisionLinks(projects: Project[], publishedSlugs: string[]): Project[] {
  return projects.map((project) => {
    const match = project.href?.match(/^\/decisions\/([^/]+)\/$/);
    return match && !publishedSlugs.includes(match[1] as string) ? { ...project, href: null, external: false } : project;
  });
}
