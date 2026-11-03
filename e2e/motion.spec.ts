import { expect, test, type Page } from '@playwright/test';

const opacityOf = (page: Page, selector: string) => page.locator(selector).first().evaluate((el) => getComputedStyle(el).opacity);

test('content is fully visible without JavaScript and with reduced motion', async ({ page }, testInfo) => {
  test.skip(!['no-js', 'reduced-motion', 'mobile-360'].includes(testInfo.project.name), 'fallback projects');
  await page.goto('/');
  const opacities = await page.locator('[data-reveal]').evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity));
  expect(opacities.length).toBeGreaterThan(10);
  expect(new Set(opacities)).toEqual(new Set(['1']));
  expect(await page.evaluate(() => document.documentElement.classList.contains('motion'))).toBe(false);
});

test.describe('with motion allowed', () => {
  // eslint-disable-next-line no-empty-pattern
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'default', 'default project allows motion');
  });

  test('text below the fold waits, then reveals as it scrolls into view', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-live'));
    const target = page.locator('.profile [data-reveal]').first();
    expect(await target.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
    await target.scrollIntoViewIfNeeded();
    await expect.poll(() => target.evaluate((el) => getComputedStyle(el).opacity), { timeout: 3000 }).toBe('1');
  });

  test('the headline arrives on its own after load, in sequence', async ({ page }) => {
    await page.goto('/');
    await expect.poll(() => opacityOf(page, '.lead-headline'), { timeout: 3000 }).toBe('1');
    await expect.poll(() => opacityOf(page, '.deck'), { timeout: 3000 }).toBe('1');
  });

  test('the five layers grow in and then a pulse runs through them', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => document.documentElement.classList.contains('motion-live'));
    const bar = page.locator('.bar--accent');
    expect(await bar.evaluate((el) => getComputedStyle(el).transform)).toMatch(/^matrix\(0,/);
    await bar.scrollIntoViewIfNeeded();
    await expect.poll(() => bar.evaluate((el) => getComputedStyle(el).transform), { timeout: 3000 }).toBe('none');
    await expect.poll(() => bar.evaluate((el) => el.getAnimations().some((a) => (a as CSSAnimation).animationName === 'layer-pulse')), { timeout: 5000 }).toBe(true);
  });

  test('the figures count up and land on their exact values', async ({ page }) => {
    await page.goto('/');
    const figures = page.locator('.brief [data-count]');
    await figures.first().scrollIntoViewIfNeeded();
    await expect.poll(() => figures.allTextContents(), { timeout: 4000 }).toEqual(['13', '30+', '10+', '35', '2M+', 'AA']);
    await expect(page.locator('.brief .visually-hidden').first()).toHaveText('13');
  });

  test('if the script never runs, everything is revealed after a few seconds', async ({ page }) => {
    // Astro inlines the small runtime, so drop it from the page itself to simulate it never starting.
    await page.route('**/', async (route) => {
      const response = await route.fetch();
      const html = (await response.text()).replace(/<script type="module"[\s\S]*?<\/script>/g, '');
      await route.fulfill({ response, body: html });
    });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion'))).toBe(true);
    await page.waitForTimeout(4500);
    expect(await page.evaluate(() => document.documentElement.classList.contains('motion'))).toBe(false);
    // The reveal transition itself takes under a second to settle.
    await expect
      .poll(async () => [...new Set(await page.locator('[data-reveal]').evaluateAll((els) => els.map((el) => getComputedStyle(el).opacity)))], { timeout: 3000 })
      .toEqual(['1']);
  });
});
