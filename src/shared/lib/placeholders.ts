const PLACEHOLDER = /\[[^\]\n]*\](?!\()|href=(["'])#\1|\]\(#\)/g;

/** Finds unfinished-copy markers: [bracketed tokens] that are not links, and dead "#" links. */
export function findPlaceholders(text: string): string[] {
  return [...text.matchAll(PLACEHOLDER)].map((match) => match[0]);
}
