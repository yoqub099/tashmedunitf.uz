import { test, expect } from '@playwright/test';

const ADMIN_URL = 'http://127.0.0.1:3001';

test.describe('Admin Login Flow', () => {
  test('redirects root to /login when unauthenticated', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/`);
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders all elements', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`);
    await expect(page.getByRole('heading', { name: /Xush kelibsiz/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Tizimga kirish/i })).toBeVisible();
  });

  test('shows email validation error on invalid format', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`);
    await page.locator('input[type="email"]').fill('not-an-email');
    await page.locator('input[type="password"]').fill('somepass');
    await page.locator('input[type="email"]').blur();
    // Validation should trigger on blur
    await expect(page.getByText(/Email formati/i)).toBeVisible({ timeout: 3000 });
  });

  test('remember me checkbox persists email', async ({ page, context }) => {
    await page.goto(`${ADMIN_URL}/login`);
    await page.locator('input[type="email"]').fill('admin@tdtutf.uz');
    await page.locator('input[type="password"]').fill('Admin123456');
    await page.locator('input[type="checkbox"]').check();
    await page.getByRole('button', { name: /Tizimga kirish/i }).click();
    // Wait for navigation
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto(`${ADMIN_URL}/login`);
    await page.locator('input[type="email"]').fill('admin@tdtutf.uz');
    await page.locator('input[type="password"]').fill('Admin123456');
    await page.getByRole('button', { name: /Tizimga kirish/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
