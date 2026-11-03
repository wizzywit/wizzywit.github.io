import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wizzywit.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/404') })],
  // lightningcss folds animation-timeline into the animation shorthand, which Chromium ignores.
  // The whole site's CSS is a few KB: inlining it removes render-blocking requests.
  build: { inlineStylesheets: 'always' },
  vite: { build: { cssMinify: 'esbuild' } },
});
