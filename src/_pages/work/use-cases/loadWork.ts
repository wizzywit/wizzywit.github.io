import { getProjects, type Project } from '@/entities/project';

export async function loadWorkProjects(): Promise<Project[]> {
  return getProjects();
}

export function workMeta(): { title: string; description: string } {
  return {
    title: 'Work — Wisdom Emmanuel Praise',
    description: 'Platform work at Censhare, products led, and open-source projects: Odudu, Wired, WebSuckIt, DIONE, FYEO and more.',
  };
}
