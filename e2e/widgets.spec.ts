import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './helpers/axe';

test('desktop shows the section nav with the current page marked and no Menu', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'default', 'desktop layout');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav.getByRole('link')).toHaveCount(5);
  await expect(nav.getByRole('link', { name: 'Front page' })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('summary', { hasText: 'Menu' })).toBeHidden();
});

test('without JavaScript the section links are reachable', async ({ page, viewport }, testInfo) => {
  test.skip(testInfo.project.name !== 'no-js', 'JavaScript disabled');
  await page.goto('/');
  expect(viewport?.width).toBeGreaterThan(900);
  const nav = page.getByRole('navigation', { name: 'Sections' }).filter({ visible: true });
  await expect(nav.getByRole('link')).toHaveCount(5);
});

test.describe('narrow screens', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 1440) > 900, 'narrow viewport only');

  test('a native Menu disclosure replaces the static nav', async ({ page }) => {
    await page.goto('/');
    const summary = page.locator('summary', { hasText: 'Menu' });
    await expect(summary).toBeVisible();
    await expect(page.locator('header .sections')).toBeHidden();
    await expect(page.locator('details.menu nav a').first()).toBeHidden();
    await summary.click();
    const links = page.locator('details.menu nav a');
    await expect(links).toHaveCount(5);
    await expect(links.first()).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test('the Menu opens from the keyboard', async ({ page }) => {
    await page.goto('/work/');
    await page.locator('summary', { hasText: 'Menu' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('details.menu')).toHaveAttribute('open', '');
    await expect(page.locator('details.menu nav a[aria-current="page"]')).toHaveText('Work');
  });

  test('the layout does not shift when the page becomes interactive', async ({ page }) => {
    await page.goto('/');
    const top = await page.locator('main').evaluate((el) => el.getBoundingClientRect().top);
    await page.waitForLoadState('networkidle');
    await page.locator('.theme-toggle[data-ready="true"]').first().waitFor();
    const settled = await page.locator('main').evaluate((el) => el.getBoundingClientRect().top);
    expect(settled).toBe(top);
  });

  test('the page does not scroll sideways', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
