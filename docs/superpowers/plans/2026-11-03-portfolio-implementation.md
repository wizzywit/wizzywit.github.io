# Portfolio "The Gazette" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Gazette portfolio as a pre-rendered, accessible, crawlable Astro site whose source follows the FSD + five-layer architecture.

**Architecture:** Astro static output with React islands; FSD layers under `src/`, with the pages layer at `src/_pages/` and `src/pages/*.astro` as one-line route shells. Content (profile, projects, ADRs) lives in `content/` and is read only through adapters. All motion is CSS; JS only for theme toggle, mobile menu, work filter, ticker pause.

**Tech Stack:** Astro (static), React 19, TypeScript strict, Zustand (theme only), Vitest, React Testing Library, Playwright + axe, Steiger, eslint-plugin-boundaries, jscpd, pnpm, GitHub Actions. Use the latest stable versions at implementation time and record them in `package.json`.

**Spec:** `docs/superpowers/specs/2026-11-03-portfolio-design.md` (visual reference: `docs/design/gazette/*.dc.html`; architecture rules: `~/Downloads/FRONTEND_ARCHITECTURE.md`, copy it into the repo as `AGENTS.md` in Task 1).

## Global Constraints

- Commit messages: very brief, **no AI co-author trailers or "Generated with" lines** anywhere (commits, PRs, files).
- WCAG 2.2 AA: text contrast ≥ 4.5:1, visible 3px focus ring, 44px targets, skip link, `aria-current` on nav, one `h1` per page.
- Every page fully readable and indexable with JavaScript disabled.
- Reveal animation: `animation-timeline: view()`; hidden start state only inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; no scroll hijacking, no smooth-scroll library.
- Anything auto-moving for more than 5 seconds has a pause control; ticker and looping video included.
- Performance targets: Lighthouse mobile ≥ 95 performance, 100 accessibility/SEO/best-practices; LCP < 2.0s; CLS < 0.05; ≤ 40 KB gzipped JS on any page; fonts self-hosted woff2 subsets (Latin + Latin-1/Latin-Extended-A) ≤ 150 KB, blackletter face for the masthead only, `font-display: swap`.
- Site URL `https://wizzywit.github.io/`; nothing under `/odudu/` may exist in `dist/`; `/odudu/` links are external absolute links.
- No invented numbers; facts only from résumé, LinkedIn, Odudu/Wired repos. No dead `#` links; no `[…]` placeholders in published entries.
- No cookies/analytics, no contact-form backend, no i18n. Contact is `mailto:wisdompraise968@gmail.com`.
- Architecture doc rules apply, with exactly two documented exceptions: pages layer at `src/_pages/`, and the no-flash theme bootstrap script.
- Never write to or delete anything on `master` before cutover; work on branch `rebuild`.

## Review Focus

1. **No-JS visit:** every route shows all content and working navigation with JS disabled (work filter shows all entries, ticker shows the static "In brief" list, mobile menu links are visible).
2. **Unsupported or reduced motion:** with `prefers-reduced-motion: reduce` or no `animation-timeline` support, nothing is left invisible and nothing moves.
3. **Draft and placeholder leakage:** a `draft: true` entry, a `[…]` token, or a `#` link must not reach production output, sitemap or RSS (and must fail the build when in a published entry).
4. **Storage unavailable or corrupt:** `localStorage` throwing (private mode/blocked) or holding an invalid theme value falls back to the system preference without errors.
5. **Narrow and zoomed viewing:** at 360px width and at 200% zoom there is no horizontal page scroll and no clipped content on any route.

---

### Task 1: Scaffold the project and repo hygiene

**Files:**
- Delete (on `rebuild` only): `css/`, `js/`, `images/`, `static/`, `index.html`, `service-worker.js`, `asset-manifest.json`, `favicon.ico`
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `AGENTS.md` (copy of the architecture doc), `src/` skeleton per the spec's tree, `README.md`

**Interfaces:**
- Produces: scripts `pnpm dev|build|preview|lint|typecheck|test|e2e`; path alias `@/*` → `src/*`; Astro config with `site: 'https://wizzywit.github.io'`, `output: 'static'`, React integration, `trailingSlash: 'always'`.

- [ ] **Step 1:** Confirm the commit identity with the owner and set it repo-locally (`git config user.name/user.email` without `--global`); never use the global config. The earlier docs commit failed for lack of identity: commit `docs/` first on `rebuild`.
- [ ] **Step 2:** Remove the old compiled files in one commit ("Remove old build output"); keep `.idea/` out via `.gitignore` (also `node_modules`, `dist`, `.astro`, `test-results`, `playwright-report`).
- [ ] **Step 3:** Scaffold Astro (empty template) with React and TypeScript `strict`; create empty FSD directories with a `.gitkeep` only where needed; one placeholder `src/pages/index.astro`.
- [ ] **Step 4:** Run `pnpm build`. Expected: succeeds and `dist/index.html` exists.
- [ ] **Step 5:** Commit ("Scaffold Astro project").

### Task 2: Architecture guardrails

**Files:**
- Create: `steiger.config.ts`, `eslint.config.js` (boundaries rules), `.jscpd.json`, `src/shared/lib/__fixtures__/` only if needed for the rule tests, `tools/check-architecture.test.ts`

**Interfaces:**
- Produces: `pnpm lint` runs Steiger (treating `src/_pages` as the pages layer), eslint boundaries (view → own use-case only; services import no repository/adapter/React; adapters import nothing above; no deep imports; no segment `index.ts`), and jscpd.

- [ ] **Step 1:** Write `tools/check-architecture.test.ts`: it lints tiny in-memory violating snippets (a view importing a repository; a service importing an adapter; a deep import into another slice) and asserts ESLint reports each.
- [ ] **Step 2:** Run `pnpm test tools/check-architecture.test.ts`. Expected: FAIL (rules absent).
- [ ] **Step 3:** Configure the boundaries rules and Steiger as above; add `lint` script combining them.
- [ ] **Step 4:** Run the test, then `pnpm lint`. Expected: PASS.
- [ ] **Step 5:** Commit ("Add architecture lint").

### Task 3: Design tokens, fonts, shell and test harness

**Files:**
- Create: `src/app/styles/tokens.css`, `src/app/styles/global.css`, `src/app/layouts/BaseLayout.astro`, `src/shared/lib/contrast.ts`, `src/shared/lib/contrast.test.ts`, `playwright.config.ts`, `e2e/helpers/axe.ts`, `e2e/shell.spec.ts`

**Interfaces:**
- Produces: CSS custom properties for light (paper `#F3F0E8`, ink `#151412`, accent `#A3171C`, rule/muted tones taken from the design files) and dark (`#191816` ground, `#E8E2D2` ink; derive the dark accent so it passes) selected by `[data-theme]` with `prefers-color-scheme` fallback; `contrastRatio(foreground: string, background: string): number`; `BaseLayout` props `{ title: string; description: string; canonicalPath: string; jsonLd?: object[] }` with a skip link and `<main id="main">`; Playwright projects: `default`, `no-js` (JS disabled), `reduced-motion`, `mobile-360`; `expectNoAxeViolations(page)`.

- [ ] **Step 1:** Write `contrast.test.ts`: `contrastRatio('#000000','#FFFFFF')` ≈ 21; and a test that every foreground/background token pair listed in a `tokenPairs` export of `tokens` meets ≥ 4.5 in light and dark (small text) — fails until tokens exist.
- [ ] **Step 2:** Run it; expected FAIL. Implement `contrastRatio` (WCAG relative luminance) and extract tokens from the design; self-host fonts (UnifrakturMaguntia, Libre Caslon Display/Text, Libre Franklin, Courier Prime, IBM Plex Mono) as woff2 with Latin + Latin-1/Ext-A subsets, preload the body and masthead faces, size-matched fallbacks.
- [ ] **Step 3:** Run the contrast test; expected PASS.
- [ ] **Step 4:** Write `e2e/shell.spec.ts` (skip link is the first focusable element and focuses `#main`; focus ring visible; axe clean on `/`); implement `BaseLayout` and a stub index; run `pnpm e2e`. Expected PASS in all four projects.
- [ ] **Step 5:** Commit ("Add tokens, fonts, shell, e2e harness").

### Task 4: Reveal and motion primitives

**Files:**
- Create: `src/shared/ui/reveal/reveal.css`, `src/shared/ui/reveal/Reveal.astro`, `src/shared/ui/reveal/reveal.test.ts`

**Interfaces:**
- Produces: `<Reveal as? delay?: number>` wrapper (class `reveal`, `--reveal-delay` stagger); CSS where the hidden start state exists only inside the two guards in Global Constraints.

- [ ] **Step 1:** Write `reveal.test.ts` using PostCSS to parse `reveal.css`: assert no top-level rule sets `opacity: 0` or `transform` on `.reveal`, and every such declaration is nested inside `@supports (animation-timeline: view())` AND `@media (prefers-reduced-motion: no-preference)`.
- [ ] **Step 2:** Run; expected FAIL. Implement the CSS (fade + 12px translate over a short `entry` range) and the wrapper.
- [ ] **Step 3:** Run; expected PASS. Add an e2e check (`reduced-motion` and `no-js` projects): `.reveal` elements have computed opacity 1.
- [ ] **Step 4:** Commit ("Add reveal primitive").

### Task 5: Shared content helpers

**Files:**
- Create: `src/shared/lib/drafts.ts`, `src/shared/lib/drafts.test.ts`, `src/shared/lib/placeholders.ts`, `src/shared/lib/placeholders.test.ts`

**Interfaces:**
- Produces: `publishable<T extends { draft: boolean }>(entries: T[], includeDrafts: boolean): T[]`; `findPlaceholders(text: string): string[]` (returns `[…]` bracket tokens and `href="#"` occurrences as found strings).

- [ ] **Step 1:** Tests: `publishable` drops drafts when `includeDrafts=false`, keeps all when true, keeps input order; `findPlaceholders('Hello [Your words] x')` returns `['[Your words]']`, returns `[]` for text with Markdown links like `[text](url)` and for plain brackets-free text, and flags `<a href="#">`.
- [ ] **Step 2:** Run; expected FAIL. Implement both.
- [ ] **Step 3:** Run; expected PASS. Commit ("Add draft and placeholder helpers").

### Task 6: Project and profile entities

**Files:**
- Create: `src/entities/project/{types/project.ts, adapter/projectContentAdapter.ts, adapter/projectContentAdapter.test.ts, adapter/__fixtures__/project.md, services/projectFiltering.ts, services/projectFiltering.test.ts, repository/useProjectRepository.ts, ui/ProjectRow.astro, index.ts, README.md}`; `src/entities/profile/{types/profile.ts, adapter/profileContentAdapter.ts, adapter/profileContentAdapter.test.ts, repository/useProfileRepository.ts, index.ts, README.md}`; `src/content.config.ts`; `content/profile.json`; `content/projects/*.md`

**Interfaces:**
- Consumes: `publishable` (Task 5).
- Produces:
  - `type ProjectSection = 'Platform' | 'Identity' | 'Real-time' | 'Security' | 'Industrial' | 'Public sector' | 'Rust'`
  - `type Project = { slug: string; title: string; section: ProjectSection; kicker: string; summary: string; role: string; href: string | null; external: boolean; hasCaseStudy: boolean; order: number; draft: boolean }`
  - `filterProjects(projects: Project[], section: ProjectSection | 'All'): Project[]`
  - `describeProjectCount(count: number, section: ProjectSection | 'All'): string` → `"1 entry"`, `"8 entries"`, `"3 entries in Platform"`
  - `getProjects(): Project[]` and `getProject(slug: string): Project | undefined` from `useProjectRepository`-adjacent plain functions exported through `index.ts` (content is build-time, so no hook is required)
  - `type Profile = { name: string; role: string; location: string; summary: string; email: string; links: { github: string; linkedin: string; gitlab: string }; skills: { group: string; items: string[] }[]; experience: { title: string; org: string; location: string; period: string; context: string; stack: string[]; highlights: string[] }[]; education: { degree: string; school: string; period: string; note: string }[]; ticker: { id: string; text: string }[] }`
  - `getProfile(): Profile`

- [ ] **Step 1:** Write `projectContentAdapter.test.ts` against `__fixtures__/project.md` (saved frontmatter shape): maps to `Project`, treats missing `href` as `null`, marks `external` true for `https://` hrefs, rejects an unknown `section`. Write `projectFiltering.test.ts`: `'All'` returns everything, a section returns only that section, unknown/empty result returns `[]`, count labels as above.
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Implement the types, adapter (the only code importing `astro:content`), services, and the Astro content collections schema. Author `content/profile.json` and `content/projects/*.md` (12 entries from the design's work list) strictly from résumé/LinkedIn facts; unknown one-liners (Waihona/Mythra) get `draft: true`. Add the profile adapter test with a fixture and a schema check that `ticker` has the four design figures.
- [ ] **Step 4:** Run tests; expected PASS. Write each entity README with a "Rules owned" list.
- [ ] **Step 5:** Commit ("Add project and profile entities").

### Task 7: Decision (ADR) entity

**Files:**
- Create: `src/entities/decision/{types/decision.ts, adapter/decisionContentAdapter.ts, adapter/decisionContentAdapter.test.ts, adapter/__fixtures__/decision.md, services/decisionOrdering.ts, services/decisionOrdering.test.ts, services/decisionStructuredData.ts, services/decisionStructuredData.test.ts, index.ts, README.md}`; `content/decisions/*.md`

**Interfaces:**
- Produces:
  - `type DecisionStatus = 'proposed' | 'accepted' | 'superseded'`
  - `type Decision = { slug: string; number: number; title: string; why: string; area: string; status: DecisionStatus; decidedOn: string | null; related: string[]; body: string; draft: boolean }`
  - `formatDecisionNumber(n: number): string` → `"ADR 02"`
  - `sortDecisions(decisions: Decision[]): Decision[]` (ascending by number)
  - `relatedDecisions(all: Decision[], current: Decision): Decision[]` (resolves `related` slugs, skips unknown)
  - `buildTechArticleJsonLd(decision: Decision, siteUrl: string): object`
  - `getDecisions(): Decision[]`, `getDecision(slug: string): Decision | undefined`

- [ ] **Step 1:** Tests: `formatDecisionNumber(2)` = `'ADR 02'` and `(12)` = `'ADR 12'`; `sortDecisions` orders 3,1,2 to 1,2,3; `relatedDecisions` ignores an unknown slug; JSON-LD has `@type: 'TechArticle'`, `headline`, absolute `url` under `siteUrl`; adapter maps fixture frontmatter and body.
- [ ] **Step 2:** Run; expected FAIL. Implement.
- [ ] **Step 3:** Draft ADR 01–06 from the design's log (titles/why/area from `GzDecisions`) using only résumé facts; mark all `draft: true` until the owner approves; ADR 02 follows the `GzDecision` structure (Context, Options, Decision, Consequences).
- [ ] **Step 4:** Run; expected PASS. Commit ("Add decision entity").

### Task 8: Theme switch feature (and the documented exception)

**Files:**
- Create: `src/features/theme-switch/{types/theme.ts, adapter/themeStorageAdapter.ts, adapter/themeStorageAdapter.test.ts, services/themeResolution.ts, services/themeResolution.test.ts, repository/useThemeRepository.ts, use-cases/useThemeSwitch.ts, ui/ThemeToggle.tsx, ui/ThemeToggle.test.tsx, bootstrap/themeBootstrap.ts, index.ts}`

**Interfaces:**
- Produces:
  - `type Theme = 'light' | 'dark'`; `type ThemePreference = Theme | 'system'`
  - `THEME_STORAGE_KEY = 'wep-theme'`, `THEME_ATTRIBUTE = 'data-theme'`
  - `parseStoredPreference(raw: string | null): ThemePreference` (invalid → `'system'`)
  - `resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): Theme`
  - `themeStorageAdapter: { read(): string | null; write(p: ThemePreference): void }` (swallows storage errors)
  - `useThemeSwitch(): { viewModel: { theme: Theme; preference: ThemePreference; label: string }; toggle(): void }`
  - `themeBootstrapScript: string` (≤ 10 lines, inlined in `BaseLayout` head)

- [ ] **Step 1:** Tests: `parseStoredPreference('purple')` → `'system'`, `(null)` → `'system'`, `('dark')` → `'dark'`; `resolveTheme('system', true)` → `'dark'`, `('light', true)` → `'light'`; adapter `read()` returns `null` and `write()` does not throw when `localStorage` access throws; `ThemeToggle` (RTL) toggles `aria-pressed`, updates `data-theme`, and persists through the adapter.
- [ ] **Step 2:** Run; expected FAIL.
- [ ] **Step 3:** Implement per the architecture doc (Zustand `persist` with a storage built on the adapter; use case builds the view model; toggle is a real `<button>`, 44px target, label "Night edition"/"Day edition"). The bootstrap script imports key/attribute constants and sets the attribute before first paint.
- [ ] **Step 4:** Run; expected PASS. Add e2e: choose dark, reload, still dark with no flash of light (assert attribute present at `domcontentloaded`).
- [ ] **Step 5:** Commit ("Add theme switch").

### Task 9: Widgets

**Files:**
- Create under `src/widgets/`: `masthead-and-nav/{ui/Masthead.astro, ui/MobileMenu.tsx, ui/MobileMenu.test.tsx, use-cases/useMobileMenu.ts, index.ts}`, `site-footer/{ui/SiteFooter.astro, index.ts}`, `news-ticker/{ui/NewsTicker.astro, ui/TickerPause.tsx, ui/TickerPause.test.tsx, use-cases/useTickerPause.ts, index.ts}`, `classifieds-card/{ui/ClassifiedsCard.astro, index.ts}`, `adr-table/{ui/AdrTable.astro, index.ts}`

**Interfaces:**
- Consumes: `getProfile`, `ThemeToggle`, `Reveal`.
- Produces: `<Masthead current: 'front' | 'work' | 'decisions' | 'profile' | 'contact' />` (all links render without JS; `aria-current="page"` on the current one), `<NewsTicker items: Profile['ticker']>` (static "In brief" list always in the DOM, marquee only when motion allowed, pause button toggles `aria-pressed`, pauses on hover/focus), `<ClassifiedsCard email: string>`, `<AdrTable decisions: Decision[]>`.

- [ ] **Step 1:** RTL tests: mobile menu button toggles `aria-expanded` and Escape closes it returning focus to the button; ticker pause button toggles the animation-paused state and its label.
- [ ] **Step 2:** Run; expected FAIL. Implement all widgets matching `GzHome`/`GzMobileMenu` markup and tokens.
- [ ] **Step 3:** Run; expected PASS. Commit ("Add widgets").

### Task 10: Front page (light, night, 360px)

**Files:**
- Create: `src/_pages/home/{ui/HomePage.astro, use-cases/homeViewModel.ts, index.ts}`; `src/pages/index.astro`; `e2e/home.spec.ts`

**Interfaces:**
- Consumes: widgets, `getProfile`, `getProjects`.
- Produces: `buildHomeViewModel(profile: Profile, projects: Project[]): { role: string; headline: string; deck: string; lead: { paragraphs: string[] }; inside: { title: string; href: string; page: number }[]; ticker: Profile['ticker'] }`. The plain role line ("Senior Frontend Engineer, Frontend Platform & Architecture") appears above the joke headline.

- [ ] **Step 1:** Write `e2e/home.spec.ts`: title/description present; one `h1`; the role text is visible above the fold at 1440×900 and 360×800; the classified "Reply" link is a `mailto:`; axe clean in light and dark; `no-js` project shows the "In brief" list.
- [ ] **Step 2:** Run; expected FAIL. Implement the page from `GzHome`/`GzNight`/`GzMobile` (masthead register-snap, headline roll-in, AVAILABLE stamp, drop cap, Reveal on sections).
- [ ] **Step 3:** Run; expected PASS. Commit ("Add front page").

### Task 11: Work index with filter

**Files:**
- Create: `src/_pages/work/{ui/WorkPage.astro, ui/WorkFilter.tsx, ui/WorkFilter.test.tsx, use-cases/useWorkIndex.ts, index.ts}`; `src/pages/work/index.astro`; `e2e/work.spec.ts`

**Interfaces:**
- Consumes: `filterProjects`, `describeProjectCount`, `getProjects`.
- Produces: `useWorkIndex(projects: Project[]): { viewModel: { filters: { label: string; pressed: boolean }[]; entries: (Project & { n: string })[]; countLabel: string }; select(section: ProjectSection | 'All'): void }`. Entries with no `href` render as unlinked titles.

- [ ] **Step 1:** RTL test: pressing "Security" shows only security entries and the polite live region reads "2 entries in Security"; pressing an empty section shows the count label and an empty-state line; `e2e/work.spec.ts`: `no-js` shows all entries, no `href="#"` anywhere, axe clean.
- [ ] **Step 2:** Run; expected FAIL. Implement from `GzWork`.
- [ ] **Step 3:** Run; expected PASS. Commit ("Add work index").

### Task 12: Odudu case study and media

**Files:**
- Create: `src/_pages/case-study/{ui/CaseStudyPage.astro, ui/ArchitectureDiagram.astro, ui/LoopingVideo.tsx, ui/LoopingVideo.test.tsx, index.ts}`; `src/pages/work/odudu.astro`; `content/projects/odudu.md` body; `src/assets/odudu/*`; `e2e/case-study.spec.ts`

**Interfaces:**
- Consumes: project entity, decision entity (`relatedDecisions`).
- Produces: `/work/odudu/`. `LoopingVideo({ src: string; poster: string; label: string })`: muted looping video with a pause/play button, not autoplaying under `prefers-reduced-motion: reduce`.

- [ ] **Step 1:** RTL test: `LoopingVideo` does not call `play()` when `matchMedia('(prefers-reduced-motion: reduce)')` matches; its button toggles pause. E2E: heading, meta list, the diagram has a text alternative, "Decisions in this project" links resolve (no `#`), axe clean.
- [ ] **Step 2:** Run; expected FAIL. Copy real screenshots from `~/WebstormProjects/odudu/apps/docs/static/console/` (light/dark pairs) and convert `docs/media/console.gif` to a silent mp4/webm with poster into `src/assets/odudu/`; process images with Astro's image pipeline. Implement from `GzCase`; first-person sections are drafts: render only from non-draft body, with the factual summary sections (problem/approach/result) from known facts.
- [ ] **Step 3:** Run; expected PASS. Commit ("Add Odudu case study").

### Task 13: Decisions log and single ADR pages

**Files:**
- Create: `src/_pages/decisions/{ui/DecisionsPage.astro, index.ts}`; `src/_pages/decision/{ui/DecisionPage.astro, ui/ImportMapDiagram.astro, use-cases/decisionViewModel.ts, index.ts}`; `src/pages/decisions/index.astro`; `src/pages/decisions/[slug].astro`; `e2e/decisions.spec.ts`

**Interfaces:**
- Consumes: decision entity, `AdrTable`, `publishable`.
- Produces: `getStaticPaths` from published decisions only; `buildDecisionViewModel(decision: Decision, all: Decision[]): { title: string; number: string; status: DecisionStatus; related: { title: string; href: string }[]; toc: { id: string; label: string }[] }`.

- [ ] **Step 1:** E2E (with `INCLUDE_DRAFTS=1`): log lists decisions in numeric order; ADR page has TOC links to `#context`, `#options`, `#decision`, `#consequences`; options table has `th scope`; the "rejected" options are text, not only a style; `/decisions/does-not-exist/` serves the 404 page; axe clean.
- [ ] **Step 2:** Run; expected FAIL. Implement from `GzDecisions`/`GzDecision` (stamp-and-strike on scroll-in, Import Map tile diagram with text alternative).
- [ ] **Step 3:** Run; expected PASS. Commit ("Add decision pages").

### Task 14: Profile, contact, 404

**Files:**
- Create: `src/_pages/profile/{ui/ProfilePage.astro, index.ts}`, `src/_pages/contact/{ui/ContactPage.astro, index.ts}`, `src/_pages/not-found/{ui/NotFoundPage.astro, index.ts}`; `src/pages/profile.astro`, `src/pages/contact.astro`, `src/pages/404.astro`; `e2e/profile-contact.spec.ts`

**Interfaces:**
- Consumes: `getProfile`.
- Produces: `/profile/` with the full HTML CV (experience, skills, education, languages, work authorization) and a CV PDF link rendered only when `public/cv.pdf` exists at build time; `/contact/` with the `mailto:` link, GitHub, LinkedIn, GitLab; `/404.html` styled as a "correction" with links back.

- [ ] **Step 1:** E2E: profile shows each employer from the résumé in order; PDF link absent when `public/cv.pdf` is missing; contact has exactly the résumé email as `mailto:`; unknown path returns the 404 page content; axe clean.
- [ ] **Step 2:** Run; expected FAIL. Implement from `GzProfile`/`GzContact`/`GzNotFound`.
- [ ] **Step 3:** Run; expected PASS. Commit ("Add profile, contact, 404").

### Task 15: SEO, feeds, share assets

**Files:**
- Create: `src/app/seo/Seo.astro`, `src/entities/profile/services/personStructuredData.ts` (+ test), `src/pages/rss.xml.ts`, `src/pages/robots.txt.ts`, `public/favicon.svg`, `public/og.png`, `tools/make-og.ts`, `e2e/seo.spec.ts`; configure `@astrojs/sitemap`

**Interfaces:**
- Produces: `buildPersonJsonLd(profile: Profile, siteUrl: string): object` and `buildWebSiteJsonLd(siteUrl: string): object`; every page head has title, description, canonical, OG/Twitter tags, and JSON-LD (`Person`, `WebSite`, `ProfilePage` on `/profile/`, `TechArticle` on ADRs); sitemap excludes drafts and `/odudu/`; RSS lists published decisions.

- [ ] **Step 1:** Unit test the JSON-LD builders (types, absolute URLs, `sameAs` includes GitHub and LinkedIn). E2E: each route has a unique title, a canonical ending in `/`, `og:image`, parseable JSON-LD; `sitemap-index.xml`, `rss.xml`, `robots.txt` exist; production build output (no `INCLUDE_DRAFTS`) contains no draft route in sitemap or RSS.
- [ ] **Step 2:** Run; expected FAIL. Implement; generate `og.png` (1200×630, masthead on newsprint) once with `tools/make-og.ts` and commit it; favicon is an SVG "W" mark adapting to light/dark via `prefers-color-scheme`.
- [ ] **Step 3:** Run; expected PASS. Commit ("Add SEO and feeds").

### Task 16: Release gates

**Files:**
- Create: `tools/check-content.ts`, `tools/check-dist.ts` (+ tests), `e2e/all-routes.spec.ts`, `lighthouserc.json`

**Interfaces:**
- Consumes: `findPlaceholders`, `publishable`.
- Produces: `pnpm check:content` (fails on `[…]` or `href="#"` in published entries and built HTML), `pnpm check:dist` (fails if `dist/` contains `odudu/` or a draft route), `pnpm e2e` across all routes × light/dark × `default`/`no-js`/`reduced-motion`/`mobile-360` projects running axe, a horizontal-overflow check (`document.documentElement.scrollWidth <= innerWidth`, also at 200% zoom via a 720px-wide viewport), and JS-weight budget (≤ 40 KB gzipped) ; Lighthouse CI asserts the performance targets.

- [ ] **Step 1:** Write tests for the two check tools using temp directories (a draft entry with `[x]` fails; a clean one passes; a `dist/odudu/index.html` fails). Write `all-routes.spec.ts`.
- [ ] **Step 2:** Run; expected FAIL. Implement the tools and wire them into `pnpm build:prod` (`INCLUDE_DRAFTS` unset).
- [ ] **Step 3:** Run the full suite; expected PASS. Fix findings (any failure here is a real defect in the owning task, fix it there).
- [ ] **Step 4:** Commit ("Add release gates").

### Task 17: CI and deploy workflow

**Files:**
- Create: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: CI on every push: `pnpm lint`, `typecheck`, `test`, `build:prod`, `check:content`, `check:dist`, `e2e`, Lighthouse CI, uploads the site artifact. `deploy.yml` publishes to Pages (via `actions/deploy-pages`) only on pushes to `master`.

- [ ] **Step 1:** Write both workflows; validate YAML locally with `actionlint` if available.
- [ ] **Step 2:** Push `rebuild` only when the owner asks; do not touch Pages settings.
- [ ] **Step 3:** Commit ("Add CI and deploy workflows").

### Task 18: Content approval pass and handover

**Files:**
- Modify: draft entries in `content/`; Create: `docs/adr/0001-pages-layer-naming.md`, `docs/CONTENT.md`

**Interfaces:**
- Produces: a list of every `draft: true` entry and what the owner must write; the ADR recording the `_pages` deviation and the theme-bootstrap exception (per the architecture doc: explain deliberate rule breaks).

- [ ] **Step 1:** Run `INCLUDE_DRAFTS=1 pnpm build && pnpm preview` and hand the owner the local preview URL with a checklist of drafts to rewrite in their own words (Odudu first-person sections, ADR context/consequences, quote, Waihona/Mythra one-liners).
- [ ] **Step 2:** As the owner approves entries, flip `draft` to false and re-run `pnpm build:prod && pnpm check:content`.
- [ ] **Step 3:** Run the architecture doc §13 checklist; Commit ("Document deviations and content status").

### Task 19: Cutover (owner-gated)

Performed only after the owner approves the preview, in this order:

- [ ] **Step 1 (owner):** Switch repo Settings → Pages → Source to "GitHub Actions".
- [ ] **Step 2:** Merge `rebuild` into `master`; confirm the `deploy` workflow succeeds.
- [ ] **Step 3:** Verify live: `/`, `/work/`, `/decisions/`, `/profile/`, `/contact/`, a bad URL (404), `https://wizzywit.github.io/odudu/docs/` still loads; submit the sitemap in Search Console (owner).
