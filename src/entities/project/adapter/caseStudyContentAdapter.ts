import type { CaseStudy } from '../types/caseStudy';

export type CaseStudyEntry = {
  id: string;
  data: Omit<CaseStudy, 'slug' | 'sections'> & {
    sections: { id: string; heading: string; paragraphs: string[]; draft?: boolean | undefined }[];
  };
};

export function mapCaseStudyEntry(entry: CaseStudyEntry): CaseStudy {
  const { data } = entry;
  return {
    slug: entry.id,
    title: data.title,
    kicker: data.kicker,
    deck: data.deck,
    meta: data.meta,
    glance: data.glance,
    decisions: data.decisions,
    sections: data.sections.map((section) => ({ ...section, draft: section.draft ?? false })),
  };
}
