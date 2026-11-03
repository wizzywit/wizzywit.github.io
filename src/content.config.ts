import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
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

const profile = defineCollection({
  loader: glob({ pattern: 'profile.json', base: './content' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    location: z.string(),
    summary: z.string(),
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

export const collections = { projects, profile };
