import { test as setup, expect } from '@playwright/test';
import * as path from 'path';

const authFile = path.join(__dirname, '..', '.auth', 'admin.json');

setup('authenticate admin', async ({ page }) => {
  await page.goto('http://127.0.0.1:3001/login');
  await page.locator('input[type="email"]').fill('admin@tdtutf.uz');
  await page.locator('input[type="password"]').fill('Admin123456');
  await page.getByRole('button', { name: /Tizimga kirish/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  await expect(page).toHaveURL(/\/dashboard/);
  // Give cookie/storage a moment to stabilize
  await page.waitForTimeout(1500);
  // Verify admin-token cookie is set before saving state
  const cookies = await page.context().cookies();
  const adminToken = cookies.find((c) => c.name === 'admin-token');
  if (!adminToken || !adminToken.value) {
    throw new Error('admin-token cookie not found after login');
  }
  console.log('✓ admin-token cookie captured:', adminToken.value.slice(0, 20) + '...');
  await page.context().storageState({ path: authFile });
});
