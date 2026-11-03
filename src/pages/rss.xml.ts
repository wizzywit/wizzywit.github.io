import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { formatDecisionNumber, getDecisions } from '@/entities/decision';
import { SITE_NAME } from '@/shared/config';

export async function GET(context: APIContext) {
  const decisions = await getDecisions();
  return rss({
    title: `${SITE_NAME}: decision log`,
    description: 'Architecture decision records: the context, the options, what was chosen and what it cost.',
    site: context.site ?? 'https://wizzywit.github.io',
    items: decisions.map((decision) => ({
      title: `${formatDecisionNumber(decision.number)}: ${decision.title}`,
      description: decision.why,
      link: `/decisions/${decision.slug}/`,
    })),
  });
}
