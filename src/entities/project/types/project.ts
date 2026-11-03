export const PROJECT_SECTIONS = ['Platform', 'Identity', 'Real-time', 'Security', 'Industrial', 'Public sector', 'Rust'] as const;
export type ProjectSection = (typeof PROJECT_SECTIONS)[number];

export type Project = {
  slug: string;
  title: string;
  section: ProjectSection;
  /** Small label above the title, e.g. "Platform · Censhare". */
  kicker: string;
  summary: string;
  role: string;
  href: string | null;
  external: boolean;
  hasCaseStudy: boolean;
  order: number;
  draft: boolean;
};
