import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://wizzywit.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  // lightningcss folds animation-timeline into the animation shorthand, which Chromium ignores.
  vite: { build: { cssMinify: 'esbuild' } },
});
