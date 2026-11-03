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

test('lists all fifteen entries and links none to #', async ({ page }) => {
  await expect(page.getByRole('listitem').filter({ has: page.locator('.num') })).toHaveCount(15);
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
  await expect(page.getByText('15 entries', { exact: true })).toBeVisible();
});

test('without JavaScript every entry shows and the filter chips are not offered', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'no-js', 'JavaScript disabled');
  await expect(page.getByRole('listitem').filter({ has: page.locator('.num') })).toHaveCount(15);
  await expect(page.getByRole('button', { name: 'Security' })).toBeHidden();
});

test('filtering narrows the list and announces the count', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'no-js', 'needs JavaScript');
  await page.getByRole('button', { name: 'Security' }).click();
  await expect(page.getByRole('listitem').filter({ has: page.locator('.num') })).toHaveCount(2);
  await expect(page.getByText('2 entries in Security')).toBeVisible();
  await page.getByRole('button', { name: 'All' }).click();
  await expect(page.getByText('15 entries', { exact: true })).toBeVisible();
});

test('entries with pictures show described thumbnails that actually load', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'no-js', 'images are verified with JavaScript on');
  const thumbs = page.locator('img.thumb');
  expect(await thumbs.count()).toBe(7);
  for (const alt of await thumbs.evaluateAll((els) => els.map((el) => el.getAttribute('alt')))) expect(alt?.length ?? 0).toBeGreaterThan(10);
  await page.locator('img.thumb').last().scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  expect(await thumbs.evaluateAll((els) => els.filter((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth === 0).length)).toBe(0);
});

test('links the real destinations: case studies, repositories and live sites', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Wired' })).toHaveAttribute('href', '/work/wired/');
  await expect(page.getByRole('link', { name: 'Odudu' })).toHaveAttribute('href', '/work/odudu/');
  await expect(page.getByRole('link', { name: /VREG/ })).toHaveAttribute('href', 'https://vreg.gov.ng');
  await expect(page.getByRole('link', { name: 'WebSuckIt' })).toHaveAttribute('href', 'https://github.com/WebSuckIt');
});

test('linked entries say where they go, in words, and unlinked ones stay quiet', async ({ page }) => {
  await expect(page.getByText('Read the case study →').first()).toBeVisible();
  await expect(page.getByText('Visit the site ↗').first()).toBeVisible();
  await expect(page.getByText('View on GitHub ↗').first()).toBeVisible();
  const unlinked = page.locator('li.row:not(.row--link)').first();
  await expect(unlinked.locator('.cta')).toHaveCount(0);
});

test('the whole row opens the entry, not just the title', async ({ page }) => {
  // A real mouse click on the summary text, which the row's stretched link covers.
  const summary = page.locator('li.row', { hasText: 'Wired' }).first().locator('.summary');
  await summary.scrollIntoViewIfNeeded();
  const box = await summary.boundingBox();
  await page.mouse.click(box!.x + 12, box!.y + box!.height / 2);
  await expect(page).toHaveURL(/\/work\/wired\/$/);
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
