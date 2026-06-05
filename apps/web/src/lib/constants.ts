export const LANGUAGES = [
  { code: "uz", label: "O'zb" },
  { code: "ru", label: "Рус" },
  { code: "en", label: "Eng" },
] as const;

export const DEFAULT_LANGUAGE = "uz";

export const ITEMS_PER_PAGE = 12;

export const STATS = [
  { value: "5000+", label: "Talabalar", description: "5000 dan ortiq talaba bizni tanladi!" },
  { value: "200+", label: "O'qituvchilar", description: "Malakali professor-o'qituvchilar" },
  { value: "15+", label: "Kafedralar", description: "Tibbiyot yo'nalishlari" },
  { value: "10+", label: "Hamkorlar", description: "Xalqaro hamkor tashkilotlar" },
] as const;
