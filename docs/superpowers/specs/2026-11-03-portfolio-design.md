# Portfolio rebuild: "The Gazette" (design)

Date: 2026-11-03. Owner: Wisdom Emmanuel Praise. Status: draft for approval.

## Intent

Replace the current wizzywit.github.io (a compiled old React bundle with no source) with a unique, accessible, Google-crawlable portfolio that positions Wisdom as a senior frontend platform/architecture engineer and shows his work. Recruiters should find role, strengths, selected work and contact within seconds; engineers should find evidence of how he thinks (ADRs, case studies).

## Direction (chosen by the owner)

"The Gazette": the site is the front page of a Munich broadsheet where he is the news. Work is "Features", ADRs are "Opinion", contact is a classified ad ("Situations wanted"), a news ticker carries real numbers, and 404 is a "correction". Source designs are in `docs/design/gazette/`, exported from Claude Design. There is a design for every page: `GzHome` (front page), `GzNight` (dark), `GzMobile` and `GzMobileMenu` (360px), `GzWork`, `GzCase` (Odudu), `GzDecisions` (ADR log), `GzDecision` (single ADR), `GzProfile`, `GzContact`, `GzNotFound`; `Gazette.dc.html` is the concept board. The files are static HTML mockups in Claude Design's `.dc.html` format (inline styles, a few filter/list interactions), not React code: they are ported by hand, and design tokens (colors, type scale, spacing) are extracted from them. The design files are the visual and motion reference; this document is the contract for behavior and structure. Fonts used (all open-licence, OFL, self-hostable): UnifrakturMaguntia (masthead only), Libre Caslon Display and Text, Libre Franklin, Courier Prime, IBM Plex Mono.

## Goals

- Pages: front page `/`, work index `/work/`, case study `/work/odudu/`, decision log `/decisions/`, single ADR `/decisions/<slug>/`, profile & CV `/profile/`, contact `/contact/`, 404.
- Light theme (default) and dark "night edition"; follows `prefers-color-scheme`, with a manual toggle that persists.
- Responsive from 360px; designs exist for 360 and 1440.
- WCAG 2.2 AA, including keyboard-only use, visible focus, 44px targets, reduced motion.
- Fully pre-rendered HTML: every page readable and indexable without JavaScript.
- Smooth fade-in reveal of sections as they scroll into view (owner requirement).
- Source follows `FRONTEND_ARCHITECTURE.md` (FSD + five layers), with the one documented deviation below.

## Non-goals

No CMS, comments, analytics with cookies (so no consent banner), contact-form backend, i18n (German version later), or blog beyond the decision log.

## Anti-goals (a failure even if it technically works)

- A joke headline that hides who he is or what he does.
- Placeholder copy (`[Your words…]`) in production.
- Content hidden until JS runs, or any scroll hijacking.
- Heavy JavaScript on a content site.
- Looking like a template.

## Approaches

| Option | Verdict |
|---|---|
| **A. Astro static output + React, thin routing shell (chosen)** | Pre-rendered HTML, near-zero JS, content collections for ADRs and case studies, reveal animation is pure CSS. React hydrates only for interactive pieces. Cost: Astro needs its routes in `src/pages/`, colliding with FSD `pages`. |
| B. Vite + React + TanStack Router, pre-rendered | Most literal fit to the doc, but hydrates the whole app (more JS, hydration-mismatch risk with animations). |
| C. Next.js static export | `app/` and `pages/` collide with two of the doc's layers; heaviest for a content site. |

The owner chose A on 2026-11-03.

## Architecture

**Deliberate deviation (explain in the PR/ADR):** FSD's `pages` layer lives in `src/_pages/<page>/` (FSD's own workaround for frameworks that reserve `pages/`). Astro's `src/pages/*.astro` files are one-line route shells that import a page slice's public `index.ts` and render it with the layout from `app`. Steiger must be configured to treat `_pages` as the pages layer. Nothing else in the doc is relaxed.

```
src/
  app/          layouts, global styles + design tokens, SEO head, providers
  pages/        Astro route shells only (no logic)
  _pages/       FSD pages layer: home, work, case-study, decisions, decision, profile, contact, not-found
  widgets/      masthead-and-nav, footer, news-ticker, classifieds-card, adr-table
  features/     theme-switch (used by every page, via the masthead widget)
  entities/     project, decision (ADR), profile (each: ui, repository, services, adapter, types)
  shared/       ui (design-system primitives: Reveal, Button, Figure...), lib, config
content/        projects/*.md, decisions/*.md, profile.json (typed via Astro content collections)
e2e/            Playwright
```

Rules applied to this site:
- **Adapters** are the only code touching Astro's content API (`astro:content`), `localStorage`, `matchMedia`, or third-party SDKs. Frontmatter/JSON is mapped to domain types (`Project`, `Decision`, `Profile`) with fixtures and mapping tests.
- **Repositories** wrap the adapters. Content is read synchronously at build time, so no TanStack Query is needed; it is introduced only if client data fetching appears. Client state (theme preference) uses Zustand inside the theme-switch repository with a storage-adapter-backed `persist`.
- **Services** hold the rules: filtering and counting projects by section, ADR ordering/status, "related decisions", placeholder detection, structured-data builders. Pure, with `now` and randomness injected. Each owned rule is listed in its entity README.
- **Use cases** build view models for views (e.g. work index entries, ADR table rows, JSON-LD input).
- **Pages first:** the work filter and ticker pause belong to their page/widget until a second consumer exists.
- **Documented exception:** the no-flash theme bootstrap is a single inline `<script>` in the head (≤10 lines). It reads the storage key and attribute name from constants exported by the theme adapter's slice and is the only code outside an adapter that references the stored theme.

## Interactivity (islands)

Everything works without JS except these enhancements, each a React island hydrated on idle/visible: theme toggle; mobile menu disclosure (links are plain visible links without JS); work filter chips (without JS all entries show); news ticker pause/play control (static "In brief" list without JS or with reduced motion).

## Motion

- **Reveal:** CSS scroll-driven animation (`animation-timeline: view()`, short `animation-range`), opacity + small translate, staggered by order. The hidden start state exists only inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference)`; otherwise content renders in its final state.
- **Signature motion from the design:** masthead off-register then snapping into place; headlines rolling in; AVAILABLE stamp; ticker; ADR stamp-and-strike; the diagrams that draw themselves (Odudu architecture, Import Map tiles). All are CSS, all disabled under reduced motion, anything that auto-moves for more than 5 seconds has a pause control.
- Triggers (my call): above-the-fold motion (masthead register, headline roll-in, AVAILABLE stamp, ticker) runs on load; section reveals and diagrams that draw themselves run on scroll via `view()` timelines; ADR stamp-and-strike runs when its record scrolls into view. Without `animation-timeline` support (or with reduced motion) everything renders in its final state, with no JS fallback. Stamp and strike are real text so assistive tech is unaffected; e2e/axe runs use `prefers-reduced-motion: reduce` emulation so tests are deterministic.
- Native scroll only: no smooth-scroll library, no wheel/touch interception; `scroll-behavior: smooth` only for in-page jumps under no-preference.

## SEO and crawlability

Per-page `<title>` and meta description, canonical URL, Open Graph/Twitter cards with a static share image, JSON-LD (`Person`, `WebSite`, `ProfilePage`; `TechArticle` for ADRs), `sitemap.xml`, `robots.txt`, an RSS feed for the decision log, a real 404 page, semantic landmarks and one `h1` per page, descriptive link text, meaningful alt text. The full CV is rendered as HTML on `/profile/` so it is indexable. The deployed domain is `https://wizzywit.github.io/` (root). The Odudu docs live at `/odudu/` from a separate repository; this site must not publish anything under that path.

## Accessibility

WCAG 2.2 AA: contrast of at least 4.5:1 for text, skip link, `aria-current` on nav, visible 3px focus ring, 44px targets, real buttons/links, tables with `th` scope, diagrams with text alternatives, ticker/video pause controls, justified text only at wide widths (left-aligned on narrow), blackletter masthead kept as real text with an accessible name. Automated: axe via Playwright on every route in light and dark; manual keyboard and screen-reader pass before launch.

## Performance (targets; the builder may propose tighter)

Lighthouse mobile ≥ 95 performance, 100 accessibility/SEO/best-practices; LCP < 2.0s, CLS < 0.05, ≤ 40 KB gzipped JS on any page, fonts self-hosted woff2 subsets (Latin plus Latin-1/Latin-Extended-A so German umlauts work; ≤ 150 KB total by limiting weights, with the blackletter face loaded for the masthead only), `font-display: swap` and size-matched fallbacks. Images via Astro's image pipeline (AVIF/WebP, explicit dimensions). The Odudu console GIF becomes a silent looping video with a poster and a pause control.

## Content

Facts come only from the résumé (`~/Downloads/Resume_Wisdom_Praise_Senior_Frontend_Engineer.pdf`), LinkedIn projects, and the Odudu/Wired repositories. Real screenshots/media come from `~/WebstormProjects/odudu` (`docs/media/`, `apps/docs/static/console/`) and `~/WebstormProjects/wired`. No invented numbers. Work entries without a case study link to the real repository or are unlinked; there are no dead `#` links. A content lint fails the build if any published entry still contains a `[…]` placeholder or a `#` link.

Extraction (my call): the builder transcribes facts into `content/profile.json` and the project/ADR files in this repo, and copies the media it needs into the repo; the build never reads from `~/Downloads` or `~/WebstormProjects`. The résumé PDF itself is not copied into the repo (it contains a phone number). The ticker uses the four figures in the design: 35 MCP tools, 5,000+ extension accounts, Odudu passing OpenID conformance in CI, 30+ micro-frontends on one runtime; all are on the résumé.

Drafts (my call): `draft: true` entries are included when `INCLUDE_DRAFTS=1` (local preview, preview CI) and excluded from production builds, sitemap and RSS. Every route and e2e test works from fixtures or the preview build; production e2e runs against published entries only. Minimum to launch: the Odudu case study, at least the ADRs the owner approves, and the profile/contact pages; the owner decides when enough is approved. Work entries without a case study never link to `#`.

Open content that only the owner can write: first-person paragraphs in the Odudu case study ("The problem", "Conformance as a test", "What I would do differently"), ADR context/consequence details beyond the résumé facts, and the quote. The builder drafts these strictly from known facts, marks them `draft: true`, and they are excluded from the production build until the owner approves them.

## Tooling and quality (per the architecture doc)

React + TypeScript strict; Vitest for services and adapter mapping; React Testing Library for island integration tests; Playwright for critical flows (navigate all pages, theme toggle persists, work filter, ticker pause, mobile menu, contact link, 404) and the axe scan; Steiger + boundaries lint; jscpd; `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm e2e`. CI on GitHub Actions; deploy to GitHub Pages via Actions.

## Constraints and owner rules

- Commit messages are very brief, with no AI co-author trailers or "Generated with" lines anywhere.
- Switching Pages to "GitHub Actions" deployment and removing the old built files from the repo happens only at cutover, after the owner approves the preview.

## Repository, preview and deploy

- The Astro project lives at the repo root on a feature branch (`rebuild`). Its first commit deletes the old compiled files (`css/`, `js/`, `images/`, `static/`, `index.html`, `service-worker.js`, `asset-manifest.json`, `favicon.ico`) on that branch only; `master` keeps serving the old site and holds them in history until cutover.
- Preview is local (`astro build && astro preview`, with `INCLUDE_DRAFTS=1`) plus screenshots; the owner approves from that. The deploy workflow runs build + checks on every push and uploads the site as an artifact, and publishes to Pages only from `master`.
- Cutover, in order: owner approves preview → switch Pages source to "GitHub Actions" in repo settings (owner does this) → merge `rebuild` to `master` → verify the live site and Search Console. Merging first would break the live site, since Pages currently serves `master` as-is.
- `/odudu/` belongs to another repository on the same origin: links to it are plain absolute links treated as external, it is excluded from this site's sitemap and link-checker, and CI fails if `dist/` contains an `odudu/` path.
- Share image: one static 1200×630 PNG (masthead on newsprint) generated once by a committed script; favicon is a single SVG "W" mark that adapts to light/dark.

## My calls (the owner can overrule)

- Contact is a `mailto:` link only, using the address on the résumé; no form.
- The CV PDF button appears only once the owner supplies a PDF without his phone number; the HTML CV is always present.
- Source lives on a feature branch until cutover.
- Performance numbers above are my targets, not agreed ones.

## Left to the builder

Exact Steiger/boundaries configuration for `_pages`, font subsetting, share-image generation, mobile-menu pattern, JSON-LD field details, and the Wired/other case-study decisions beyond Odudu.

## Changes made during the build (supersede the text above where they differ)

- The finished page designs, not the earlier concept board, are the visual reference: there is no news ticker, blackletter masthead or AVAILABLE stamp, and no pause control is needed because every animation plays once.
- JavaScript budget: 85 KB gzipped per page (React islands cost about 66 KB on their own). LCP gate: 2.5 s. See `docs/adr/0001-deliberate-departures.md`.
- The mobile menu is a native `<details>` disclosure instead of a React dialog, because hydrating the dialog shifted the layout.
- No contact form and no portrait; the PDF button waits for `public/cv.pdf`.
- Case studies and decisions are structured content (`content/case-studies/*.yaml`, `content/decisions/*.yaml`) with per-entry or per-section `draft` flags.
