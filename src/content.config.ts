import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { DECISION_STATUSES } from '@/entities/decision/types/decision';
import { PROJECT_SECTIONS } from '@/entities/project/types/project';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    section: z.enum(PROJECT_SECTIONS),
    kicker: z.string(),
    summary: z.string(),
    role: z.string(),
    href: z.string().optional(),
    order: z.number(),
    draft: z.boolean().optional(),
  }),
});

const decisions = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './content/decisions' }),
  schema: z.object({
    number: z.number(),
    title: z.string(),
    why: z.string(),
    area: z.string(),
    status: z.enum(DECISION_STATUSES as [string, ...string[]]),
    decidedOn: z.string().optional(),
    related: z.array(z.string()).optional(),
    context: z.array(z.string()),
    options: z.array(z.object({ name: z.string(), pros: z.string(), cons: z.string(), chosen: z.boolean() })),
    decision: z.string(),
    consequences: z.object({ better: z.array(z.string()), harder: z.array(z.string()) }),
    draft: z.boolean().optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './content/case-studies' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    deck: z.string(),
    meta: z.object({
      role: z.string(), type: z.string(), stack: z.string(),
      links: z.array(z.object({ label: z.string(), href: z.string() })),
    }),
    glance: z.object({ problem: z.string(), approach: z.string(), result: z.string() }),
    decisions: z.array(z.string()),
    sections: z.array(z.object({ id: z.string(), heading: z.string(), paragraphs: z.array(z.string()), draft: z.boolean().optional() })),
  }),
});

const profile = defineCollection({
  loader: glob({ pattern: 'profile.json', base: './content' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    location: z.string(),
    summary: z.string(),
    yearsExperience: z.number(),
    email: z.string(),
    links: z.object({ github: z.string(), linkedin: z.string(), gitlab: z.string() }),
    skills: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
    experience: z.array(
      z.object({
        title: z.string(), org: z.string(), location: z.string(), period: z.string(), context: z.string(),
        stack: z.array(z.string()), highlights: z.array(z.string()),
      }),
    ),
    education: z.array(z.object({ degree: z.string(), school: z.string(), period: z.string(), note: z.string() })),
    languages: z.array(z.object({ language: z.string(), level: z.string() })),
    workAuthorization: z.string(),
    ticker: z.array(z.object({ id: z.string(), text: z.string() })),
  }),
});

export const collections = { projects, decisions, caseStudies, profile };
