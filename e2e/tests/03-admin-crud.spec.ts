import { test, expect } from '@playwright/test';
import * as path from 'path';

const ADMIN_URL = 'http://127.0.0.1:3001';
const authFile = path.join(__dirname, '..', '.auth', 'admin.json');

test.use({ storageState: authFile });

test.describe('Admin CRUD UI Flow (authenticated via storageState)', () => {
  test('dashboard loads successfully', async ({ page, context }) => {
    const cookies = await context.cookies();
    const adminCookie = cookies.find((c) => c.name === 'admin-token');
    console.log('[CRUD] Cookie before nav:', adminCookie?.value?.slice(0, 25) || 'MISSING');
    await page.goto(`${ADMIN_URL}/dashboard`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    console.log('[CRUD] URL after nav:', page.url());
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('news list page loads', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/yangiliklar`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/yangiliklar/);
    // Wait briefly for content to render
    await page.waitForTimeout(1000);
    // Look for news-related markers on the page
    const hasNewsText = await page.locator('body').innerText();
    expect(hasNewsText.length).toBeGreaterThan(100);
  });

  test('pages admin loads', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/sahifalar`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/sahifalar/);
  });

  test('faculty list loads', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/biz-haqimizda/tuzilma/fakultetlar`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/fakultetlar/);
  });

  test('department list loads', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/biz-haqimizda/tuzilma/kafedralar`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/kafedralar/);
  });

  test('staff list loads', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/biz-haqimizda/tuzilma/xodimlar`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/xodimlar/);
  });

  test('faq admin loads', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/faq`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/faq/);
  });

  test('contact messages admin loads', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/aloqa`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/aloqa/);
  });
});
