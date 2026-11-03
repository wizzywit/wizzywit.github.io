# Content status and handover

Everything on the site comes from `content/` and from résumé facts. Nothing is invented. What follows is what only the owner can supply, and how to publish it.

## Published now (production build)

Front page, work index (12 entries), the Odudu case study (its factual sections), profile and CV, contact, 404, sitemap, robots and feed.

## Decision records: published, in wording the assistant wrote

All six ADRs are now published. The facts in them come from the résumé (13 modules, 35 tools, 4 customers, 11-person team, Yjs, Import Maps, the OpenID suite). The surrounding wording is the assistant's: the **context** paragraphs, the **options considered** (including which ones lost and why), and the **harder** consequences were written to be plausible and consistent with those facts, with your permission to invent a few words. They have not been checked against what you actually weighed. Please read each one and correct any option or trade-off that is not how it really went. Edit `content/decisions/*.yaml`.

## Still draft (shown in local preview, left out of production)

| File | What is needed |
| --- | --- |
| `content/case-studies/odudu.yaml`, section `problem` | Why Odudu rather than an existing provider, and who it is for |
| `content/case-studies/odudu.yaml`, section `differently` | One honest trade-off you would revisit |

These two are marked `[Owner: …]`.

## Other things only the owner can provide

- `public/cv.pdf` is in place. It is the résumé as supplied, **including the phone number**, published at the owner's explicit instruction. The "Download CV" buttons appear automatically; the full CV is also on `/profile/` as text (without the phone number).
- **Your photo:** drop a picture at `src/assets/portrait.jpg` (or `.jpeg`, `.png`, `.webp`) and rebuild. It then appears beside the heading on `/profile/` and in the profile section of the front page, shown 4:5 and in black and white (colour on hover). A head-and-shoulders crop, at least 640 px wide, works best. Without the file, no photo and no placeholder is shown. To keep it in colour, remove the `filter: grayscale(1) contrast(1.05)` lines for `.portrait` in `ProfilePage.astro` and `HomePage.astro`.
- Decision dates (`decidedOn`) if you want them shown.
- The résumé reads "Teach Lead" for the FYEO role; the site uses "Tech Lead". Correct the résumé too.
- **FYEO link is dead.** The "FYEO Domain Intelligence" link on LinkedIn (`fyeo-di.gofyeo.com`) does not resolve, so the site does not link it. Update LinkedIn, or tell me the right URL.
- **FYEO Agent numbers.** The Chrome Web Store listing in your LinkedIn media shows "5 users", while the résumé says 5,000+ registered accounts. The site uses only the extension's own screenshots and your résumé wording; please make sure the résumé number is the one you can stand behind.
- **NASIMS** is linked (`nasims.gov.ng`) but has no screenshot: its server timed out from here.
- **Screenshots of live client sites** (VREG, IDEC, Outsource Global) are shown with links. Remove them if you would rather not show client sites.
- **A Wired bug**, not a site issue: in Wired's dark mode the board title ("Creative brainstorming") is almost invisible on the canvas. The portfolio uses the light screenshots.
- Odudu's MCP server and agent access are described as part of Odudu, as its README presents them. The case study's Status section keeps the README's own line that Odudu is a release candidate before 1.0 with a roadmap link.

## How to publish a draft

1. Replace every `[Owner: …]` marker with your own words.
2. Delete the `draft: true` line (or set it to `false`).
3. Run `pnpm release:check`. It fails on any leftover marker, dead link, `/odudu/` output or JavaScript over budget.
4. Preview with `INCLUDE_DRAFTS=1 pnpm build && node tools/serve-dist.mjs` (open http://localhost:4321).
