import { formatDecisionStatus, getDecisions, type Decision } from '@/entities/decision';
import { getCaseStudy, getCaseStudySlugs, type CaseStudy } from '@/entities/project';

export type CaseStudyViewModel = {
  study: CaseStudy;
  decisions: { title: string; href: string; status: string }[];
};

export function buildCaseStudyViewModel(study: CaseStudy, decisions: Decision[]): CaseStudyViewModel {
  const bySlug = new Map(decisions.map((decision) => [decision.slug, decision]));
  return {
    study,
    decisions: study.decisions.flatMap((slug) => {
      const decision = bySlug.get(slug);
      return decision ? [{ title: decision.title, href: `/decisions/${decision.slug}/`, status: formatDecisionStatus(decision.status) }] : [];
    }),
  };
}

export async function loadCaseStudyViewModel(slug: string): Promise<CaseStudyViewModel> {
  const study = await getCaseStudy(slug);
  if (!study) throw new Error(`No case study named "${slug}"`);
  return buildCaseStudyViewModel(study, await getDecisions());
}

export async function loadCaseStudySlugs(): Promise<string[]> {
  return getCaseStudySlugs();
}

export async function loadCaseStudyMeta(slug: string): Promise<{ title: string; description: string }> {
  const study = await getCaseStudy(slug);
  if (!study) throw new Error(`No case study named "${slug}"`);
  return { title: `${study.title} — Wisdom Emmanuel Praise`, description: study.deck };
}
