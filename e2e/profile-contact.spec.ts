import { existsSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setTheme } from './helpers/axe';

const EMPLOYERS = ['Censhare GmbH', 'Agile Robots SE', 'FYEO Inc', 'Outsource Global Technologies', 'Access Solutions Ltd'];

test.describe('profile', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile/');
  });

  test('has one h1 and lists every résumé employer in order', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('Senior Frontend Engineer');
    const orgs = await page.locator('.job .org').allTextContents();
    expect(orgs).toEqual(EMPLOYERS);
  });

  test('shows skills, education, languages and work authorisation as indexable text', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Toolbox' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
    await expect(page.locator('main')).toContainText('Federal University of Technology, Minna');
    await expect(page.locator('main')).toContainText('Niederlassungserlaubnis');
  });

  test('offers the CV PDF only once the owner has supplied public/cv.pdf', async ({ page }) => {
    const link = page.getByRole('link', { name: /Download CV/ });
    if (existsSync('public/cv.pdf')) {
      await expect(link).toHaveAttribute('href', '/cv.pdf');
    } else {
      await expect(link).toHaveCount(0);
    }
  });

  test('never shows placeholders or dead links', async ({ page }) => {
    expect(await page.locator('body').innerText()).not.toMatch(/\[[^\]]+\]/);
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

test.describe('contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/');
  });

  test('offers exactly the résumé email as a mailto link', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Write to me');
    const mailto = page.locator('a[href^="mailto:"]');
    await expect(mailto.first()).toHaveAttribute('href', 'mailto:wisdompraise968@gmail.com');
    const hrefs = new Set(await mailto.evaluateAll((els) => els.map((el) => el.getAttribute('href'))));
    expect([...hrefs]).toEqual(['mailto:wisdompraise968@gmail.com']);
  });

  test('links LinkedIn, GitHub and GitLab and has no form or fake response promise', async ({ page }) => {
    await expect(page.getByRole('link', { name: /linkedin.com\/in\/wisdom-praise/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /github.com\/wizzywit/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /gitlab.com\/wizzywit/ })).toBeVisible();
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText(/working days/i);
  });

  test('has no axe violations in light and dark', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'no-js', 'axe needs JavaScript');
    for (const theme of ['light', 'dark'] as const) {
      await setTheme(page, theme);
      await page.reload();
      await expectNoAxeViolations(page);
    }
  });
});

test.describe('404', () => {
  test('an unknown path returns the styled correction page, not indexed', async ({ page }) => {
    const response = await page.goto('/no/such/page/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText('This page was never printed.');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const ways = page.getByRole('navigation', { name: 'Ways back' }).getByRole('link');
    expect(await ways.allTextContents()).toEqual(['Front page', 'All work', 'Contact']);
  });

  test('the 404 page has no axe violations', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'no-js', 'axe needs JavaScript');
    await page.goto('/no/such/page/');
    await expectNoAxeViolations(page);
  });
});
