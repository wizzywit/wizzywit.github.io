import { PROJECT_SECTIONS, type Project, type ProjectSection } from '../types/project';

export type ProjectEntry = {
  id: string;
  data: {
    title: string;
    section: string;
    kicker: string;
    summary: string;
    role: string;
    href?: string | undefined;
    order: number;
    draft?: boolean | undefined;
    image?: { src: string; alt: string } | undefined;
    links?: { label: string; href: string }[] | undefined;
  };
};

function toSection(value: string): ProjectSection {
  const found = PROJECT_SECTIONS.find((section) => section === value);
  if (!found) throw new Error(`Unknown project section: ${value}`);
  return found;
}

export function mapProjectEntry(entry: ProjectEntry): Project {
  const { data } = entry;
  const href = data.href ?? null;
  return {
    slug: entry.id,
    title: data.title,
    section: toSection(data.section),
    kicker: data.kicker,
    summary: data.summary,
    role: data.role,
    href,
    external: href !== null && /^https?:\/\//.test(href),
    hasCaseStudy: href !== null && href.startsWith('/work/'),
    order: data.order,
    draft: data.draft ?? false,
    image: data.image ? { name: data.image.src, alt: data.image.alt } : null,
    links: data.links ?? [],
  };
}
