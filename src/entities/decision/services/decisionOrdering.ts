import type { Decision } from '../types/decision';

export function formatDecisionNumber(n: number): string {
  return `ADR ${String(n).padStart(2, '0')}`;
}

export function sortDecisions(decisions: Decision[]): Decision[] {
  return [...decisions].sort((a, b) => a.number - b.number);
}

export function relatedDecisions(all: Decision[], current: Decision): Decision[] {
  return current.related
    .filter((slug) => slug !== current.slug)
    .flatMap((slug) => all.find((decision) => decision.slug === slug) ?? []);
}
