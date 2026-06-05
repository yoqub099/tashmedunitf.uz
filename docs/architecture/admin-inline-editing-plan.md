# Admin Panel Inline Editing Redesign Plan

## Overview

Transform the admin panel from a traditional sidebar-based CRUD dashboard into a frontend-mirror with inline editing capabilities (WordPress/Wix style). The admin sees the exact same UI as the public frontend, but with hover-to-edit overlays on every content section.

## Rebuild Strategy: TO'LIQ TOZALASH (Clean Rebuild)

`admin/src/` folder to'liq o'chiriladi va noldan qayta yoziladi. Frontend folder tizimiga mos ravishda professional darajada quriladi.

**Sababi**: Eski kod sidebar-based CRUD pattern da yozilgan — inline editing arxitekturasiga mos kelmaydi. Toza boshlanish = toza kod.

## Current State

- **Admin**: Sidebar layout, 10 entity CRUD pages, working auth (Sanctum + cookies)
- **Frontend**: Top header navigation, 23 hardcoded placeholder pages, no API calls
- **Backend**: 46 API endpoints (14 public GET, 27 admin CRUD, 2 public POST)
- **Stack**: Next.js 16.1.6, React 19.2.3, Tailwind CSS 4, TanStack Query 5, Zustand 5

## Design Principles

- No sidebar — top header only, matching frontend design
- Admin sees the real frontend pages with edit overlays
- Hover over any section → blue border + edit/delete/add buttons appear
- Dashboard becomes a dropdown/modal accessed from header avatar
- Full media support: images, video, gif, pdf (drag & drop upload)
- Translatable fields: UZ (required), RU, EN tabs in edit modals

---

## TO'LIQ FOLDER TIZIMI (Clean Rebuild)

### Frontend folder tizimi (REFERENCE — shunga qarab quramiz)

```
frontend/src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── (main)/
│       ├── layout.tsx
│       ├── page.tsx                          # Bosh sahifa
│       ├── abiturientlarga/
│       │   ├── page.tsx
│       │   ├── bakalavriat/page.tsx
│       │   ├── magistratura/page.tsx
│       │   └── ordinatura/page.tsx
│       ├── aloqa/page.tsx
│       ├── biz-haqimizda/
│       │   ├── page.tsx
│       │   ├── rahbariyat/page.tsx
│       │   ├── tarix/page.tsx
│       │   └── tuzilma/page.tsx
│       ├── faoliyat/
│       │   ├── page.tsx
│       │   ├── ilmiy/
│       │   │   ├── page.tsx
│       │   │   └── konferensiyalar/
│       │   │       ├── page.tsx
│       │   │       └── [id]/page.tsx
│       │   └── klinik/page.tsx
│       ├── faq/page.tsx
│       ├── kafedralar/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── talabalarga/
│       │   ├── page.tsx
│       │   ├── karyera-markazi/page.tsx
│       │   └── kutubxona/page.tsx
│       └── yangiliklar/
│           ├── page.tsx
│           └── [id]/page.tsx
├── components/
│   ├── home/
│   │   ├── AdvantagesSection.tsx
│   │   ├── DirectionsSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── LocationSection.tsx
│   │   ├── MissionSection.tsx
│   │   ├── NewsSection.tsx
│   │   ├── PartnersSection.tsx
│   │   └── TestimonialsSection.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── MobileMenu.tsx
│   └── shared/
│       ├── Badge.tsx
│       ├── Breadcrumb.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Container.tsx
│       ├── Pagination.tsx
│       ├── SearchModal.tsx
│       └── SectionTitle.tsx
├── config/
│   ├── navigation.ts
│   └── site.ts
├── hooks/
│   ├── useApi.ts
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useScrollDirection.ts
├── lib/
│   ├── api.ts
│   ├── constants.ts
│   ├── services.ts
│   └── utils.ts
├── providers/
│   └── QueryProvider.tsx
├── store/
│   ├── useLanguageStore.ts
│   └── useUIStore.ts
└── types/
    ├── css.d.ts
    └── index.ts
```

### YANGI Admin folder tizimi (TO'LIQ NOLDAN)

```
admin/src/
│
├── middleware.ts                              # Auth route protection
│
├── app/
│   ├── globals.css                           # Global styles (Tailwind + custom)
│   ├── layout.tsx                            # Root layout (providers, fonts)
│   ├── not-found.tsx                         # 404 sahifa
│   │
│   ├── login/
│   │   └── page.tsx                          # Admin login sahifasi
│   │
│   └── (dashboard)/                          # Auth-protected zona
│       ├── layout.tsx                        # Top header layout (NO SIDEBAR!)
│       ├── page.tsx                          # Bosh sahifa (inline editable)
│       │
│       ├── yangiliklar/                      # = frontend /yangiliklar
│       │   ├── page.tsx                      # News grid (inline edit)
│       │   └── [id]/
│       │       └── page.tsx                  # News detail (inline edit)
│       │
│       ├── kafedralar/                       # = frontend /kafedralar
│       │   ├── page.tsx                      # Departments list (inline edit)
│       │   └── [slug]/
│       │       └── page.tsx                  # Department detail (inline edit)
│       │
│       ├── xodimlar/                         # Staff management
│       │   └── page.tsx                      # Staff grid (inline edit)
│       │
│       ├── yonalishlar/                      # = frontend /abiturientlarga
│       │   └── page.tsx                      # Directions list (inline edit)
│       │
│       ├── faq/
│       │   └── page.tsx                      # FAQ accordion (inline edit)
│       │
│       ├── sahifalar/                        # Static pages management
│       │   ├── page.tsx                      # Pages list
│       │   └── [slug]/
│       │       └── page.tsx                  # Page detail (inline edit)
│       │
│       ├── aloqa/                            # Contact messages
│       │   ├── page.tsx                      # Messages list + mark as read
│       │   └── [id]/
│       │       └── page.tsx                  # Message detail
│       │
│       ├── bannerlar/                        # Banner management
│       │   └── page.tsx                      # Banners (inline edit, reorder)
│       │
│       ├── hamkorlar/                        # Partners management
│       │   └── page.tsx                      # Partners grid (inline edit)
│       │
│       ├── izohlar/                          # Testimonials
│       │   └── page.tsx                      # Testimonials (inline edit)
│       │
│       └── sozlamalar/                       # Admin settings
│           └── page.tsx                      # Site settings, profile
│
├── components/
│   │
│   ├── layout/                               # Layout components
│   │   ├── AdminTopHeader.tsx                # Main header (frontend Header mirror)
│   │   ├── AdminAvatar.tsx                   # Profile dropdown (logout, settings)
│   │   ├── DashboardDropdown.tsx             # Stats + quick actions dropdown
│   │   ├── NotificationBell.tsx              # Unread contacts notification
│   │   ├── MobileMenu.tsx                    # Hamburger menu (frontend mirror)
│   │   ├── Footer.tsx                        # Footer (frontend mirror)
│   │   └── LanguageSwitcher.tsx              # UZ/RU/EN switcher
│   │
│   ├── inline-edit/                          # Core inline editing system
│   │   ├── EditableWrapper.tsx               # Hover overlay + action buttons
│   │   ├── EditModal.tsx                     # Universal edit modal
│   │   ├── LanguageTabs.tsx                  # UZ/RU/EN form tabs
│   │   ├── MediaUploader.tsx                 # Drag & drop (img/video/gif/pdf)
│   │   ├── RichTextEditor.tsx                # TipTap editor
│   │   └── ConfirmDialog.tsx                 # Delete confirmation
│   │
│   ├── sections/                             # Home page editable sections
│   │   ├── EditableHero.tsx                  # Hero banner section
│   │   ├── EditableMission.tsx               # Mission section
│   │   ├── EditableDirections.tsx            # Directions cards
│   │   ├── EditableAdvantages.tsx            # Advantages section
│   │   ├── EditableTestimonials.tsx          # Testimonials carousel
│   │   ├── EditableNews.tsx                  # Latest news section
│   │   ├── EditablePartners.tsx              # Partners logos
│   │   └── EditableLocation.tsx              # Map + contact info
│   │
│   └── shared/                               # Reusable UI components
│       ├── Badge.tsx                         # Status badges
│       ├── Breadcrumb.tsx                    # Page breadcrumbs
│       ├── Button.tsx                        # Button variants
│       ├── Card.tsx                          # Content cards
│       ├── Container.tsx                     # Max-width container
│       ├── DataTable.tsx                     # Table for contacts list
│       ├── Input.tsx                         # Form input
│       ├── Select.tsx                        # Form select
│       ├── Modal.tsx                         # Base modal
│       ├── Pagination.tsx                    # Page navigation
│       ├── SearchModal.tsx                   # Global search (Ctrl+K)
│       ├── SectionTitle.tsx                  # Section headings
│       ├── Skeleton.tsx                      # Loading skeletons
│       ├── Toast.tsx                         # Success/error notifications
│       └── EmptyState.tsx                    # Empty content placeholder
│
├── config/                                   # App configuration
│   ├── navigation.ts                         # Header nav items + admin items
│   └── site.ts                               # Site metadata, API URL, colors
│
├── hooks/                                    # React Query hooks (CRUD)
│   ├── useBanners.ts                         # Banner CRUD hooks
│   ├── useContacts.ts                        # Contact list + markAsRead
│   ├── useDashboard.ts                       # Dashboard stats hook
│   ├── useDepartments.ts                     # Department CRUD hooks
│   ├── useDirections.ts                      # Direction CRUD hooks
│   ├── useFaqs.ts                            # FAQ CRUD hooks
│   ├── useNews.ts                            # News CRUD hooks
│   ├── usePages.ts                           # Pages CRUD hooks
│   ├── usePartners.ts                        # Partner CRUD hooks
│   ├── useStaff.ts                           # Staff CRUD hooks
│   ├── useTestimonials.ts                    # Testimonial CRUD hooks
│   ├── useDebounce.ts                        # Input debounce
│   ├── useMediaQuery.ts                      # Responsive breakpoints
│   └── useScrollDirection.ts                 # Header hide on scroll
│
├── lib/                                      # Core utilities
│   ├── api.ts                                # Axios instance + interceptors
│   ├── constants.ts                          # App constants
│   ├── utils.ts                              # Helper functions (cn, formatDate...)
│   └── services/                             # API service functions
│       ├── auth.ts                           # Login, logout, getMe
│       ├── banners.ts                        # Banner API calls
│       ├── contacts.ts                       # Contact API calls
│       ├── dashboard.ts                      # Dashboard stats API
│       ├── departments.ts                    # Department API calls
│       ├── directions.ts                     # Direction API calls
│       ├── faqs.ts                           # FAQ API calls
│       ├── news.ts                           # News API calls
│       ├── pages.ts                          # Pages API calls
│       ├── partners.ts                       # Partner API calls
│       ├── staff.ts                          # Staff API calls
│       └── testimonials.ts                   # Testimonial API calls
│
├── providers/                                # React context providers
│   └── QueryProvider.tsx                     # TanStack Query provider
│
├── store/                                    # Zustand stores
│   ├── useAuthStore.ts                       # Auth state (token, user, persist)
│   └── useUIStore.ts                         # UI state (modals, mobile menu)
│
└── types/                                    # TypeScript types
    ├── index.ts                              # All entity types
    └── inline-edit.ts                        # EditableWrapper, FieldConfig types
```

### Fayl soni taqqoslash

| Kategoriya  | Eski admin   | Yangi admin  | Frontend (reference) |
| ----------- | ------------ | ------------ | -------------------- |
| app/ pages  | 31 fayl      | 22 fayl      | 23 fayl              |
| components/ | 21 fayl      | 30 fayl      | 20 fayl              |
| hooks/      | 10 fayl      | 14 fayl      | 4 fayl               |
| lib/        | 15 fayl      | 15 fayl      | 4 fayl               |
| config/     | 0 fayl       | 2 fayl       | 2 fayl               |
| store/      | 1 fayl       | 2 fayl       | 2 fayl               |
| types/      | 1 fayl       | 2 fayl       | 2 fayl               |
| providers/  | 1 fayl       | 1 fayl       | 1 fayl               |
| **JAMI**    | **~85 fayl** | **~90 fayl** | **~62 fayl**         |

### Asosiy farqlar (Eski vs Yangi)

| Eski admin                                           | Yangi admin                                        |
| ---------------------------------------------------- | -------------------------------------------------- |
| Sidebar + sidebar navigation                         | Top header (frontend mirror)                       |
| `/news/create/page.tsx`, `/news/[id]/edit/page.tsx`  | EditModal popup — alohida sahifa yo'q              |
| 10 ta EntityForm component (BannerForm, NewsForm...) | 1 ta EditModal + FieldConfig — universal           |
| RichTextEditor = textarea                            | RichTextEditor = TipTap (toolbar, media)           |
| config/ folder yo'q                                  | config/navigation.ts + site.ts                     |
| store/ faqat auth                                    | store/ auth + UI state                             |
| English URL'lar (news, departments, staff)           | O'zbek URL'lar (yangiliklar, kafedralar, xodimlar) |
| Alohida create/edit sahifalar                        | Inline editing — hover to edit                     |
| AdminHeader ishlatilmaydi                            | AdminTopHeader — asosiy component                  |

## Architecture

```
AdminLayout
├── AdminTopHeader (mirrors frontend Header + admin controls)
│   ├── Logo + Navigation (same as frontend)
│   ├── DashboardDropdown (stats, quick actions)
│   └── AdminAvatar (profile, logout)
├── EditableWrapper (wraps any content section)
│   ├── HoverOverlay (blue border + action buttons)
│   ├── EditButton → opens EditModal
│   ├── DeleteButton → confirmation dialog
│   └── AddButton → opens EditModal (empty)
├── EditModal (universal editing dialog)
│   ├── LanguageTabs (UZ / RU / EN)
│   ├── DynamicFormFields (based on entity schema)
│   ├── RichTextEditor (TipTap-based)
│   └── MediaUploader (drag & drop, multi-format)
└── Page Content (same components as frontend)
```

## Implementation Steps

### Step 0: TO'LIQ TOZALASH (Clean Slate)

**Goal**: `admin/src/` folder to'liq o'chirib, yangi folder tizimini yaratish.

**Jarayon**:

1. `admin/src/` ichidagi barcha fayllarni o'chirish
2. Yuqoridagi "YANGI Admin folder tizimi" bo'yicha barcha folderlarni yaratish
3. Har bir faylni noldan professional darajada yozish

**Tartib**: config → types → lib → store → providers → hooks → components/shared → components/layout → components/inline-edit → components/sections → app/

---

### Step 1: Admin Layout Transformation

**Goal**: Yangi top header layout yaratish (frontend Header mirror).

**Files to create (noldan)**:

- `admin/src/app/layout.tsx` — Root layout (providers, fonts, metadata)
- `admin/src/app/globals.css` — Tailwind + custom styles
- `admin/src/app/not-found.tsx` — 404 page
- `admin/src/app/login/page.tsx` — Login page
- `admin/src/app/(dashboard)/layout.tsx` — Top header layout (NO SIDEBAR)
- `admin/src/middleware.ts` — Auth route protection
- `admin/src/components/layout/AdminTopHeader.tsx` — Main header component
- `admin/src/components/layout/AdminAvatar.tsx` — Profile dropdown
- `admin/src/components/layout/DashboardDropdown.tsx` — Stats dropdown
- `admin/src/components/layout/NotificationBell.tsx` — Unread contacts bell
- `admin/src/components/layout/MobileMenu.tsx` — Hamburger menu
- `admin/src/components/layout/Footer.tsx` — Footer
- `admin/src/components/layout/LanguageSwitcher.tsx` — UZ/RU/EN
- `admin/src/config/navigation.ts` — Nav items
- `admin/src/config/site.ts` — Site config

**Reference files**:

- `frontend/src/components/layout/Header.tsx` — design reference for header
- `frontend/src/config/navigation.ts` — navigation structure reference

**Design specs**:

- Primary color: `#1d4ed8` (blue-700)
- Gradient: `from-blue-800 via-blue-700 to-blue-900`
- Font: Inter
- Border radius: `rounded-2xl`
- Header: sticky top, white background, shadow on scroll
- Admin indicator: small badge or colored accent distinguishing from public site
- Avatar dropdown: Dashboard link, Settings, Logout
- Mobile: hamburger menu same as frontend

**Header navigation items**:

```ts
const adminNavItems = [
  { label: 'Bosh sahifa', href: '/', icon: Home },
  { label: 'Yangiliklar', href: '/news', icon: Newspaper },
  { label: "Bo'limlar", href: '/departments', icon: Building },
  { label: "Yo'nalishlar", href: '/directions', icon: GraduationCap },
  { label: 'Xodimlar', href: '/staff', icon: Users },
  { label: 'FAQ', href: '/faq', icon: HelpCircle },
  { label: 'Sahifalar', href: '/pages', icon: FileText },
  { label: 'Aloqa', href: '/contacts', icon: Mail },
];
```

---

### Step 2: EditableWrapper Component

**Goal**: Core component that wraps any content section and adds hover-to-edit UI.

**File to create**:

- `admin/src/components/inline-edit/EditableWrapper.tsx`

**Props interface**:

```ts
interface EditableWrapperProps {
  children: React.ReactNode;
  entityType: string; // 'news' | 'banner' | 'partner' | etc.
  entityId?: number | string;
  onEdit: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  className?: string;
  label?: string; // "Yangilik #3", "Banner", etc.
}
```

**Behavior**:

- Default state: invisible overlay, children render normally
- Hover state: blue dashed border (`border-2 border-dashed border-blue-500`), semi-transparent blue background (`bg-blue-50/30`)
- Action buttons appear top-right corner on hover:
  - Edit (pencil icon) — blue button
  - Delete (trash icon) — red button (only if `onDelete` provided)
  - Add (plus icon) — green button (only if `onAdd` provided)
- Label badge appears top-left on hover showing entity type/name
- Click edit → calls `onEdit()` which opens EditModal
- Click delete → shows confirmation dialog, then calls `onDelete()`
- Nested EditableWrappers: inner takes priority on hover

---

### Step 3: EditModal Component

**Goal**: Universal modal for editing any entity with language tabs and media upload.

**Files to create**:

- `admin/src/components/inline-edit/EditModal.tsx`
- `admin/src/components/inline-edit/LanguageTabs.tsx`
- `admin/src/components/inline-edit/MediaUploader.tsx`

**EditModal props**:

```ts
interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  initialData?: Record<string, any>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'select' | 'number' | 'date' | 'media' | 'toggle';
  translatable?: boolean; // if true, shows UZ/RU/EN tabs
  required?: boolean;
  options?: { value: string; label: string }[]; // for select type
  accept?: string; // for media type: 'image/*', 'video/*', '.pdf', etc.
  multiple?: boolean; // for media type: allow multiple files
  placeholder?: string;
}
```

**LanguageTabs behavior**:

- Three tabs: O'zbekcha (UZ) | Русский (RU) | English (EN)
- UZ is required, RU/EN optional
- Active tab highlighted with blue underline
- Form fields duplicate per language for translatable fields
- Non-translatable fields (like category, order, is_active) appear once outside tabs

**MediaUploader behavior**:

- Drag & drop zone with dashed border
- Supports: images (jpg, png, webp, gif), video (mp4, webm), documents (pdf)
- Preview thumbnails for images, video player preview for videos
- File size display
- Remove button on each uploaded file
- Multiple file support for gallery-type uploads
- Progress bar during upload

---

### Step 4: RichTextEditor Replacement

**Goal**: Replace current textarea-based RichTextEditor with TipTap editor.

**Dependencies to install**:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-youtube @tiptap/extension-placeholder
```

**File to modify**:

- `admin/src/components/shared/RichTextEditor.tsx` — complete rewrite

**Features**:

- Toolbar: Bold, Italic, Underline, Strikethrough
- Headings: H1, H2, H3
- Lists: Bullet, Numbered
- Media: Insert image (upload or URL), Insert video (YouTube embed or upload)
- Link: Add/edit/remove hyperlinks
- Blockquote, Code block
- Undo/Redo
- Clean paste from Word/Google Docs

---

### Step 5: Home Page Inline Editing

**Goal**: Make each home page section editable inline.

**Sections to wrap with EditableWrapper**:

1. HeroSection → edit hero title, subtitle, background image/video
2. MissionSection → edit mission text, image
3. DirectionsSection → edit/add/delete direction cards
4. AdvantagesSection → edit/add/delete advantage items
5. TestimonialsSection → edit/add/delete testimonials
6. NewsSection → edit/add/delete news cards (links to full news editor)
7. PartnersSection → edit/add/delete partner logos
8. LocationSection → edit address, map coordinates, contact info

**Implementation approach**:

- Create admin versions of each frontend section component
- Import frontend section components and wrap with EditableWrapper
- Each section fetches real data from API (replace hardcoded data)
- Click edit → opens EditModal pre-filled with current data
- On save → API call → React Query cache invalidation → UI updates

---

### Step 6: Entity Pages Inline Editing

**Goal**: News list, Department pages, Staff pages, etc. all use inline editing.

**Pages to implement**:

- `/news` — grid of news cards, each wrapped in EditableWrapper
- `/news/[slug]` — full article view with inline editing of title, content, images
- `/departments` — department list with inline editing
- `/departments/[id]` — department detail with staff list, inline editing
- `/staff` — staff grid with inline editing of each card
- `/directions` — direction cards with inline editing
- `/faq` — FAQ accordion with inline editing of each Q&A
- `/pages/[slug]` — static pages with inline editing

---

### Step 7: Dashboard Dropdown & Admin Features

**Goal**: Dashboard stats accessible from header, not a separate page.

**Dashboard dropdown contents**:

- Quick stats: total news, departments, staff, contacts (unread)
- Recent activity: last 5 edits
- Quick actions: "Yangilik qo'shish", "Xodim qo'shish"
- Link to full dashboard page (optional)

**Additional admin features**:

- Banners management: edit/reorder/toggle visibility
- Contact messages: view/mark as read from dropdown notification bell
- Settings page: site settings, admin profile

---

## Implementation Tartib (Build Order)

Fayllar shu tartibda yoziladi — har biri oldingi qadamga bog'liq:

```
1. config/site.ts, config/navigation.ts         → Asosiy sozlamalar
2. types/index.ts, types/inline-edit.ts          → TypeScript tiplar
3. lib/api.ts, lib/utils.ts, lib/constants.ts    → Core utilities
4. lib/services/*.ts (12 ta service)             → API service functions
5. store/useAuthStore.ts, store/useUIStore.ts    → State management
6. providers/QueryProvider.tsx                   → React Query provider
7. hooks/*.ts (14 ta hook)                       → CRUD + utility hooks
8. app/globals.css                               → Styles
9. components/shared/*.tsx (15 ta)               → Reusable UI
10. components/layout/*.tsx (7 ta)               → Header, Footer, Mobile
11. components/inline-edit/*.tsx (6 ta)           → Core editing system
12. components/sections/*.tsx (8 ta)              → Home page sections
13. middleware.ts                                 → Auth protection
14. app/layout.tsx, app/not-found.tsx             → Root layout
15. app/login/page.tsx                            → Login
16. app/(dashboard)/layout.tsx                    → Dashboard layout
17. app/(dashboard)/page.tsx                      → Home page (editable)
18. app/(dashboard)/yangiliklar/**                → News pages
19. app/(dashboard)/kafedralar/**                 → Department pages
20. app/(dashboard)/xodimlar/**                   → Staff pages
21. app/(dashboard)/yonalishlar/**                → Direction pages
22. app/(dashboard)/faq/**                        → FAQ pages
23. app/(dashboard)/sahifalar/**                  → Static pages
24. app/(dashboard)/aloqa/**                      → Contact pages
25. app/(dashboard)/bannerlar/**                  → Banner pages
26. app/(dashboard)/hamkorlar/**                  → Partners pages
27. app/(dashboard)/izohlar/**                    → Testimonials pages
28. app/(dashboard)/sozlamalar/**                 → Settings page
```

## API Endpoints Used

| Entity       | List (GET)                | Create (POST)             | Update (POST+\_method)          | Delete (DELETE)                |
| ------------ | ------------------------- | ------------------------- | ------------------------------- | ------------------------------ |
| News         | `/api/admin/news`         | `/api/admin/news`         | `/api/admin/news/{id}`          | `/api/admin/news/{id}`         |
| Departments  | `/api/admin/departments`  | `/api/admin/departments`  | `/api/admin/departments/{id}`   | `/api/admin/departments/{id}`  |
| Staff        | `/api/admin/staff`        | `/api/admin/staff`        | `/api/admin/staff/{id}`         | `/api/admin/staff/{id}`        |
| Directions   | `/api/admin/directions`   | `/api/admin/directions`   | `/api/admin/directions/{id}`    | `/api/admin/directions/{id}`   |
| FAQs         | `/api/admin/faqs`         | `/api/admin/faqs`         | `/api/admin/faqs/{id}`          | `/api/admin/faqs/{id}`         |
| Banners      | `/api/admin/banners`      | `/api/admin/banners`      | `/api/admin/banners/{id}`       | `/api/admin/banners/{id}`      |
| Partners     | `/api/admin/partners`     | `/api/admin/partners`     | `/api/admin/partners/{id}`      | `/api/admin/partners/{id}`     |
| Testimonials | `/api/admin/testimonials` | `/api/admin/testimonials` | `/api/admin/testimonials/{id}`  | `/api/admin/testimonials/{id}` |
| Pages        | `/api/admin/pages`        | `/api/admin/pages`        | `/api/admin/pages/{id}`         | `/api/admin/pages/{id}`        |
| Contacts     | `/api/admin/contacts`     | —                         | `/api/admin/contacts/{id}/read` | `/api/admin/contacts/{id}`     |

## Design Tokens

```ts
const designTokens = {
  colors: {
    primary: '#1d4ed8', // blue-700
    primaryHover: '#1e40af', // blue-800
    gradient: 'from-blue-800 via-blue-700 to-blue-900',
    editBorder: '#3b82f6', // blue-500
    editBg: 'rgba(59,130,246,0.05)',
    deleteBg: '#ef4444', // red-500
    addBg: '#22c55e', // green-500
  },
  font: 'Inter, sans-serif',
  borderRadius: {
    card: '1rem', // rounded-2xl
    button: '0.5rem', // rounded-lg
    modal: '1rem', // rounded-2xl
  },
  shadow: {
    card: '0 4px 6px -1px rgba(0,0,0,0.1)',
    modal: '0 25px 50px -12px rgba(0,0,0,0.25)',
  },
};
```

## Dependencies to Add

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-image": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-youtube": "^2.x",
  "@tiptap/extension-placeholder": "^2.x",
  "lucide-react": "^0.x"
}
```

## Notes

- **TO'LIQ TOZALASH**: `admin/src/` folder butunlay o'chiriladi, noldan yoziladi
- Admin auth flow: Sanctum + cookie-based (qayta yoziladi, lekin mantiq bir xil)
- Barcha services/hooks noldan yoziladi — eski pattern'lardan yaxshi tomonlari olinadi
- Frontend components serve as visual reference; admin reimplements with edit overlays
- TranslatableField pattern: `field[uz]`, `field[ru]`, `field[en]` bracket keys in FormData
- Forms use `FormData` with `_method=PUT` for Laravel updates (except FAQ/Pages which use JSON)
- Contact entity is read-only + mark-as-read (no create/update)
- URL'lar o'zbek tilida: `/yangiliklar`, `/kafedralar`, `/xodimlar` (frontend bilan mos)
- Eski admin'da 10 ta EntityForm edi → yangi admin'da 1 ta universal EditModal
- Eski admin'da create/edit sahifalar edi → yangi admin'da inline editing (popup modal)
