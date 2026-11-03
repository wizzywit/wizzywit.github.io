import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setTheme } from './helpers/axe';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('has a title, a description and exactly one h1 with the name', async ({ page }) => {
  await expect(page).toHaveTitle(/Wisdom Emmanuel Praise/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /frontend platform and architecture/i);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('Wisdom Emmanuel Praise');
});

test('states the role above the fold', async ({ page }) => {
  await expect(page.getByText('Senior Frontend Engineer · Frontend Platform & Architecture · 7+ years')).toBeInViewport();
});

test('shows every section with real content', async ({ page }) => {
  for (const name of ['In brief', 'Situations wanted', 'Selected work', 'From the decision log', 'Profile']) {
    await expect(page.getByRole('heading', { name })).toBeVisible();
  }
  await expect(page.locator('dl dt')).toHaveCount(6);
});

test('links to the right places and never to #', async ({ page }) => {
  await expect(page.getByRole('link', { name: 'Write to me' }).first()).toHaveAttribute('href', '/contact/');
  await expect(page.getByRole('link', { name: /Read the decision/ })).toHaveAttribute('href', '/decisions/five-layers/');
  await expect(page.getByRole('link', { name: /Odudu: a multi-tenant identity provider/ })).toHaveAttribute('href', '/work/odudu/');
  await expect(page.getByRole('link', { name: /Wired: an infinite canvas/ })).toHaveAttribute('href', 'https://github.com/wizzywit/wired');
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

test('carries no placeholder text', async ({ page }) => {
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/\[[^\]]+\]/);
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
