import { test, expect } from "@playwright/test";

/**
 * Real CRUD verifikatsiyasi — admin tokenni ishlatib backend API'ga
 * POST/PUT/DELETE so'rovlar yuboradi va haqiqiy ma'lumot yaratish/yangilash/o'chirish
 * ishlayotganini tekshiradi.
 *
 * Bu testlar Playwright `request` API'sini ishlatadi (brauzer ishlatmaydi).
 */

const API = "http://127.0.0.1:8000";

let adminToken: string | null = null;

test.beforeAll(async ({ request }) => {
  const res = await request.post(`${API}/api/v1/auth/login`, {
    data: { email: "admin@tdtutf.uz", password: "Admin123456" },
    headers: { Accept: "application/json" },
  });
  expect(res.status()).toBe(200);
  const json = await res.json();
  adminToken = json.data.token;
  expect(adminToken).toBeTruthy();
});

function authHeaders() {
  return {
    Authorization: `Bearer ${adminToken}`,
    Accept: "application/json",
  };
}

test.describe.configure({ mode: "serial" });

test.beforeEach(async () => {
  // Rate limit'dan saqlanish — har test orasida kichik kechikish
  await new Promise((r) => setTimeout(r, 700));
});

test.describe("Banner: full CRUD lifecycle", () => {
  let createdId: number | null = null;

  test("CREATE banner via POST", async ({ request }) => {
    const fd = new FormData();
    fd.append("title[uz]", "Test Banner UZ");
    fd.append("title[ru]", "Тест Баннер RU");
    fd.append("title[en]", "Test Banner EN");
    fd.append("subtitle[uz]", "E2E test sub");
    fd.append("link", "https://example.com");
    fd.append("sort_order", "999");
    fd.append("is_active", "1");

    const res = await request.post(`${API}/api/v1/banners`, {
      headers: authHeaders(),
      multipart: {
        "title[uz]": "Test Banner UZ E2E",
        "title[ru]": "Тест Баннер RU E2E",
        "title[en]": "Test Banner EN E2E",
        "subtitle[uz]": "E2E test sub",
        link: "https://example.com",
        sort_order: "999",
        is_active: "1",
      },
    });
    expect([200, 201]).toContain(res.status());
    const json = await res.json();
    expect(json.success).toBe(true);
    createdId = json.data.id;
    expect(createdId).toBeTruthy();
  });

  test("UPDATE banner via POST + _method=PUT", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.post(`${API}/api/v1/banners/${createdId}`, {
      headers: authHeaders(),
      multipart: {
        _method: "PUT",
        "title[uz]": "UPDATED Banner UZ",
        "title[ru]": "ОБНОВЛЕНО RU",
        "title[en]": "UPDATED EN",
        sort_order: "888",
        is_active: "1",
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.title.uz).toBe("UPDATED Banner UZ");
    expect(Number(json.data.sort_order)).toBe(888);
  });

  test("DELETE banner", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.delete(`${API}/api/v1/banners/${createdId}`, {
      headers: authHeaders(),
    });
    expect([200, 204]).toContain(res.status());
  });
});

test.describe("Partner: full CRUD lifecycle", () => {
  let createdId: number | null = null;

  test("CREATE partner", async ({ request }) => {
    const res = await request.post(`${API}/api/v1/partners`, {
      headers: authHeaders(),
      multipart: {
        name: "E2E Test Partner",
        url: "https://test-partner.com",
        sort_order: "999",
        is_active: "1",
      },
    });
    expect([200, 201]).toContain(res.status());
    const json = await res.json();
    expect(json.success).toBe(true);
    createdId = json.data.id;
  });

  test("UPDATE partner", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.post(`${API}/api/v1/partners/${createdId}`, {
      headers: authHeaders(),
      multipart: {
        _method: "PUT",
        name: "UPDATED E2E Partner",
        sort_order: "888",
        is_active: "0",
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.name).toBe("UPDATED E2E Partner");
    expect(json.data.is_active).toBeFalsy();
  });

  test("DELETE partner", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.delete(`${API}/api/v1/partners/${createdId}`, {
      headers: authHeaders(),
    });
    expect([200, 204]).toContain(res.status());
  });
});

test.describe("Testimonial: full CRUD lifecycle", () => {
  let createdId: number | null = null;

  test("CREATE testimonial", async ({ request }) => {
    const res = await request.post(`${API}/api/v1/testimonials`, {
      headers: authHeaders(),
      multipart: {
        "name[uz]": "Test Talaba",
        "name[ru]": "Тест Студент",
        "name[en]": "Test Student",
        "role[uz]": "Bitiruvchi 2026",
        "role[ru]": "Выпускник 2026",
        "role[en]": "Graduate 2026",
        "text[uz]": "Universitet ajoyib edi!",
        "text[ru]": "Университет был замечательный!",
        "text[en]": "University was amazing!",
        sort_order: "999",
        is_active: "1",
      },
    });
    expect([200, 201]).toContain(res.status());
    const json = await res.json();
    expect(json.success).toBe(true);
    createdId = json.data.id;
  });

  test("UPDATE testimonial", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.post(`${API}/api/v1/testimonials/${createdId}`, {
      headers: authHeaders(),
      multipart: {
        _method: "PUT",
        "name[uz]": "UPDATED Talaba",
        "role[uz]": "UPDATED Lavozim",
        "text[uz]": "UPDATED text",
        sort_order: "888",
        is_active: "1",
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.name.uz).toBe("UPDATED Talaba");
  });

  test("DELETE testimonial", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.delete(`${API}/api/v1/testimonials/${createdId}`, {
      headers: authHeaders(),
    });
    expect([200, 204]).toContain(res.status());
  });
});

test.describe("SiteContent: upsert lifecycle", () => {
  const testKey = `e2e-test-${Date.now()}`;

  test("UPSERT (create) site content", async ({ request }) => {
    const res = await request.put(`${API}/api/v1/site-contents`, {
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      data: {
        key: testKey,
        section: "test",
        type: "text",
        value: { uz: "E2E test value", ru: "Тест значение", en: "Test value" },
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.key).toBe(testKey);
  });

  test("UPSERT (update) same key", async ({ request }) => {
    const res = await request.put(`${API}/api/v1/site-contents`, {
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      data: {
        key: testKey,
        section: "test",
        type: "html",
        value: { uz: "<p>UPDATED</p>", ru: "<p>ОБНОВЛЕНО</p>", en: "<p>UPDATED</p>" },
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.value.uz).toContain("UPDATED");
    expect(json.data.type).toBe("html");
  });

  test("DELETE site content by key", async ({ request }) => {
    const res = await request.delete(`${API}/api/v1/site-contents/${testKey}`, {
      headers: authHeaders(),
    });
    expect([200, 204]).toContain(res.status());
  });
});

test.describe("LibraryResource: full CRUD lifecycle", () => {
  let createdId: number | null = null;

  test("CREATE library resource", async ({ request }) => {
    const res = await request.post(`${API}/api/v1/library-resources`, {
      headers: authHeaders(),
      multipart: {
        "title[uz]": "E2E Test Kitob",
        "title[ru]": "Тест Книга",
        "title[en]": "Test Book",
        "description[uz]": "Test tavsif",
        category: "ichki-kutubxona",
        type: "kitob",
        url: "",
        sort_order: "999",
        is_published: "1",
      },
    });
    expect([200, 201]).toContain(res.status());
    const json = await res.json();
    expect(json.success).toBe(true);
    createdId = json.data.id;
  });

  test("UPDATE library resource", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.post(`${API}/api/v1/library-resources/${createdId}`, {
      headers: authHeaders(),
      multipart: {
        _method: "PUT",
        "title[uz]": "UPDATED Kitob",
        category: "e-library",
        sort_order: "888",
        is_published: "1",
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.title.uz).toBe("UPDATED Kitob");
    expect(json.data.category).toBe("e-library");
  });

  test("DELETE library resource", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.delete(`${API}/api/v1/library-resources/${createdId}`, {
      headers: authHeaders(),
    });
    expect([200, 204]).toContain(res.status());
  });
});

test.describe("JournalIssue: full CRUD lifecycle", () => {
  let createdId: number | null = null;

  test("CREATE journal issue", async ({ request }) => {
    const res = await request.post(`${API}/api/v1/journal-issues`, {
      headers: authHeaders(),
      multipart: {
        "title[uz]": "E2E Jurnal Soni",
        "title[ru]": "Тест Журнал",
        "title[en]": "Test Journal",
        date: "2026-04-30",
        issue_number: "999",
        year: "2026",
        is_current: "0",
        is_published: "1",
        sort_order: "999",
      },
    });
    expect([200, 201]).toContain(res.status());
    const json = await res.json();
    expect(json.success).toBe(true);
    createdId = json.data.id;
  });

  test("UPDATE journal issue", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.post(`${API}/api/v1/journal-issues/${createdId}`, {
      headers: authHeaders(),
      multipart: {
        _method: "PUT",
        "title[uz]": "UPDATED Jurnal",
        date: "2026-05-01",
        issue_number: "999",
        year: "2026",
        is_current: "0",
        is_published: "1",
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.data.title.uz).toBe("UPDATED Jurnal");
  });

  test("DELETE journal issue", async ({ request }) => {
    expect(createdId).toBeTruthy();
    const res = await request.delete(`${API}/api/v1/journal-issues/${createdId}`, {
      headers: authHeaders(),
    });
    expect([200, 204]).toContain(res.status());
  });
});
