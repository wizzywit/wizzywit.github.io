import { expect, test } from '@playwright/test';

const SITE = 'https://wizzywit.github.io';
const ROUTES = ['/', '/work/', '/work/odudu/', '/decisions/', '/decisions/one-runtime/', '/profile/', '/contact/'];

// Playwright requires an object pattern as the first argument.
// eslint-disable-next-line no-empty-pattern
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== 'default', 'metadata does not depend on viewport or motion');
});

test('every page has a unique title, a canonical URL and share tags', async ({ page }) => {
  const titles: string[] = [];
  for (const route of ROUTES) {
    await page.goto(route);
    const title = await page.title();
    expect(title.length, route).toBeGreaterThan(10);
    titles.push(title);
    await expect(page.locator('link[rel="canonical"]'), route).toHaveAttribute('href', `${SITE}${route}`);
    await expect(page.locator('meta[property="og:image"]'), route).toHaveAttribute('content', `${SITE}/og.png`);
    await expect(page.locator('meta[property="og:url"]'), route).toHaveAttribute('content', `${SITE}${route}`);
    await expect(page.locator('meta[name="twitter:card"]'), route).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="description"]'), route).toHaveAttribute('content', /.{40,}/);
    await expect(page.locator('meta[name="robots"]'), route).toHaveCount(0);
  }
  expect(new Set(titles).size).toBe(titles.length);
});

async function jsonLdTypes(page: import('@playwright/test').Page): Promise<string[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((text) => (JSON.parse(text) as { '@type': string })['@type']);
}

test('structured data matches each page', async ({ page }) => {
  await page.goto('/');
  expect(await jsonLdTypes(page)).toEqual(['Person', 'WebSite']);
  await page.goto('/profile/');
  expect(await jsonLdTypes(page)).toEqual(['ProfilePage', 'Person']);
  await page.goto('/decisions/one-runtime/');
  expect(await jsonLdTypes(page)).toEqual(['TechArticle']);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
});

test('the person data never exposes the email address', async ({ page }) => {
  await page.goto('/');
  const text = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('');
  expect(text).not.toContain('@gmail.com');
});

test('sitemap, robots, feed and share assets are served', async ({ request }) => {
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  expect(await index.text()).toContain('sitemap-0.xml');

  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const route of ROUTES) expect(sitemap, route).toContain(`${SITE}${route}`);
  expect(sitemap).not.toContain('/404');
  expect(sitemap).not.toContain('/odudu/docs');

  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain(`Sitemap: ${SITE}/sitemap-index.xml`);

  const feed = await request.get('/rss.xml');
  expect(feed.headers()['content-type']).toContain('xml');
  expect(await feed.text()).toContain('/decisions/five-layers/');

  const og = await request.get('/og.png');
  expect(og.headers()['content-type']).toBe('image/png');
  expect((await request.get('/favicon.svg')).status()).toBe(200);
});

test('the 404 page is kept out of the index', async ({ page }) => {
  await page.goto('/definitely/missing/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});
