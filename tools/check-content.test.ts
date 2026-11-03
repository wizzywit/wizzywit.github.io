import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findContentProblems } from './check-content.ts';

function tree(files: Record<string, string>): string {
  const root = mkdtempSync(path.join(tmpdir(), 'content-'));
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(root, rel);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, body);
  }
  return root;
}

const decision = (extra: string) => `number: 1\ntitle: T\nwhy: W\narea: A\nstatus: accepted\ncontext:\n  - ${extra}\noptions: []\ndecision: D\nconsequences:\n  better: []\n  harder: []\n`;

describe('findContentProblems', () => {
  it('accepts a clean tree', () => {
    expect(findContentProblems(tree({ 'decisions/a.yaml': decision('Clean text.') }))).toEqual([]);
  });

  it('lets a draft entry keep its placeholders', () => {
    const root = tree({ 'decisions/a.yaml': decision('"[Owner: fill in.]"') + 'draft: true\n' });
    expect(findContentProblems(root)).toEqual([]);
  });

  it('flags a placeholder in a published decision', () => {
    const root = tree({ 'decisions/a.yaml': decision('"[Owner: fill in.]"') });
    expect(findContentProblems(root)).toEqual([expect.stringContaining('decisions/a.yaml')]);
  });

  it('checks case-study sections one by one, skipping draft sections', () => {
    const study = (draft: boolean) =>
      `title: T\nkicker: K\ndeck: D\nmeta: { role: r, type: t, stack: s, links: [] }\nglance: { problem: p, approach: a, result: r }\ndecisions: []\nsections:\n  - id: x\n    heading: H\n    paragraphs: ["[Owner: write this.]"]\n    draft: ${draft}\n`;
    expect(findContentProblems(tree({ 'case-studies/odudu.yaml': study(true) }))).toEqual([]);
    expect(findContentProblems(tree({ 'case-studies/odudu.yaml': study(false) }))).toHaveLength(1);
  });

  it('flags a hash link in a published project', () => {
    const root = tree({ 'projects/a.md': '---\ntitle: A\nhref: "#"\n---\n' });
    expect(findContentProblems(root)).toEqual([expect.stringContaining('projects/a.md')]);
  });

  it('flags a placeholder in the profile', () => {
    const root = tree({ 'profile.json': JSON.stringify({ name: 'W', summary: 'See [Owner: x] here.' }) });
    expect(findContentProblems(root)).toEqual([expect.stringContaining('profile.json')]);
  });
});
