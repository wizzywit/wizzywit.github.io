import { describe, expect, it } from 'vitest';
import { formatDecisionStatus } from './decisionStatus';

describe('formatDecisionStatus', () => {
  it('capitalises each status for display', () => {
    expect(formatDecisionStatus('proposed')).toBe('Proposed');
    expect(formatDecisionStatus('accepted')).toBe('Accepted');
    expect(formatDecisionStatus('superseded')).toBe('Superseded');
  });
});
