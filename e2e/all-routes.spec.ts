import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setTheme } from './helpers/axe';

const ROUTES = ['/', '/work/', '/work/odudu/', '/decisions/', '/decisions/one-runtime/', '/profile/', '/contact/', '/no/such/page/'];

test.describe('reflow at 320 CSS px (WCAG 1.4.10)', () => {
  test.use({ viewport: { width: 320, height: 700 } });
  // Playwright requires an object pattern as the first argument.
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'default', 'viewport is set here');
  });

  for (const route of ROUTES) {
    test(`${route} has no sideways scroll and no axe violations in either theme`, async ({ page }) => {
      for (const theme of ['light', 'dark'] as const) {
        await setTheme(page, theme);
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, `${route} (${theme})`).toBeLessThanOrEqual(0);
        await expectNoAxeViolations(page);
      }
    });
  }
});
