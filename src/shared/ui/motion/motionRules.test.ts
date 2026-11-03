import { describe, expect, it } from 'vitest';
import { formatCount, parseCount, staggerDelay } from './motionRules';

describe('parseCount', () => {
  it('splits a leading number from its suffix', () => {
    expect(parseCount('13')).toEqual({ value: 13, suffix: '' });
    expect(parseCount('30+')).toEqual({ value: 30, suffix: '+' });
    expect(parseCount('2M+')).toEqual({ value: 2, suffix: 'M+' });
  });

  it('leaves text that is not a number alone', () => {
    expect(parseCount('AA')).toBeNull();
    expect(parseCount('')).toBeNull();
    expect(parseCount('+30')).toBeNull();
  });
});

describe('formatCount', () => {
  it('rounds the running value and re-attaches the suffix', () => {
    expect(formatCount(12.6, '+')).toBe('13+');
    expect(formatCount(0, 'M+')).toBe('0M+');
  });
});

describe('staggerDelay', () => {
  it('steps by 90 ms and stops growing at 540 ms', () => {
    expect([0, 1, 2, 6, 10].map((i) => staggerDelay(i))).toEqual([0, 90, 180, 540, 540]);
  });
});
