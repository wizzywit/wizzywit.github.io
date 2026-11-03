import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkStructure } from './check-structure.ts';

function tree(files: Record<string, string>): string {
  const root = mkdtempSync(path.join(tmpdir(), 'structure-'));
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(root, rel);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, body);
  }
  return root;
}

describe('checkStructure', () => {
  it('accepts a clean slice', () => {
    const root = tree({
      'entities/order/index.ts': "export { canSubmitOrder } from './services/orderSubmission';",
      'entities/order/services/orderSubmission.ts': 'export const canSubmitOrder = () => true;',
    });
    expect(checkStructure(root)).toEqual([]);
  });

  it('flags a segment-level index file', () => {
    const root = tree({ 'entities/order/services/index.ts': 'export {};' });
    expect(checkStructure(root)).toEqual([expect.stringContaining('entities/order/services/index.ts')]);
  });

  it('flags forbidden folder names inside a slice', () => {
    const root = tree({ 'features/a/components/Button.tsx': 'export {};', 'features/a/hooks/useX.ts': 'export {};' });
    expect(checkStructure(root)).toHaveLength(2);
  });

  it('flags a slice index that exports an adapter', () => {
    const root = tree({ 'entities/order/index.ts': "export { orderApiAdapter } from './adapter/orderApiAdapter';" });
    expect(checkStructure(root)).toEqual([expect.stringContaining('adapter')]);
  });

  it('flags a folder that is not one of the allowed segments', () => {
    const root = tree({ 'features/a/bootstrap/x.ts': 'export {};' });
    expect(checkStructure(root)).toEqual([expect.stringContaining('bootstrap')]);
  });

  it('allows index, README and the @x folder at the slice root', () => {
    const root = tree({
      'entities/order/index.ts': 'export {};',
      'entities/order/README.md': '# order',
      'entities/order/@x/delivery.ts': 'export {};',
      'entities/order/types/order.ts': 'export {};',
    });
    expect(checkStructure(root)).toEqual([]);
  });

  it('allows components/ inside shared', () => {
    const root = tree({ 'shared/ui/components/x.ts': 'export {};' });
    expect(checkStructure(root)).toEqual([]);
  });
});
