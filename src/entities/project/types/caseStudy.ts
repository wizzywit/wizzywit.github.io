export type CaseStudySection = { id: string; heading: string; paragraphs: string[]; draft: boolean };

export type CaseStudy = {
  slug: string;
  title: string;
  kicker: string;
  deck: string;
  meta: { role: string; type: string; stack: string; links: { label: string; href: string }[] };
  glance: { problem: string; approach: string; result: string };
  /** Slugs of decisions to list beside the case study. */
  decisions: string[];
  sections: CaseStudySection[];
};
