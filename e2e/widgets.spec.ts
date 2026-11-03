import { expect, test } from '@playwright/test';
import { expectNoAxeViolations } from './helpers/axe';

test('desktop shows the section nav with the current page marked and no menu button', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'default', 'desktop layout');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav.getByRole('link')).toHaveCount(5);
  await expect(nav.getByRole('link', { name: 'Front page' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
});

test('without JavaScript every section link stays visible and no menu button appears', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'no-js', 'JavaScript disabled');
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav.getByRole('link')).toHaveCount(5);
  await expect(nav.getByRole('link').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeHidden();
});

test.describe('narrow screens', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 1440) > 900, 'narrow viewport only');

  test('the Menu button replaces the static nav and opens a dialog', async ({ page }) => {
    await page.goto('/');
    const menu = page.getByRole('button', { name: 'Open menu' });
    await expect(menu).toBeVisible();
    await expect(page.locator('header .sections')).toBeHidden();
    await menu.click();
    const dialog = page.getByRole('dialog', { name: 'Site menu' });
    await expect(dialog.getByRole('navigation').getByRole('link')).toHaveCount(5);
    await expectNoAxeViolations(page);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(menu).toBeFocused();
  });

  test('the page does not scroll sideways', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
