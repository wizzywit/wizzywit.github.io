import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'astro:content': fileURLToPath(new URL('./tools/stubs/astro-content.ts', import.meta.url)),
    },
  },
  test: { include: ['src/**/*.test.{ts,tsx}', 'tools/**/*.test.ts'] },
});
