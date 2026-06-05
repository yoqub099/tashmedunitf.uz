import { test, expect } from "@playwright/test";
import * as path from "path";

/**
 * Yangi qo'shilgan admin CRUD sahifalarini tekshirish.
 * Banner, Partner, Testimonial, SiteContent, Direction.
 *
 * Auth-setup'dan storage state ishlatadi (admin login sessiyasi).
 */

const ADMIN = "http://127.0.0.1:3001";
const API = "http://127.0.0.1:8000";

const authFile = path.join(__dirname, "..", ".auth", "admin.json");
test.use({ storageState: authFile });

test.describe("Phase 1-5: New Admin CRUDs render after auth", () => {
  test("Bannerlar admin page loads and shows form fields", async ({ page }) => {
    await page.goto(`${ADMIN}/bannerlar`);
    await page.waitForLoadState("networkidle", { timeout: 25000 });
    await expect(page).toHaveURL(/\/bannerlar/);
    // Sarlavha mavjud
    await expect(page.getByText(/Bannerlar boshqaruvi/i)).toBeVisible();
    // "Yangi banner" tugmasi mavjud
    await expect(page.getByRole("button", { name: /Yangi banner/i })).toBeVisible();
  });

  test("Sheriklar admin page loads", async ({ page }) => {
    await page.goto(`${ADMIN}/sheriklar`);
    await page.waitForLoadState("networkidle", { timeout: 25000 });
    await expect(page).toHaveURL(/\/sheriklar/);
    await expect(page.getByText(/Bosh sahifadagi hamkor logolari/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Yangi hamkor/i })).toBeVisible();
  });

  test("Testimoniallar admin page loads", async ({ page }) => {
    await page.goto(`${ADMIN}/testimoniallar`);
    await page.waitForLoadState("networkidle", { timeout: 25000 });
    await expect(page).toHaveURL(/\/testimoniallar/);
    await expect(page.getByText(/Bitiruvchilar va talabalar fikrlari/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Yangi fikr/i })).toBeVisible();
  });

  test("Sayt kontenti admin page loads", async ({ page }) => {
    await page.goto(`${ADMIN}/sayt-kontenti`);
    await page.waitForLoadState("networkidle", { timeout: 25000 });
    await expect(page).toHaveURL(/\/sayt-kontenti/);
    await expect(page.getByText(/Frontenddagi statik matnlar/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Yangi kalit/i })).toBeVisible();
  });

  test("Yo'nalishlar admin page loads", async ({ page }) => {
    await page.goto(`${ADMIN}/abiturientlarga/yo-nalishlar`);
    await page.waitForLoadState("networkidle", { timeout: 25000 });
    await expect(page).toHaveURL(/\/yo-nalishlar/);
    await expect(
      page.getByText(/Bakalavriat, magistratura va ordinatura yo.*nalishlari/i)
    ).toBeVisible();
  });

  test("Kutubxona resurslari admin page loads", async ({ page }) => {
    await page.goto(`${ADMIN}/kutubxona-resurslari`);
    await page.waitForLoadState("networkidle", { timeout: 25000 });
    await expect(page).toHaveURL(/\/kutubxona-resurslari/);
    await expect(page.getByText(/Kitoblar, jurnallar, maqolalar/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Yangi resurs/i })).toBeVisible();
  });

  test("Ilmiy jurnal nashrlar admin page loads", async ({ page }) => {
    await page.goto(`${ADMIN}/ilmiy-jurnal-nashrlar`);
    await page.waitForLoadState("networkidle", { timeout: 25000 });
    await expect(page).toHaveURL(/\/ilmiy-jurnal-nashrlar/);
    await expect(page.getByText(/Jurnal sonlari, PDF fayllari/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Yangi son/i })).toBeVisible();
  });
});

test.describe("Backend API contracts for new CRUDs", () => {
  test("GET /api/v1/banners returns paginated list", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/banners?per_page=5`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
  });

  test("GET /api/v1/partners returns paginated list", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/partners?per_page=5`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data).toBeInstanceOf(Array);
  });

  test("GET /api/v1/testimonials returns list", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/testimonials?per_page=5`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data).toBeInstanceOf(Array);
  });

  test("GET /api/v1/site-contents/hero returns section data", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/site-contents/hero`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test("GET /api/v1/directions returns paginated list", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/directions?per_page=5`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data).toBeInstanceOf(Array);
  });

  test("GET /api/v1/library-resources returns paginated list", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/library-resources?per_page=5`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data).toBeInstanceOf(Array);
  });

  test("GET /api/v1/library-resources/categories returns categories", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/library-resources/categories`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test("GET /api/v1/journal-issues returns paginated list", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/journal-issues?per_page=5`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data).toBeInstanceOf(Array);
  });
});
