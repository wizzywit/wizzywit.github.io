import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL } from '../src/shared/config/site.ts';
import { findPlaceholders } from '../src/shared/lib/placeholders.ts';

const DEFAULT_JS_BUDGET = 85 * 1024;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function visibleText(html: string): string {
  return html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ');
}

function linkExists(distDir: string, href: string): boolean {
  const clean = decodeURIComponent(href.split('#')[0]!.split('?')[0]!);
  if (clean === '' || clean === '/') return existsSync(path.join(distDir, 'index.html'));
  const target = path.join(distDir, clean);
  return clean.endsWith('/') ? existsSync(path.join(target, 'index.html')) : existsSync(target) || existsSync(path.join(target, 'index.html'));
}

function scriptFiles(distDir: string, html: string): Set<string> {
  const found = new Set<string>();
  const add = (url: string, from?: string) => {
    const file = url.startsWith('/') ? path.join(distDir, url) : path.resolve(path.dirname(from ?? distDir), url);
    if (found.has(file) || !existsSync(file)) return;
    found.add(file);
    for (const match of readFileSync(file, 'utf8').matchAll(/(?:from|import)\s*\(?\s*["'](\.{1,2}\/[^"']+\.js)["']/g)) add(match[1]!, file);
  };
  for (const match of html.matchAll(/(?:component-url|renderer-url|before-hydration-url)="([^"]+\.js)"/g)) add(match[1]!);
  for (const match of html.matchAll(/<script[^>]+src="([^"]+\.js)"/g)) add(match[1]!);
  for (const match of html.matchAll(/<link[^>]+rel="modulepreload"[^>]+href="([^"]+\.js)"/g)) add(match[1]!);
  return found;
}

const COPY_ATTRIBUTES = ['alt', 'title', 'aria-label', 'aria-description', 'placeholder', 'content', 'label'];

/** Copy a reader or a search engine sees that is not element text: alt, aria-label, meta content. */
function attributeCopy(html: string): string[] {
  const withoutCode = html.replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ');
  const pattern = new RegExp(`\\s(?:${COPY_ATTRIBUTES.join('|')})="([^"]*)"`, 'g');
  return [...withoutCode.matchAll(pattern)].map((match) => match[1]!);
}

/** Local files the page asks for besides links: images, video, posters and the share image. */
function assetPaths(html: string): string[] {
  const paths: string[] = [];
  for (const match of html.matchAll(/\s(?:src|poster)="(\/[^"]*)"/g)) paths.push(match[1]!);
  for (const match of html.matchAll(/\ssrcset="([^"]*)"/g)) {
    for (const candidate of match[1]!.split(',')) {
      const url = candidate.trim().split(/\s+/)[0]!;
      if (url.startsWith('/') && !url.startsWith('//')) paths.push(url);
    }
  }
  for (const match of html.matchAll(new RegExp(`content="${SITE_URL.replace(/[.]/g, '\\.')}(\\/[^"]*)"`, 'g'))) paths.push(match[1]!);
  return paths;
}

/** Checks a built site: no /odudu/, no unfinished copy, no dead links, and JavaScript within budget per page. */
export function findDistProblems(distDir: string, options: { jsBudgetBytes?: number } = {}): string[] {
  const budget = options.jsBudgetBytes ?? DEFAULT_JS_BUDGET;
  const problems: string[] = [];
  if (existsSync(path.join(distDir, 'odudu'))) problems.push('dist/odudu exists; /odudu/ belongs to another repository');

  for (const file of walk(distDir).filter((f) => f.endsWith('.html'))) {
    const name = path.relative(distDir, file).split(path.sep).join('/');
    const html = readFileSync(file, 'utf8');
    for (const marker of findPlaceholders([visibleText(html), ...attributeCopy(html)].join('\n'))) problems.push(`${name}: unfinished copy ${marker}`);
    if (/href=(["'])#\1/.test(html)) problems.push(`${name}: dead link href="#"`);
    for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
      const href = match[1]!;
      if (href.startsWith('//')) continue;
      if (!linkExists(distDir, href)) problems.push(`${name}: broken internal link ${href}`);
    }
    for (const asset of assetPaths(html)) {
      if (!linkExists(distDir, asset)) problems.push(`${name}: missing file ${asset}`);
    }
    const bytes = [...scriptFiles(distDir, html)].reduce((sum, script) => sum + gzipSync(readFileSync(script)).length, 0);
    if (bytes > budget) problems.push(`${name}: JavaScript is ${(bytes / 1024).toFixed(1)} KB gzipped, over the ${(budget / 1024).toFixed(0)} KB budget`);
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const problems = findDistProblems(path.resolve('dist'));
  problems.forEach((problem) => console.error(problem));
  process.exit(problems.length ? 1 : 0);
}
