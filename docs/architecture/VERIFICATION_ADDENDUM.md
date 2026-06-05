# TMTU Termiz — 2-O'tish Tekshiruv Addendumi (Verification Addendum)

> **Hujjat maqsadi:** Bu addendum 1-o'tish (`ARCHITECTURE_STUDY.md`) tomonidan aniqlangan xavflarni tasdiqlaydi/rad etadi va har bir faylni to'liq qayta o'qishdan kelib chiqqan YANGI topilmalarni qayd etadi. Arxitekturaning to'liq tavsifi takrorlanmaydi — u 1-o'tishda yashaydi. Bu yerda faqat **verdiktlar, yangi topilmalar, tuzatishlar va ustuvor harakatlar** keltiriladi.

---

## 1. Xulosa (Summary)

| Ko'rsatkich                                                 | Qiymat                                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Tekshirilgan 1-o'tish xavflari                              | **15**                                                                       |
| ✅ To'liq tasdiqlangan (confirmed)                          | **6** (#1, #5, #9, #12, #13, #14)                                            |
| ⚠️ Qisman tasdiqlangan / kamaytirilgan (partial/downgraded) | **8** (#2, #3, #4, #6, #7, #10, #11, #15)                                    |
| ❌ Rad etilgan (refuted)                                    | **1** (#8)                                                                   |
| Qayta o'qilgan fayllar (PASS-2 deep-read)                   | **~830+** fayl, 11 ta domen segmenti bo'yicha (har biri `fullyCovered=true`) |
| YANGI topilmalar (1-o'tish o'tkazib yuborgan)               | **80+** (jumladan **9 ta P1**, **30+ P2**, qolganlari P3)                    |
| 1-o'tish xaritasiga tuzatishlar                             | **35+** noaniqlik                                                            |

**Qamrov to'liqligi (coverage completeness):** Har bir segment bo'yicha barcha fayllar **to'liq o'qildi** (`fullyCovered=true`): backend (models/enums 31/31, migrations+seeders+factories 79, controllers+routes+middleware 34, FormRequests 47/47, Resources 26, services+traits+observers+console 50, config+lang+tests 22), frontend (static leaves 56, dynamic+shell+SEO 42, components 54/54, lib+hooks+store+config 36), admin (dashboard pages 122/122, components 77/77, lib+services+hooks 73), infra+e2e+docs 38. **Yagona bilingan bo'shliqlar:** (a) ba'zi shared template (`StaticPageAdmin`, `EditModal`) ichki xulq-atvori boshqa segmentlarda chuqurroq tekshirilishi kerak; (b) `node_modules/`/`vendor/` faqat tegishli fayllar uchun nuqtali tekshirildi (masalan Laravel `In.php`, Symfony `UploadedFile.php`) — to'liq emas (bu kutilgan). Boshqa har bir loyiha kodi fayli o'qildi.

**Eng muhim o'zgarish 1-o'tishga nisbatan:** ikkita YANGI **P1** xavf topildi — `pages/tree` **PUBLIC** endpoint orqali nashr qilinmagan (draft) sahifalarni anonim foydalanuvchilarga oshkor qilishi, va `frontend/src/lib/api.ts` dagi `API_BASE` ishlab chiqarish (production) URL'ini buzishi. Bularning ikkalasi ham 1-o'tishda yo'q edi.

---

## 2. Tasdiqlangan xavflar (Verified Risks)

| #   | Xavf (qisqacha)                                                              | Verdikt      | Haqiqiy jiddiylik | Dalil (file:line)                                                |
| --- | ---------------------------------------------------------------------------- | ------------ | ----------------- | ---------------------------------------------------------------- |
| 1   | phpunit.xml da ochiq DB paroli commit qilingan                               | ✅ confirmed | **P1** (P0 emas)  | `backend/phpunit.xml:33`                                         |
| 2   | "Commit qilingan sirlar" (.env DB pass, ADMIN_PASSWORD, REVALIDATION_SECRET) | ⚠️ partial   | **P2**            | `backend/config/app.php:33`; `.gitignore:21-30`                  |
| 3   | `fix_dompurify.js` DOMPurify'ni no-op'ga aylantiradi (stored-XSS)            | ⚠️ partial   | **P2**            | `frontend/fix_dompurify.js:17-26`; `package.json:5-10`           |
| 4   | MediaController download/stream da object-level authz yo'q                   | ⚠️ partial   | **P2**            | `MediaController.php:231-252, 264-325`; `api.php:211`            |
| 5   | StudentWork fayllari PUBLIC diskda, `asset()` orqali ochiq                   | ✅ confirmed | **P1**            | `StudentWorkService.php:15-19`; `StudentWorkResource.php:25`     |
| 6   | Qidiruv buggi: `@>` JSONB containment substring o'rniga                      | ⚠️ partial   | **P2**            | `Department.php:71-77` (+4); `SearchService.php:38-72`           |
| 7   | Upload o'lcham nomuvofiqligi (PHP vs Nginx)                                  | ⚠️ partial   | **P2**            | `default.conf:15`; `php.ini:1-2`; `backend/public/.user.ini:1-2` |
| 8   | Rasm upload 500: temp `.webp` `getSize()` stat xatosi (Windows)              | ❌ refuted   | none              | `ConvertsToWebp.php:88-108`; log: Spatie `crop()` TypeError      |
| 9   | Page::boot() reparent'da nasldoshlar path/depth eskirib qoladi               | ✅ confirmed | **P2**            | `Page.php:52-70`; `PageService.php:160-177, 226-245`             |
| 10  | Contact/StudentWork yozuvlari unread_count cache'ni tozalamaydi              | ⚠️ partial   | **P2**            | `ContactService.php:74-90`; `ContactMessageObserver.php:11-30`   |
| 11  | To'g'ridan-to'g'ri media upload bypass (SVG-XSS/MIME guard)                  | ⚠️ partial   | **P2**            | `PageService.php:277-281`; `StoreSiteMediaRequest.php:21`        |
| 12  | Rules-of-Hooks buzilishi: useMemo early return'dan keyin                     | ✅ confirmed | **P1**            | `TestimonialsSection.tsx:78-90`; `StudentLifeGallery.tsx:25-51`  |
| 13  | Admin page-lock hardcoded "09" paroli (trivial bypass)                       | ✅ confirmed | **P2**            | `sahifalar/page.tsx:28-29`; `usePasswordGuard.tsx:60-82`         |
| 14  | Admin auth faqat client-side; middleware token formatini tekshiradi          | ✅ confirmed | **P2**            | `admin/src/middleware.ts:39-50`; `useAuthStore.ts:8-11, 48-57`   |
| 15  | Database factory'lar eskirgan/buzilgan (column nomi mos kelmaydi)            | ✅ confirmed | **P2**            | `DepartmentFactory.php:25-34` vs migration:13-22 (+7 ta)         |

### Tasdiqlangan P1 xavflar — batafsil

**#1 — phpunit.xml da ochiq DB paroli (P1).**
`backend/phpunit.xml:33` git-tracked faylda:

```xml
<env name="DB_PASSWORD" value="Yoqubjon20022006"/>
```

Bu placeholder emas: ishlaydigan `backend/.env:19-20` aynan shu juftlikni (`DB_USERNAME=postgres`, `DB_PASSWORD=Yoqubjon20022006`) qayta ishlatadi, va `.env.example:20` bo'sh `DB_PASSWORD=` jo'natadi — ya'ni niyat sirlarni bo'sh qoldirish edi. Parol commit tarixiga (9177730) doimiy kirgan. **"Live/production" so'zi bir oz oshirib yuborilgan** — bu fayldagi credential `127.0.0.1` + `tmtu_termiz_test` ga bog'langan, lekin parolning o'zi haqiqiy va qayta ishlatilgan.
**Tuzatish:** (1) phpunit.xml dagi literalni bo'sh/soxta qiymatga almashtiring yoki `.env.testing`/CI secrets'dan foydalaning; (2) postgres parolini **darhol rotatsiya qiling** (tarixda); (3) shared repo bo'lsa tarixdan tozalang (BFG/filter-repo); (4) secret-scanning pre-commit hook qo'shing.

**#5 — StudentWork fayllari PUBLIC diskda (P1).**
`backend/app/Services/StudentWorkService.php:15-19`:

```php
$path = $file->store('student-works', 'public');
```

`backend/app/Http/Resources/StudentWorkResource.php:25`:

```php
'file_path' => $this->file_path ? asset('storage/' . $this->file_path) : null,
```

Bu autentifikatsiyasiz, ochiq URL. StudentWork PII (fullname/email/phone/address + yuklangan ish fayli, ko'pincha rezyume) saqlaydi. Aksincha `JobApplication` private `local` diskda saqlanadi va `url('/api/v1/media/download/{id}')` orqali `auth:sanctum + role:super-admin|admin` bilan himoyalangan — ya'ni private-fayl naqshi mavjud edi, lekin StudentWork'ga qo'llanilmadi. **P1, P0 emas:** Laravel `store()` 40-belgili tasodifiy nom beradi, shuning uchun ketma-ket enumeratsiya mumkin emas; asosiy oqim — submitter'ning o'z 201 javobi yoki referrer/log orqali URL chiqishi.
**Tuzatish:** private `local` diskka (yoki Spatie Media private collection) ko'chiring va auth-protected route orqali bering; `Storage::disk('public')->delete()` ni ham `delete()` da yangilang.

**#12 — Rules-of-Hooks buzilishi (P1).**
`frontend/src/components/home/TestimonialsSection.tsx:78-90`: `useLanguageStore()` (79) → `if (... ) return null;` (81) → `useMemo()` (84). `StudentLifeGallery.tsx:25-51`: `return null` (28) → ikkita `useMemo` (31, 42). Massiv bo'sh↔to'la o'tishida hook soni o'zgaradi va React "Rendered more/fewer hooks" bilan crash beradi. Bu lint smell emas, haqiqiy bug.
**Tuzatish:** barcha `useMemo` chaqiruvlarini `if (...) return null;` guard'idan **YUQORIGA** ko'chiring (bo'sh kirishda while-loop ishlamaydi, shuning uchun xavfsiz).

---

## 3. Rad etilgan / kamaytirilgan da'volar (Refuted/Downgraded)

**#8 — RAD ETILDI (Refuted).** 1-o'tish "rasm upload Windows'da temp `.webp` `SplFileInfo::getSize()` stat xatosi tufayli 500 qaytaradi" deb da'vo qildi. Kod bu xato rejimini **qo'llab-quvvatlamaydi**. `ConvertsToWebp.php:108` temp faylni `UploadedFile(..., test=true)` bilan o'raydi — bu aynan Windows-mos yo'l (`isValid()` `is_uploaded_file()` ni o'tkazib yuboradi, `move()` `rename()` ishlatadi). Temp fayl success-yo'lida **hech qachon unlink qilinmaydi** (yagona `@unlink` line 96 — imagewebp-failure tarmog'ida). Loglardagi yagona haqiqiy 500 — butunlay boshqa bug: `Spatie\Image\Image::crop()` da `int` o'rniga `CropPosition` argument (`laravel-2026-04-08.log:395-396`). **Da'vo soxta sabab — rad etiladi.** (Crop TypeError alohida P2 sifatida qaralishi kerak.)

**Kamaytirilgan da'volar (P0/P1 → P2):**

- **#2** "Commit qilingan sirlar" → P2. Uchta elementdan ikkitasi (DB pass, ADMIN_PASSWORD) git'da **emas** — faqat gitignored ishchi `.env` da. Yagona haqiqiy commit qilingan zaiflik — `config/app.php:33` dagi `REVALIDATION_SECRET` default'i.
- **#3** `fix_dompurify.js` → P2. Skript **hech qachon ishlatilmagan** (postinstall/CI hook yo'q), no-op marker `src/` da **yo'q**, va yo'llari eskirgan (`(main)` o'rniga real `[locale]/(main)`). Dormant footgun, faol XSS emas. **Tuzatish: faylni o'chiring.**
- **#4** Media authz → P2. Texnik da'vo to'g'ri, lekin endpoint'lar `auth:sanctum + role:super-admin|admin` ichida (`api.php:211`) — "har qanday admin", "har qanday user" emas. Adminlar orasidagi gorizontal IDOR.
- **#6** Qidiruv buggi → P2. `@>` scope'lar **dead code** — hech qayerda chaqirilmaydi. Real qidiruv `SearchService` `ILIKE` ishlatadi (prefix-only `$query.'%'`). "Foydalanuvchilar uchun sukut bilan ishlamaydi" da'vosi ishlaydigan `SearchService` bilan zid.
- **#7** Upload o'lcham → P2, lekin **kamaytirilgan emas — kuchaytirilgan**. Haqiqiy cheklov 100M emas, `backend/public/.user.ini` dagi `post_max_size=12M` (PHP-FPM `.user.ini` ni hurmat qiladi). Buzilish oynasi ~12M–500M, da'vo qilingan 100M–500M emas.
- **#10** Cache staleness → P2, **50% noto'g'ri**. Faqat `ContactService` to'g'ri (cache tozalanmaydi). `StudentWorkService` `ModelCacheObserver('student_works')` orqali ro'yxatdan o'tgan — uning badge'i eskirmaydi. Da'vo faqat ContactService'ni nomlashi kerak edi.
- **#11** Media bypass → P2, **da'vo nomlagan fayllar uchun noto'g'ri**. News/Staff/Department `image` qoidasi (Laravel 12 da SVG'ni istisno qiladi) bilan himoyalangan. Haqiqiy bypass faqat **Page** (`StorePageRequest.php:33` da `svg` whitelisted) va **SiteMedia** (`StoreSiteMediaRequest.php:21` da mimes yo'q) da.
- **#15** Factory'lar → P2 (lekin **kengroq**). 11 dan 8 ta factory mavjud bo'lmagan column'lar yozadi, lekin barchasi **dead code** — `backend/tests` da `::factory()` 0 marta, faqat to'g'ri `NewsFactory` seeder'da ishlatiladi.

---

## 4. YANGI topilmalar (New findings) — 1-o'tish o'tkazib yuborgan

### P1 (yuqori jiddiylik)

| App      | Topilma                                                                                                                                                            | file:line                                                                     | Bir qatorli tuzatish                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| backend  | `pages/tree` PUBLIC route'da, nashr qilinmagan draft sahifalarni anonim foydalanuvchilarga beradi                                                                  | `routes/api.php:134` + `PageService.php:98-109`                               | Route'ni `auth:sanctum role:super-admin\|admin` guruhiga ko'chiring yoki `getTree` ga `onlyPublished` flag qo'shing |
| backend  | `MediaBackup` yangi-layout media papkalarini (news/, staff/, private/jobs...) chetlab o'tadi — backup to'liq emas                                                  | `MediaBackup.php:29-32`                                                       | `$sourceDirs` ga `MediaPathGenerator` ishlatadigan barcha model papkalarni qo'shing                                 |
| backend  | `TestimonialFactory`/`DepartmentFactory`/`PartnerFactory` NOT NULL column'larni o'rnatmaydi — `create()` insert xatosi                                             | `TestimonialFactory.php:21-40`; `PartnerFactory.php:16-31`                    | Factory'larni real schema (`name`/`text`/`url`/`sort_order`) ga moslang                                             |
| frontend | `API_BASE = url.replace("/api","")` faqat birinchi `/api`'ni almashtiradi — host'da 'api' bo'lsa production base URL'ni buzadi (`https:/.tashmedunitf.uz/api`)     | `lib/api.ts:4`                                                                | `.replace(/\/api\/?$/, '')` — faqat oxiridagi `/api` ni olib tashlang                                               |
| frontend | privacy & terms sahifalari to'liq hardcoded Uzbek, `[locale]` ni e'tiborsiz qoldiradi; breadcrumb hardcoded `/uz` ga link                                          | `privacy/page.tsx` (butun); `terms/page.tsx` (butun)                          | i18n `s()`/`getLanguage()` qo'shing, `/uz` literallarni locale-aware qiling                                         |
| frontend | `FacultyDetailPage` CTA mavjud bo'lmagan `/qabul` route'iga link (404)                                                                                             | `FacultyDetailPage.tsx:206-212`                                               | href'ni `/${lang}/aloqa` yoki `/abiturientlarga` ga o'zgartiring                                                    |
| admin    | ~9 faoliyat/ilmiy-jurnal admin sahifalari hardcoded mock kontent render qiladi (soxta editorial board, 'IAP 07XXX', 'ISSN: XXXX-XXXX') — admin tahrirlay olmaydi   | `faoliyat/ilmiy-faoliyat/**` va `ilmiy-jurnal/**` (har faylning data massivi) | Kontentni DB-backed `StaticPageAdmin` slug'iga ko'chiring yoki real CRUD ulang                                      |
| infra    | e2e `global-setup.ts` hardcoded noto'g'ri absolut yo'l (`C:/Users/Yoqubjon099/...`) — cache:clear hech qachon ishlamaydi                                           | `e2e_tests/global-setup.ts:6-7`                                               | `path.resolve(__dirname,'..','backend')` ishlating                                                                  |
| infra    | Next.js `NEXT_PUBLIC_API_URL` faqat runtime `environment` sifatida berilgan, build ARG sifatida emas — client bundle noto'g'ri (localhost) API URL'ni baxtga oladi | `frontend/Dockerfile.frontend:14-19`; `admin/Dockerfile.admin:6-11`           | `ARG NEXT_PUBLIC_API_URL` + `ENV` ni builder bosqichida e'lon qiling                                                |

### P2 (o'rta jiddiylik)

**Backend:**

- `FaqCategory` da dublikat semantik qiymatlar: `GENERAL='general'` va `UMUMIY='umumiy'` ikkalasi ham 'Umumiy' label beradi — `options()` ikkita bir xil tanlovni ko'rsatadi. `FaqCategory.php:11-29,35-41`. → `UMUMIY` (legacy) ni `options()` dan filtrlang.
- Enum'lar model qatlamiga **ulanmagan**: `News.category`, `Faq.category`, `Direction.level`, `Faculty.level`, `ContactMessage.status` enum cast'siz xom string. `News.php:19-37`; `ContactMessage.php:15-17,29-34`. → Eloquent `casts()` ga enum cast qo'shing.
- `LibraryResource` da SoftDeletes yo'q (boshqa kontent modellarda bor) — hard delete media yetimlarini qoldiradi. `LibraryResource.php:14-16`. → SoftDeletes qo'shing yoki media cascade'ni tasdiqlang. _(Eslatma: migration `2026_04_12_120000` SoftDeletes'ni ataylab olib tashlagan — forceDelete uchun; ya'ni final schema'da yo'q.)_
- Plain-string `AllowedFilter('name')` translatable JSONB column'larda — buzilgan filtrlash. `FacultyService.php:26`, `DirectionService.php:26-27`, `DepartmentService.php:21`, `StaffService.php:24`. → `AllowedFilter::callback` bilan `name->uz ILIKE` ishlating (commit 7c028d8 dagi naqsh).
- Translatable JSONB column'larda to'g'ridan-to'g'ri `ILIKE` (JSON matn/qavslar bilan moslashadi, locale-blind). `CareerCenterInfoService.php:28-29`, `TalentedStudentService.php:32-33`, `StudentLifePhotoService.php:32`. → `title->uz`/`title->ru`/`title->en` ishlating.
- `MediaObserver` cleanup `media/{id}` yo'lini target qiladi, lekin yangi media `{modelFolder}/{id}/{collection}/` da — barcha yangi media uchun dead. `MediaObserver.php:33-36`. → `MediaPathGenerator` mantig'i bilan moslang.
- `CleanOrphanMedia` faqat legacy `media/` layout'ni skanlaydi — yangi-format yetimlarni aniqlamaydi. `CleanOrphanMedia.php:187-218`. → `MediaCleanup` ga birlashtiring (u ikkala layout'ni boshqaradi).
- `MediaPathGenerator` har bir path resolutsiyasida filesystem `exists()` chaqiradi — list endpoint'larda I/O ko'paytiradi. `MediaPathGenerator.php:99-115`. → per-request memoization qo'shing.
- `pages/by-key`/`{identifier}` public catch-all route'lari admin show route'larini soyalaydi (numeric ID uchun unreachable). `api.php:124 vs 336; 165 vs 324; 169 vs 330`. → dead admin route'larni o'chiring yoki public route'ga `->where('key','[^0-9].*')` qo'shing.
- `down()` dublikat array key `'directions'` ni klobbar qiladi — rollback'da `idx_directions_faculty_id` sizib chiqadi. `2026_04_13_210000_..._indexes.php:97-105`. → `[table,index]` juftliklar ro'yxati ishlating.
- Idempotent bo'lmagan seeder'lar: `TalentedStudentSeeder` (DatabaseSeeder'da, guard'siz `create()`) qayta-ishlatishda dublikat qiladi; `StudentLifePhotoSeeder`, `Navigation/Translation/SiteMedia/CareerCenter/LibraryResource/BizHaqimizda` seeder'lari `DatabaseSeeder->call()` da **yo'q** — qo'lda ishga tushirilishi kerak (hujjatlashtirilmagan). `TalentedStudentSeeder.php:59-73`; `DatabaseSeeder.php:68-81`.
- `media-library.queue_connection_name` default `'database'` — Redis-only stack'ga zid (`queue.php` default `'redis'`). `media-library.php:44`. → ikkalasini `'redis'` qiling.
- `revalidation_secret` hardcoded fallback default. `config/app.php:33`. → null'ga fail qiling (ADMIN_PASSWORD naqshini taqlid qiling).
- Test suite real PostgreSQL (`tmtu_termiz_test`) ga ulanadi — non-hermetic, brittle. `phpunit.xml:28-33`. → ajratilgan test DB / CI provisioning.
- ru/en `validation.php` yo'q — faqat `uz/validation.php`. `backend/lang/ru`, `backend/lang/en`. → ru/en validation tarjimalarini qo'shing.
- `AuthController` hardcoded Uzbek xato stringlari — `messages.login_failed` lang key'lari dead. `AuthController.php:32,45-46,49`. → `__('messages.login_failed')` ishlating.

**Frontend:**

- `umumiy-malumot` & `qabul-komissiyasi` sahifalari mavjud, lekin middleware 308-redirect bilan unreachable; static nav hali ham `umumiy-malumot` ga link (visibly broken). `middleware.ts:7-10,41-61`; `config/navigation.ts:91`. → redirect'larni olib tashlang yoki nav link'ni yangilang.
- `FacultyTabView` CTA middleware 308-redirect qiladigan route'ga ishora qiladi — maxsus sahifa unreachable. `FacultyTabView.tsx:179-186`. → redirect'ni olib tashlang yoki CTA target'ni o'zgartiring.
- `AutoRefresh` har 2s global polling — millionlab foydalanuvchi uchun og'ir yuk; 3 ta muvaffaqiyatsiz refresh'dan keyin `window.location.reload()` (reload loop xavfi); version `globalThis` da (multi-instance'da ishlamaydi). `AutoRefresh.tsx:16-120`.
- `Pagination` har bir sahifa raqamini windowing/ellipsis'siz render qiladi — katta ro'yxatlarda DOM toshib ketadi. `Pagination.tsx:20-47`.
- `CookieConsent` UI stringlari hardcoded Uzbek + privacy link hardcoded `/uz/privacy`. `CookieConsent.tsx:78-115`. → i18n `s()` ishlating.
- `StatsCounterSection` raqamlari hardcoded konstantalar (admin'dan yangilanmaydi) + `toLocaleString("uz-UZ")` barcha locale uchun. `StatsCounterSection.tsx:15-55,87`.
- `LeafletMap`/`ContactMap` marker ikonkalarni unpkg CDN'dan yuklaydi — CSP/offline/IP-leak xavfi. `LeafletMap.tsx:13-21`. → marker asset'larni `/public` da self-host qiling.
- `ContactLocation` name/address `string` deb tiplangan, lekin `t()` translatable orqali o'tkaziladi (aloqa/page.tsx esa `{uz,ru,en}` deb tiplaydi). `filiallar/page.tsx:16-24,88,95,132`.
- Bir nechta hardcoded Uzbek string (i18n bo'shliqlari): `aloqa/page.tsx:19,52,105,109`; `JobApplicationForm.tsx:80`; `tadqiqod-markazi/page.tsx:85`.
- `Organization` JSON-LD `foundingDate:'2024'` — sayt o'zining 2018 asos solinishiga zid. `lib/seo.ts:850`. → '2018' (ideal '2018-03-05').
- nizom leaflari `downloadUrl='#'` — dead download tugmasi. `nizom/institut-nizomi/page.tsx:24-29`; `nizom/tashkiliy-tuzilma/page.tsx:24-29`.
- `yoriqnoma.pdf` mavjud emas (`public/docs/` da yo'q) — 404 download. `yoriqnoma/page.tsx:69-78`.
- Journal `boglanish` `tdtutf.uz` email ishlatadi — kanonik `tashmedunitf.uz` ga zid. `boglanish/page.tsx:27,33`.

**Admin:**

- Faculty-detail kontakt/CTA kartalari **global** site-content key'lardan foydalanadi (`faculty_detail_contact_*`, `faculty_id` suffix'siz) — bitta fakultetni tahrirlash **barcha** fakultet va yo'nalishlarni o'zgartiradi. Barcha 6 ta detail sahifasi. `bakalavriat/fakultet/[id]/page.tsx:130-148`.
- Conference registrations qidiruvi client-side (faqat joriy sahifa), boshqa inbox'lar server-side. `ConferenceRegistrationsAdmin.tsx:91-100`. → backend `filter[name]`/search ishlating.
- `bosh-sahifa` journal admin production UI'da debug overlay qoldiradi (`Hero rasm: /imgs/journal/hero.jpg`). `bosh-sahifa/page.tsx:87-89`.
- `abiturientlarga` o'ng sidebar har doim 'Bakalavriat' ko'rsatadi (`activeDegree` ni e'tiborsiz qoldiradi). `abiturientlarga/page.tsx:522-524,537-540`.
- `tuzilma/filiallar` `<ContactsAdmin />` render qiladi (kontakt xabarlari, filial boshqaruvi emas) — nav label bilan nomuvofiq. `tuzilma/filiallar/page.tsx:7`.
- `contactService.markAsRead` dead VA buzilgan — PUT o'rniga GET, `is_read=true` jo'natmaydi. `contactService.ts:41-44`.
- Detail-cache `setQueryData` numeric id bilan kalitlanadi, lekin slug bilan o'qiladi — optimistic detail yangilanish no-op. `usePages.ts:24-30,64`; `useDepartments.ts:17-23,56`.
- Middleware Sanctum token regex `-`/`_` o'z ichiga olgan tokenlarni rad etadi — redirect loop xavfi. `admin/src/middleware.ts:40-41`.
- `useMe` har qanday query xatosida (transient 500/timeout) logout qiladi, faqat 401 emas. `useAuth.ts:46-65`. → faqat 401'da logout.
- axios global timeout 10s katta multipart upload'larga qo'llaniladi — abort. `admin/src/lib/api.ts:5-12`. → upload uchun uzunroq per-request timeout.
- Auth token localStorage VA non-HttpOnly cookie'da — ikki XSS-fosh joy. `useAuthStore.ts:8-11,26-58`.
- `JournalIssuesCrudAdmin` `date` ni `datetime-local` sifatida render qiladi, lekin ma'lumot `yyyy-MM-dd` — date picker bo'sh ko'rinadi. `JournalIssuesCrudAdmin.tsx:32,207,224`; `EditModal.tsx:340-356`.
- `MediaUploader` object URL'larni leak qiladi (no `revokeObjectURL`). `MediaUploader.tsx:68-71,173,211`.
- `VirtualQabulxonaAdmin` autentifikatsiyasiz xom `fetch('.../contact/stats')` — agar route protected bo'lsa 401. `VirtualQabulxonaAdmin.tsx:54-59`.
- `sections/` ichida 351-qatorli `.prompt.md` rejalashtirish hujjati commit qilingan. `# Admin Panel Inline Editing Redesign Pl.prompt.md`. → `/docs` ga ko'chiring yoki o'chiring.

**Infra:**

- docker-compose `APP_KEY`/`DB_PASSWORD`/`REVALIDATION_SECRET` default'siz; `REDIS_PASSWORD` 5 joyda hardcoded `'RedisStr0ng!Pass2026'`. `docker-compose.yml:15,24,27,35,80,113,153`. → secret'larni majburlang, Redis parolini o'zgartiring.
- CI deploy `docker compose down` + `build --no-cache` har push'da — to'liq downtime (deploy.sh "zero-downtime" brendi bilan zid). `.github/workflows/ci.yml:223-231`.
- `deploy.sh` `/var/run/php-fpm.pid` o'qiydi (systemd setup uni yaratmaydi) — `opcache.validate_timestamps=0` bilan yangi kod deploy'da faollashmaydi. `deploy.sh:118-122`.
- Ikki nomuvofiq deploy modeli birga yashaydi (bare-metal `deploy.sh` vs Docker compose) — qaysi biri kanonikligini aytuvchi hujjat yo'q. `deploy.sh:29-32` vs `Dockerfile`.

### P3 (past jiddiylik) — qisqacha

Dead code: `FileType` enum (`FileType.php:8-46`), `UserRole` enum (`UserRole.php:10-54`), `hooks/useApi.ts` butun fayl (0 importer), `constants.ts` `STATS`/`ITEMS_PER_PAGE` exports, `AntiCard`/`LawCard`/`ContactCard` (frontend & admin, hech qachon import qilinmaydi), `cleanDescription()`/`Icon` 3 ta direction [id] sahifasida, `e2e 09` da ishlatilmagan `FormData`. I18n: ~12 frontend leaf sahifalarida hardcoded Uzbek string/aria-label/inline ternary; 10+ controller `__('messages.models.*')` o'rniga hardcoded Uzbek model nomlari. A11y: bir nechta static sahifa `<h1>` o'rniga `<h2>` ishlatadi (heading ierarxiyasi); `VideoPlayer` mute ikonkasi holatni aks ettirmaydi (`VideoPlayer.tsx:11-13`). Perf: `next/image unoptimized` journal sahifalarida keng tarqalgan; `useScrollDirection`/`useMediaQuery` ortiqcha re-subscribe. Security: CSP faqat `frame-ancestors 'self'` (`next.config.ts:11`) — script/style/connect himoyasi yo'q; `ENT_NOQUOTES` barcha escape helper'larda (attribute breakout); kutubxona PDF iframe `allow-scripts`. Misc: Cyrillic homoglyph funksiya nomlari (`Bakalavriат...`, frontend & admin), domen brendi bo'linishi (`tdtutf.uz` vs `tashmedunitf.uz`), server spec hujjatlarda 5 xil qiymat.

---

## 5. 1-o'tishga tuzatishlar (Corrections to the architecture map)

- **JSONB qidiruv bir xil `ILIKE` EMAS:** faqat News, LibraryResource, JournalIssue `ILIKE` substring; Department/Direction/Staff/Faq/Page `@>` exact containment ishlatadi (lekin bu scope'lar dead code). "GIN-indexed multilingual search" umumlashtirishi bu beshtasi uchun noto'g'ri.
- **Enum'lar model'larga ko'pincha ulanmagan:** `NewsCategory`, `DirectionLevel`, `FaqCategory`, `ContactStatus` Eloquent cast sifatida ishlatilmaydi; `UserRole`, `FileType` butunlay dead. Enum'lar model qatlamida majburiy haqiqat manbai emas.
- **Hamma kontent modeli soft-delete QILMAYDI:** `LibraryResource` va `StudentWork` final schema'da soft-delete yo'q (`2026_04_12_120000/130000` dropSoftDeletes); `SiteContent`, `Translation` ham yo'q.
- **`pages/tree` admin endpoint EMAS:** PUBLIC route guruhida (`api.php:134`), `getTree` nashr qilinmagan sahifalarni qaytaradi — real oshkorlik.
- **Effektiv RBAC ikki-darajali (super-admin, admin), uch emas:** `editor` roli yaratilishi mumkin, lekin hech bir route unga huquq bermaydi (dead). `api.php:200-355`.
- **Public/admin ko'rinish SERVICE qatlamida amalga oshiriladi**, controllers'da emas (controllers `$isAdmin` hisoblab `!$isAdmin` ni service'ga uzatadi). Ko'p `show()` metodlari `onlyPublished` flag uzatmaydi — pass-3 service tekshiruvi kerak.
- **Media storage layout `media-library.prefix` ni e'tiborsiz qoldiradi:** custom `MediaPathGenerator` `{modelFolder}/{id}/{collection}/` da saqlaydi. Bir nechta cleanup/backup/observer utilita'lari hali ham legacy `media/{id}` ni taxmin qiladi (noto'g'ri/to'liqsiz).
- **Ikkita ustma-ust orphan-cleanup buyrug'i:** `media:clean-orphans` (legacy-only) va `media:cleanup` (ikkala layout) — divergent.
- **`ContactMessage` universal observer'da emas:** maxsus `ContactMessageObserver` faqat log yozadi (cache invalidation yo'q). `JobApplication` da umuman observer yo'q.
- **Page `ModelCacheObserver` bilan ikki marta ro'yxatdan o'tgan** (PREFIX_PAGES + PREFIX_NAV) — bitta Page yozuvi ikkita revalidation HTTP POST keltirib chiqaradi. `AppServiceProvider.php:66-67`.
- **Revalidation kanali SSE EMAS:** `revalidate/stream/route.ts` oddiy GET `{version}` qaytaradi, brauzer har 2s polling qiladi; version `globalThis.__revalidateVersion` da (multi-instance'da tarqalmaydi).
- **Client data-fetching layer (`useApi.ts`) 100% dead** — barcha public-sayt fetch'i `lib/services.ts` orqali SSR.
- **`umumiy-malumot`/`qabul-komissiyasi` jonli sahifalar emas** — middleware 308-redirect bilan unreachable.
- **`revalidateTag(tag, "default")` Next 16'da to'g'ri** (profile arg majburiy) — bug emas. `revalidatePath(path,"layout")` ham to'g'ri.
- **`Rule::in(Enum::cases())` bug EMAS** — Laravel 12 `In.php:50` `enum_value()` chaqiradi.
- **Test framework PHPUnit 11, Pest emas** (`composer.json` `phpunit/phpunit ^11.5`, `pestphp/pest` yo'q). Commit nomi "Pest tests" noto'g'ri. `tests/Unit` da faqat `.gitkeep` ('placeholder').
- **PHP floor 8.2** (`composer.json "php": "^8.2"`), 8.3 emas. `backend/README.md` "Laravel 11 / PHP 8.4" deydi — eskirgan/noto'g'ri.
- **`media.conf` Docker image'da ishlatilmaydi** — Dockerfile faqat `default.conf` ni copy qiladi (`Dockerfile:73`). `media.conf` ning boy qoidalari (aio, X-Accel) faqat bare-metal'da.
- **`/api/health` endpoint** (v1 ostida emas) mavjud, `{status,services,version}` qaytaradi, throttle 10/min — API xaritasiga qo'shing.
- **`console.php` to'liq production cron jadvali** (cache:warm, db:backup, media:cleanup...), faqat 'inspire' emas.
- **Backend i18n qisman:** messages 3 locale, validation faqat uz.
- **Stack Redis-primary, lekin database fallback'lar tarqalgan** (queue failed.driver, media-library queue_connection_name).

---

## 6. Qamrov tasdig'i (Coverage attestation)

Bu o'tishda quyidagi har bir papka/segment to'liq o'qildi (`fullyCovered=true` har biri uchun tasdiqlangan):

- **Backend:** models+enums (31/31), migrations+seeders+factories (79), controllers+routes+middleware (34), FormRequests (47/47), Resources (24 + 2 yordamchi model = 26), services+traits+observers+providers+console+bootstrap (50), config+lang+tests+phpunit.xml+composer.json (22).
- **Frontend:** static leaf sahifalar (56), dynamic pages+app shell+SEO (42), components (54/54), lib+hooks+store+providers+config+data+types+middleware+build (36).
- **Admin:** dashboard pages+login/forgot/reset/api/layout (122/122), components (77/77), lib+services+hooks+store+providers+config+types+middleware+build (73; aniq sanoq: 25 service fayl).
- **Infra/e2e/docs:** Docker, nginx, deploy skriptlar, CI, e2e spec'lar, barcha `.md` (38).

**Halol bo'shliqlar (gaps):**

1. **Shared template ichki xulqi:** `StaticPageAdmin`, `EditModal` (admin `@/components/templates`) tegishli segmentlarda o'qildi, lekin ularning to'liq slug-vs-id va FormData↔JSON parse semantikasi pass-3 da chuqurroq tasdiqlanishi kerak (#4 P1 mock-data topilmasining tiklanuvchanligi shunga bog'liq).
2. **`vendor/` va `node_modules/`:** faqat load-bearing fayllar nuqtali o'qildi (Laravel `In.php`/`ValidatesAttributes.php`, Symfony `UploadedFile.php`, Spatie `FileAdder.php`, Next `revalidate.d.ts`) — to'liq emas (kutilgan, audit doirasidan tashqari).
3. **Service-layer `onlyPublished` default'lari:** single `show()` endpoint'lari nashr qilinmagan elementlarni ID/slug orqali qaytarishi mumkinligi (5-bo'limda qayd etilgan) pass-3 da har bir service `getAll`/`findBy*` default'i bo'yicha tasdiqlanishi kerak.
4. **CSS sinflari:** a11y `.a11y-font-serif` kabi sinflar `globals.css` da iste'mol qilinishini tasdiqlash kerak (JS kontrakt to'g'ri).

Bulardan tashqari **har bir loyiha kodi fayli to'liq o'qildi**.

---

## 7. Yakuniy ustuvor harakatlar (Top prioritized action list)

### P0 — DARHOL (sir/credential)

1. **postgres parolini rotatsiya qiling** (`Yoqubjon20022006`) — u `phpunit.xml:33` da commit qilingan (git tarixida) VA ishchi `.env` da qayta ishlatilgan. `phpunit.xml` literalini bo'sh/soxta qiymatga almashtiring; shared repo bo'lsa tarixdan tozalang (BFG/filter-repo). [#1]
2. **`REDIS_PASSWORD` ni o'zgartiring** — `docker-compose.yml` da 5 joyda hardcoded `'RedisStr0ng!Pass2026'`. [Infra]
3. **`REVALIDATION_SECRET` ni rotatsiya qiling va `config/app.php:33` default'ini olib tashlang** (null'ga fail qiling). [#2]

### P1 — Tezkor (oshkorlik, buzilgan production)

4. **`pages/tree` ni `auth:sanctum role:super-admin|admin` ga ko'chiring** — hozir anonim draft-sahifa oshkorligi. [YANGI P1, `api.php:134`]
5. **StudentWork fayllarini private `local` diskka ko'chiring** + auth-protected download route; `asset('storage/...')` ni almashtiring. [#5]
6. **`API_BASE` regex'ini tuzating** (`.replace(/\/api\/?$/,'')`) — aks holda production'da yuklangan rasmlar 404. [YANGI P1, `api.ts:4`]
7. **Rules-of-Hooks tuzating** — `TestimonialsSection.tsx` va `StudentLifeGallery.tsx` da `useMemo` ni early return'dan yuqoriga ko'chiring. [#12]
8. **Docker'da `NEXT_PUBLIC_API_URL` ni build ARG qiling** (frontend & admin Dockerfile) — aks holda client bundle noto'g'ri API URL bilan ship bo'ladi. [YANGI P1, Infra]
9. **`MediaBackup` `$sourceDirs` ga barcha yangi-layout papkalarni qo'shing** (private/jobs ham) — hozir backup deyarli barcha media'ni chetlab o'tadi. [YANGI P1, DR bo'shlig'i]
10. **`FacultyDetailPage` CTA `/qabul` → `/aloqa`** (404 tuzatish). [YANGI P1]
11. **privacy/terms sahifalarini i18n-aware qiling** + hardcoded `/uz` link'larni tuzating. [YANGI P1]
12. **CI deploy zero-downtime qiling** — `docker compose down` + `--no-cache` ni rolling build/up bilan almashtiring; `deploy.sh` FPM reload'ni tuzating (OPcache `validate_timestamps=0` bilan). [YANGI P1, Infra]

### P2 — Rejalashtirilgan

13. Admin faculty-detail kartalarini per-entity key'larga o'tkazing (`faculty_id` suffix) — hozir global overwrite. [YANGI P2]
14. ~9 ta faoliyat/ilmiy-jurnal admin sahifasidagi hardcoded mock kontentni DB-backed qiling yoki real CRUD ulang. [YANGI P1/P2]
15. ContactService cache invalidation qo'shing (`ConferenceRegistrationService` naqshi) yoki `ModelCacheObserver('contact')` orqali ro'yxatdan o'tkazing. [#10]
16. Translatable JSONB filter/search/sort'larni tuzating (`FacultyService`/`DirectionService`/`DepartmentService`/`StaffService`/`CareerCenterInfoService`/`TalentedStudentService` — `name->uz ILIKE`). [YANGI P2]
17. Page reparent'da nasldoshlar `path`/`depth` ni rekursiv qayta hisoblang (`PageService::update/reorder`). [#9]
18. Media upload bypass'ni yoping: `StorePageRequest` dan `svg` ni olib tashlang/SVG-XSS scan qo'shing; `StoreSiteMediaRequest` `file` ga mimes allowlist qo'shing. [#11]
19. `fix_dompurify.js` faylini va `sections/*.prompt.md` ni o'chiring. [#3, YANGI P2]
20. Buzilgan factory'larni schema'ga moslang (`order→sort_order`, `head_of_department→head_name`, Partner/Testimonial qayta yozish). [#15]
21. Admin: `useMe` faqat 401'da logout; axios upload timeout'ni oshiring; `contactService.markAsRead` ni PUT qiling yoki o'chiring; conference qidiruvni server-side qiling. [YANGI P2]
22. docker-compose secret'larni majburlang; Next tier'larga healthcheck + `depends_on: service_healthy` qo'shing. [Infra]

### P3 — Tozalash (texnik qarz)

23. Dead code o'chirish (`useApi.ts`, `FileType`/`UserRole` enum, `AntiCard`/`LawCard`/`ContactCard`, dead route'lar, dublikat factory/serializer).
24. I18n bo'shliqlarini yoping (ru/en `validation.php`, hardcoded Uzbek string'lar, `__('messages.models.*')`).
25. CSP'ni kengaytiring (`script-src`/`connect-src`/`img-src`); `ENT_QUOTES` ga o'ting; Leaflet marker'larni self-host qiling.
26. Domen brendini birlashtiring (`tashmedunitf.uz`); JSON-LD `foundingDate` ni '2018' ga; e2e `global-setup.ts` yo'lini `path.resolve` qiling; stale README/DEPLOYMENT email/spec'larni tuzating.
