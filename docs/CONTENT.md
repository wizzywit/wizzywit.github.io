# Content status and handover

Everything on the site comes from `content/` and from résumé facts. Nothing is invented. What follows is what only the owner can supply, and how to publish it.

## Published now (production build)

Front page, work index (12 entries), the Odudu case study (its factual sections), profile and CV, contact, 404, sitemap, robots and feed.

## Still draft (shown in local preview, left out of production)

| File | What is needed |
| --- | --- |
| `content/decisions/five-layers.yaml` | Why it was needed; an option that lost; the cost; what became harder |
| `content/decisions/one-runtime.yaml` | What was going wrong before (confirm or replace the three options drafted from the design) |
| `content/decisions/accessibility-in-dod.yaml` | What happened before; the cost to the team; what became harder |
| `content/decisions/agent-permissions.yaml` | The risk designed against; an option that lost; the cost |
| `content/decisions/conformance-ci-gate.yaml` | Why a badge was not enough; the CI cost |
| `content/decisions/crdt-over-locks.yaml` | What was considered first; the cost |
| `content/case-studies/odudu.yaml`, section `problem` | Why Odudu rather than an existing provider, and who it is for |
| `content/case-studies/odudu.yaml`, section `differently` | One honest trade-off you would revisit |

Each gap is marked `[Owner: …]`. While any ADR is draft, `/decisions/` is empty in production and the work entries that point at ADRs are shown without a link (this is automatic).

## Other things only the owner can provide

- `public/cv.pdf`: a CV without a phone number. Until it exists, every "Download CV" button is hidden; the full CV is already on `/profile/` as text.
- A portrait (optional). The design had a placeholder; none is shown.
- Decision dates (`decidedOn`) if you want them shown.
- The résumé reads "Teach Lead" for the FYEO role; the site uses "Tech Lead". Correct the résumé too.
- Odudu's MCP server and agent access are described as part of Odudu, as its README presents them. The case study's Status section keeps the README's own line that Odudu is a release candidate before 1.0 with a roadmap link.

## How to publish a draft

1. Replace every `[Owner: …]` marker with your own words.
2. Delete the `draft: true` line (or set it to `false`).
3. Run `pnpm release:check`. It fails on any leftover marker, dead link, `/odudu/` output or JavaScript over budget.
4. Preview with `INCLUDE_DRAFTS=1 pnpm build && node tools/serve-dist.mjs` (open http://localhost:4321).
