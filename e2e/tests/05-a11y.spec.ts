import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const FRONTEND = 'http://127.0.0.1:3000';
const ADMIN = 'http://127.0.0.1:3001';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test('frontend homepage has no critical violations', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const critical = results.violations.filter((v) => v.impact === 'critical');
    if (critical.length > 0) {
      console.log('CRITICAL A11Y ISSUES:', JSON.stringify(critical.map((v) => ({ id: v.id, help: v.help })), null, 2));
    }
    expect(critical).toEqual([]);
  });

  test('news page has no critical violations', async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    expect(critical).toEqual([]);
  });

  test('admin login page has no critical violations', async ({ page }) => {
    await page.goto(`${ADMIN}/login`);
    await page.waitForLoadState('networkidle', { timeout: 15000 });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    const critical = results.violations.filter((v) => v.impact === 'critical');
    if (critical.length > 0) {
      console.log('LOGIN A11Y:', JSON.stringify(critical.map((v) => ({ id: v.id, help: v.help })), null, 2));
    }
    expect(critical).toEqual([]);
  });
});
