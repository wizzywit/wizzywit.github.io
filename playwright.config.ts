import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  reporter: [['list']],
  // GitHub's Linux runners block Chromium's sandbox; locally the sandbox stays on.
  use: { baseURL: 'http://localhost:4321', launchOptions: { args: process.env['CI'] ? ['--no-sandbox'] : [] } },
  webServer: {
    command: 'INCLUDE_DRAFTS=1 pnpm build && node tools/serve-dist.mjs 4321',
    url: 'http://localhost:4321/',
    reuseExistingServer: false,
    timeout: 180_000,
  },
  projects: [
    { name: 'default', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'no-js', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, javaScriptEnabled: false } },
    { name: 'reduced-motion', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' } },
    { name: 'mobile-360', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 800 }, reducedMotion: 'reduce' } },
  ],
});
