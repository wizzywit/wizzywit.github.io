// Renders public/og.png (1200x630): the masthead on newsprint. Run once: node tools/make-og.mjs
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// about:blank cannot load file:// fonts, so embed them.
const font = (pkg, file) =>
  `data:font/woff2;base64,${readFileSync(path.resolve('node_modules/@fontsource', pkg, 'files', file)).toString('base64')}`;
const html = `<!doctype html><meta charset="utf-8"><style>
@font-face{font-family:Display;src:url(${font('libre-caslon-display', 'libre-caslon-display-latin-400-normal.woff2')})}
@font-face{font-family:Ui;font-weight:600;src:url(${font('libre-franklin', 'libre-franklin-latin-600-normal.woff2')})}
@font-face{font-family:Ui;font-weight:400;src:url(${font('libre-franklin', 'libre-franklin-latin-400-normal.woff2')})}
body{margin:0;width:1200px;height:630px;background:#F3F0E8;color:#151412;display:flex;flex-direction:column;justify-content:center;padding:0 72px;box-sizing:border-box;font-family:Ui}
.top{display:flex;justify-content:space-between;font-size:22px;padding:0 0 14px;border-bottom:1px solid #151412}
h1{margin:42px 0 34px;font:400 94px/1 Display;white-space:nowrap;text-align:center;letter-spacing:-0.01em}
.role{padding:16px 0;border-top:3px double #151412;border-bottom:1px solid #151412;text-align:center;font-weight:600;font-size:27px;letter-spacing:.04em}
.foot{margin-top:22px;text-align:center;font-size:22px;color:#57534B}
</style><div class="top"><span>Edition 2026 · Munich area, Germany</span><span>wizzywit.github.io</span></div>
<h1>Wisdom Emmanuel Praise</h1>
<div class="role">Senior Frontend Engineer · Frontend Platform &amp; Architecture</div>
<div class="foot">Selected work · Architecture decisions · Profile</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('wrote public/og.png');
