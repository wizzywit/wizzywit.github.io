import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setTheme } from './helpers/axe';

test.describe('decision log', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/decisions/');
  });

  test('lists the decisions in numeric order, each linking to its record', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('The decision log');
    const numbers = await page.locator('ol .no').allTextContents();
    expect(numbers).toEqual(['ADR 01', 'ADR 02', 'ADR 03', 'ADR 04', 'ADR 05', 'ADR 06']);
    await expect(page.getByRole('link', { name: 'One feature, five layers' })).toHaveAttribute('href', '/decisions/five-layers/');
    await expect(page.locator('a[href="#"]')).toHaveCount(0);
  });

  test('has no axe violations in light and dark', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'no-js', 'axe needs JavaScript');
    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      await page.reload();
      await expectNoAxeViolations(page);
    }
  });

  test('does not scroll sideways', async ({ page }) => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});

test.describe('a single decision', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/decisions/one-runtime/');
  });

  test('has its own title, one h1 and the record details', async ({ page }) => {
    await expect(page).toHaveTitle(/ADR 02/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('complementary', { name: 'Record details' })).toContainText('Accepted');
  });

  test('the table of contents jumps to real sections', async ({ page }) => {
    const toc = page.getByRole('navigation', { name: 'On this page' }).getByRole('link');
    expect(await toc.allTextContents()).toEqual(['Context', 'Options', 'Decision', 'Consequences']);
    for (const id of ['context', 'options', 'decision', 'consequences']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test('options sit in a table with headers and say in words which was rejected', async ({ page }) => {
    await expect(page.locator('thead th[scope="col"]')).toHaveCount(3);
    await expect(page.locator('tbody th[scope="row"]')).toHaveCount(3);
    await expect(page.locator('tbody')).toContainText('(rejected)');
    await expect(page.locator('tbody')).toContainText('(chosen)');
  });

  test('draws the import-map diagram with a text alternative', async ({ page }) => {
    await expect(page.getByRole('img', { name: /thirty micro-frontend tiles/i })).toBeVisible();
  });

  test('has no axe violations in light and dark', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'no-js', 'axe needs JavaScript');
    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      await page.reload();
      await expectNoAxeViolations(page);
    }
  });

  test('does not scroll sideways', async ({ page }) => {
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});

test('an unknown decision is a 404', async ({ page }) => {
  const response = await page.goto('/decisions/does-not-exist/');
  expect(response?.status()).toBe(404);
});
