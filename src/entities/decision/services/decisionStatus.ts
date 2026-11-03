import type { DecisionStatus } from '../types/decision';

export function formatDecisionStatus(status: DecisionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
