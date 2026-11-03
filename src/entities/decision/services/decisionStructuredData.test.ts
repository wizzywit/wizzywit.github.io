import { describe, expect, it } from 'vitest';
import type { Decision } from '../types/decision';
import { buildTechArticleJsonLd } from './decisionStructuredData';

const decision: Decision = {
  slug: 'one-runtime', number: 2, title: 'One runtime', why: 'Share code once.', area: 'Platform runtime', status: 'accepted',
  decidedOn: null, related: [], context: [], options: [], decision: '', consequences: { better: [], harder: [] }, draft: false,
};

describe('buildTechArticleJsonLd', () => {
  const json = buildTechArticleJsonLd(decision, 'https://wizzywit.github.io', 'Wisdom Emmanuel Praise') as Record<string, unknown>;

  it('is a schema.org TechArticle with headline and description', () => {
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('TechArticle');
    expect(json['headline']).toBe('One runtime');
    expect(json['description']).toBe('Share code once.');
  });

  it('uses an absolute url under the site', () => {
    expect(json['url']).toBe('https://wizzywit.github.io/decisions/one-runtime/');
  });

  it('names the author', () => {
    expect(json['author']).toEqual({ '@type': 'Person', name: 'Wisdom Emmanuel Praise' });
  });

  it('tolerates a trailing slash on the site url', () => {
    const again = buildTechArticleJsonLd(decision, 'https://wizzywit.github.io/', 'W') as Record<string, unknown>;
    expect(again['url']).toBe('https://wizzywit.github.io/decisions/one-runtime/');
  });
});
