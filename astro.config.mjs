import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wizzywit.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/404') })],
  // lightningcss folds animation-timeline into the animation shorthand, which Chromium ignores.
  vite: { build: { cssMinify: 'esbuild' } },
});
