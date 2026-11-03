export function parseCount(text: string): { value: number; suffix: string } | null {
  const match = text.trim().match(/^(\d+(?:\.\d+)?)(.*)$/);
  return match ? { value: Number(match[1]), suffix: match[2] ?? '' } : null;
}

export function formatCount(value: number, suffix: string): string {
  return `${Math.round(value)}${suffix}`;
}

/** Delay for the nth element that scrolls into view in the same moment. */
export function staggerDelay(index: number, stepMs = 90, maxMs = 540): number {
  return Math.min(index * stepMs, maxMs);
}
