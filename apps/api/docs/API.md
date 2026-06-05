# TMTU Termiz Filiali — API Documentation

Laravel 12 REST API — **146 endpoints** across 27 controllers.

**Base URL:** `http://localhost:8000/api` (or `https://api.tashmedunitf.uz/api` in production)
**Authentication:** Bearer token (Laravel Sanctum)
**Rate Limiting:** 120 req/min global, stricter on sensitive endpoints
**Response Format:** Always `{ success: boolean, message: string, data: T | null, errors?: object }`

---

## 🔑 Authentication

### POST `/api/v1/auth/login`
Log in and receive access token.

**Body:** `{ email: string, password: string }`
**Response:** `{ data: { user: User, token: string } }`
**Errors:**
- `422` — invalid credentials (shows remaining attempts)
- `429` — lockout after 5 failed attempts (15-minute cooldown)

**Rate limit:** 20/min

### POST `/api/v1/auth/forgot-password`
Request password reset email.

**Body:** `{ email: string }`
**Response:** Always 200 success (prevents email enumeration)
**Rate limit:** 10/min + 5/hour per email+IP

### POST `/api/v1/auth/reset-password`
Reset password with token from email.

**Body:** `{ email, token, password, password_confirmation }`
**Token TTL:** 60 minutes
**Rate limit:** 10/min

### POST `/api/v1/auth/logout` *(auth)*
Revoke current token.

### GET `/api/v1/auth/me` *(auth)*
Get current user + roles + permissions.

---

## 📰 Content Endpoints (public read)

All content endpoints support: `?page=1&per_page=15&q=search` query params.
Response includes pagination `meta: { current_page, last_page, total, per_page }`.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/news` | News list (paginated) |
| GET | `/v1/news/{identifier}` | News by id or slug |
| GET | `/v1/departments` | Kafedralar |
| GET | `/v1/departments/{slug}` | Department detail |
| GET | `/v1/staff` | Personnel list |
| GET | `/v1/staff/{id}` | Staff member detail |
| GET | `/v1/faculties` | Faculties |
| GET | `/v1/faculties/{id}` | Faculty detail |
| GET | `/v1/directions` | Study programs |
| GET | `/v1/directions/{id}` | Program detail |
| GET | `/v1/faqs` | FAQ list |
| GET | `/v1/testimonials` | Testimonials |
| GET | `/v1/talented-students` | Talented students showcase |
| GET | `/v1/career-center-infos` | Career center |
| GET | `/v1/student-life-photos` | Photo gallery |
| GET | `/v1/partners` | Partner institutions |
| GET | `/v1/banners` | Active banners (homepage slider) |
| GET | `/v1/library-resources` | Library resources |
| GET | `/v1/journal-issues` | Academic journals |
| GET | `/v1/contact-locations` | Contact offices |
| GET | `/v1/site-media` | Embedded videos/media by key |
| GET | `/v1/site-contents/{section}` | CMS blocks |
| GET | `/v1/translations` | UI i18n strings |
| GET | `/v1/search?q=...` | Global full-text search (GIN-indexed) |

### Pages (hierarchical)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/pages` | All pages |
| GET | `/v1/pages/{slug}` | Page by slug |
| GET | `/v1/pages/tree` | Full tree structure |
| GET | `/v1/pages/navigation` | Top-level nav only |
| GET | `/v1/pages/by-path/{path}` | By nested path |

### Media
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/media/{modelType}/{modelId}` | Get media for a model (modelType: news, department, staff, direction, banner, partner, page, journal-issue) |

---

## 📝 Public Submissions (unauthenticated POST)

Throttled to prevent spam.

| Method | Path | Rate | Description |
|--------|------|------|-------------|
| POST | `/v1/contact` | 10/min | Contact form — required: name, email, phone, subject, message |
| POST | `/v1/conference-registrations` | 10/min | Register for conference — news_id, first_name, last_name, email, phone |
| POST | `/v1/job-applications` | 10/5min | Job application — name, last_name, phone, email, position, citizenship, birthday |
| POST | `/v1/student-works` | 10/5min | Submit student work — fullname, organization, address, phone, email, faculty, course, work_title, work_description, **file** (PDF/DOC/DOCX) |

---

## 🔐 Admin CRUD (role: super-admin \| admin)

All require `Authorization: Bearer <token>`.
Write endpoints accept JSON body matching model schema (translatable fields as `{uz, ru, en}` objects).

Pattern per resource (e.g., `news`):
- `GET /v1/news` — (public, but admins see drafts too)
- `POST /v1/news` — create
- `GET /v1/news/{id}` — show
- `PUT /v1/news/{id}` — update (partial OK)
- `DELETE /v1/news/{id}` — soft delete

**Resources with full CRUD:** news, departments, staff, faculties, directions, faqs, banners, partners, testimonials, pages, talented-students, career-center-infos, student-life-photos, library-resources, journal-issues, site-media, translations, contact-locations

### Pages (extra operations)
- `PUT /v1/pages/reorder` — reorder tree (drag-drop)

### Site Contents (key-based)
- `GET /v1/site-contents` — admin view
- `PUT /v1/site-contents` — upsert by key
- `PUT /v1/site-contents/batch` — bulk upsert
- `POST /v1/site-contents/upload-image` — inline editor image upload
- `DELETE /v1/site-contents/{key}` — by key

### Translations
- `GET /v1/translations/admin` — all keys incl. drafts
- `POST /v1/translations/bulk-import` — JSON import

### Submissions (read + manage)
- `GET /v1/contacts` — contact messages
- `GET /v1/contacts/unread/count` — unread badge counter
- `PUT /v1/contacts/{id}` — mark as read/accepted/completed
- `DELETE /v1/contacts/{id}`
- Similar for: `conference-registrations`, `job-applications`, `student-works`

### Media Management
- `POST /v1/media/upload` — multipart/form-data: `file`, `type` (image|video|audio|document|file), `model_type` (slug), `model_id`, `collection`
- `GET /v1/media/download/{id}`
- `GET /v1/media/stream/{id}`
- `DELETE /v1/media/{id}`
- `GET /v1/media/stats`

---

## 👥 User Management (role: super-admin only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/users?q=search&per_page=15` | Paginated admin list |
| POST | `/v1/users` | Create: name, email, password, role (super-admin\|admin\|editor) |
| GET | `/v1/users/{id}` | User detail |
| PUT | `/v1/users/{id}` | Update (password optional) |
| DELETE | `/v1/users/{id}` | Delete (can't delete self / last super-admin) |

---

## 🏥 System

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check — DB + cache status |

---

## 📋 Standard Response Envelope

**Success:**
```json
{
  "success": true,
  "message": "Success",
  "data": {...},
  "meta": {                  // only for paginated
    "current_page": 1,
    "last_page": 34,
    "per_page": 10,
    "total": 332
  }
}
```

**Error (validation):**
```json
{
  "success": false,
  "message": "Validatsiya xatolik",
  "errors": {
    "email": ["Email formati noto'g'ri."]
  }
}
```

**Error (not found / forbidden):**
```json
{
  "success": false,
  "message": "Sahifa topilmadi",
  "errors": null
}
```

---

## 🛡️ Security Headers

- `ETag` — for 304 Not Modified caching
- `Cache-Control: public, max-age=300, stale-while-revalidate=150` (on GET)
- `Vary: Accept, Accept-Encoding, Accept-Language`
- `Access-Control-Allow-Origin: <FRONTEND_URL>` (CORS)
- `Access-Control-Allow-Credentials: true`

---

## 🌐 Multilingual (Translatable) Fields

All `translatable` fields accept/return JSON with 3 keys:
```json
{ "uz": "...", "ru": "...", "en": "..." }
```

If a locale is missing, fallback is used in this order: `uz → ru → en → empty`.
At least one locale is required for create.
