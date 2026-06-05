# Admin Panel Inline Editing Redesign Plan

## Overview

Transform the admin panel from a traditional sidebar-based CRUD dashboard into a frontend-mirror with inline editing capabilities (WordPress/Wix style). The admin sees the exact same UI as the public frontend, but with hover-to-edit overlays on every content section.

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

### Step 1: Admin Layout Transformation

**Goal**: Remove sidebar, create top header matching frontend design.

**Files to modify**:
- `admin/src/app/(dashboard)/layout.tsx` — complete rewrite, remove sidebar
- `admin/src/components/layout/Sidebar.tsx` — delete or archive

**Files to create**:
- `admin/src/components/layout/AdminTopHeader.tsx` — new top header component

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
  { label: "Bosh sahifa", href: "/", icon: Home },
  { label: "Yangiliklar", href: "/news", icon: Newspaper },
  { label: "Bo'limlar", href: "/departments", icon: Building },
  { label: "Yo'nalishlar", href: "/directions", icon: GraduationCap },
  { label: "Xodimlar", href: "/staff", icon: Users },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "Sahifalar", href: "/pages", icon: FileText },
  { label: "Aloqa", href: "/contacts", icon: Mail },
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
  entityType: string;        // 'news' | 'banner' | 'partner' | etc.
  entityId?: number | string;
  onEdit: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  className?: string;
  label?: string;            // "Yangilik #3", "Banner", etc.
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
  translatable?: boolean;    // if true, shows UZ/RU/EN tabs
  required?: boolean;
  options?: { value: string; label: string }[];  // for select type
  accept?: string;           // for media type: 'image/*', 'video/*', '.pdf', etc.
  multiple?: boolean;        // for media type: allow multiple files
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

## File Structure (New/Modified)

```
admin/src/
├── components/
│   ├── layout/
│   │   ├── AdminTopHeader.tsx        [NEW]
│   │   ├── DashboardDropdown.tsx     [NEW]
│   │   ├── AdminAvatar.tsx           [NEW]
│   │   └── Sidebar.tsx              [DELETE]
│   ├── inline-edit/
│   │   ├── EditableWrapper.tsx       [NEW]
│   │   ├── EditModal.tsx             [NEW]
│   │   ├── LanguageTabs.tsx          [NEW]
│   │   ├── MediaUploader.tsx         [NEW]
│   │   └── ConfirmDialog.tsx         [NEW]
│   ├── shared/
│   │   └── RichTextEditor.tsx        [REWRITE]
│   └── sections/                     [NEW FOLDER]
│       ├── EditableHero.tsx          [NEW]
│       ├── EditableMission.tsx       [NEW]
│       ├── EditableDirections.tsx    [NEW]
│       ├── EditableAdvantages.tsx    [NEW]
│       ├── EditableTestimonials.tsx  [NEW]
│       ├── EditableNews.tsx          [NEW]
│       ├── EditablePartners.tsx      [NEW]
│       └── EditableLocation.tsx      [NEW]
├── app/
│   └── (dashboard)/
│       └── layout.tsx                [REWRITE]
└── types/
    └── inline-edit.ts                [NEW]
```

## API Endpoints Used

| Entity        | List (GET)              | Create (POST)           | Update (POST+_method) | Delete (DELETE)         |
|---------------|-------------------------|-------------------------|-----------------------|-------------------------|
| News          | `/api/admin/news`       | `/api/admin/news`       | `/api/admin/news/{id}`| `/api/admin/news/{id}`  |
| Departments   | `/api/admin/departments`| `/api/admin/departments`| `/api/admin/departments/{id}` | `/api/admin/departments/{id}` |
| Staff         | `/api/admin/staff`      | `/api/admin/staff`      | `/api/admin/staff/{id}`| `/api/admin/staff/{id}` |
| Directions    | `/api/admin/directions` | `/api/admin/directions` | `/api/admin/directions/{id}` | `/api/admin/directions/{id}` |
| FAQs          | `/api/admin/faqs`       | `/api/admin/faqs`       | `/api/admin/faqs/{id}`| `/api/admin/faqs/{id}`  |
| Banners       | `/api/admin/banners`    | `/api/admin/banners`    | `/api/admin/banners/{id}` | `/api/admin/banners/{id}` |
| Partners      | `/api/admin/partners`   | `/api/admin/partners`   | `/api/admin/partners/{id}` | `/api/admin/partners/{id}` |
| Testimonials  | `/api/admin/testimonials`| `/api/admin/testimonials`| `/api/admin/testimonials/{id}` | `/api/admin/testimonials/{id}` |
| Pages         | `/api/admin/pages`      | `/api/admin/pages`      | `/api/admin/pages/{id}`| `/api/admin/pages/{id}` |
| Contacts      | `/api/admin/contacts`   | —                       | `/api/admin/contacts/{id}/read` | `/api/admin/contacts/{id}` |

## Design Tokens

```ts
const designTokens = {
  colors: {
    primary: '#1d4ed8',        // blue-700
    primaryHover: '#1e40af',   // blue-800
    gradient: 'from-blue-800 via-blue-700 to-blue-900',
    editBorder: '#3b82f6',     // blue-500
    editBg: 'rgba(59,130,246,0.05)',
    deleteBg: '#ef4444',       // red-500
    addBg: '#22c55e',          // green-500
  },
  font: 'Inter, sans-serif',
  borderRadius: {
    card: '1rem',              // rounded-2xl
    button: '0.5rem',          // rounded-lg
    modal: '1rem',             // rounded-2xl
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

- Admin auth flow remains unchanged (Sanctum + cookie-based)
- All existing admin services/hooks are reused — only the UI layer changes
- Frontend components serve as visual reference; admin reimplements with edit overlays
- TranslatableField pattern: `field[uz]`, `field[ru]`, `field[en]` bracket keys in FormData
- Forms use `FormData` with `_method=PUT` for Laravel updates (except FAQ/Pages which use JSON)
- Contact entity is read-only + mark-as-read (no create/update)
