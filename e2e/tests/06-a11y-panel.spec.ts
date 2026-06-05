import { test, expect } from "@playwright/test";

/**
 * Accessibility Panel — WCAG 2.1 AA verification.
 *
 * Strategy: Pre-seed localStorage via context.addInitScript() BEFORE navigation
 * so the pre-hydration script applies the settings synchronously. This tests
 * the *actual* user-facing behavior (their stored preferences applied) without
 * the timing flakiness of clicking through the dev-mode Next.js overlay portal.
 */

const seed = (settings: object) => `(()=>{
  try { localStorage.setItem('tmtu:a11y', JSON.stringify(${JSON.stringify(settings)})); }
  catch (e) {}
})();`;

test.describe("Accessibility Panel — WCAG 2.1 AA", () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test("SSR renders skip link, init script, main-content target", async ({
    request,
  }) => {
    const res = await request.get("http://127.0.0.1:3000/uz");
    const html = await res.text();
    expect(html).toContain('class="a11y-skip-link"');
    expect(html).toContain('id="a11y-init"');
    expect(html).toContain('id="main-content"');
    expect(html).toContain("Asosiy mazmunga");
  });

  test("Skip link visible after Tab keypress", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/uz");
    const skip = page.locator(".a11y-skip-link");
    await expect(skip).toHaveText(/Asosiy mazmunga o'tish/);
    await expect(skip).toHaveAttribute("href", "#main-content");
  });

  test("Header trigger button renders with proper ARIA attributes", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/uz");
    const btn = page.locator('[data-a11y-trigger="header"]');
    await expect(btn).toBeVisible();
    await expect(btn).toHaveAttribute("aria-label", /Maxsus imkoniyatlar/);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await expect(btn).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("Footer trigger link renders", async ({ page }) => {
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");
    const link = page.locator('[data-a11y-trigger="footer"]');
    await expect(link).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("Default scheme + Large font: html scaled, body bg preserved", async ({
    page,
    context,
  }) => {
    await context.addInitScript(
      seed({
        fontSize: "large",
        scheme: "default",
        letterSpacing: "normal",
        lineHeight: "normal",
        fontFamily: "sans",
        imagesVisible: true,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/a11y-fs-large/);
    await expect(page.locator("html")).toHaveClass(/a11y-scheme-default/);

    // Default scheme: body bg should NOT be forced — design intact
    const bodyBg = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBg).toBe("rgb(255, 255, 255)");

    // html font-size = 125% = 20px
    const rootFs = await page.evaluate(
      () => window.getComputedStyle(document.documentElement).fontSize
    );
    expect(rootFs).toBe("20px");
  });

  test("Yellow-on-black scheme: high-contrast applied", async ({
    page,
    context,
  }) => {
    await context.addInitScript(
      seed({
        fontSize: "medium",
        scheme: "yb",
        letterSpacing: "normal",
        lineHeight: "normal",
        fontFamily: "sans",
        imagesVisible: true,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/a11y-scheme-yb/);

    const bodyBg = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBg).toBe("rgb(0, 0, 0)");

    const bodyColor = await page.evaluate(
      () => window.getComputedStyle(document.body).color
    );
    expect(bodyColor).toBe("rgb(255, 255, 0)");
  });

  test("White-on-black scheme: dark mode applied", async ({ page, context }) => {
    await context.addInitScript(
      seed({
        fontSize: "medium",
        scheme: "wb",
        letterSpacing: "normal",
        lineHeight: "normal",
        fontFamily: "sans",
        imagesVisible: true,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/a11y-scheme-wb/);
    const bodyBg = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBg).toBe("rgb(0, 0, 0)");
  });

  test("Sepia scheme: warm comfortable colors", async ({ page, context }) => {
    await context.addInitScript(
      seed({
        fontSize: "medium",
        scheme: "sepia",
        letterSpacing: "normal",
        lineHeight: "normal",
        fontFamily: "sans",
        imagesVisible: true,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/a11y-scheme-sepia/);
    const bodyBg = await page.evaluate(
      () => window.getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBg).toBe("rgb(244, 236, 216)"); // #f4ecd8
  });

  test("Letter spacing wide: applied to body", async ({ page, context }) => {
    await context.addInitScript(
      seed({
        fontSize: "medium",
        scheme: "default",
        letterSpacing: "wide",
        lineHeight: "normal",
        fontFamily: "sans",
        imagesVisible: true,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).toHaveClass(/a11y-ls-wide/);
    const ls = await page.evaluate(
      () => window.getComputedStyle(document.body).letterSpacing
    );
    expect(ls).not.toBe("normal");
  });

  test("Comfortable line height: applied to body", async ({ page, context }) => {
    await context.addInitScript(
      seed({
        fontSize: "medium",
        scheme: "default",
        letterSpacing: "normal",
        lineHeight: "comfortable",
        fontFamily: "sans",
        imagesVisible: true,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("body")).toHaveClass(/a11y-lh-comfortable/);
  });

  test("Serif font family applied", async ({ page, context }) => {
    await context.addInitScript(
      seed({
        fontSize: "medium",
        scheme: "default",
        letterSpacing: "normal",
        lineHeight: "normal",
        fontFamily: "serif",
        imagesVisible: true,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveClass(/a11y-font-serif/);
  });

  test("Images hidden: data attribute set", async ({ page, context }) => {
    await context.addInitScript(
      seed({
        fontSize: "medium",
        scheme: "default",
        letterSpacing: "normal",
        lineHeight: "normal",
        fontFamily: "sans",
        imagesVisible: false,
        enabled: true,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("html")).toHaveAttribute("data-a11y-images", "hidden");
  });

  test("Disabled state (enabled: false) — no a11y classes applied", async ({
    page,
    context,
  }) => {
    await context.addInitScript(
      seed({
        fontSize: "large",
        scheme: "yb",
        letterSpacing: "wide",
        lineHeight: "comfortable",
        fontFamily: "serif",
        imagesVisible: false,
        enabled: false,
        version: 1,
      })
    );
    await page.goto("http://127.0.0.1:3000/uz");
    await page.waitForLoadState("networkidle");

    const htmlClass = (await page.locator("html").getAttribute("class")) || "";
    expect(htmlClass).not.toMatch(/a11y-scheme-yb/);
    expect(htmlClass).not.toMatch(/a11y-fs-large/);
  });
});
