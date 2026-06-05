const EXAM_SUBJECT_MAP: Record<string, { ru: string; en: string }> = {
  "Biologiya": { ru: "Биология", en: "Biology" },
  "Kimyo": { ru: "Химия", en: "Chemistry" },
  "O'zbek tili": { ru: "Узбекский язык", en: "Uzbek language" },
  "O\u2019zbek tili": { ru: "Узбекский язык", en: "Uzbek language" },
  "Matematika": { ru: "Математика", en: "Mathematics" },
  "Fizika": { ru: "Физика", en: "Physics" },
  "Ingliz tili": { ru: "Английский язык", en: "English language" },
  "Rus tili": { ru: "Русский язык", en: "Russian language" },
  "Ichki kasalliklar": { ru: "Внутренние болезни", en: "Internal medicine" },
  "Klinik diagnostika": { ru: "Клиническая диагностика", en: "Clinical diagnostics" },
  "Xirurgiya": { ru: "Хирургия", en: "Surgery" },
  "Anesteziologiya": { ru: "Анестезиология", en: "Anesthesiology" },
  "Akusherlik": { ru: "Акушерство", en: "Obstetrics" },
  "Ginekologiya": { ru: "Гинекология", en: "Gynecology" },
  "Jamoat salomatligi": { ru: "Общественное здоровье", en: "Public health" },
  "Statistika": { ru: "Статистика", en: "Statistics" },
  "Epidemiologiya": { ru: "Эпидемиология", en: "Epidemiology" },
  "Molekulyar biologiya": { ru: "Молекулярная биология", en: "Molecular biology" },
  "Genetika": { ru: "Генетика", en: "Genetics" },
  "Farmakologiya": { ru: "Фармакология", en: "Pharmacology" },
  "Farmatsevtik kimyo": { ru: "Фармацевтическая химия", en: "Pharmaceutical chemistry" },
  "Klinik farmakologiya": { ru: "Клиническая фармакология", en: "Clinical pharmacology" },
};

export function translateExamSubject(subject: string, lang: string): string {
  if (lang === "uz") return subject;
  const entry = EXAM_SUBJECT_MAP[subject];
  if (!entry) return subject;
  return lang === "ru" ? entry.ru : lang === "en" ? entry.en : subject;
}
