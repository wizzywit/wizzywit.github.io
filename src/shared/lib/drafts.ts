/** Keeps published entries; includes drafts only when asked (local preview). Order is preserved. */
export function publishable<T extends { draft: boolean }>(entries: T[], includeDrafts: boolean): T[] {
  return includeDrafts ? [...entries] : entries.filter((entry) => !entry.draft);
}
