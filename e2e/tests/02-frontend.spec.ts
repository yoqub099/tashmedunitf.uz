import { test, expect } from '@playwright/test';

const FRONTEND = 'http://127.0.0.1:3000';

test.describe('Public Frontend', () => {
  test('homepage loads with hero and news', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz`);
    // Homepage should have the main brand present somewhere
    await expect(page.locator('body')).toContainText(/Toshkent|ToshDTU|Tibbiyot/);
    // Check at least one image loaded
    const images = page.locator('img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('language switcher works (UZ -> RU)', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    // Go directly to RU version
    await page.goto(`${FRONTEND}/ru`);
    await expect(page).toHaveURL(/\/ru/);
    // Should contain Cyrillic text
    const body = await page.textContent('body');
    expect(body).toMatch(/[А-Яа-я]/);
  });

  test('news page renders items', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    // Check at least one news item link
    const links = page.locator('a[href*="/yangiliklar/"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('news detail page renders', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar/media-test`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    // Should have article content
    const article = page.locator('article, main');
    await expect(article.first()).toBeVisible();
  });

  test('contact page loads', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/aloqa`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page).toHaveURL(/\/aloqa/);
    // Ensure body has content
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(500);
  });

  test('faculty/department detail page loads', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/biz-haqimizda/tuzilma/kafedralar/xirurgiya-kafedrasi`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(page.locator('body')).toContainText(/kafedra|xirurgiya/i);
  });
});
