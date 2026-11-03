import { shouldIncludeDrafts } from '@/shared/config';
import { mapCaseStudyEntry } from '../adapter/caseStudyContentAdapter';
import { loadCaseStudyEntries } from '../adapter/caseStudyContentSource';
import { publishableSections } from '../services/caseStudyPublishing';
import type { CaseStudy } from '../types/caseStudy';

export async function getCaseStudySlugs(): Promise<string[]> {
  return (await loadCaseStudyEntries()).map((entry) => entry.id);
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | undefined> {
  const entry = (await loadCaseStudyEntries()).find((candidate) => candidate.id === slug);
  return entry ? publishableSections(mapCaseStudyEntry(entry), shouldIncludeDrafts()) : undefined;
}
