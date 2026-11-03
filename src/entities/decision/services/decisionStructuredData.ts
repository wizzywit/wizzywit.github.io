import type { Decision } from '../types/decision';

export function buildTechArticleJsonLd(decision: Decision, siteUrl: string, authorName: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: decision.title,
    description: decision.why,
    url: new URL(`/decisions/${decision.slug}/`, siteUrl).href,
    author: { '@type': 'Person', name: authorName },
  };
}
