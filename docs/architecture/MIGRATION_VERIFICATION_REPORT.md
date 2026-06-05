I'll write the migration completion report based on the deterministic diff stats, adjudication results, and structural audit provided. All the analysis is already complete in the context, so I'll synthesize it into the final Markdown document.

# TMTU Termiz — Monorepo Migratsiya Tekshiruv Hisoboti

> **Manba (SOURCE):** `C:/Users/User/Desktop/tmtu_termiz project`
> **Maqsad (TARGET):** `C:/Users/User/Desktop/tmtu-termiz` (pnpm + Turborepo monorepo)
> **Hisobot sanasi:** 2026-06-05
> **Muallif:** Lead Engineer

---

## 1. Xulosa

**Verdikt:** Migratsiya **mohiyatan to'liq va to'g'ri** (substantively COMPLETE & correct), lekin **100% emas**. Barcha ilova kodi (Laravel API, web, admin), barcha test spec'lari, infratuzilma config'lari va hujjatlarning katta qismi **bironta ham logika yo'qotmasdan** ko'chirildi — manba kodining mantiqiy mazmuni bilan maqsad daraxti o'rtasidagi katta "drift" deyarli butunlay **Laravel Pint (PHP) va Prettier (TS/TSX) qayta formatlashidan** iborat, kod yo'qolishidan emas. 80 ta "token-genuine" diff'ning hammasi adjudikatsiya qilindi: hech biri logika yo'qotmagan — ular yo formatting, yo monorepo-adaptatsiyasi, yoki maqsad nusxasi yaxshilangan holatlardir. Qolgan ish — bir nechta **deploy/ops artefaktlari** (nginx-production.conf), **seed asset papkasi** (`rasim/`), ikkita **tahlil hujjati**, va bir qancha **strukturaviy nuqsonlar** (buzilgan Docker COPY yo'llari, dangling package scaffold'lar, eskirgan CI/e2e yo'llari). Bular sof 100% holatga yetish uchun amalga oshirilishi kerak, lekin ularning hech biri ko'chirilgan kod logikasining yo'qolishi emas.

### Statistik jadval

| Toifa                                       | Fayllar soni | Izoh                                                                   |
| ------------------------------------------- | -----------: | ---------------------------------------------------------------------- |
| **Identical** (bayt-ma-bayt bir xil)        |         1313 | Hech qanday o'zgarishsiz ko'chgan                                      |
| **EOL-only** (faqat satr yakuni)            |          135 | CRLF/LF normalizatsiya, mazmun bir xil                                 |
| **Formatting-only (token)**                 |           74 | Pint/Prettier — token darajada farq, logika bir xil                    |
| **Token-genuine (adjudikatsiya qilingan)**  |           80 | Hammasi formatting/adaptatsiya/yaxshilanish — **0 logika yo'qotilgan** |
| **Adapted (monorepo)**                      |  (80 ichida) | Nomlar `@tmtu/*`, yo'llar, env — to'g'ri adaptatsiya                   |
| **Junk (to'g'ri chiqarib tashlangan)**      |          144 | Cache, \*.txt natijalar, .env, backup'lar                              |
| **Real-missing (haqiqatan yetishmaydigan)** |           10 | Action list, §5 ga qarang                                              |
| **Binary-diff (media)**                     |         1905 | 1896 .webp runtime media + 9 .png e2e screenshot                       |
| **Maqsad jami / Manba jami**                |  3754 / 3731 | Maqsad +23 fayl (yangi monorepo scaffold/config)                       |

---

## 2. Diff tahlili

Deterministik hash-diff (junk-filtered) quyidagi taqsimotni berdi:

```
1313 IDENTICAL
 135 EOL-only
  74 formatting-only (token)
  80 token-genuine (adjudikatsiya qilindi)
 144 junk (to'g'ri chiqarib tashlangan)
  10 real-missing
1905 binary-diff (1896 .webp runtime media + 9 .png e2e screenshot)
```

**Asosiy xulosa: "drift" = qayta formatlash, kod yo'qotish EMAS.** Raqamlarni to'g'ri o'qish kerak:

- **1313 + 135 = 1448 fayl** (identical + EOL-only) — bular hech qanday mazmunli farqsiz. Bu jami fayllarning eng katta ulushi.
- **74 formatting-only + 80 token-genuine = 154 fayl** "farqli" deb belgilangan, lekin **chuqur adjudikatsiya** ko'rsatdiki, bularning hammasi quyidagilardan iborat:
  - **PHP tomonida (Laravel Pint):** `!` operatori atrofiga bo'shliq (`!$x` → `! $x`), konkatenatsiya bo'shlig'i (`'a' . $b` → `'a'.$b`), `use`-import'larni alfavit tartibida joylash, bir qatorli `if`'ларни qavsli ko'p qatorli bloklarga aylantirish, ishlatilmaydigan import'larni olib tashlash, qo'sh tirnoqdan bir tirnoqqa (interpolatsiyasiz string'lar uchun bayt-identik) o'tish, `new Class` qavsisiz, `fn ()` bo'shlig'i, `return`'dan oldin bo'sh satr.
  - **TS/TSX tomonida (Prettier + prettier-plugin-tailwindcss):** bir tirnoq normalizatsiyasi, satrlarni o'rash (wrapping), Tailwind class tartiblash (`w-7 h-7` → `h-7 w-7`).
- **Eng yorqin misol — `frontend/src/lib/i18n.ts`:** satr soni 1654 → 4142 ga "o'sgan" ko'rinadi, bu birinchi qarashda kod qo'shilgani kabi. Aslida Prettier har bir ko'p-xususiyatli tarjima obyektini alohida satrlarga yoygan. Semantik tekshiruv: **ikkala faylda ham aniq 1094 ta top-level tarjima kaliti**, key-set diff'i **nol** (hech qanday kalit qo'shilmagan/o'chirilmagan). s() lookup funksiyasi va loader bayt-identik (tirnoq uslubidan tashqari).

Demak, raqamlardagi katta "diff hajmi" deploy/migratsiya jarayonida o'rnatilgan **avtomatik formatter'lar (Pint, Prettier)** ning mahsuli. Bu **kutilgan va xohlangan** natija — yangi monorepo kod uslubi standartlashtirilgan. **Bironta ham qator kod yo'qotilmagan.**

`1905 binary-diff`: bularning **1896 tasi `.webp` runtime media** (yuklab olingan/konvertatsiya qilingan rasm fayllari — content-hashlari farq qiladi, chunki ular runtime'da generatsiya qilinadi) va **9 tasi `.png` e2e screenshot** (Playwright test artefaktlari). Bular kod emas, runtime/test chiqishi.

---

## 3. Genuine-diff hukmlari

**80 ta token-genuine fayl to'liq adjudikatsiya qilindi.** Quyidagi hukmlar chiqarildi:

### Toifa bo'yicha taqsimot

| Hukm                       | Soni (taxminan) | Ma'nosi                                      |
| -------------------------- | --------------- | -------------------------------------------- |
| `[formatting]`             | ~60             | Sof Pint/Prettier — logika bir xil           |
| `[monorepo-adaptation]`    | ~6              | Nom/yo'l/env adaptatsiyasi (to'g'ri)         |
| `[target-newer-or-better]` | ~9              | Maqsad teng yoki ko'proq xatti-harakatga ega |
| `[runtime-junk]`           | 2               | Playwright auth/last-run artefaktlari        |

### Diqqatga sazovor "target-newer-or-better" (yaxshilanish, regressiya EMAS)

- **`frontend/src/components/faq/FAQContent.tsx`** — `hidden={!isOpen}` → `aria-hidden` + `pointerEvents` style. HTML `hidden` atributi `display:none` qilib `scrollHeight`'ni nolga tushirib animatsiyani buzardi; maqsad buni **tuzatadi**. `maxHeight` fallback `?? 0` → `?? 9999` (o'lchanmagan panel yopilib qolmasligi uchun).
- **`frontend/src/components/home/TestimonialsSection.tsx`** va **`frontend/src/components/talabalarga/StudentLifeGallery.tsx`** — React **rules-of-hooks buzilishi tuzatildi**: `useMemo` erta `return null`'dan **yuqoriga** ko'chirildi + ichki bo'sh-massiv guard qo'shildi. Xatti-harakat saqlangan/yaxshilangan, hech narsa olib tashlanmagan.
- **`admin/next.config.ts`** — superset: `tashmedunitf.uz` va `*.tashmedunitf.uz` uchun ikkita qo'shimcha `remotePattern` qo'shilgan. Barcha manba pattern'lar mavjud.
- **`backend/composer.json` / `composer.lock`** — faqat **qo'shimcha**: `larastan/larastan ^3.9` dev-dependency (migratsiya tooling uchun). Hech qanday manba paketi olib tashlanmagan.
- **`e2e_tests/global-setup.ts`** va **`e2e_tests/package.json`** — manba'dagi mashinaga-bog'liq absolyut yo'l (`C:/Users/Yoqubjon099/...`) monorepo-aware nisbiy yo'lga almashtirildi; stub package.json to'liq skript to'plamiga to'ldirildi.

### Logika yo'qotgan fayllar — HUKM

> **HECH QANDAY FAYL manba logikasini haqiqatan yo'qotmagan. 0 (nol) ta actionable kod-yo'qotish topildi.**

Buni alohida ta'kidlash kerak: 80 ta token-genuine farqning **bironta ham** maqsad nusxasida manbada mavjud bo'lgan xatti-harakat, validatsiya, route, scope, media collection, cache invalidation, yoki biznes logikasini **olib tashlamagan**. Barcha controller'lar, model'lar, service'lar, observer'lar, migration'lar, va seeder'lar **logikasi bayt-darajada teng** (formatting'dan tashqari). Masalan:

- Barcha 12 ta exception render() handler (`bootstrap/app.php`) — bir xil.
- Barcha 358 satr route (`routes/api.php`) — yo'l/controller/name/throttle/where bayt-identik.
- Barcha 30 yangilik record, 17 staff record, 40 permission, 12 seeder chaqiruvi — bir xil.
- Barcha media collection (7+), conversion (1920/768/300/150 va h.k.), JSONB whereRaw bindings, locale-allowlist guard'lar — saqlangan.

**Logika regressiyasi nuqtai nazaridan migratsiya toza.**

---

## 4. Struktura auditi

12 o'lcham bo'yicha audit o'tkazildi. Quyida har biri uchun natija:

| #   | O'lcham                | Holat        | Eng og'ir muammo                                                                         |
| --- | ---------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| 1   | workspace-root-wiring  | minor-issues | pnpm 9 vs 10 ziddiyati (P1), husky v10 deprecation (P2), `packages/config` dangling (P2) |
| 2   | apps-api-laravel       | minor-issues | `rasim/` seed asset ko'chmagan (P1), `SiteMediaSeeder` admin'ga tashqi yo'l (P2)         |
| 3   | apps-web-wiring        | minor-issues | **Web Docker build buzilgan** (P1), `/api/health` route yo'q (P2)                        |
| 4   | apps-admin-wiring      | **broken**   | **🔴 Dockerfile.admin `npm ci` ishlamaydi — image BUILD FAIL (P0)**                      |
| 5   | apps-mobile            | minor-issues | Plan doc noto'g'ri joyga ko'chgan + nomi buzilgan (P1)                                   |
| 6   | e2e-wiring             | minor-issues | Report yo'l mismatch (P2), commit qilingan report (P3)                                   |
| 7   | infrastructure-docker  | minor-issues | `docker-safe.sh` `-f` flag'siz (P1), **nginx-production.conf YO'Q (P1)**                 |
| 8   | packages-shared        | minor-issues | **Barcha 8 paket 100% UNCONSUMED (P1)**, kod dublikatlangan (P1)                         |
| 9   | ci-github              | minor-issues | E2E job server'larni ishga tushirmaydi (P1×2), admin Docker build fail (P2)              |
| 10  | docs-completeness      | minor-issues | ARCHITECTURE_STUDY.md + VERIFICATION_ADDENDUM.md ko'chmagan (P2)                         |
| 11  | root-config-coverage   | minor-issues | pnpm versiya ziddiyati (P1), husky (P2), `.npmrc` yo'q (P3)                              |
| 12  | root-70-reconciliation | minor-issues | `docker-safe.sh` buzilgan (P2), tahlil hujjatlari ko'chmagan (P3)                        |

### Buzilgan / og'ir muammoli o'lchamlar (highlight)

- **🔴 `apps-admin-wiring` (P0 — yagona BUZILGAN o'lcham):** `apps/admin/Dockerfile.admin` manba'dan bayt-identik ko'chgan — `COPY package.json package-lock.json* ./` so'ng `RUN npm ci --prefer-offline`. pnpm migratsiyasi `package-lock.json`'ni olib tashlagan, va `npm ci` lockfile bo'lmasa **xato bilan to'xtaydi**. Admin Docker image **build qilolmaydi** — ham compose'da, ham CI'da. Web'ning Dockerfile'i (`Dockerfile.frontend`) modernizatsiya qilingan (pnpm-detect bilan), lekin admin orqada qolgan.

- **`apps-web-wiring` (P1):** Web image ham buzilgan, lekin sekinroq tarzda. `Dockerfile.frontend` `pnpm install --frozen-lockfile` ni urinadi, lekin build context `apps/web` ichida lockfile yo'q (root'da `pnpm-lock.yaml`), shuning uchun u `npm install` shoxiga **tushib ketadi** — pin qilinmagan, takrorlanmaydigan o'rnatish.

- **`packages-shared` (P1):** Migratsiya 8 ta shared paket scaffold yaratgan (`@tmtu/types`, `@tmtu/sdk`, `@tmtu/utils` substantsial; `ui`/`auth`/`analytics` stub), lekin **bironta ilova ulardan import qilmaydi** (grep = 0 hit). Bu "konsolidatsiya" maqsadining 2-bosqichi bajarilmaganini ko'rsatadi — kod hali ham har bir ilova ichida dublikat.

- **`infrastructure-docker` (P1):** SOURCE `backend/nginx-production.conf` (~340 satr bare-metal reverse-proxy + media RAM-cache) **hech qayerga ko'chmagan** — `infrastructure/nginx/` bo'sh. `scripts/deploy.sh` ning DEFAULT `bare` rejimi bu config'ga tayanadi.

- **`ci-github` (P1):** Yangi `e2e` job web/API server'larini ishga tushirmaydi (`webServer` block yo'q, PHP/Postgres/Redis yo'q) — har bir Playwright testi ulanolmay fail bo'ladi. Bu YANGI va buzilgan qamrov.

**To'g'ri ishlaydigan (confirmed-coherent) jihatlar:** API Docker image (root-context, pnpm-aware), workspace globlar va pnpm-lock importer'lari mos, barcha 9 e2e spec mavjud va hardcoded-yo'l yo'q, barcha docker config fayllari to'g'ri ko'chgan, turbo pipeline koherent, root `.gitignore`/`.dockerignore` `backend/` → `apps/api/` to'g'ri remap qilingan.

---

## 5. Haqiqiy bo'shliqlar (action list)

100% holatga yetish uchun zarur, prioritetlangan ro'yxat. Har bir element: **harakat + manba yo'li + maqsad yo'li.**

### 🔴 P0 — Build BUZILGAN (darhol)

**A1. `Dockerfile.admin` ni pnpm-aware qiling**

- **Harakat:** `COPY package.json package-lock.json* ./` + `RUN npm ci --prefer-offline` ni web'dagi lockfile-detection blokiga almashtiring: `COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./` so'ng `RUN if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; elif [ -f package-lock.json ]; then npm ci; else npm install; fi`. (Admin'da `@tmtu/*` workspace dep yo'q, shuning uchun `npm install`'ga tushadi va ishlaydi.)
- **Fayl:** `C:/Users/User/Desktop/tmtu-termiz/apps/admin/Dockerfile.admin` (6-7 satr)
- **Ta'sir qiladi:** `infrastructure/docker/compose/compose.yml` (215-218), `.github/workflows/ci.yml` (228-236)

### 🟠 P1 — Funksional/strukturaviy

**A2. `rasim/` seed asset papkasini ko'chiring**

- **Harakat:** ~8 `.webp` rasmni app ichiga joylashtiring va seeder yo'lini `base_path('../rasim/...')` dan `database_path('seeders/assets/...')` ga o'zgartiring.
- **Manba:** `C:/Users/User/Desktop/tmtu_termiz project/rasim/`
- **Maqsad:** `C:/Users/User/Desktop/tmtu-termiz/apps/api/database/seeders/assets/`
- **Tegishli fayl:** `apps/api/database/seeders/StudentLifePhotoSeeder.php` (15-50, 8+ joyda)

**A3. `nginx-production.conf` ni ko'chiring**

- **Harakat:** Bare-metal reverse-proxy config'ini ko'chiring; ichki `root /var/www/tmtu-termiz/public` ni `apps/web`+`apps/api/public` ga moslab tekshiring.
- **Manba:** `C:/Users/User/Desktop/tmtu_termiz project/backend/nginx-production.conf`
- **Maqsad:** `C:/Users/User/Desktop/tmtu-termiz/infrastructure/nginx/production.conf` (hozir bo'sh)

**A4. Web Docker build'ni monorepo-aware qiling**

- **Harakat:** Build context'ni root'ga o'zgartiring, Dockerfile'ni `infrastructure/docker/images/Dockerfile.web` ga ko'chiring, root `pnpm-lock.yaml`+`pnpm-workspace.yaml` COPY qiling, `pnpm install --frozen-lockfile --filter @tmtu/web...`.
- **Fayl:** `apps/web/Dockerfile.frontend` → `infrastructure/docker/images/Dockerfile.web`
- **Ta'sir:** `compose.yml` (190-193), `ci.yml` (218-226)

**A5. `scripts/docker-safe.sh` ga `-f` flag qo'shing**

- **Harakat:** Yuqorida `COMPOSE='docker compose -f infrastructure/docker/compose/compose.yml'` aniqlang, har bir `docker compose` ni `$COMPOSE` ga almashtiring.
- **Fayl:** `C:/Users/User/Desktop/tmtu-termiz/scripts/docker-safe.sh` (26,31,36,37,42,43,44,49,54,71 satr)

**A6. Plan doc'ni to'g'ri joyga ko'chiring va to'liq versiyani tiklang**

- **Harakat:** Buzilgan-nomli faylni app source'dan docs'ga ko'chiring; truncate qilingan 350-satr versiyani SOURCE'ning to'liq 660-satr versiyasi bilan almashtiring.
- **Manba (to'liq):** `C:/Users/User/Desktop/tmtu_termiz project/mobile-app/plan-adminInlineEditing.prompt.md`
- **Hozirgi (noto'g'ri):** `C:/Users/User/Desktop/tmtu-termiz/apps/admin/src/components/sections/# Admin Panel Inline Editing Redesign Pl.prompt.md`
- **Maqsad:** `C:/Users/User/Desktop/tmtu-termiz/docs/architecture/admin-inline-editing-plan.md`

**A7. pnpm versiya ziddiyatini hal qiling**

- **Harakat:** `.tool-versions` da `pnpm 9.15.0` → `pnpm 10.28.2`; `README.md:62` `pnpm ≥ 9.0.0` → `pnpm ≥ 10.0.0`.
- **Fayl:** `C:/Users/User/Desktop/tmtu-termiz/.tool-versions:3`, `README.md:62`

**A8. E2E CI job'ga server provisioning qo'shing**

- **Harakat:** `playwright.config.ts` ga `webServer` block qo'shing YOKI e2e job'ga postgres+redis service, PHP+composer setup, migration, `php artisan serve` + web build/start, `wait-on` qadamlarini qo'shing.
- **Fayl:** `.github/workflows/ci.yml:157-192`, `e2e/playwright.config.ts:9`, `e2e/global-setup.ts:9`

**A9. Shared paketlarni ulang (consolidation 2-bosqich) — yoki WIP deb belgilang**

- **Harakat:** `apps/web`+`apps/admin` package.json ga `@tmtu/*` workspace dep qo'shing, dublikat lib kodini import bilan almashtiring, har `next.config.ts` ga `transpilePackages` qo'shing. AGAR tayyor bo'lmasa — docs/ADR'da paketlarni "source of truth" deb da'vo qilishni to'xtating.
- **Fayl:** `apps/web/package.json`, `apps/admin/package.json`, `apps/{web,admin}/src/lib/{translate,utils,i18n}.ts`, `packages/utils/`, `packages/i18n/`

### 🟡 P2 — Sifat/integratsiya

**A10. Tahlil hujjatlarini ko'chiring**

- **Manba:** `.../ARCHITECTURE_STUDY.md` (584 satr), `.../VERIFICATION_ADDENDUM.md` (248 satr)
- **Maqsad:** `docs/architecture/architecture-study.md`, `docs/architecture/verification-addendum.md`

**A11. `SiteMediaSeeder` ni self-contained qiling** — `IMG_3455.mp4` ni `apps/admin/public/images/` dan `apps/api/database/seeders/assets/` ga ko'chiring, `base_path('../admin/...')` → `database_path()`. Fayl: `apps/api/database/seeders/SiteMediaSeeder.php:22`

**A12. Web `/api/health` route yarating** — `apps/web/src/app/api/health/route.ts` (200 qaytaradi) YOKI compose healthcheck'ni `/` ga o'zgartiring. Fayl: `compose.yml:208`

**A13. `packages/config` ni workspace'ga ro'yxatdan o'tkazing** — `pnpm-workspace.yaml` ga `packages/config/*` qo'shing YOKI flatten qiling; docs'dagi `@tmtu/config` referenslarni tuzating; `@tmtu/eslint-config` `files` dan mavjud bo'lmagan `react.js`/`node.js` ni olib tashlang.

**A14. E2E report yo'l mismatch'ini tuzating** — `ci.yml:191` ni `e2e/report/` ga, `.gitignore` ni `e2e/report/` ga moslang. Commit qilingan `e2e/report/index.html` ni `git rm -r --cached e2e/report` bilan olib tashlang.

**A15. Husky v10 deprecation'ni tuzating** — `package.json:37` `husky install` → `husky`; `.husky/pre-commit` va `.husky/commit-msg` dan birinchi ikki satrni (shebang + husky.sh source) olib tashlang.

**A16. postgres volume migratsiyasi** — agar mavjud production host'da ishlasa, `compose.yml:244-246` da `external: true` + asl nomni saqlang YOKI bir martalik volume rename qiling.

### 🟢 P3 — Hygiene/kosmetik

**A17.** Eskirgan cron yo'li: `apps/api/routes/console.php:17` va `apps/api/storage/STORAGE_STRUCTURE.md:199` da `cd /var/www/tmtu-termiz/backend` → `.../apps/api`.
**A18.** `SECURITY.md:49` dangling link → `docs/security/security.md` ga yo'naltiring YOKI `threat-model.md` stub yarating.
**A19.** API.md'ni README doc indeksiga qo'shing (`apps/api/docs/API.md` mavjud, lekin discoverable emas).
**A20.** Bo'sh placeholder dirlar (`scripts/ci/`, `tooling/*`, `docs/{api,changelog,architecture/diagrams}/`) — `.gitkeep` qo'shing yoki olib tashlang.
**A21.** Root `.npmrc` qo'shing (auto-install-peers, dedupe-peer-dependents).
**A22.** package.json'dan redundant `workspaces` massivini olib tashlang (pnpm uni e'tiborsiz qoldiradi).
**A23.** E2E README'dagi eskirgan `e2e_tests`/npm CI snippet'ni `pnpm test:e2e` ga yangilang.

---

## 6. Diqqat: bilan ko'chmagani to'g'ri (intentionally excluded)

Quyidagilar **ataylab va to'g'ri** ko'chirilmadi — bu globally-correct tanlov:

| Element                        | Nima                                                                                                     | Nega to'g'ri                                                                                                                                                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Runtime cache**              | `storage/framework/cache`, `sessions`, `views`, `bootstrap/cache` (compiled)                             | Generatsiya qilinadigan runtime artefakt; har deploy'da qayta yaratiladi. Versiya nazoratiga kirmasligi kerak.                                                                                                                                  |
| **`.env` sirlari**             | `backend/.env`, `admin/.env(.local)` (REVALIDATION_SECRET, DB parol)                                     | Maxfiy ma'lumot. Faqat `.env.example` track qilinadi. `phpunit.xml` dagi hardcoded parol (`Yoqubjon20022006`) bo'sh'ga adapt qilindi — to'g'ri.                                                                                                 |
| **DB dump**                    | `database_backup_*.sql`                                                                                  | PII (shaxsiy ma'lumot) o'z ichiga oladi; katta binary; `.gitignore` `*.sql`/`database_backup_*` ni bloklaydi.                                                                                                                                   |
| **Test artefaktlari**          | `*.txt` test natijalar, Playwright `.auth/admin.json`, `test-results/.last-run.json`, e2e screenshot'lar | Har test run'da regeneratsiya qilinadigan runtime chiqish; kod emas.                                                                                                                                                                            |
| **Scratch `rasim/*.jpg`**      | 46 ta screenshot (`Screenshot 2026-04-*.jpg`)                                                            | Vaqtinchalik ish rasmlari (scratch); hujjat yoki asset emas. **Diqqat:** bu seed-asset `rasim/*.webp` papkasidan FARQ qiladi — `.webp` seed assetlari ko'chirilishi KERAK (A2), lekin `.jpg` scratch screenshot'lar to'g'ri chiqarib tashlandi. |
| **`node_modules/`, `vendor/`** | Bog'liqliklar                                                                                            | Lockfile'dan qayta o'rnatiladi; hech qachon commit qilinmaydi.                                                                                                                                                                                  |
| **144 junk fayl**              | Yuqoridagilarning yig'indisi                                                                             | `.gitignore`/`.dockerignore` to'g'ri qamrab oladi; remapping `backend/` → `apps/api/` to'g'ri qo'llanildi.                                                                                                                                      |

Bu chiqarib tashlashlar **professional monorepo gigienasi** ning belgisi — sirlar, runtime holat, va katta binary'lar versiya nazoratidan tashqarida.

---

## 7. Yakuniy verdikt

| Ko'rsatkich                   | Qiymat                                                                                                           |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Kod logikasi migratsiyasi** | **100%** — 0 logika yo'qotilgan, 80/80 genuine-diff toza adjudikatsiya                                           |
| **Tarkib/asset to'liqligi**   | **~97%** — 10 real-missing (asosan `rasim/` seed asset + 2 tahlil doc + nginx config)                            |
| **Strukturaviy to'g'rilik**   | **~90%** — 1 P0 (admin Docker), bir nechta P1 (web Docker, e2e CI, shared-package wiring, docker-safe.sh, nginx) |
| **UMUMIY MIGRATSIYA**         | **≈ 94% to'liq**                                                                                                 |

**Yakuniy hukm:** Migratsiya **mohiyatan muvaffaqiyatli** — barcha ilova kodi, testlar va infratuzilma config'lari bironta logika regressiyasisiz ko'chdi, va yangi monorepo standartlashtirilgan formatting, professional gigiena va kengaytirilgan scaffold bilan **manbadan ustun**. Biroq u **deploy-ready 100% emas**: 1 ta P0 (admin Docker image build fail) tuzatilmaguncha to'liq Docker stack qurilmaydi.

**Qoldiq to-do soni:** **23 ta amal** (A1–A23):

- **1 × P0** (darhol — admin Docker)
- **8 × P1** (funksional/strukturaviy)
- **7 × P2** (sifat/integratsiya)
- **7 × P3** (gigiena/kosmetik)

Bu 23 amal bajarilgach, monorepo to'liq **100% migrated, build-clean, va deploy-ready** holatga yetadi. Eng kritik yo'l: **A1 (P0) → A2/A3/A4/A5/A8 (P1)** — bular tuzatilsa, funksional to'liqlik ta'minlanadi; qolganlari sifat va uzoq muddatli konsolidatsiya uchun.
