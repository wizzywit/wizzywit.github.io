import { publishable } from '@/shared/lib';
import type { CaseStudy } from '../types/caseStudy';

export function publishableSections(study: CaseStudy, includeDrafts: boolean): CaseStudy {
  return { ...study, sections: publishable(study.sections, includeDrafts) };
}
