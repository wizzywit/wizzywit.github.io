import { expect, test } from '@playwright/test';

test.describe('theme switch', () => {
  // Playwright requires an object pattern as the first argument.
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'default', 'needs JavaScript and motion defaults');
  });

  test('a dark choice persists across reloads', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Night edition' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Night edition', pressed: true })).toBeVisible();
  });

  test('the stored theme applies before any JavaScript bundle runs', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('wep-theme', 'dark'));
    await page.route('**/*.js', (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('blocked storage falls back quietly and the toggle still works', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new DOMException('blocked', 'SecurityError'); };
      Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); };
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Night edition' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(errors).toEqual([]);
  });

  test('an invalid stored value is ignored', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('wep-theme', 'purple'));
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Night edition', pressed: false })).toBeVisible();
  });
});
