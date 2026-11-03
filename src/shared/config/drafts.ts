/** Drafts render only in local preview and preview CI, never in a production build. */
export function shouldIncludeDrafts(): boolean {
  return process.env['INCLUDE_DRAFTS'] === '1';
}
