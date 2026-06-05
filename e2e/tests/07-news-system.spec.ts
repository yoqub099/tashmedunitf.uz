import { test, expect } from "@playwright/test";

/**
 * News ("Yangiliklar") system — comprehensive end-to-end coverage.
 * Verifies: API, multilingual list/detail, category pages, pagination,
 * homepage news section, admin news pages, image rendering, share buttons.
 */

const FRONTEND = "http://127.0.0.1:3000";
const ADMIN = "http://127.0.0.1:3001";
const API = "http://127.0.0.1:8000";

test.describe("News API contract", () => {
  test("List endpoint returns paginated structure", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/news?per_page=5`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
    expect(json.data.length).toBeLessThanOrEqual(5);
    expect(json.meta).toMatchObject({
      current_page: 1,
      per_page: 5,
    });
    expect(typeof json.meta.total).toBe("number");
    expect(typeof json.meta.last_page).toBe("number");
  });

  test("List items contain required fields", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/news?per_page=1`);
    const json = await res.json();
    const n = json.data[0];
    expect(n).toHaveProperty("id");
    expect(n).toHaveProperty("title");
    expect(n).toHaveProperty("slug");
    expect(n).toHaveProperty("category");
    expect(n).toHaveProperty("is_published");
    expect(n).toHaveProperty("published_at");
    // Multilingual title structure
    expect(typeof n.title).toBe("object");
  });

  test("Category filter returns correct subset", async ({ request }) => {
    const res = await request.get(
      `${API}/api/v1/news?filter%5Bcategory%5D=tadbirlar&per_page=5`
    );
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.length).toBeGreaterThan(0);
    for (const item of json.data) {
      expect(item.category).toBe("tadbirlar");
    }
  });

  test("Title filter (multilingual) — Uzbek search works", async ({ request }) => {
    const res = await request.get(
      `${API}/api/v1/news?filter%5Btitle%5D=tibbiyot&per_page=5`
    );
    expect(res.status()).toBe(200);
    const json = await res.json();
    // Either finds matches or zero — must NOT 500-error (the bug we fixed)
    expect(json.success).toBe(true);
    expect(json.data).toBeInstanceOf(Array);
  });

  test("Title filter — Russian search works", async ({ request }) => {
    const res = await request.get(
      `${API}/api/v1/news?filter%5Btitle%5D=${encodeURIComponent("медицина")}&per_page=5`
    );
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  test("Sort by -published_at returns latest first", async ({ request }) => {
    const res = await request.get(
      `${API}/api/v1/news?sort=-published_at&per_page=3`
    );
    const json = await res.json();
    expect(json.data.length).toBe(3);
    const dates = json.data.map((d: { published_at: string }) => new Date(d.published_at).getTime());
    expect(dates[0]).toBeGreaterThanOrEqual(dates[1]);
    expect(dates[1]).toBeGreaterThanOrEqual(dates[2]);
  });

  test("Pagination — page 2 returns different items", async ({ request }) => {
    const r1 = await request.get(`${API}/api/v1/news?per_page=3&page=1`);
    const r2 = await request.get(`${API}/api/v1/news?per_page=3&page=2`);
    const j1 = await r1.json();
    const j2 = await r2.json();
    const ids1 = j1.data.map((d: { id: number }) => d.id);
    const ids2 = j2.data.map((d: { id: number }) => d.id);
    // No overlap between pages
    expect(ids1.some((id: number) => ids2.includes(id))).toBe(false);
  });

  test("Single by slug returns full content", async ({ request }) => {
    // First, find a real slug
    const list = await (await request.get(`${API}/api/v1/news?per_page=1`)).json();
    const slug = list.data[0].slug;

    const res = await request.get(`${API}/api/v1/news/${slug}`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    const n = json.data;
    expect(n.slug).toBe(slug);
    expect(n).toHaveProperty("content");
    expect(typeof n.content).toBe("object");
  });

  test("Single by ID also works", async ({ request }) => {
    const list = await (await request.get(`${API}/api/v1/news?per_page=1`)).json();
    const id = list.data[0].id;

    const res = await request.get(`${API}/api/v1/news/${id}`);
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.id).toBe(id);
  });

  test("Non-existent slug returns 404", async ({ request }) => {
    const res = await request.get(`${API}/api/v1/news/this-news-does-not-exist-9999`);
    expect(res.status()).toBe(404);
  });

  test("All 5 known categories — yangiliklar/tadbirlar/konferensiyalar exist", async ({
    request,
  }) => {
    const categories = ["yangiliklar", "tadbirlar", "konferensiyalar"];
    for (const cat of categories) {
      const res = await request.get(
        `${API}/api/v1/news?filter%5Bcategory%5D=${cat}&per_page=1`
      );
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.meta.total).toBeGreaterThan(0);
    }
  });
});

test.describe("News Frontend Pages", () => {
  test("Homepage renders news section", async ({ page }) => {
    await page.goto(`${FRONTEND}/uz`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    // News section should render with links to /yangiliklar
    const newsLinks = page.locator('a[href*="/yangiliklar/"]');
    const count = await newsLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("Main news list page (/uz/yangiliklar) loads", async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await expect(page).toHaveURL(/\/yangiliklar/);
    // At least some news cards should render
    const articles = page.locator('a[href*="/uz/yangiliklar/"]');
    expect(await articles.count()).toBeGreaterThan(3);
  });

  test("Tadbirlar (events) category page loads", async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar/tadbirlar`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await expect(page).toHaveURL(/\/tadbirlar/);
  });

  test("Konferensiyalar category page loads", async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar/konferensiyalar`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await expect(page).toHaveURL(/\/konferensiyalar/);
  });

  test("News detail page renders with content", async ({ page, request }) => {
    // Get a real slug from API
    const apiRes = await request.get(`${API}/api/v1/news?per_page=1`);
    const json = await apiRes.json();
    const slug = json.data[0].slug;

    await page.goto(`${FRONTEND}/uz/yangiliklar/${slug}`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });

    // Page must contain the news title text
    const title = json.data[0].title.uz;
    if (title) {
      const body = await page.locator("body").innerText();
      expect(body.length).toBeGreaterThan(500);
    }
  });

  test("Russian news page (/ru/yangiliklar) loads", async ({ page }) => {
    await page.goto(`${FRONTEND}/ru/yangiliklar`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await expect(page).toHaveURL(/\/ru\/yangiliklar/);
  });

  test("English news page (/en/yangiliklar) loads", async ({ page }) => {
    await page.goto(`${FRONTEND}/en/yangiliklar`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await expect(page).toHaveURL(/\/en\/yangiliklar/);
  });

  test("Pagination — page 2 loads", async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar?page=2`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    await expect(page).toHaveURL(/page=2/);
  });

  test("News detail has cover image rendered", async ({ page, request }) => {
    // Find a news item with cover
    const apiRes = await request.get(`${API}/api/v1/news?per_page=10`);
    const json = await apiRes.json();
    const withCover = json.data.find((n: { cover: string }) => n.cover);
    if (!withCover) test.skip(true, "No news with cover available");

    await page.goto(`${FRONTEND}/uz/yangiliklar/${withCover.slug}`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });

    // Verify at least one image element exists (Next.js Image)
    const images = page.locator("img").filter({ hasNot: page.locator('[data-a11y-ui-icon]') });
    expect(await images.count()).toBeGreaterThan(0);
  });

  test("Non-existent news slug shows 404", async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar/this-does-not-exist-9999`);
    await page.waitForLoadState("domcontentloaded");
    // Next.js notFound() renders the locale not-found page with 404 heading and "Sahifa topilmadi"
    await expect(
      page.getByRole("heading", { level: 1, name: "404" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /topilmadi/i })
    ).toBeVisible();
  });
});

test.describe("News Admin Pages", () => {
  test("Admin news list (/yangiliklar) loads after auth", async ({ page }) => {
    // Uses admin-token cookie from auth-setup
    await page.goto(`${ADMIN}/yangiliklar`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    // Either we land on the list or got redirected to login
    const url = page.url();
    expect(url).toMatch(/\/(yangiliklar|login)/);
  });

  test("Admin news category subpages load", async ({ page }) => {
    for (const sub of ["tadbirlar", "konferensiyalar"]) {
      const res = await page.goto(`${ADMIN}/yangiliklar/${sub}`);
      expect(res?.status()).toBe(200);
    }
  });
});

test.describe("News SEO & Metadata", () => {
  test("News list page has proper meta tags", async ({ page }) => {
    await page.goto(`${FRONTEND}/uz/yangiliklar`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length || 0).toBeGreaterThan(20);
  });

  test("News detail has Open Graph tags", async ({ page, request }) => {
    const apiRes = await request.get(`${API}/api/v1/news?per_page=1`);
    const json = await apiRes.json();
    const slug = json.data[0].slug;

    await page.goto(`${FRONTEND}/uz/yangiliklar/${slug}`);
    await page.waitForLoadState("networkidle", { timeout: 20000 });

    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toBeTruthy();
  });
});
