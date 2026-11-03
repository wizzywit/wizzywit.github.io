import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setTheme } from './helpers/axe';

test.beforeEach(async ({ page }) => {
  await page.goto('/work/');
});

test('has its own title and one h1', async ({ page }) => {
  await expect(page).toHaveTitle(/^Work — Wisdom Emmanuel Praise/);
  await expect(page.locator('h1')).toHaveText('Work');
});

test('marks Work as the current section in the nav', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 1440) <= 900, 'narrow screens use the menu dialog');
  await expect(page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
});

test('lists all twelve entries and links none to #', async ({ page }) => {
  await expect(page.getByRole('listitem').filter({ has: page.locator('.num') })).toHaveCount(12);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.getByText('12 entries', { exact: true })).toBeVisible();
});

test('without JavaScript every entry shows and the filter chips are not offered', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'no-js', 'JavaScript disabled');
  await expect(page.getByRole('listitem').filter({ has: page.locator('.num') })).toHaveCount(12);
  await expect(page.getByRole('button', { name: 'Security' })).toBeHidden();
});

test('filtering narrows the list and announces the count', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'no-js', 'needs JavaScript');
  await page.getByRole('button', { name: 'Security' }).click();
  await expect(page.getByRole('listitem').filter({ has: page.locator('.num') })).toHaveCount(2);
  await expect(page.getByText('2 entries in Security')).toBeVisible();
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.getByText('12 entries', { exact: true })).toBeVisible();
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
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
