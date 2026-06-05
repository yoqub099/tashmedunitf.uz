export const QUERY_KEYS = {
  // Auth
  ME: ["auth", "me"] as const,

  // News
  NEWS: ["news"] as const,
  NEWS_DETAIL: (id: number | string) => ["news", id] as const,

  // Departments
  DEPARTMENTS: ["departments"] as const,
  DEPARTMENT_DETAIL: (id: number | string) => ["departments", id] as const,

  // Staff
  STAFF: ["staff"] as const,
  STAFF_DETAIL: (id: number | string) => ["staff", id] as const,

  // Directions
  DIRECTIONS: ["directions"] as const,
  DIRECTION_DETAIL: (id: number | string) => ["directions", id] as const,
  FACULTIES: ["faculties"] as const,
  FACULTY_DETAIL: (id: number | string) => ["faculties", id] as const,

  // FAQs
  FAQS: ["faqs"] as const,

  // Banners
  BANNERS: ["banners"] as const,
  BANNER_DETAIL: (id: number | string) => ["banners", id] as const,

  // Partners
  PARTNERS: ["partners"] as const,
  PARTNER_DETAIL: (id: number | string) => ["partners", id] as const,

  // Testimonials
  TESTIMONIALS: ["testimonials"] as const,
  TESTIMONIAL_DETAIL: (id: number | string) => ["testimonials", id] as const,

  // Pages
  PAGES: ["pages"] as const,
  PAGE_TREE: ["pages", "tree"] as const,
  PAGE_DETAIL: (id: number | string) => ["pages", id] as const,

  // Contacts
  CONTACTS: ["contacts"] as const,
  CONTACT_DETAIL: (id: number | string) => ["contacts", id] as const,
  CONTACTS_UNREAD: ["contacts", "unread"] as const,

  // Conference Registrations
  CONFERENCE_REGISTRATIONS: ["conference-registrations"] as const,
  CONFERENCE_REGISTRATION_DETAIL: (id: number | string) => ["conference-registrations", id] as const,
  CONFERENCE_REGISTRATIONS_UNREAD: ["conference-registrations", "unread"] as const,

  // Job Applications
  JOB_APPLICATIONS: ["job-applications"] as const,
  JOB_APPLICATION_DETAIL: (id: number | string) => ["job-applications", id] as const,
  JOB_APPLICATIONS_UNREAD: ["job-applications", "unread"] as const,

  // Student Works
  STUDENT_WORKS: ["student-works"] as const,
  STUDENT_WORK_DETAIL: (id: number | string) => ["student-works", id] as const,
  STUDENT_WORKS_UNREAD: ["student-works", "unread"] as const,

  // Dashboard
  DASHBOARD_STATS: ["dashboard", "stats"] as const,

  // Site Contents
  SITE_CONTENTS: ["site-contents"] as const,
  SITE_CONTENTS_SECTION: (section: string) => ["site-contents", section] as const,

  // Contact Locations
  CONTACT_LOCATIONS: ["contact-locations"] as const,

  // Talented Students
  TALENTED_STUDENTS: ["talented-students"] as const,
  TALENTED_STUDENT_DETAIL: (id: number | string) => ["talented-students", id] as const,

  // Career Center Infos
  CAREER_CENTER_INFOS: ["career-center-infos"] as const,
  CAREER_CENTER_INFO_DETAIL: (id: number | string) => ["career-center-infos", id] as const,

  // Student Life Photos
  STUDENT_LIFE_PHOTOS: ["student-life-photos"] as const,
  STUDENT_LIFE_PHOTO_DETAIL: (id: number | string) => ["student-life-photos", id] as const,

  // Site Media
  SITE_MEDIA: ["site-media"] as const,
  SITE_MEDIA_DETAIL: (id: number | string) => ["site-media", id] as const,
  SITE_MEDIA_BY_KEY: (key: string) => ["site-media", "key", key] as const,

  // Library Resources
  LIBRARY_RESOURCES: ["library-resources"] as const,
  LIBRARY_RESOURCE_DETAIL: (id: number | string) => ["library-resources", id] as const,
  LIBRARY_RESOURCE_CATEGORIES: ["library-resources", "categories"] as const,

  // Journal Issues
  JOURNAL_ISSUES: ["journal-issues"] as const,
  JOURNAL_ISSUE_DETAIL: (id: number | string) => ["journal-issues", id] as const,

  // Translations
  TRANSLATIONS: ["translations"] as const,
  TRANSLATION_DETAIL: (id: number | string) => ["translations", id] as const,

} as const;

export const NEWS_CATEGORIES = [
  { value: "yangiliklar", label: "Yangiliklar" },
  { value: "tadbirlar", label: "Tadbirlar" },
  { value: "konferensiyalar", label: "Konferensiyalar" },
  { value: "elonlar", label: "E'lonlar" },
  { value: "vakansiyalar", label: "Vakansiyalar" },
] as const;

export const DEGREE_OPTIONS = [
  { value: "bakalavriat", label: "Bakalavriat" },
  { value: "ordinatura", label: "Klinik ordinatura" },
  { value: "magistratura", label: "Magistratura" },
] as const;

export const LANGUAGES = [
  { code: "uz" as const, label: "O'zbekcha", flag: "🇺🇿" },
  { code: "ru" as const, label: "Русский", flag: "🇷🇺" },
  { code: "en" as const, label: "English", flag: "🇬🇧" },
] as const;

export const PER_PAGE_OPTIONS = [10, 20, 50] as const;

export const LIBRARY_CATEGORIES = [
  { value: "badiiy-adabiyotlar", label: "Badiiy adabiyotlar" },
  { value: "ilmiy-adabiyotlar", label: "Ilmiy adabiyotlar" },
  { value: "oquv-resurslari", label: "O'quv resurslari" },
] as const;
