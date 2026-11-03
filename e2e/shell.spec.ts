import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setTheme } from './helpers/axe';

test('skip link is first focusable and moves focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /skip to (main )?content/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#main')).toBeFocused();
});

test('focused links show a 3px focus ring', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const width = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineWidth);
  expect(width).toBe('3px');
});

for (const theme of ['light', 'dark'] as const) {
  test(`front page has no axe violations (${theme})`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'no-js', 'axe needs JavaScript');
    await setTheme(page, theme);
    await page.goto('/');
    await expectNoAxeViolations(page);
  });
}
