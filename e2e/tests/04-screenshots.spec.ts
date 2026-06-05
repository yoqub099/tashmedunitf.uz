import { test } from '@playwright/test';
import * as path from 'path';

const FRONTEND = 'http://127.0.0.1:3000';
const ADMIN = 'http://127.0.0.1:3001';
const authFile = path.join(__dirname, '..', '.auth', 'admin.json');

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1366, height: 768 },
];

for (const vp of viewports) {
  test.describe(`Screenshots — ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test(`homepage ${vp.name}`, async ({ page }) => {
      await page.goto(`${FRONTEND}/uz`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.screenshot({ path: `screenshots/homepage-${vp.name}.png`, fullPage: false });
    });

    test(`news list ${vp.name}`, async ({ page }) => {
      await page.goto(`${FRONTEND}/uz/yangiliklar`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.screenshot({ path: `screenshots/news-${vp.name}.png`, fullPage: false });
    });

    test(`login ${vp.name}`, async ({ page }) => {
      await page.goto(`${ADMIN}/login`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.screenshot({ path: `screenshots/login-${vp.name}.png`, fullPage: false });
    });
  });
}

test.describe('Screenshots — admin dashboard desktop', () => {
  test.use({ storageState: authFile, viewport: { width: 1366, height: 768 } });

  test('dashboard desktop', async ({ page }) => {
    await page.goto(`${ADMIN}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/admin-dashboard.png', fullPage: false });
  });
});
