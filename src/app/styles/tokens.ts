/** Single source for theme colors; tokens.css mirrors these values (checked by tokens.test.ts). */
export const lightTokens = {
  paper: '#F3F0E8',
  ink: '#151412',
  soft: '#3A3732',
  muted: '#57534B',
  accent: '#A3171C',
  panel: '#EAE5D9',
  rule: '#151412',
  inverse: '#151412',
  onInverse: '#E9E4D8',
} as const;

export const darkTokens = {
  paper: '#151412',
  ink: '#ECE7DB',
  soft: '#CFC9BC',
  muted: '#B5AFA3',
  accent: '#F0857C',
  panel: '#1F1D1A',
  rule: '#6E695F',
  inverse: '#0F0E0C',
  onInverse: '#E9E4D8',
} as const;

type Pair = { name: string; fg: string; bg: string };

function pairsFor(t: typeof lightTokens | typeof darkTokens): Pair[] {
  return [
    { name: 'ink on paper', fg: t.ink, bg: t.paper },
    { name: 'soft on paper', fg: t.soft, bg: t.paper },
    { name: 'muted on paper', fg: t.muted, bg: t.paper },
    { name: 'accent on paper', fg: t.accent, bg: t.paper },
    { name: 'ink on panel', fg: t.ink, bg: t.panel },
    { name: 'onInverse on inverse', fg: t.onInverse, bg: t.inverse },
  ];
}

export const tokenPairs = { light: pairsFor(lightTokens), dark: pairsFor(darkTokens) } as const;
