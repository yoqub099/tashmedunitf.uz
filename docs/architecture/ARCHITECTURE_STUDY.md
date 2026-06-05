# TMTU Termiz Loyihasi — To'liq Arxitektura Tahlili

> Definitiv arxitektura ma'lumotnomasi. Toshkent Davlat Tibbiyot Universiteti (TMTU) Termiz filiali rasmiy veb-sayti — Laravel 12 + Next.js 16 (frontend & admin) + PostgreSQL 16 + Redis 7 monorepo. Ushbu hujjat 16 ta chuqur survey hisobotidan sintez qilingan.

---

## 1. Umumiy ko'rinish (Executive Summary)

TMTU Termiz loyihasi — bitta repozitoriyda yashovchi **uchta ilovadan** iborat full-stack monorepo. U real, ishlab turgan universitet saytidir (production domeni jonli), shuning uchun bu greenfield emas, balki iteratsiya qilingan, production'da "yong'in o'chirilgan" kodbaza.

| Ilova       | Stack                             | Port | Vazifa                         |
| ----------- | --------------------------------- | ---- | ------------------------------ |
| `backend/`  | Laravel 12, PHP 8.3, Sanctum      | 8000 | REST API (`/api/v1`)           |
| `frontend/` | Next.js 16, React 19, Tailwind v4 | 3000 | Ommaviy SSR/ISR sayt           |
| `admin/`    | Next.js 16, React 19, Tailwind v4 | 3001 | Inline-editing CMS admin panel |

Yordamchi infratuzilma: **PostgreSQL 16** (JSONB asosidagi ko'p tilli kontent), **Redis 7** (cache/session/queue — majburiy). Qo'shimcha `e2e_tests/` (Playwright) — mustaqil acceptance test loyihasi.

**Asosiy g'oyalar:**

- **Ko'p tillilik (uz/ru/en)** har bir qatlamda — Spatie Translatable JSONB ustunlari `{uz, ru, en}` shaklida.
- **5-qatlamli cache invalidatsiya** — model yozuvi → Redis tag flush → Next.js ISR revalidation → brauzer soft-refresh. Kodbazada takror-takror **"999 million foydalanuvchi"** miqyoslash motivi.
- **Public/private media ajratish** — Nginx tomonidan tarqatiladigan ochiq fayllar va auth-gated maxfiy fayllar (CV, diplom skanlari).
- **Thin-controller / fat-service** backend arxitekturasi.
- **Uzbek-first** — `locale='uz'`, `fallback_locale='uz'` (English emas), barcha xato xabarlari va izohlar o'zbekcha.

**Kod uslubi belgilari:** ASCII-box bannerlar, ikki tilli (o'zbekcha) izohlar, ochiq-oydin "ma'lum buglar" izohlari (`observer file-cache bug workaround`).

---

## 2. Tizim arxitekturasi

### Yuqori darajadagi diagramma

```
                          ┌─────────────────────────────────────────────┐
                          │              FOYDALANUVCHILAR                 │
                          │   (brauzer · qidiruv botlari · ijtimoiy)      │
                          └───────────────┬──────────────┬────────────────┘
                                          │              │
                          ┌───────────────▼──┐        ┌──▼──────────────────┐
                          │  FRONTEND :3000  │        │   ADMIN :3001       │
                          │  Next.js 16 SSR  │        │   Next.js 16 CMS    │
                          │  [locale] i18n   │        │   inline-editing    │
                          │  ISR + tags      │        │   Sanctum token     │
                          └──┬────────────┬──┘        └──┬───────────────┬──┘
                             │ GET /api   │              │ /api/v1       │
                             │ +cache tags│              │ Bearer token  │
                             │            │              │               │
                             │            │  POST /api/revalidate         │
                             │            │  (secret-guarded)  ◄──────────┘
                             │            │  revalidateTag + revalidatePath
                             │            │
              ┌──────────────▼────────────▼──────────────────────────────┐
              │              NGINX (in-container yoki host)                │
              │  /storage/*  → disk'dan to'g'ridan (PHP ga tegmaydi)      │
              │  /private-files/ → X-Accel-Redirect (auth-gated)          │
              │  boshqalar → FastCGI :9000                                 │
              └──────────────────────────┬───────────────────────────────┘
                                         │
              ┌──────────────────────────▼───────────────────────────────┐
              │            LARAVEL 12 API  (PHP-FPM 8.3)                   │
              │  Routes → Middleware(ApiPerformance, throttle, role)      │
              │  Controller (thin) → FormRequest → Service (fat)          │
              │  → Eloquent Model → API Resource                          │
              │  Observers → CacheService + FrontendRevalidationService   │
              └──────┬──────────────────┬─────────────────────┬──────────┘
                     │                  │                     │
          ┌──────────▼──────┐  ┌────────▼────────┐  ┌─────────▼──────────┐
          │  PostgreSQL 16  │  │    Redis 7      │  │  Storage (disk)    │
          │  JSONB+GIN/BRIN │  │ DB1: cache(tag) │  │ public/ (Nginx)    │
          │  41 jadval      │  │ DB0: session/   │  │ private/ (auth)    │
          │  pg_trgm        │  │      queue      │  │ Spatie Media WebP  │
          └─────────────────┘  └─────────────────┘  └────────────────────┘
                                         ▲
                                  ┌──────┴──────┐
                                  │  queue      │  WebP conversions (queued)
                                  │  scheduler  │  cache:warm, db:backup, ...
                                  └─────────────┘
```

### Request lifecycle (o'qish yo'li)

1. **Frontend SSR**: Brauzer so'rovi → `middleware.ts` locale'ni tekshiradi/redirect qiladi, `x-locale` header + `lang` cookie o'rnatadi → `[locale]/layout` → `(main)/layout` (`loadTranslations()` + `getNavigation()`) → Server Component `lib/services.ts` orqali backend'ga `{revalidate:60, tags:[...]}` bilan fetch qiladi.
2. **Nginx**: `/storage/*.{ext}` bo'lsa to'g'ridan-to'g'ri disk'dan beriladi (PHP ga tegmaydi, 2-5ms); boshqalar FastCGI orqali PHP-FPM ga.
3. **Laravel**: `ApiPerformance` + `throttle:120,1` → ixtiyoriy `auth:sanctum` + `role` → Controller admin flagini hisoblaydi → Service `CacheService::remember()` orqali Redis'dan o'qiydi yoki PostgreSQL'dan qayta quradi → API Resource `{uz,ru,en}` JSON xaritalarini chiqaradi.
4. **Frontend render**: `t(field, lang)` translatable JSON'ni ochadi, `s(key, lang)` UI string'larni beradi, HTML `DOMPurify` orqali tozalanadi.

### Request lifecycle (yozish yo'li → publish loop)

```
Admin EditModal → FormData (field[uz]/[ru]/[en], _method=PUT)
  → admin use*Mutation hook → service → POST /api/v1/...
    → Laravel: FormRequest validatsiya → Service DB::transaction
       → ConvertsToWebp (GD) → Spatie addMedia (queued conversions)
       → commit → CacheService::clearModel(PREFIX) + 'search'
    → Eloquent Observer → FrontendRevalidationService → POST {frontend}/api/revalidate
  → admin onSuccess → setQueriesData + invalidateQueries + revalidateFrontend()
    → admin /api/revalidate proxy (secret inject) → frontend /api/revalidate
       → revalidateTag(tags) + revalidatePath(all locales) + bump version
  → ochiq brauzerlar 2s'da bir /api/revalidate/stream poll → router.refresh()
```

---

## 3. Backend (Laravel)

### 3.1 Ma'lumot modeli (~24 entity)

24 Eloquent model + 7 string-backed PHP enum. Modellar uch funksional guruhga bo'linadi:

**(1) Ommaviy kontent modellari** (admin-CRUD, public-facing):
`News`, `Page`, `Department`, `Staff`, `Faculty`, `Direction`, `Banner`, `Faq`, `Testimonial`, `Partner`, `LibraryResource`, `JournalIssue`, `TalentedStudent`, `StudentLifePhoto`, `CareerCenterInfo`.

Deyarli barchasi bir xil trait stack ishlatadi:

```
HasFactory + HasTranslations + InteractsWithMedia + SoftDeletes
  (+ HasSlug — News, Page, Department, LibraryResource, JournalIssue da)
```

**(2) Kiruvchi/forma modellari** (foydalanuvchi yuborgan ma'lumot, translatable EMAS, `is_read` + `unread()` scope):
`ContactMessage`, `ConferenceRegistration`, `JobApplication`, `StudentWork`.

**(3) Infratuzilma/konfig modellari**:
`User` (auth), `SiteContent` (key/value sayt matni), `Translation` (i18n string store), `SiteMedia` (umumiy media), `ContactLocation` (xarita joylashuvlari).

**Munosabatlar grafi:**

```
Faculty 1──* Direction          (directions.faculty_id, nullOnDelete)
Department 1──* Staff            (staff.department_id, cascadeOnDelete)
Faculty 1──* Faq                 (faqs.faculty_id, nullOnDelete)
News 1──* ConferenceRegistration (conference_registrations.news_id, cascadeOnDelete)
Page ──* Page  (self-referential tree: parent/children/allChildren)
```

**Diqqatga sazovor modellar:**

- **`Page`** (`backend/app/Models/Page.php`) — materialized-path daraxt. `boot()` saving hook `parent_id` o'zgarganda `depth` va slash-ajratilgan `path` ni avtomatik hisoblaydi. Bu daraxt dinamik navbar va `[...slug]` sahifalarini quvvatlaydi. Ogohlantirish: subtree'ni qayta-ota qilganda nabira-sahifalar `path`/`depth` ni meros qilmaydi (stale).
- **`JobApplication`** (`backend/app/Models/JobApplication.php`) — maxfiylik namunasi: ~13 hujjat kolleksiyasi (resume, photo, diplomas, dissertation...) hammasi `useDisk('local')` (private) da, har biri `singleFile`.
- **`News`** (`backend/app/Models/News.php`) — eng boy media sozlamasi: 7 kolleksiya, queued WebP konvertatsiyalar (thumbnail 600x450, medium 1200x900).

### 3.2 Enums

7 string-backed enum (`backend/app/Enums/`): `UserRole`, `FaqCategory`, `FileType`, `DirectionLevel`, `NewsCategory`, `LibraryCategory`, `ContactStatus`. **Muhim:** ular model `$casts` da ISHLATILMAYDI — faqat FormRequest validatsiyasida (`Rule::in(...)`) consume qilinadi. `category`/`status`/`level` ustunlari oddiy string sifatida saqlanadi va o'qiladi. `UserRole::permissions()` to'liq RBAC matritsasini kodga yozadi (super-admin => `['*']`) lekin runtime'da Spatie Permission jadvallari avtoritet.

### 3.3 API qatlami

Barcha ~28 controller `BaseController` ni kengaytiradi (`success()`, `error()`, `paginated()` helperlar). Yagona response envelope:

```json
{ "success": true, "message": "...", "data": {...}, "meta": {...}, "links": {...} }
```

**Thin-controller / fat-service:** controllerlar 4 ish qiladi — (1) `$request->user()?->hasAnyRole(['super-admin','admin'])` orqali admin flagini hisoblash, (2) injected `*Service` ni chaqirish, (3) `*Resource` ga o'rash, (4) `BaseController` orqali qaytarish.

**Marshrutlash** (`backend/routes/api.php`): hammasi `v1` prefix + global `ApiPerformance` + `throttle:120,1`. Public read GET'lar + tighter throttle'li public POST'lar (contact `10,1`, conference, job, student-works). `auth:sanctum` guruhida logout/me + admin CRUD. Ichida `role:super-admin` (user management) va `role:super-admin|admin` (barcha kontent CRUD). Marshrut tartibi ataylab boshqariladi: literal `pages/navigation` `pages/{slug}` dan OLDIN, admin numeric show `->where('id','[0-9]+')`.

**Sofistik outlier'lar:**

- **`MediaController`** (445 satr) — 16 modelni `model_type` string orqali resolve qiladi, public/private storage split, **HTTP Range (206 partial content)** video/audio streaming, conversion URL metadata.
- **`AuthController`** — brute-force lockout (5 urinish → 15 min, `sha1(email|ip)` key), timing-safe dummy-hash solishtirish (user enumeration oldini olish), 24 soatdan eski tokenlarni o'chirish (multi-device sessiyalar).
- **`PasswordResetController`** — DB-hashed token, 60 min TTL, har doim success qaytarish (anti-enumeration).

### 3.4 Service qatlami va caching strategiyasi

~22 domain CRUD service bir xil shablonga amal qiladi: `getAll/find*/create/update/delete`. O'qishlar `CacheService::remember()` ga o'raladi, yozishlar `DB::transaction()` ichida, commit'dan SO'NG `CacheService::clearModel(PREFIX)` (observer bilan ataylab ortiqcha — "observer file-cache bug workaround").

**`CacheService`** (`backend/app/Services/CacheService.php`) — yagona cache haqiqat manbai:

- TTL darajalari: `SHORT=60s` (news), `MEDIUM=300s`, `LONG=3600s` (statik), `PAGE=300s`.
- `requestKey(prefix, params)` = `ksort` + `md5(serialize($params))`.
- **Ikki backend** `isRedis()` orqali abstraksiya: Redis bilan `Cache::tags([tag])->flush()` (O(1)); file/db driver bilan qo'lda `_tracked_keys:{prefix}` to'plami (7-kun TTL, O(n)).
- Tag avtomatik `explode(':', $key)[0]` dan olinadi — shuning uchun cache key birinchi segmenti prefix bilan teng bo'lishi SHART.

### 3.5 5-qatlamli cache invalidatsiya + revalidatsiya

Bu loyihaning markaziy nakhshasi. Har bir model yozuvida **ikki tomonlama cache-bust**:

```
1-qatlam: Eloquent Observer (ModelCacheObserver yoki NewsObserver)
2-qatlam: CacheService::clearModel(prefix) — Redis tag flush + 'search' tag
3-qatlam: FrontendRevalidationService → HTTP POST {frontend}/api/revalidate
4-qatlam: Next.js revalidateTag(tag) + revalidatePath(barcha locale'lar)
5-qatlam: globalThis.__revalidateVersion bump → brauzer 2s poll → soft-refresh
```

- **`ModelCacheObserver`** — yagona parametrik observer, `AppServiceProvider::boot()` da ~18 modelga `new ModelCacheObserver(PREFIX_X)` sifatida ulanadi. `Page` IKKI marta kuzatiladi (`PREFIX_PAGES` + `PREFIX_NAV`) — sahifa tahriri navbar cache'ni ham buzadi.
- **`FrontendRevalidationService`** — Laravel snake_case prefikslarni Next.js dash-case taglarga xaritalaydi, fire-and-forget (`Http::timeout(5)->retry(2,500)`), xatolar faqat log qilinadi (admin yozuvini bloklamaydi).
- **Yangi modelni 3 joyda ulash kerak:** `AppServiceProvider::observe()`, `CacheService::PREFIX_*`, `FrontendRevalidationService::PREFIX_TO_TAG`.

### 3.6 Media pipeline (WebP, Spatie Media Library)

- **Public/private disk ajratish** — `public` disk Nginx-served (thumbnails, gallery, docs), `local` disk auth-gated (`Page.private_docs`, `Staff.private_docs`, butun `JobApplication`).
- **WebP konvertatsiyalar** — model-spesifik kengliklarda (1920 cover/banner, 800 dept/faculty, 400 staff, 300 partner logo, 150 testimonial), quality 85-90, `sharpen(10)`, `->queued()` (Redis queue worker'ga bog'liq — worker yo'q bo'lsa derived rasmlar yaratilmaydi).
- **`MediaUploadService`** — qattiq xavfsizlik: 8 fayl-turi kategoriyasi MIME+kengaytma allow-list, ~30 xavfli kengaytma blok, double-extension hujumi himoyasi (`shell.php.jpg`), SVG body XSS skanerlash, filename sanitizatsiya. **Ogohlantirish:** ko'p domain service `MediaUploadService` ni chetlab o'tib, to'g'ridan `convertToWebp()` + Spatie `addMedia()` chaqiradi — bu yo'llarda FormRequest validatsiyasi yagona himoya.
- **`MediaPathGenerator`** — `{model-folder}/{id}/{collection}/` pro-layout, legacy `{id}/` yo'llarni ham qo'llab-quvvatlaydi (`isLegacyMedia()` har getPath chaqiruvida disk exists tekshiradi).
- **`ForceFileRemover`** — butun media papkani o'chiradi (Windows file-lock muammosini hal qiladi).
- **`ConvertsToWebp` trait** — GD asosida decode→resize→imagewebp, alpha saqlash, 10000x10000 DoS guard, Imagick TIFF fallback, har xatoda original'ni qaytaradi (hech qachon throw qilmaydi).

### 3.7 Auth (Sanctum)

- Personal access token, 480 daqiqa (8 soat) muddat (`config/sanctum.php`).
- Login: brute-force lockout + timing-safe + 24h token rotatsiya (multi-device).
- Logout: faqat `currentAccessToken` o'chadi. Password reset/akkaunt o'chirish: BARCHA tokenlar nuke qilinadi.

### 3.8 Console komandalar va scheduler

14 komanda, `routes/console.php` scheduler'i tomonidan boshqariladi (60GB RAM / 4TB SSD universitet serveri, 02:00-04:30 tungi oyna). Klasterlar:

- **Cache**: `cache:warm` (/30min, 8 service oldindan isitadi), `deploy:refresh` (to'liq flush + config/route/view/event cache + `queue:restart` + `revalidateAll()` + warm).
- **Backup**: `db:backup` (pg_dump -Fc, oxirgi 10), `db:restore`, `media:backup` (zip, oxirgi 5), `db:safe-seed` ("SEED-PRODUCTION" type-to-confirm).
- **Storage/media**: `storage:setup`, `media:health` (8-bo'lim diagnostika), `media:migrate-structure`, 3 ta overlapping cleanup komanda.

**Windows-first himoya:** `putenv('PGPASSWORD')`, PHP `gzencode` (shell gzip emas), `MediaObserver` Spatie fayl-lock muvaffaqiyatsizliklarini kompensatsiya qiladi.

### 3.9 bootstrap/app.php

Laravel 12 minimal skeleton: `withExceptions()` har bir istisnoni yagona JSON envelope'ga aylantiradi (`{success:false, message, errors}`, to'g'ri HTTP status — barchasi qattiq-kodlangan o'zbekcha). `redirectGuestsTo` api/\* uchun `null` qaytaradi (→ 401 JSON). `preventLazyLoading` + `preventSilentlyDiscardingAttributes` faqat NON-production'da yoqilgan.

---

## 4. Ma'lumotlar bazasi

**PostgreSQL 16** (production'da aslida **18.1** dan dump qilingan — hujjatlar bilan drift), 41 ommaviy jadval, 48 migratsiya, 18 seeder + 242KB `translations.json` (842 yozuv), 11 factory.

### 4.1 Asosiy jadvallar va JSONB

- Deyarli har bir kontent modeli translatable maydonlarini JSON ustun sifatida `{uz, ru, en}` shaklida saqlaydi (Spatie Translatable).
- Muhim migratsiya **`2026_02_21_000001_add_performance_indexes.php`** ~20 JSON ustunni `ALTER TABLE ... TYPE jsonb USING col::jsonb` orqali JSONB ga aylantiradi, keyin GIN (jsonb_path_ops), partial (WHERE is_published/is_active/is_read), BRIN (created_at) indekslar + `SET STATISTICS` qo'shadi. **Postgres-only schema** — MySQL/SQLite'da ishlamaydi.

### 4.2 Hierarxik pages

`pages` jadvali ortiqcha yuklangan — kontent store + CMS daraxt + navigatsiya menyu bir vaqtda:

```
parent_id (FK self, cascade), sort_order, depth (smallint),
path (string), is_nav_item (bool), page_type (content|link|group),
external_url, nav_icon
```

`NavigationSeeder` butun 7-bo'limli sayt navigatsiyasini shu jadvalga quradi (lekin `DatabaseSeeder` da ro'yxatga olinmagan — qo'lda ishga tushirilishi kerak).

### 4.3 Indekslar va search

GIN indekslar `jsonb_path_ops` ishlatadi (`@>` containment uchun optimallashtirilgan), **`gin_trgm_ops` EMAS** — `pg_trgm` o'rnatilgan bo'lsa-da. Bu substring/ILIKE qidiruv bu indekslardan FOYDALANMAYDI degani — SEO/search da'volari bilan schema o'rtasida ehtimoliy performance/correctness bo'shliq.

### 4.4 Migratsiya tarixi (production firefighting belgilari)

- `testimonials.role` string→jsonb (`2026_03_04_000001`) double-encode qildi → row-by-row repair migratsiya (`000003`, qaytarib bo'lmaydigan `down()`).
- `contact_locations` translatable rebuild — ru/en bo'sh string bilan to'ldirildi (ma'lumot yo'qotish).
- Dublikat migratsiya nomlari (ikki `add_performance_indexes`, ikki `2026_03_05_100000`) — faqat to'liq yo'l noyobligi tufayli yashaydi.

### 4.5 Seederlar

Idempotent va production-safe: `if (Model::count() > 0) return;` yoki `updateOrCreate`. `DatabaseSeeder` 47 permission + 3 rol + super-admin (parol `ADMIN_PASSWORD` env'dan, yo'q bo'lsa `RuntimeException` — yaxshi xavfsizlik). **KRITIK risk:** ko'p factory schema bilan mos kelmaydi (`DepartmentFactory` `head_of_department`/`order` ishlatadi, jadval `head_name`/`sort_order` ishlatadi) — to'g'ridan ishlatilsa insert xatosi beradi. Faqat `NewsFactory` to'g'ri va default oqimda ishlatiladi.

---

## 5. Frontend (ommaviy sayt)

### 5.1 i18n [locale] routing

**Homegrown i18n** (next-intl EMAS):

- `middleware.ts` locale'siz yo'llarni `/{defaultLocale}` ga 308-redirect qiladi, `x-locale` header + `lang` cookie (365 kun) o'rnatadi.
- Server komponentlar `getLanguage()` (header → cookie → 'uz') orqali tilni resolve qiladi.
- Client komponentlar Zustand `useLanguageStore` o'qiydi (SSR'da har doim 'uz' boshlanadi — hydration mismatch oldini olish).
- **`s(key, lang)`** — ~1650-satrli statik UI lug'at (~600 kalit) + DB override (`s()` DB ni afzal ko'radi → admin orqali tarjima tahrirlash redeploysiz).
- **`t(field, lang)`** — Spatie Translatable JSON'ni ochadi, fallback zanjiri lang→uz→ru→en→"".

### 5.2 SSR va caching

- **`lib/api.ts` `ApiClient`** — fetch wrapper, `AbortSignal.timeout` (15s). Dev: `cache:'no-store'`; prod GET: `{revalidate:60, tags:[...]}`. Ataylab `revalidate:false` dan qochilgan (izoh: "999 million user ABADIY eski sahifani ko'radi" — 60s TTL bu xavfsizlik to'ri).
- **`lib/services.ts`** — ~30 typed funksiya, har biri barqaror cache-tag bilan, Spatie `filter[key]` konvensiyasini quradi.
- **`app/api/revalidate/route.ts`** — secret-guarded POST (`REVALIDATION_SECRET`, CORS `ADMIN_URL` ga qulflangan). `revalidateTag` + har locale variant uchun `revalidatePath` + `notifyUpdate()` versiya bump.
- **`stream/route.ts`** — versiyani no-cache GET orqali ko'rsatadi, brauzer 2s'da poll qiladi (`AutoRefresh`). **Ogohlantirish:** `globalThis.__revalidateVersion` per-instance — ko'p instansiyali deploy'da SSE bo'lishilmaydi.

### 5.3 Sahifa daraxti va arxetiplar

Public sayt IA (URL strukturasi): `abiturientlarga/`, `biz-haqimizda/`, `faoliyat/`, `talabalarga/`, `yangiliklar/`.

Sahifa arxetiplari:

1. **Dinamik DB-driven** async Server Component'lar (homepage, yangiliklar, kafedralar, fakultetlar). Har fetch `.catch()` bilan bo'sh-lekin-shaklli fallback qaytaradi (graceful degradation). HTML har doim `DOMPurify` orqali tozalanadi.
2. **`[...slug]` catch-all** — to'liq generic CMS renderer (content + gallery + documents + children + breadcrumbs), `getPageByPath` orqali.
3. **`NavHub`** hublar — DB-hujjatlar yoki qattiq-kodlangan fallback.
4. **`DocumentDetail`** barg sahifalar — toza statik, qattiq-kodlangan tashqi `lex.uz` URL'lar.
5. **"Asosan statik"** faoliyat/doktorantura sahifalar — `s()` lug'atidan + qattiq-kodlangan namuna ma'lumot.

### 5.4 Komponentlar

Feature domeniga ko'ra tashkil etilgan (a11y, directions, faq, home, journal, layout, talabalarga, virtual-qabulxona) + `shared/` (design-system) + `templates/`. Server/Client split asosiy konvensiya: SSR komponentlar `lang` prop oladi; client komponentlar `useLanguageStore` o'qiydi + `lang = hydrated ? language : serverLang`.

- **Directions** eng og'ir feature — direction ikonlari 6-raqamli mutaxassislik kodi bo'yicha tanlanadi (`605101→Stethoscope`).
- **`AutoRefresh`** — backend cache-invalidation pipeline bilan bog'lanish, `/api/revalidate/stream` ni 2s'da poll, `router.refresh()`.
- **`LocaleLink`** — pathname locale'ni avto-prefix qiluvchi wrapper.

### 5.5 State

- **Zustand**: `useUIStore` (modal flagi), `useLanguageStore` (URL/cookie mirror), `useA11yStore` (WCAG sozlamalar).
- **TanStack Query** (`QueryProvider`, 60s staleTime) — `useApi.ts` hooks asosan interaktiv widgetlar uchun; SSR'da ma'lumot olish `services.ts` orqali server-side.

### 5.6 Security headers

`next.config.ts`: `output:'standalone'`, `reactCompiler:true`, security headerlar (nosniff, SAMEORIGIN, HSTS preload, CSP frame-ancestors), differensial Cache-Control (HTML `s-maxage=60` SWR + `Vary: Accept-Language, Cookie`; static 1yr immutable; api no-store), image `remotePatterns` whitelist.

### 5.7 SEO

`lib/seo.ts` (~1180 satr) — `PAGE_SEO` registri, `buildMetadata` (canonical + hreflang + OG + Twitter), 11 JSON-LD builder (Organization, WebSite, Breadcrumb, Article, FAQ, Course, Event, Person, Department, LocalBusiness). `sitemap.ts` (~70 statik + dinamik), `robots.ts`, edge-runtime `opengraph-image.tsx`.

---

## 6. Admin panel

### 6.1 Inline-editing CMS (WordPress/Wix uslubi)

Admin — sidebar dashboard EMAS. Niyat: admin public frontend bilan AYNAN bir xil UI ko'radi, lekin har kontent bloki **`EditableWrapper`** ga o'raladi (hover overlay: ko'k chiziqli border + edit/delete/add tugmalar + label badge → modal editor ochadi). Admin URL'lari public sayt i18n marshrutlarini aks ettiradi (`[locale]` segmentsiz).

### 6.2 EditModal — yagona editing dvigateli

**`admin/src/components/inline-edit/EditModal.tsx`** — deklarativ `FieldConfig[]` schema orqali boshqariladigan universal forma dvigateli (`text/textarea/richtext/select/number/date/media/toggle/tags/hidden`). Translatable maydonlar UZ/RU/EN `LanguageTabs` ostida (UZ majburiy). Hammasini multipart `FormData` ga Laravel bracket notatsiyasida serializatsiya qiladi (`title[uz]`, `exam_subjects[0]`, `field[]`).

**Eng murakkab mantiq — media diffing:** ochilishda `{id,url}` media obyektlarini URL string'ga normalizatsiya qiladi + URL→ID xaritani ref'da keshlaydi. Submit'da joriy vs boshlang'ich'ni diff qilib `remove_<field>=1` (to'liq tozalash) yoki `remove_media_ids[]` (maqsadli gallery o'chirish) chiqaradi. Backend 422 (`title.uz`) xatolarni flat nomlarga qaytaradi + UZ tab'ga o'tadi.

### 6.3 Tiptap

**`RichTextEditor.tsx`** — Tiptap (StarterKit + Image/Link/Placeholder/TextAlign), `immediatelyRender:false` (SSR-safe), `onUpdate→onChange`, `setContent({emitUpdate:false})` loop oldini olish. **Ogohlantirish:** `addImage`/`setLink` `window.prompt` ishlatadi, ixtiyoriy URL qabul qiladi (sanitizer yumshoq bo'lsa `javascript:` URL mumkin).

### 6.4 ~40 boshqaruv bo'limi

Ikki CRUD scaffold:

- **PATTERN A (thin wrapper)**: `page.tsx` statik metadata + `@/components/templates/*` render qiladi. `biz-haqimizda/meyoriy-hujjatlar/**` (~30 barg) va `faoliyat/**` deyarli butunlay shu.
- **PATTERN B (full inline)**: `'use client'` komponent — shared primitiv + `EditModal` + `FieldConfig[]` + `use*` hooks.

Eng boy qo'lda yozilgan sahifalar: `abiturientlarga/page.tsx` (~1100 satr — Faculty + Direction + Faq + SiteContent), per-level direction/faculty detail sahifalar (bakalavriat|magistratura|ordinatura), `talabalarga/page.tsx` (5 CRUD resursi bitta ekranda).

Inbox sahifalar (`ish-arizalari`, `konferensiya-royxatlari`, `talaba-ishlari`) — qo'lda jadval+modal pattern (debounced search, read/unread badge, view-marks-read, auth-aware blob download).

### 6.5 Auth oqimi

- **Ikki-storage dizayn**: token localStorage'da Zustand `persist` (`useAuthStore`, `admin-auth`) — axios injection uchun; AND non-HttpOnly `admin-token` cookie (qo'lda `document.cookie`) — `middleware.ts` server-side guard uchun.
- **`middleware.ts`** Sanctum format regex (`^[0-9]+\|[A-Za-z0-9+/=]+$`) ni VALIDATE qiladi (faqat format, validlik EMAS) — real enforcement API 401 ga qoldiriladi.
- **`(dashboard)/layout.tsx`** — client-side guard, `useAuthStore` hydration kutadi, token yo'q bo'lsa `/login` ga redirect.
- 401 da axios interceptor `logout()` + hard-redirect (`isRedirectingTo401` flag bilan redirect storm oldini oladi).

### 6.6 Data plumbing (3-qatlamli stack)

(1) ~26 per-entity service (shared axios `api.ts` wrap, `{success,message,data}` envelope unwrap) → (2) ~24 per-entity TanStack Query hook (query key, optimistic `setQueriesData`, toast, `revalidateFrontend`) → (3) Zustand store. **Massiv duplikatsiya** — bu dominant tech-debt vektori.

**Cross-app revalidation**: admin mutatsiya → admin `/api/revalidate` proxy (secret server-side inject) → frontend `/api/revalidate`. Secret hech qachon brauzerga yetmaydi.

---

## 7. Multilingual (uz/ru/en) — end-to-end

```
┌─────────────────────────────────────────────────────────────────┐
│  STORAGE: PostgreSQL JSONB ustun  {uz:"...", ru:"...", en:"..."}  │
│           (Spatie Translatable, GIN jsonb_path_ops indeks)        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  BACKEND: HasTranslations model → API Resource getTranslations() │
│           → to'liq {uz,ru,en} xaritani qaytaradi                  │
│           (locale resolution frontend'ga qoldiriladi)             │
│  Validatsiya: field.uz=required, field.ru/.en=nullable           │
│  Yozish: Store=required, Update=required_with (qisman tahrir)     │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  FRONTEND: t(field, lang) → field[lang]||uz||ru||en||""          │
│            s(key, lang) → DB override → statik lug'at → uz        │
│            locale: middleware x-locale header (server)            │
│                    lang cookie (fallback)                         │
│                    URL [locale] prefix (client store)             │
│  CDN: Vary: Accept-Language (cross-locale poisoning oldini oladi) │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│  ADMIN: EditModal LanguageTabs (UZ/RU/EN, UZ majburiy)           │
│         → FormData field[uz]/[ru]/[en] bracket notatsiya          │
│  UI: faqat .uz ko'rsatiladi (|| 'Nomsiz' fallback)               │
└──────────────────────────────────────────────────────────────────┘
```

**Ikki kanal:** (1) **kontent maydonlari** — model JSONB ustunlari (`t()`); (2) **UI string'lar** — `s()` statik lug'at + DB `translations` jadvali override (842 yozuv, `export-i18n.js` orqali frontend → `translations.json` → `TranslationSeeder` → DB). DB i18n frontend'dan downstream.

**Backend xato xabarlari**: `lang/{uz,ru,en}/messages.php`. **Ogohlantirish:** faqat `lang/uz/validation.php` mavjud — ru/en foydalanuvchilar validatsiya xatolarida vendor inglizcha matnga tushadi.

---

## 8. Infratuzilma & DevOps

### 8.1 Docker Compose (7 service)

`tmtu_network` ko'prik tarmog'ida: `app` (Laravel PHP-FPM + Nginx + Supervisor bitta konteynerда), `queue` (`queue:work redis`), `scheduler` (`while true; schedule:run; sleep 60`), `postgres` (16-alpine), `redis` (7-alpine), `frontend` (:3000), `admin` (:3001). `app`/`queue`/`scheduler` BIR XIL image (root `Dockerfile` `production` target) — faqat CMD farq qiladi.

- **Root `Dockerfile`** — 3-bosqich (base/vendor/production), PHP 8.3-fpm-alpine, katta extension to'plami (pdo_pgsql, gd, intl, redis, imagick) + ffmpeg + image-optimizerlar (jpegoptim, pngquant, cwebp, avifenc).
- Ikkala Next.js `output:'standalone'`, non-root `nextjs` user (uid 1001), `node server.js`.
- `postgres_data` `external:true` — `down -v` uni o'chira olmaydi. `docker-safe.sh` typed "DESTROY-ALL-DATA" tasdiqi bilan himoyalaydi.

### 8.2 Nginx

Ikki-darajali media serving: `/storage/*.{ext}` to'g'ridan disk'dan (PHP tegmaydi, per-tur cache TTL — rasmlar 365d immutable, video 30d Accept-Ranges). Private fayllar `X-Accel-Redirect /private-files/` orqali auth-gated. Video `ngx_http_mp4_module` (pseudo-streaming/seek).

### 8.3 Uchta deploy yo'li (kelishtirilmagan — markaziy tension)

1. **DOCKER**: `docker-compose.yml` + CI SSH deploy (`git pull && down && build --no-cache && up -d && migrate && cache`).
2. **BARE-METAL**: `backend/deploy-production.sh` (10-bosqich Ubuntu provisioning) + `backend/nginx-production.conf` (host vhost, Let's Encrypt, unix socket).
3. **HYBRID**: root `deploy.sh` (PM2 + supervisorctl + `php artisan deploy:refresh`).

Konfliktlar: server speclari (60GB vs 200GB), yo'llar (`/var/www/html` vs `/var/www/tmtu-termiz`), queue driverlari (Docker=redis, bare-metal=database).

### 8.4 CI/CD (`.github/workflows/ci.yml`)

5 job: `backend-tests` (postgres+redis service, `php artisan test --parallel --coverage`), `backend-lint` (php-cs-fixer + PHPStan level 5), `frontend-tests` (lint + tsc + build), `docker-build` (buildx, main-only), `deploy` (appleboy/ssh-action). **Ogohlantirish:** admin app'ning CI coverage'i YO'Q va docker-build'i YO'Q — buzilgan admin build aniqlanmasdan ketadi.

### 8.5 deploy:refresh — cache/revalidation quyrug'i

`DeployRefresh.php` yagona orkestratsiya nuqtasi: `Cache::flush()` → config/route/view/event cache → `queue:restart` → `FrontendRevalidationService::revalidateAll()` (Next.js ISR bust) → `cache:warm`. Bu Laravel cache qatlami va Next.js ISR qatlami o'rtasidagi ko'prik.

### 8.6 Backuplar

`db:backup` (pg_dump -Fc, oxirgi 10), `media:backup` (zip, oxirgi 5), kunlik 03:00 cron + offsite rclone. `database_backup_2026-04-30.sql` — to'liq data+schema dump (1191 INSERT, gitignored).

### 8.7 Health

`/api/health` (throttle `10,1`, v1 prefiksidan TASHQARI) — DB (`getPdo`) + cache (`put/forget`) ni probe qiladi, 200/503 + per-service status. **Ogohlantirish:** Redis ishlamasa `degraded` lekin HTTP 200 — Docker healthcheck (`curl -f`) buni sog'lom deb hisoblaydi.

---

## 9. Testlar

### 9.1 Backend (PHPUnit/Pest)

Minimal lekin maqsadli: 2 Feature class (`AuthTest`, `PublicApiTest`), bo'sh Unit suite. `RefreshDatabase` real PostgreSQL test DB'ga (`tmtu_termiz_test`) qarshi.

- `AuthTest`: token berish, invalid-password 422 (o'zbekcha substring), 5-urinish brute-force lockout (`login:`+`sha1(email|ip)` key controllerga to'g'ri keladi), anti-enumeration forgot-password, `/auth/me` guard.
- `PublicApiTest`: `/api/health` shakli, public index endpointlar, admin POST 401, contact validatsiya 422.

**KRITIK risk:** `phpunit.xml` real plaintext DB parolini commit qiladi (`'Yoqubjon20022006'`). Test coverage yupqa — media upload, JSONB ustunlar, CRUD update/delete, query-builder, cache invalidation qoplanmagan.

### 9.2 Playwright E2E (`e2e_tests/`)

Mustaqil loyiha (workspace EMAS), `workers:1` strictly serial (spec 09 real DB mutatsiya qiladi). 9 spec, 100+ test. Uchta jonli servisni black-box sifatida boshqaradi (3000/3001/8000), `webServer` config yo'q — servislar oldindan ishlayotgan bo'lishi kerak.

- **storageState auth**: `auth-setup.ts` admin login → `.auth/admin.json` saqlaydi.
- **Spec 07 (News)** — eng keng: API envelope `{success,data,meta}`, multilingual title=object, JSONB title filter UZ+RU (commit `7c028d8` da tuzatilgan 500-bug regression guard), pagination non-overlap.
- **Spec 06 (a11y-panel)** — eng sofistik: `localStorage['tmtu:a11y']` ni `addInitScript` orqali navigatsiyadan OLDIN seed qiladi, aniq computed `rgb()` qiymatlarni har scheme uchun tekshiradi.
- **Spec 09 (Real CRUD)** — yagona DB-mutating suite, Bearer token, 700ms rate-limit delay, full create→update→delete (sentinel `sort_order 999`, `e2e-test-*` key, cleanup'ga tayanadi).

**Ogohlantirish:** `global-setup.ts` backend yo'li qattiq-kodlangan (`C:/Users/Yoqubjon099/...`) — joriy mashinada (`C:/Users/User/...`) silently no-op, rate-limit reset ishlamaydi → spec 09 flaky bo'lishi mumkin. a11y gate faqat `critical` da fail bo'ladi (serious/moderate jim o'tadi). Hardcoded credentials 3 faylda. README eskirgan ("4 fayl / 30 test" — aslida 9 spec / 100+).

---

## 10. Asosiy oqimlar (Key data flows)

### Oqim A: Admin yangilik yaratadi → public ko'radi

```
1. Admin EditModal → FormData (title[uz/ru/en], thumbnail File, _method=PUT)
2. useCreateNews → newsService → POST /api/v1/news (Bearer token)
3. Laravel: StoreNewsRequest validatsiya (title.uz required)
4. NewsService::create — DB::transaction:
     - HasSlug slug yaratadi (faqat birinchi marta)
     - ConvertsToWebp: thumbnail → WebP@1920 (GD)
     - Spatie addMedia → public disk → queued WebP conversion job (600x450, 1200x900)
5. commit → CacheService::clearModel(PREFIX_NEWS) + PREFIX_SEARCH (Redis tag flush)
6. NewsObserver (after-commit) → FrontendRevalidationService → POST {frontend}/api/revalidate {tags:['news'], secret}
7. Frontend revalidate route: revalidateTag('news') + revalidatePath('/uz/yangiliklar', '/ru/...', '/en/...') + version++
8. Admin onSuccess → setQueriesData + invalidateQueries + revalidateFrontend()
9. Ochiq brauzer: AutoRefresh /api/revalidate/stream poll → versiya o'zgardi → router.refresh()
10. Queue worker: WebP conversion job bajaradi → thumbnail/medium URL'lar materializatsiya bo'ladi
11. Public foydalanuvchi: yangi yangilik 60s ISR TTL ichida (yoki darhol tag invalidation orqali) ko'rinadi
```

### Oqim B: Abituriyent ish arizasi yuboradi (private fayllar)

```
1. Public JobApplicationForm → multipart POST /api/v1/job-applications (throttle:10,1)
2. StoreJobApplicationRequest: 12 nullable file slot (max 10MB, per-tur mimes)
3. JobApplicationService::create — DB::transaction:
     - 12 ta media kolleksiya hammasi useDisk('local') (private), addMedia
     - addMedia xatosi → application qatorini rollback
4. Admin inbox: ish-arizalari sahifa, server-side filter[is_read]/filter[name]
5. View modal → markAsRead (optimistic) → fayllar:
     - GET /api/v1/media/download/{id} (responseType:'blob', auth:sanctum + role)
     - Laravel streamDownload → private disk → object URL → brauzer download
```

### Oqim C: Deploy → 999M foydalanuvchi yangi sahifani ko'radi

```
git push main → CI (test/lint/build) → SSH host:
  git pull → docker compose build --no-cache → up -d → migrate → cache
  YOKI host'da: deploy.sh → php artisan deploy:refresh:
    Cache::flush() → config/route/view/event:cache → queue:restart
    → FrontendRevalidationService::revalidateAll() → POST barcha tag + '/'
    → cache:warm (8 service oldindan isitiladi)
```

---

## 11. Xavflar va texnik qarz (Risks & tech debt)

### P0 — KRITIK (xavfsizlik / ma'lumot yo'qotish)

| #   | Risk                                                                                                                                                                                                      | Fayl                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 1   | **Plaintext DB parol commit'da** (`'Yoqubjon20022006'`)                                                                                                                                                   | `backend/phpunit.xml`                                  |
| 2   | **Committed secretlar**: root/backend `.env` da live DB parol, `ADMIN_PASSWORD=Admin123456`, zaif `REVALIDATION_SECRET=tdtutf-revalidation-secret-2026` (config defaultiga qaytadi agar env o'rnatilmasa) | `backend/config/app.php`, `.env`                       |
| 3   | **`fix_dompurify.js`** — DESTRUKTIV skript, 12 faylda DOMPurify'ni no-op'ga almashtiradi. Ishga tushirilsa stored-XSS vektor ochadi                                                                       | `frontend/fix_dompurify.js`                            |
| 4   | **`MediaController.download/stream` ownership tekshiruvi yo'q** — har qanday admin BARCHA media'ni (jumladan boshqa modellarning CV/diplom skanlarini) yuklab/stream qila oladi                           | `backend/app/Http/Controllers/Api/MediaController.php` |
| 5   | **StudentWork fayllari public disk'da** (`asset('storage/...')`) — shaxsiy ma'lumotli resumelar URL bilan ommaviy yuklab olinadi (JobApplication private, StudentWork emas)                               | `StudentWorkResource.php`                              |

### P1 — YUQORI (correctness buglari)

| #   | Risk                                                                                                                                                                                     | Fayl                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| 6   | **SEARCH BUG**: Department/Direction/Staff/Page/Faq `@> ?::jsonb` containment (exact-match) ishlatadi, substring EMAS — qisman qidiruv ishlamaydi (News/Library ILIKE to'g'ri ishlatadi) | model `searchName`/`searchTitle` scopelar |
| 7   | **Upload size mismatch**: PHP `upload_max_filesize=100M` vs Nginx `client_max_body_size=500M` — 100-500M oraliq Docker'da PHP'da fail bo'ladi                                            | `docker/php/php.ini`                      |
| 8   | **Image upload HTTP 500** (Windows): WebP konvertatsiyadan keyin temp `.webp` fayl `SplFileInfo::getSize()` stat fail — image CRUD 75% ishlaydi                                          | `ConvertsToWebp` + Windows temp           |
| 9   | **Page subtree re-parent stale path**: `boot()` faqat `parent_id` dirty bo'lganda ishlaydi, nabira-sahifalar `path`/`depth` ni yangilamaydi                                              | `backend/app/Models/Page.php`             |
| 10  | **Cache badge stale**: `ContactService`/`StudentWorkService` yozishlar `contact:unread_count`/`stats` ni clear qilmaydi (30-60s kechikish)                                               | `backend/app/Services/ContactService.php` |
| 11  | **Direct-upload media security bypass**: ko'p service `MediaUploadService` ni chetlab o'tadi — SVG-XSS, double-extension, MIME cross-check qo'llanmaydi                                  | barcha domain service'lar                 |
| 12  | **Hooks-after-early-return**: `TestimonialsSection`/`StudentLifeGallery` `useMemo` ni `if (length===0) return null` dan KEYIN chaqiradi (Rules of Hooks buzilishi)                       | `frontend/src/components/home/`           |

### P2 — O'RTA (tech debt / maintainability)

| #   | Risk                                                                                                                                                                                                                    | Fayl / Soha                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 13  | **Massiv duplikatsiya**: ~26 service + ~24 hook template klonlari; per-degree sahifalar (bakalavriat/magistratura/ordinatura) ~450-620 satr near-identical (bugfix 3-6 marta)                                           | `admin/src/lib/services/`, `admin/src/app/(dashboard)/abiturientlarga/` |
| 14  | **Hardcoded password '09'** sahifalar lock (client-side, trivial bypass)                                                                                                                                                | `admin/src/hooks/usePasswordGuard.tsx`, `PageLock`                      |
| 15  | **Auth faqat client-side** (admin) — himoyalangan UI yuboriladi, hydration'dan keyin redirect; middleware faqat token FORMAT'ni validate qiladi                                                                         | `admin/src/app/(dashboard)/layout.tsx`, `admin/src/middleware.ts`       |
| 16  | **Stale/broken factories**: ko'p factory schema bilan mos kelmaydi (insert xato)                                                                                                                                        | `backend/database/factories/`                                           |
| 17  | **Inconsistent XSS escaping**: faqat ~8 Resource plain-text escape qiladi, ~15 ta xom `getTranslations()`                                                                                                               | `backend/app/Http/Resources/`                                           |
| 18  | **Domain branding inconsistency**: `SEO_STRATEGY.md` `tdtutf.uz`, qolganlari `tashmedunitf.uz` (JSON-LD/canonical noto'g'ri bo'lishi mumkin)                                                                            | `SEO_STRATEGY.md`                                                       |
| 19  | **Uch deploy yo'li kelishtirilmagan** (server spec/path/queue konfliktlari)                                                                                                                                             | `deploy.sh`, `backend/deploy-production.sh`, `docker-compose.yml`       |
| 20  | **Admin CI coverage yo'q** — buzilgan admin build aniqlanmasdan ketadi                                                                                                                                                  | `.github/workflows/ci.yml`                                              |
| 21  | **GIN `jsonb_path_ops` vs `pg_trgm`**: substring qidiruv GIN'dan foydalanmaydi (performance gap)                                                                                                                        | migratsiya indekslar                                                    |
| 22  | **Dead code**: `AntiCard`/`LawCard`/`ContactCard` (import qilinmagan), unreachable `/biz-haqimizda/umumiy-malumot` (middleware redirect, lekin sitemap'da), `LoadingSpinner` size/text prop'larini e'tiborsiz qoldiradi | frontend/admin                                                          |
| 23  | **Leaflet unpkg CDN** marker rasmlari — offline/CSP'da markerlar buziladi                                                                                                                                               | `ContactMap`, `LeafletMap` (ikkala app)                                 |
| 24  | **CI deploy downtime**: `down && build --no-cache && up` — har deploy'da to'liq offline + qayta qurish, rollback/blue-green yo'q                                                                                        | `.github/workflows/ci.yml`                                              |
| 25  | **`AutoRefresh` 2s poll** har sahifada har foydalanuvchi uchun cheksiz — miqyosda doimiy origin trafik, CDN'ni chetlab o'tadi                                                                                           | `frontend/src/components/shared/AutoRefresh.tsx`                        |

---

## 12. Diqqatga sazovor / clever details

1. **Materialized-path daraxt** — `Page::boot()` saving hook'i `depth` + slash-ajratilgan ajdod-ID `path` ni denormalizatsiya qiladi (tez breadcrumb/ajdod so'rovlari). Bir model sahifa daraxti, CMS kontent VA navigatsiya menyu'ni quvvatlaydi (`page_type` group/content/link).

2. **Dual cache backend abstraksiya** — bir xil service kodi Redis'da (tag flush, O(1)) yoki file/db driver'da (`_tracked_keys` to'plami, O(n)) shaffof ishlaydi (`CacheService::isRedis()`).

3. **List-vs-detail conditional serialization** — `NewsResource`/`PageResource` og'ir maydonlarni (`content`, `gallery`) `$this->when(array_key_exists('content', getAttributes()))` ga o'raydi. Controllerlar list so'rovida `content` ustunini SELECT qilmaydi → bitta Resource ikkala endpoint'ga xizmat qiladi (zero-flag elegant trick).

4. **HTTP Range 206 streaming** — `MediaController` video/audio uchun byte-range parsing, 8KB buffered streaming, public/private disk dichotomy — odatiy CRUD'dan ancha tashqarida.

5. **Anti-enumeration ikki marta** — login dummy bcrypt hash bilan constant-time solishtiradi (noma'lum user uchun timing bir xil); forgot-password har doim bir xil success qaytaradi.

6. **WCAG 2.1 AA accessibility toolbar** — production-grade, O'zbekiston davlat saytlari uchun: pre-hydration FOUC skript (`A11yPreHydrationScript` `<html>` ga klass qo'yadi React mount'idan oldin), focus trap, live region, reduced-motion, cross-tab sync, 6 rang sxemasi (`data-a11y-ui` tagging recoloring dvigatelini panel chrome'idan ajratadi).

7. **Direction ikonlari mutaxassislik kodi bo'yicha** — `CODE_ICONS["605101"]→Stethoscope` (umumiy tibbiyot), `605102→Baby` (pediatriya) — domen bilimi to'g'ridan kodga kiritilgan.

8. **SiteContent CMS-editability** — homepage hero, advantages, applicants/faculty matnlari `SiteContent[]` key-value yozuvlari orqali `cv(contents, key, fallback, lang)` bilan resolve qilinadi, i18n string'lar default sifatida → kontent jamoasi kodsiz tahrirlaydi. `EditableAdvantagesSection` dinamik element sonini DB kalitlarini regex-skanerlash orqali oladi (`advantages_item_<n>`).

9. **Live content refresh websocketsiz** — `globalThis.__revalidateVersion` counter + 2s client poll → admin tahriridan keyin <2s propagatsiya, F5'siz.

10. **Cross-app secret server-side** — admin browser faqat o'z `/api/revalidate` proxy'siga uradi; secret faqat admin route'ning server-to-server fetch'ida frontend'ga inekt qilinadi.

11. **Windows first-class deploy target** — `putenv('PGPASSWORD')`, PHP `gzencode`, `MediaObserver` Spatie fayl-lock papka-o'chirish muvaffaqiyatsizliklarini kompensatsiya qiladi, `db:restore` `pg_restore` exit 1 ni non-fatal deb hisoblaydi.

12. **Legacy-path media migration safety** — `MediaPathGenerator` jonli `Storage::exists()` tekshiruvi orqali pre-migration `{id}/file` yo'llarni resolve qiladi, yangi yuklamalar `{model}/{id}/{collection}/` oladi.

13. **Staggered tungi maintenance oyna** — 60GB/4TB server uchun: 02:00 health → 03:00 db backup → 03:30 media backup → 04:00/04:30 haftalik cleanup, hammasi `withoutOverlapping()` + per-job log fayllar.

14. **xxh3 ETag + Vary: Accept-Language** — `ApiPerformance` xxh3 hash (crc32'dan tez) ETaglar uchun; `Vary: Accept-Language` CDN edge'da cross-locale uz/ru/en JSON poisoning'ni oldini oluvchi load-bearing element.

15. **Honest SECURITY.md audit** — 2026-04-20 audit avval tuzatilgan real zaifliklarni hujjatlashtiradi (`backend/.token` git-tracked edi, login HAR safar BARCHA tokenni revoke qilardi — multi-session bug) + tugallanmagan-ish ro'yxati (2FA yo'q, ClamAV yo'q, CSP `unsafe-inline`).

---

**Tegishli asosiy fayllar (absolute path):**

- `C:\Users\User\Desktop\tmtu_termiz project\backend\app\Services\CacheService.php` — cache haqiqat manbai
- `C:\Users\User\Desktop\tmtu_termiz project\backend\app\Services\FrontendRevalidationService.php` — ISR ko'prik
- `C:\Users\User\Desktop\tmtu_termiz project\backend\app\Models\Page.php` — materialized-path daraxt
- `C:\Users\User\Desktop\tmtu_termiz project\backend\app\Http\Controllers\Api\MediaController.php` — media streaming
- `C:\Users\User\Desktop\tmtu_termiz project\backend\routes\api.php` — marshrut/auth/throttle
- `C:\Users\User\Desktop\tmtu_termiz project\backend\routes\console.php` — scheduler
- `C:\Users\User\Desktop\tmtu_termiz project\frontend\src\lib\api.ts` — ISR cache strategiyasi
- `C:\Users\User\Desktop\tmtu_termiz project\frontend\src\app\api\revalidate\route.ts` — revalidation hook
- `C:\Users\User\Desktop\tmtu_termiz project\admin\src\components\inline-edit\EditModal.tsx` — editing dvigateli
- `C:\Users\User\Desktop\tmtu_termiz project\admin\src\middleware.ts` — admin auth guard
- `C:\Users\User\Desktop\tmtu_termiz project\docker-compose.yml` — orkestratsiya
- `C:\Users\User\Desktop\tmtu_termiz project\backend\database\migrations\2026_02_21_000001_add_performance_indexes.php` — JSONB+indeks
- `C:\Users\User\Desktop\tmtu_termiz project\backend\phpunit.xml` — KRITIK: leaked DB parol
- `C:\Users\User\Desktop\tmtu_termiz project\frontend\fix_dompurify.js` — KRITIK: destruktiv XSS skript
