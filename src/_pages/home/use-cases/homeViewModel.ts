import { formatDecisionStatus, getDecisions, type Decision } from '@/entities/decision';
import { buildPersonJsonLd, buildWebSiteJsonLd, getProfile } from '@/entities/profile';
import { getProjects, type Project } from '@/entities/project';
import { SITE_NAME, SITE_URL } from '@/shared/config';

export type HomeFeatured = { slug: string; kicker: string; headline: string; blurb: string; href: string | null; external: boolean };
export type HomeCard = { kicker: string; title: string; blurb: string; href: string | null; external: boolean };
export type HomeViewModel = {
  lead: { kicker: string; headline: string; deck: string; paragraphs: string[]; decisionHref: string | null };
  inBrief: { figure: string; text: string }[];
  featured: HomeFeatured[];
  more: HomeCard[];
  decisions: { title: string; why: string; status: string; href: string }[];
  profile: { paragraph: string; principles: string[] };
};

// Editorial headlines for the three featured entries; everything else comes from project data.
const FEATURED: Record<string, { headline: string; blurb: string; kicker: string }> = {
  odudu: {
    kicker: 'Identity · Open source',
    headline: 'Odudu: a multi-tenant identity provider that proves its own conformance',
    blurb: 'OAuth and OpenID Connect with an admin console, brandable sign-in pages and an MCP server for agents. The OpenID conformance suite runs in CI.',
  },
  wired: {
    kicker: 'Real-time',
    headline: 'Wired: an infinite canvas where edits never collide',
    blurb: 'A collaborative whiteboard built with React 19 and Konva. Yjs CRDTs merge concurrent edits; live cursors show who is where.',
  },
  websuckit: {
    kicker: 'Infrastructure',
    headline: 'WebSuckIt: WebSocket infrastructure developers do not have to build',
    blurb: 'Scalable real-time connections as a service, so teams add live features without first writing the plumbing.',
  },
};
const FEATURED_ORDER = ['odudu', 'wired', 'websuckit'];
const MORE_ORDER = ['fyeo-domain-intelligence', 'dione', 'nasims', 'rust-side-projects'];
const FEATURED_DECISIONS = ['one-runtime', 'accessibility-in-dod', 'agent-permissions'];

export function buildHomeViewModel(projects: Project[], decisions: Decision[]): HomeViewModel {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const decisionBySlug = new Map(decisions.map((d) => [d.slug, d]));
  const fiveLayers = decisionBySlug.get('five-layers');

  return {
    lead: {
      kicker: 'Platform architecture',
      headline: 'One feature, five layers: the architecture now standard in thirteen product modules',
      deck: 'How a single architecture decision record at Censhare became the shared shape for features across the product, and why each layer can be tested on its own.',
      paragraphs: [
        'The five-layer feature architecture (view, use case, repository, service, adapter) began as an ADR. It is now the default in 13 product modules.',
        'Because each layer can be tested on its own, the cause of a production bug is usually found within a day instead of several days. The Frontend Builder, a platform for assembling customer-specific UIs from shared components, now runs at more than ten enterprise customers.',
        'The same discipline holds the platform together: more than thirty micro-frontends share one runtime through Import Maps, and accessibility to WCAG 2.2 AA and BFSG is part of the Definition of Done.',
      ],
      decisionHref: fiveLayers ? `/decisions/${fiveLayers.slug}/` : null,
    },
    inBrief: [
      { figure: '13', text: 'product modules on the five-layer architecture' },
      { figure: '30+', text: 'micro-frontends on one shared runtime' },
      { figure: '10+', text: 'enterprise customers running the Frontend Builder' },
      { figure: '35', text: 'permission-scoped MCP tools for LLM agents' },
      { figure: '2M+', text: 'citizens served by national platforms' },
      { figure: 'AA', text: 'WCAG 2.2 and BFSG in the Definition of Done' },
    ],
    featured: FEATURED_ORDER.flatMap((slug) => {
      const project = bySlug.get(slug);
      const copy = FEATURED[slug];
      return project && copy
        ? [{ slug, kicker: copy.kicker, headline: copy.headline, blurb: copy.blurb, href: project.href, external: project.external }]
        : [];
    }),
    more: MORE_ORDER.flatMap((slug) => {
      const project = bySlug.get(slug);
      return project ? [{ kicker: project.kicker, title: project.title, blurb: project.summary, href: project.href, external: project.external }] : [];
    }),
    decisions: FEATURED_DECISIONS.flatMap((slug) => {
      const decision = decisionBySlug.get(slug);
      return decision ? [{ title: decision.title, why: decision.why, status: formatDecisionStatus(decision.status), href: `/decisions/${decision.slug}/` }] : [];
    }),
    profile: {
      paragraph:
        'Senior Frontend Engineer at Censhare, working on frontend platform and architecture. Before that: a robot-programming IDE for industry at Agile Robots, a threat-intelligence product at FYEO, and national platforms serving more than two million citizens. Seven-plus years of B2B web applications, micro-frontends and UI platforms, built with distributed Scrum teams.',
      principles: [
        'Architecture decisions are written down as ADRs.',
        'Accessibility is part of the Definition of Done, not a later phase.',
        'Each layer of a feature can be tested on its own.',
      ],
    },
  };
}

export async function loadHomeViewModel(): Promise<HomeViewModel> {
  return buildHomeViewModel(await getProjects(), await getDecisions());
}

export async function loadHomeMeta(): Promise<{ title: string; description: string; jsonLd: object[] }> {
  const profile = await getProfile();
  return {
    title: `${profile.name} — ${profile.role}`,
    description: 'Senior Frontend Engineer near Munich: frontend platform and architecture, micro-frontends, design systems and WCAG 2.2 AA. Selected work, architecture decisions and CV.',
    jsonLd: [buildPersonJsonLd(profile, SITE_URL), buildWebSiteJsonLd(SITE_NAME, SITE_URL)],
  };
}
