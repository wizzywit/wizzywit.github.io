import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { findPlaceholders } from '../src/shared/lib/placeholders.ts';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function strings(value: Json, found: string[] = []): string[] {
  if (typeof value === 'string') found.push(value);
  else if (Array.isArray(value)) value.forEach((item) => strings(item, found));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => strings(item, found));
  return found;
}

function problemsIn(label: string, value: Json): string[] {
  const text = strings(value);
  const markers = findPlaceholders(text.join('\n'));
  if (text.includes('#')) markers.push('href "#"');
  return markers.map((marker) => `${label}: unfinished copy ${marker}`);
}

function files(dir: string, extension: string): string[] {
  return existsSync(dir) ? readdirSync(dir).filter((name) => name.endsWith(extension)).map((name) => path.join(dir, name)) : [];
}

/** Published (non-draft) content must not contain placeholders or dead links. */
export function findContentProblems(contentDir: string): string[] {
  const problems: string[] = [];
  const rel = (file: string) => path.relative(path.dirname(contentDir), file).split(path.sep).join('/');
  const labelFor = (file: string) => rel(file).replace(/^[^/]+\//, '');

  for (const file of files(path.join(contentDir, 'decisions'), '.yaml')) {
    const data = parse(readFileSync(file, 'utf8')) as { draft?: boolean } & { [key: string]: Json };
    if (!data.draft) problems.push(...problemsIn(labelFor(file), data));
  }
  for (const file of files(path.join(contentDir, 'case-studies'), '.yaml')) {
    const data = parse(readFileSync(file, 'utf8')) as { sections?: { draft?: boolean }[] } & { [key: string]: Json };
    const { sections = [], ...rest } = data;
    problems.push(...problemsIn(labelFor(file), rest as Json));
    for (const section of sections) if (!section.draft) problems.push(...problemsIn(labelFor(file), section as unknown as Json));
  }
  for (const file of files(path.join(contentDir, 'projects'), '.md')) {
    const match = readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
    const data = (match ? parse(match[1] as string) : {}) as { draft?: boolean } & { [key: string]: Json };
    if (!data.draft) problems.push(...problemsIn(labelFor(file), data));
  }
  const profile = path.join(contentDir, 'profile.json');
  if (existsSync(profile)) problems.push(...problemsIn('profile.json', JSON.parse(readFileSync(profile, 'utf8')) as Json));
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = findContentProblems(path.resolve('content'));
  problems.forEach((problem) => console.error(problem));
  process.exit(problems.length ? 1 : 0);
}
