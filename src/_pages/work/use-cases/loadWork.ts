import { getDecisions } from '@/entities/decision';
import { getProjects, type Project } from '@/entities/project';
import { dropUnpublishedDecisionLinks } from './dropUnpublishedLinks';

export async function loadWorkProjects(): Promise<Project[]> {
  const decisions = await getDecisions();
  return dropUnpublishedDecisionLinks(await getProjects(), decisions.map((decision) => decision.slug));
}

export function workMeta(): { title: string; description: string } {
  return {
    title: 'Work — Wisdom Emmanuel Praise',
    description: 'Platform work at Censhare, products led, and open-source projects: Odudu, Wired, WebSuckIt, DIONE, FYEO and more.',
  };
}
