import { describe, expect, it } from 'vitest';
import { ESLint } from 'eslint';

const eslint = new ESLint({ cwd: process.cwd() });

async function violations(code: string, filePath: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  return (result?.messages ?? []).filter((m) => m.ruleId === 'arch/imports').map((m) => m.message);
}

describe('architecture lint: segment rules', () => {
  it('flags a view importing a repository', async () => {
    const found = await violations("import { x } from '../repository/useThing';", 'src/features/a/ui/Thing.tsx');
    expect(found).toHaveLength(1);
  });

  it('flags a service importing an adapter', async () => {
    const found = await violations("import { a } from '../adapter/thingAdapter';", 'src/entities/thing/services/rules.ts');
    expect(found).toHaveLength(1);
  });

  it('flags a service importing react', async () => {
    const found = await violations("import { useState } from 'react';", 'src/entities/thing/services/rules.ts');
    expect(found).toHaveLength(1);
  });

  it('flags astro:content outside an adapter', async () => {
    const found = await violations("import { getCollection } from 'astro:content';", 'src/entities/thing/repository/repo.ts');
    expect(found).toHaveLength(1);
  });

  it('flags a use case importing an adapter', async () => {
    const found = await violations("import { a } from '../adapter/thingAdapter';", 'src/features/a/use-cases/useA.ts');
    expect(found).toHaveLength(1);
  });

  it('allows a view importing its own use case', async () => {
    const found = await violations("import { useA } from '../use-cases/useA';", 'src/features/a/ui/A.tsx');
    expect(found).toHaveLength(0);
  });

  it('allows an adapter to use astro:content', async () => {
    const found = await violations("import { getCollection } from 'astro:content';", 'src/entities/thing/adapter/thingAdapter.ts');
    expect(found).toHaveLength(0);
  });
});

describe('architecture lint: slice and layer rules', () => {
  it('flags a deep import into another slice', async () => {
    const found = await violations("import { r } from '@/entities/order/services/orderSubmission';", 'src/features/a/use-cases/useA.ts');
    expect(found).toHaveLength(1);
  });

  it('flags a sideways import between features', async () => {
    const found = await violations("import { b } from '@/features/b';", 'src/features/a/use-cases/useA.ts');
    expect(found).toHaveLength(1);
  });

  it('flags an upward import', async () => {
    const found = await violations("import { w } from '@/widgets/w';", 'src/entities/thing/services/rules.ts');
    expect(found).toHaveLength(1);
  });

  it('flags shared importing a business layer', async () => {
    const found = await violations("import { p } from '@/entities/project';", 'src/shared/lib/helper.ts');
    expect(found).toHaveLength(1);
  });

  it('allows importing a lower layer through its public index', async () => {
    const found = await violations("import { canSubmitOrder } from '@/entities/order';", 'src/features/a/use-cases/useA.ts');
    expect(found).toHaveLength(0);
  });

  it('allows a page slice to import a widget public index', async () => {
    const found = await violations("import { Masthead } from '@/widgets/masthead-and-nav';", 'src/_pages/home/ui/HomePage.tsx');
    expect(found).toHaveLength(0);
  });
});
