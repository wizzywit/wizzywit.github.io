import { expect, test } from '@playwright/test';
import { expectNoAxeViolations, setTheme } from './helpers/axe';

test.beforeEach(async ({ page }) => {
  await page.goto('/work/odudu/');
});

test('has a title, one h1 and the project facts', async ({ page }) => {
  await expect(page).toHaveTitle(/Odudu/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('dl.meta')).toContainText('Creator, maintainer');
  await expect(page.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://github.com/wizzywit/odudu');
});

test('describes the MCP server and agent access as part of Odudu', async ({ page }) => {
  await expect(page.getByText(/MCP server/).first()).toBeVisible();
  await expect(page.getByText(/planned|coming soon|not yet/i)).toHaveCount(0);
});

test('the architecture diagram has a text alternative', async ({ page }) => {
  await expect(page.getByRole('img', { name: /Tenant apps and LLM agents connect to Odudu/i })).toBeVisible();
});

test('lists the decisions in this project with real links', async ({ page }) => {
  const links = page.getByRole('complementary', { name: 'Decisions and contact' }).locator('ol a');
  await expect(links).toHaveCount(2);
  for (const href of await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')))) {
    expect(href).toMatch(/^\/decisions\/[a-z-]+\/$/);
  }
  await expect(page.locator('a[href="#"]')).toHaveCount(0);
});

test('draft sections show in preview, with their placeholders flagged for the owner', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'The problem' })).toBeVisible();
});

test('the video can be paused', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'default', 'default project plays video');
  await page.locator('.looping-video').scrollIntoViewIfNeeded();
  const pause = page.getByRole('button', { name: 'Pause animation' });
  await expect(pause).toBeVisible();
  await pause.click();
  await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
});

test('the video does not autoplay with reduced motion', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'reduced-motion', 'reduced-motion project');
  await page.locator('.looping-video').scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Play animation' })).toBeVisible();
  expect(await page.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('the hero screenshot keeps its text alternative in both themes', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    await setTheme(page, theme);
    await page.reload();
    await expect(page.getByRole('img', { name: /admin console: the overview page/i }), theme).toBeVisible();
  }
});

test('does not download the screenshot for the theme that is not showing', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'default', 'default project');
  const fetched: string[] = [];
  page.on('request', (request) => fetched.push(request.url()));
  await setTheme(page, 'light');
  await page.goto('/work/odudu/');
  await page.waitForLoadState('networkidle');
  expect(fetched.filter((url) => /overview-light/.test(url)).length).toBeGreaterThan(0);
  expect(fetched.filter((url) => /overview-dark/.test(url))).toEqual([]);
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

test.describe('the Wired case study', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work/wired/');
  });

  test('has its own title, one h1, the project facts and a source link', async ({ page }) => {
    await expect(page).toHaveTitle(/Wired/);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('dl.meta')).toContainText('Creator');
    await expect(page.getByRole('link', { name: 'Source' })).toHaveAttribute('href', 'https://github.com/wizzywit/wired');
  });

  test('shows real screenshots of the product, with descriptions, that load', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'no-js', 'images are verified with JavaScript on');
    await expect(page.getByRole('img', { name: /Wired's landing page/ })).toBeVisible();
    for (const name of [/studio dashboard/, /six coloured sticky notes/]) {
      const img = page.getByRole('img', { name });
      await img.scrollIntoViewIfNeeded();
      await expect(img).toBeVisible();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    }
  });

  test('links the decisions behind it', async ({ page }) => {
    const links = page.getByRole('complementary', { name: 'Decisions and contact' }).locator('ol a');
    expect(await links.evaluateAll((els) => els.map((el) => el.getAttribute('href')))).toEqual(['/decisions/crdt-over-locks/', '/decisions/five-layers/']);
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
});
