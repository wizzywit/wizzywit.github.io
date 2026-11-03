export type CaseStudyMedia = { image: string; alt: string; caption: string };
export type CaseStudyVideo = { src: string; poster: string; label: string; caption: string };

export type CaseStudySection = {
  id: string;
  heading: string;
  paragraphs: string[];
  draft: boolean;
  /** Pictures shown under the section's text; `image` is an asset path under src/assets. */
  media: CaseStudyMedia[];
  video: CaseStudyVideo | null;
  /** Names a drawn diagram the page knows how to render. */
  diagram: string | null;
};

export type CaseStudy = {
  slug: string;
  /** Short name for the breadcrumb. */
  name: string;
  title: string;
  kicker: string;
  deck: string;
  hero: { light: string; dark: string | null; alt: string };
  meta: { role: string; type: string; stack: string; links: { label: string; href: string }[] };
  glance: { problem: string; approach: string; result: string };
  /** Slugs of decisions to list beside the case study. */
  decisions: string[];
  sections: CaseStudySection[];
};
