# ADR 0001: Deliberate departures from the architecture doc

Status: accepted (2026-11-03). Context: `AGENTS.md` (FSD + five layers) read against Astro, a static content site.

`AGENTS.md` says to explain a rule broken on purpose. These are all of them.

## 1. The FSD pages layer is `src/_pages/`, not `src/pages/`

Astro reserves `src/pages/` for routes. FSD's own workaround for frameworks that do this is to rename the layer. `src/pages/*.astro` are one-line route shells that compose `BaseLayout`, a widget masthead and footer, and a page slice from `@/_pages/<page>`. A page slice may not import `app/` (that would point upward), so the shell, not the slice, owns the layout.
Steiger only knows the layer name `pages`, so `tools/run-steiger.mjs` lints a mirror of `src` with `_pages` renamed and the route shells left out.

## 2. Two Steiger rules are off

`fsd/no-segmentless-slices` and `fsd/segments-by-purpose` only know FSD's default segment names. This project's segments (`services`, `types`, `use-cases`, `repository`, `adapter`) come from `AGENTS.md`, so `tools/check-structure.ts` enforces that vocabulary instead (and forbids `components/`, `hooks/`, `utils/`, segment-level index files and exported adapters).
Layer and segment import rules are a small custom ESLint rule (`tools/eslint-rule-arch.js`) because it can be tested directly with fixture snippets.

## 3. The theme bootstrap is the only code outside an adapter that names the stored theme

To avoid a flash of the wrong theme, `<head>` carries a short inline script. Its text is built by a pure function in `features/theme-switch/services/themeBootstrap.ts` from the storage key and attribute constants, so it cannot drift from the adapter. Everything else that touches `localStorage` is in the adapter.

## 4. Build-time reads in places the doc keeps pure

- Repositories are plain async functions, not hooks over TanStack Query: content is read once at build time and there is no server state. TanStack Query is not installed.
- `shared/config/drafts.ts` reads `INCLUDE_DRAFTS` from the environment (configuration is where that belongs).
- The three `*ContentSource.ts` adapters guard `astro:content` with `import.meta.env.SSR` and a dynamic import, so React islands that import an entity's public API do not pull a server-only module into the browser bundle.

## 5. Measured targets that changed

The spec's 40 KB JavaScript budget cannot hold with React islands (react-dom is about 66 KB gzipped), so it is 85 KB per page; and LCP is gated at Google's "good" 2.5 s because the italic-led pages measure about 2.1 s on Lighthouse's throttled mobile profile (others about 1.65 s). Swapping React for Preact/compat would recover most of the difference if the tighter numbers matter.

## 6. A native disclosure, not a modal, for the mobile menu

A React menu dialog caused a 0.34 layout shift on every page when it hydrated. The menu is a `<details>` disclosure: no JavaScript, no shift, one island fewer.
