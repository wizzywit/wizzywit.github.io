import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://wizzywit.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
});
