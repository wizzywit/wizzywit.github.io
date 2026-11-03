import type { Project } from '../types/project';

function host(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

/** The call to action shown beside a linked entry, so a visitor can tell it opens and where it goes. */
export function describeProjectLink(project: Project): string | null {
  if (!project.href) return null;
  if (project.hasCaseStudy) return 'Read the case study';
  if (project.href.startsWith('/decisions/')) return 'Read the decision';
  if (project.external) return host(project.href) === 'github.com' ? 'View on GitHub' : 'Visit the site';
  return 'Read more';
}

export function extraProjectLinks(project: Project): { label: string; href: string }[] {
  return project.links.filter((link) => link.href !== project.href);
}
