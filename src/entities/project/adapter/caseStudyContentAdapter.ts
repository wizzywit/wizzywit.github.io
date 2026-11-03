import type { CaseStudy, CaseStudyMedia, CaseStudyVideo } from '../types/caseStudy';

export type CaseStudyEntry = {
  id: string;
  data: Omit<CaseStudy, 'slug' | 'sections' | 'hero'> & {
    hero: { light: string; dark?: string | undefined; alt: string };
    sections: {
      id: string;
      heading: string;
      paragraphs: string[];
      draft?: boolean | undefined;
      media?: CaseStudyMedia[] | undefined;
      video?: CaseStudyVideo | undefined;
      diagram?: string | undefined;
    }[];
  };
};

export function mapCaseStudyEntry(entry: CaseStudyEntry): CaseStudy {
  const { data } = entry;
  return {
    slug: entry.id,
    name: data.name,
    title: data.title,
    kicker: data.kicker,
    deck: data.deck,
    hero: { light: data.hero.light, dark: data.hero.dark ?? null, alt: data.hero.alt },
    meta: data.meta,
    glance: data.glance,
    decisions: data.decisions,
    sections: data.sections.map((section) => ({
      id: section.id,
      heading: section.heading,
      paragraphs: section.paragraphs,
      draft: section.draft ?? false,
      media: section.media ?? [],
      video: section.video ?? null,
      diagram: section.diagram ?? null,
    })),
  };
}
