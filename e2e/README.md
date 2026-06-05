# E2E Tests — Playwright

Brauzerda haqiqiy foydalanuvchi flow'larini avtomatik test qiladi.

## Talablar
Servislar ishlab turishi kerak:
- Backend: `http://127.0.0.1:8000`
- Frontend: `http://127.0.0.1:3000`
- Admin: `http://127.0.0.1:3001`

## Ishga tushirish

```bash
# Birinchi marta o'rnatish
npm install
npx playwright install chromium

# Barcha testlarni yuglash
npx playwright test

# Bitta test faylini yuglash
npx playwright test tests/01-login.spec.ts

# Brauzerni ko'rib turish (debug uchun)
npx playwright test --headed

# HTML hisobot ochish
npx playwright show-report report
```

## Test tarkibi

| Fayl | Nima tekshiradi | Test soni |
|------|-----------------|-----------|
| `auth-setup.ts` | Admin login va cookie saqlash | 1 (setup) |
| `01-login.spec.ts` | Login flow, validatsiya, redirect | 5 |
| `02-frontend.spec.ts` | Public sahifalar, til almashtirish | 6 |
| `03-admin-crud.spec.ts` | Admin dashboard, CRUD sahifalar | 8 |
| `04-screenshots.spec.ts` | Mobile/tablet/desktop screenshot | 10 |

**Jami: 30 test**

## Muhim fayllar

- `playwright.config.ts` — konfiguratsiya
- `global-setup.ts` — Laravel cache tozalash (rate limit reset)
- `.auth/admin.json` — saqlangan login token (git'ga tushmaydi)
- `screenshots/` — visual verification rasmlar (git'ga tushmaydi)

## Natijalar

- 30/30 PASS ✅
- Topilgan va tuzatilgan buglar:
  1. CORS preflight fail (127.0.0.1 origin)
  2. Multi-session logout (every login deleted all tokens)
  3. XSS in 2 admin components
  4. Production build Suspense issue

## CI'da ishlatish

GitHub Actions workflow'ga qo'shish mumkin:
```yaml
- run: cd e2e_tests && npm ci && npx playwright install --with-deps chromium
- run: cd e2e_tests && npx playwright test
```
