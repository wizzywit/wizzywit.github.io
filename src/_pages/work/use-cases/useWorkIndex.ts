import { useEffect, useState } from 'react';
import { PROJECT_SECTIONS, describeProjectCount, filterProjects, type Project, type ProjectSection } from '@/entities/project';

type Choice = ProjectSection | 'All';

export type WorkEntry = Project & { n: string };

export function useWorkIndex(projects: Project[]): {
  viewModel: {
    ready: boolean;
    filters: { label: Choice; pressed: boolean }[];
    entries: WorkEntry[];
    countLabel: string;
    emptyText: string | null;
  };
  select: (choice: Choice) => void;
} {
  const [choice, setChoice] = useState<Choice>('All');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const present = PROJECT_SECTIONS.filter((section) => projects.some((p) => p.section === section));
  const entries = filterProjects(projects, choice).map((project, index) => ({ ...project, n: String(index + 1).padStart(2, '0') }));

  return {
    viewModel: {
      ready,
      filters: (['All', ...present] as Choice[]).map((label) => ({ label, pressed: label === choice })),
      entries,
      countLabel: describeProjectCount(entries.length, choice),
      emptyText: entries.length === 0 ? `Nothing filed under ${choice} yet.` : null,
    },
    select: setChoice,
  };
}
