import type { Metadata } from "next";

// ============ SEO Constants ============

export const SITE_URL = "https://tashmedunitf.uz";
export const SITE_NAME_UZ = "ToshDTU Termiz filiali";
export const SITE_NAME_RU = "Филиал ТашГМУ в Термезе";
export const SITE_NAME_EN = "TashSMU Termez Branch";
export const SITE_SHORT_NAME = "TdTUTF";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;
export const DEFAULT_OG_IMAGE_ALT = "Toshkent Davlat Tibbiyot Universiteti Termiz Filiali";

// ============ Keywords by Language ============

export const KEYWORDS = {
  uz: {
    primary: [
      "Toshkent Davlat Tibbiyot Universiteti Termiz filiali",
      "TdTUTF",
      "ToshDTU Termiz filiali",
      "tibbiyot universiteti Termiz",
      "Termiz tibbiyot",
      "tibbiyot instituti Termiz",
      "tibbiyot oliy ta'lim",
    ],
    secondary: [
      "bakalavriat tibbiyot Termiz",
      "magistratura tibbiyot Termiz",
      "ordinatura Termiz",
      "davolash fakulteti Termiz",
      "farmatsiya fakulteti Termiz",
      "pediatriya fakulteti",
      "tibbiyot ta'limi O'zbekiston",
      "shifokor bo'lish",
      "tibbiyot kafedralar",
    ],
    longTail: [
      "Termizda tibbiyot universiteti qabul 2026",
      "ToshDTU Termiz filiali bakalavriat yo'nalishlari",
      "tibbiyot universitetiga hujjat topshirish Termiz",
      "Termiz tibbiyot universiteti kontrakt narxi",
      "tibbiyot universiteti grant o'rinlari",
      "tibbiyot fakulteti qabul ballari Termiz",
      "Surxondaryo viloyati tibbiyot universiteti",
      "Termiz shahrida tibbiyot ta'limi",
      "shifokorlik mutaxassisligi Termiz",
      "hamshiralik ishi ta'limi Termiz",
    ],
    local: [
      "Termiz shahri universitet",
      "Surxondaryo tibbiyot",
      "Termiz oliy ta'lim",
      "Termiz universitet qabul",
      "Termizda o'qish",
    ],
  },
  ru: {
    primary: [
      "Ташкентский государственный медицинский университет Термезский филиал",
      "ТашГМУ Термез",
      "медицинский университет Термез",
      "медицинский институт Термез",
      "филиал медуниверситета Термез",
    ],
    secondary: [
      "бакалавриат медицина Термез",
      "магистратура медицина Термез",
      "ординатура Термез",
      "лечебный факультет Термез",
      "фармацевтический факультет Термез",
      "педиатрический факультет",
      "медицинское образование Узбекистан",
    ],
    longTail: [
      "приём в медицинский университет Термез 2026",
      "стоимость обучения медицинский университет Термез",
      "направления бакалавриата ТашГМУ Термез",
      "грантовые места медуниверситет Термез",
      "Сурхандарьинская область медицинский вуз",
    ],
  },
  en: {
    primary: [
      "Tashkent State Medical University Termez Branch",
      "TashSMU Termez",
      "medical university Termez Uzbekistan",
      "medical school Termez",
    ],
    secondary: [
      "study medicine Uzbekistan",
      "medical education Termez",
      "bachelor medicine Termez",
      "master medicine Termez",
      "clinical residency Termez",
      "pharmacy faculty Termez",
      "pediatrics faculty Termez",
    ],
    longTail: [
      "admission medical university Termez 2026",
      "international students medicine Uzbekistan",
      "tuition fees medical university Termez",
      "medical degree Uzbekistan Termez",
      "Surkhandarya region medical university",
      "study MBBS in Uzbekistan Termez",
    ],
  },
} as const;

// ============ Page SEO Configs ============

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  canonical?: string;
  noIndex?: boolean;
}

export const PAGE_SEO: Record<string, PageSEO> = {
  // ===== HOME =====
  home: {
    title: "ToshDTU Termiz filiali — Rasmiy sayt",
    description:
      "Toshkent Davlat Tibbiyot Universiteti Termiz filiali — Surxondaryo viloyatida yetakchi tibbiyot oliy ta'lim muassasasi. Bakalavriat, magistratura, ordinatura. 2026-yil qabul ochildi.",
    keywords: [
      "ToshDTU Termiz filiali",
      "tibbiyot universiteti Termiz",
      "TdTUTF",
      "Termiz tibbiyot",
      "tibbiyot ta'limi",
      "bakalavriat",
      "magistratura",
      "ordinatura",
      "Surxondaryo",
    ],
  },

  // ===== BIZ HAQIMIZDA =====
  "biz-haqimizda": {
    title: "Biz haqimizda",
    description:
      "ToshDTU Termiz filiali — missiya, qadriyatlar, tarix va tashkiliy tuzilma. O'zbekistonda zamonaviy tibbiyot kadrlari tayyorlash markazi.",
    keywords: [
      "ToshDTU Termiz filiali haqida",
      "tibbiyot universiteti tarixi",
      "Termiz filiali missiyasi",
    ],
  },
  "umumiy-malumot": {
    title: "Umumiy ma'lumot",
    description:
      "ToshDTU Termiz filiali haqida umumiy ma'lumot — tashkil etilgan yili, joylashuvi, ta'lim dasturlari, professor-o'qituvchilar va yutuqlari.",
    keywords: ["ToshDTU umumiy malumot", "Termiz filiali", "tibbiyot universiteti haqida"],
  },
  "acca-haqida": {
    title: "ACCA haqida",
    description:
      "ACCA akkreditatsiya va sertifikatsiya haqida ma'lumot. ToshDTU Termiz filialining xalqaro ta'lim standartlariga muvofiqligi.",
    keywords: ["ACCA", "akkreditatsiya", "tibbiyot ta'lim sifati"],
  },
  "sifat-siyosati": {
    title: "Sifat siyosati",
    description:
      "ToshDTU Termiz filialining sifat siyosati — ta'lim sifatini ta'minlash, xalqaro standartlar, doimiy takomillashtirish tamoyillari.",
    keywords: ["sifat siyosati", "ta'lim sifati", "ISO standart"],
  },
  "virtual-qabulxona": {
    title: "Virtual qabulxona",
    description:
      "ToshDTU Termiz filiali virtual qabulxonasi — onlayn murojaat yuborish, savollar berish, ariza qoldirish. Tez va qulay.",
    keywords: ["virtual qabulxona", "onlayn murojaat", "ariza yuborish"],
  },
  "murojaatlar-tartibi": {
    title: "Murojaatlar tartibi",
    description:
      "ToshDTU Termiz filialiga murojaatlar tartibi — ariza berish, ko'rib chiqish muddatlari, javob olish tartibi.",
    keywords: ["murojaat tartibi", "ariza berish", "fuqarolar murojaati"],
  },
  antikorrupsiya: {
    title: "Antikorrupsiya",
    description:
      "ToshDTU Termiz filialida korrupsiyaga qarshi kurashish — aloqa kanallari, idoraviy hujjatlar, shikoyat bildirish tartibi.",
    keywords: ["antikorrupsiya", "korrupsiyaga qarshi", "shikoyat"],
  },

  // ===== TUZILMA =====
  tuzilma: {
    title: "Tashkiliy tuzilma",
    description:
      "ToshDTU Termiz filiali tashkiliy tuzilmasi — rektorat, fakultetlar, kafedralar, bo'limlar va xodimlar to'liq ma'lumoti.",
    keywords: ["tuzilma", "rektorat", "fakultetlar", "kafedralar"],
  },
  rektorat: {
    title: "Rektorat",
    description:
      "ToshDTU Termiz filiali rahbariyati — direktor, o'rinbosarlar, mas'ul shaxslar haqida to'liq ma'lumot.",
    keywords: ["rektorat", "rahbariyat", "direktor", "o'rinbosar"],
  },
  fakultetlar: {
    title: "Fakultetlar",
    description:
      "ToshDTU Termiz filiali fakultetlari — Davolash, Farmatsiya, Pediatriya, Klinik tibbiyot, Ilmiy-tadqiqot fakultetlari.",
    keywords: ["fakultetlar", "davolash fakulteti", "farmatsiya", "pediatriya"],
  },
  kafedralar: {
    title: "Kafedralar",
    description:
      "ToshDTU Termiz filiali kafedralari — tibbiy fanlar bo'yicha ixtisoslashgan kafedralar ro'yxati va ma'lumotlari.",
    keywords: ["kafedralar", "tibbiy fanlar", "o'quv kafedralari"],
  },
  xodimlar: {
    title: "Xodimlar",
    description:
      "ToshDTU Termiz filiali professor-o'qituvchilari va xodimlari — ilmiy darajalar, tajriba, aloqa ma'lumotlari.",
    keywords: ["xodimlar", "professorlar", "o'qituvchilar", "ilmiy xodimlar"],
  },

  // ===== FAOLIYAT =====
  faoliyat: {
    title: "Faoliyat",
    description:
      "ToshDTU Termiz filiali faoliyati — ilmiy tadqiqot, o'quv jarayoni, xalqaro hamkorlik, konferensiyalar.",
    keywords: ["faoliyat", "ilmiy tadqiqot", "xalqaro hamkorlik"],
  },
  "ilmiy-faoliyat": {
    title: "Ilmiy faoliyat",
    description:
      "ToshDTU Termiz filialining ilmiy faoliyati — tadqiqotlar, konferensiyalar, ilmiy jurnal, doktorantura dasturlari.",
    keywords: ["ilmiy faoliyat", "tadqiqot", "ilmiy jurnal", "doktorantura"],
  },
  "ilmiy-jurnal": {
    title: "Ilmiy jurnal",
    description:
      "ToshDTU Termiz filialining ilmiy jurnali — tibbiyot sohasida ilmiy maqolalar, nashrlar va tadqiqot natijalari.",
    keywords: ["ilmiy jurnal", "tibbiy maqolalar", "ilmiy nashr"],
  },
  "oquv-faoliyati": {
    title: "O'quv faoliyati",
    description:
      "ToshDTU Termiz filialining o'quv faoliyati — ta'lim dasturlari, o'quv rejalari, amaliy mashg'ulotlar.",
    keywords: ["o'quv faoliyati", "ta'lim dasturlari", "o'quv rejalari"],
  },
  "xalqaro-hamkorlik": {
    title: "Xalqaro hamkorlik",
    description:
      "ToshDTU Termiz filialining xalqaro hamkorligi — xorijiy universitetlar bilan shartnomalar, talaba almashinuvi, qo'shma loyihalar.",
    keywords: ["xalqaro hamkorlik", "xorijiy universitetlar", "talaba almashinuvi"],
  },
  "tadqiqod-markazi": {
    title: "Tadqiqot markazi",
    description:
      "ToshDTU Termiz filiali tadqiqot markazi — tibbiy tadqiqotlar, laboratoriyalar, innovatsion loyihalar.",
    keywords: ["tadqiqot markazi", "tibbiy tadqiqot", "laboratoriya"],
  },

  // ===== ABITURIENTLARGA =====
  abiturientlarga: {
    title: "Abiturientlarga",
    description:
      "ToshDTU Termiz filialiga qabul 2026 — bakalavriat, magistratura, ordinatura. Hujjat topshirish, imtihon fanlari, kontrakt narxlari, grant o'rinlari.",
    keywords: [
      "qabul 2026",
      "hujjat topshirish",
      "abiturient",
      "tibbiyot universiteti qabul",
      "grant",
      "kontrakt",
    ],
  },
  bakalavriat: {
    title: "Bakalavriat yo'nalishlari",
    description:
      "ToshDTU Termiz filiali bakalavriat dasturlari — Davolash ishi, Farmatsiya, Pediatriya. Kontrakt narxi, o'qish muddati, imtihon fanlari.",
    keywords: [
      "bakalavriat tibbiyot",
      "davolash ishi",
      "farmatsiya",
      "pediatriya",
      "kontrakt narxi",
    ],
  },
  magistratura: {
    title: "Magistratura yo'nalishlari",
    description:
      "ToshDTU Termiz filiali magistratura dasturlari — tibbiyot sohasida chuqurlashtirilgan ta'lim, ilmiy tadqiqot imkoniyatlari.",
    keywords: ["magistratura tibbiyot", "chuqurlashtirilgan ta'lim", "ilmiy tadqiqot"],
  },
  ordinatura: {
    title: "Klinik ordinatura",
    description:
      "ToshDTU Termiz filiali klinik ordinatura dasturlari — klinik amaliyot, mutaxassislik tanlash, o'qish muddati va shartlari.",
    keywords: ["klinik ordinatura", "tibbiy mutaxassislik", "klinik amaliyot", "rezidentura"],
  },
  "qabul-komissiyasi": {
    title: "Qabul komissiyasi",
    description:
      "ToshDTU Termiz filiali qabul komissiyasi — qabul tartibi, kerakli hujjatlar, murojaat telefon raqamlari, ish vaqti.",
    keywords: ["qabul komissiyasi", "hujjat topshirish", "qabul tartibi"],
  },
  "test-topshiriladigan-fanlar": {
    title: "Test topshiriladigan fanlar",
    description:
      "ToshDTU Termiz filialiga kirish imtihoni fanlari majmuasi — har bir yo'nalish uchun test fanlari ro'yxati.",
    keywords: ["imtihon fanlari", "test fanlari", "kirish imtihoni"],
  },

  // ===== TALABALARGA =====
  talabalarga: {
    title: "Talabalarga",
    description:
      "ToshDTU Termiz filiali talabalari uchun — karyera markazi, kutubxona, talaba ishlari, ijtimoiy hayot.",
    keywords: ["talabalar", "karyera markazi", "kutubxona", "talaba ishlari"],
  },
  "karyera-markazi": {
    title: "Karyera markazi",
    description:
      "ToshDTU Termiz filiali Karyera markazi — bitiruvchilar uchun ish o'rinlari, karyera maslahat, ish bilan ta'minlash.",
    keywords: ["karyera markazi", "ish o'rinlari", "bitiruvchilar", "ish bilan ta'minlash"],
  },
  kutubxona: {
    title: "Kutubxona",
    description:
      "ToshDTU Termiz filiali kutubxonasi — elektron kutubxona, darsliklar, ilmiy adabiyotlar, ma'lumotlar bazasi.",
    keywords: ["kutubxona", "elektron kutubxona", "darsliklar", "ilmiy adabiyot"],
  },
  "talaba-ishlari": {
    title: "Talaba ishlari",
    description:
      "ToshDTU Termiz filiali talaba ishlari bo'limi — ma'naviy-ma'rifiy ishlar, sport, madaniyat, talabalar tashkiloti.",
    keywords: ["talaba ishlari", "talabalar hayoti", "sport", "madaniyat"],
  },

  // ===== YANGILIKLAR =====
  yangiliklar: {
    title: "Yangiliklar",
    description:
      "ToshDTU Termiz filiali yangiliklari — so'nggi voqealar, tadbirlar, konferensiyalar, yutuqlar va e'lonlar.",
    keywords: ["yangiliklar", "voqealar", "tadbirlar", "e'lonlar"],
  },
  tadbirlar: {
    title: "Tadbirlar",
    description:
      "ToshDTU Termiz filiali tadbirlari — seminarlar, master-klasslar, madaniy tadbirlar, sport musobaqalari taqvimi.",
    keywords: ["tadbirlar", "seminarlar", "master-klass", "musobaqalar"],
  },
  konferensiyalar: {
    title: "Konferensiyalar",
    description:
      "ToshDTU Termiz filiali ilmiy konferensiyalari — xalqaro va respublika miqyosidagi tibbiy konferensiyalar, simpoziumlar.",
    keywords: ["konferensiyalar", "ilmiy konferensiya", "simpozium", "tibbiy anjuman"],
  },

  // ===== BOSHQA =====
  faq: {
    title: "Ko'p so'raladigan savollar (FAQ)",
    description:
      "ToshDTU Termiz filiali haqida ko'p beriladigan savollar — qabul, o'qish, stipendiya, yotoqxona, transfer va boshqalar.",
    keywords: ["FAQ", "savollar", "qabul savollari", "tibbiyot universiteti savollari"],
  },
  aloqa: {
    title: "Aloqa",
    description:
      "ToshDTU Termiz filiali bilan bog'lanish — manzil, telefon, elektron pochta, ijtimoiy tarmoqlar, xarita.",
    keywords: ["aloqa", "bog'lanish", "manzil", "telefon", "Termiz"],
  },

  // ===== MEYORIY HUJJATLAR =====
  "meyoriy-hujjatlar": {
    title: "Me'yoriy hujjatlar",
    description:
      "ToshDTU Termiz filiali me'yoriy hujjatlari — qonunlar, qarorlar, nizomlar, ichki tartib-qoidalar.",
    keywords: ["meyoriy hujjatlar", "qonunlar", "nizom", "tartib-qoidalar"],
  },
  qonunlar: {
    title: "Qonunlar",
    description:
      "Ta'lim sohasidagi qonunlar — ta'lim to'g'risidagi qonun, litsenziyalash, pedagog maqomi haqida qonunchilik hujjatlari.",
    keywords: ["qonunlar", "ta'lim qonuni", "litsenziyalash", "pedagog maqomi"],
  },
  "talim-qonuni": {
    title: "Ta'lim to'g'risidagi qonun",
    description:
      "O'zbekiston Respublikasining ta'lim to'g'risidagi qonuni — oliy ta'lim, tibbiyot ta'limi normativlari.",
    keywords: ["ta'lim qonuni", "oliy ta'lim", "qonunchilik"],
  },
  litsenziyalash: {
    title: "Litsenziyalash",
    description:
      "Oliy ta'lim muassasalarini litsenziyalash tartibi va me'yoriy hujjatlari.",
    keywords: ["litsenziyalash", "akkreditatsiya", "ta'lim litsenziyasi"],
  },
  "pedagog-maqomi": {
    title: "Pedagog maqomi",
    description:
      "Pedagog kadrlar maqomi to'g'risidagi qonun — huquqlar, imtiyozlar, kafolatlari.",
    keywords: ["pedagog maqomi", "o'qituvchi huquqlari", "kadrlar"],
  },
  "prezident-qarorlari": {
    title: "Prezident qarorlari",
    description:
      "O'zbekiston Respublikasi Prezidentining ta'lim va tibbiyot sohasidagi qarorlari, farmonlari.",
    keywords: ["prezident qarorlari", "farmonlar", "ta'lim islohotlari"],
  },
  "taraqqiyot-strategiyasi": {
    title: "Taraqqiyot strategiyasi",
    description:
      "O'zbekiston taraqqiyot strategiyasi — ta'lim va sog'liqni saqlash sohasidagi islohotlar.",
    keywords: ["taraqqiyot strategiyasi", "islohotlar", "strategik rejalar"],
  },
  "mamuriy-islohotlar": {
    title: "Ma'muriy islohotlar",
    description:
      "Ma'muriy islohotlar bo'yicha Prezident qarorlari — davlat boshqaruvi takomillashtirish.",
    keywords: ["mamuriy islohotlar", "davlat boshqaruvi", "qarorlar"],
  },
  "vazirlar-mahkamasi": {
    title: "Vazirlar Mahkamasi qarorlari",
    description:
      "Vazirlar Mahkamasining ta'lim va tibbiyot sohasidagi qarorlari — qabul tartibi, sirtqi ta'lim, pedagog tanlov.",
    keywords: ["vazirlar mahkamasi", "qarorlar", "qabul tartibi"],
  },
  "qabul-tartib": {
    title: "Qabul tartibi",
    description:
      "Oliy ta'lim muassasalariga qabul tartibi haqida Vazirlar Mahkamasi qarori.",
    keywords: ["qabul tartibi", "oliy ta'lim qabul", "tartib-qoidalar"],
  },
  "sirtqi-talim": {
    title: "Sirtqi ta'lim",
    description:
      "Sirtqi va kechki ta'lim shakllari bo'yicha me'yoriy hujjatlar va tartiblar.",
    keywords: ["sirtqi ta'lim", "kechki ta'lim", "masofaviy ta'lim"],
  },
  "pedagog-tanlov": {
    title: "Pedagog tanlov",
    description:
      "Pedagog kadrlarni tanlov asosida ishga qabul qilish tartibi haqida me'yoriy hujjatlar.",
    keywords: ["pedagog tanlov", "ishga qabul", "kadrlar tanlash"],
  },
  "akademik-tatil": {
    title: "Akademik ta'til",
    description:
      "Akademik ta'til berish tartibi va shartlari — talabalar uchun me'yoriy hujjatlar.",
    keywords: ["akademik tatil", "ta'til tartibi", "talaba huquqlari"],
  },
  nizom: {
    title: "Filial nizomi",
    description:
      "ToshDTU Termiz filiali nizomi — tashkiliy tuzilma, vakolatlar, faoliyat tartibi.",
    keywords: ["nizom", "filial nizomi", "tashkiliy tuzilma"],
  },
  "institut-nizomi": {
    title: "Institut nizomi",
    description:
      "Oliy ta'lim muassasasi nizomi — tashkil etish, boshqarish, faoliyat tartibi haqida hujjat.",
    keywords: ["institut nizomi", "oliy ta'lim nizomi", "universitet nizomi"],
  },
  "tashkiliy-tuzilma-nizom": {
    title: "Tashkiliy tuzilma",
    description:
      "ToshDTU Termiz filialining tashkiliy tuzilmasi haqida nizom va tartib-qoidalar.",
    keywords: ["tashkiliy tuzilma", "boshqaruv tuzilmasi", "nizom"],
  },
  "ichki-hujjatlar": {
    title: "Ichki hujjatlar",
    description:
      "ToshDTU Termiz filialining ichki tartib-qoidalari — akademik halollik, sifat siyosati, odob-axloq kodeksi.",
    keywords: ["ichki hujjatlar", "tartib-qoidalar", "akademik halollik"],
  },
  "akademik-halollik": {
    title: "Akademik halollik",
    description:
      "Akademik halollik siyosati — plagiatga qarshi kurash, ilmiy odob-axloq me'yorlari.",
    keywords: ["akademik halollik", "plagiat", "ilmiy odob-axloq"],
  },
  "diskriminatsiya-siyosati": {
    title: "Diskriminatsiyaga qarshi siyosat",
    description:
      "Diskriminatsiyaga qarshi siyosat — teng huquqlilik, xilma-xillik va inklyuzivlik tamoyillari.",
    keywords: ["diskriminatsiya", "teng huquqlilik", "inklyuzivlik"],
  },
  "institut-kengashi": {
    title: "Institut kengashi",
    description:
      "ToshDTU Termiz filiali ilmiy kengashi haqida — tarkibi, vakolatlari, qarorlar tartibi.",
    keywords: ["ilmiy kengash", "institut kengashi", "qarorlar"],
  },
  "odob-axloq-kodeksi": {
    title: "Odob-axloq kodeksi",
    description:
      "Professor-o'qituvchilar va talabalar uchun odob-axloq kodeksi — professional xulq-atvor me'yorlari.",
    keywords: ["odob-axloq kodeksi", "professional etika", "xulq-atvor"],
  },
  "sifat-siyosati-ichki": {
    title: "Sifat siyosati",
    description:
      "ToshDTU Termiz filialining ichki sifat siyosati hujjati — sifat menejmenti tizimi.",
    keywords: ["sifat siyosati", "sifat menejmenti", "ISO"],
  },
  "tanlov-reglamenti": {
    title: "Tanlov reglamenti",
    description:
      "Professor-o'qituvchilarni tanlov asosida ishga qabul qilish reglamenti.",
    keywords: ["tanlov reglamenti", "ishga qabul", "konkurs"],
  },
  "tyutorlik-nizomi": {
    title: "Tyutorlik nizomi",
    description:
      "Tyutorlik tizimi nizomi — talabalarni individual qo'llab-quvvatlash tartibi.",
    keywords: ["tyutorlik", "mentor", "talabalar qo'llab-quvvatlash"],
  },
  "ishga-qabul": {
    title: "Ishga qabul",
    description:
      "ToshDTU Termiz filialiga ishga qabul — bo'sh ish o'rinlari, talablar, hujjat topshirish tartibi.",
    keywords: ["ishga qabul", "vakansiyalar", "bo'sh ish o'rinlari"],
  },
  elonlar: {
    title: "E'lonlar",
    description:
      "ToshDTU Termiz filiali e'lonlari — muhim xabarlar, tanlovlar, konkurslar, ogohlantirishlar.",
    keywords: ["e'lonlar", "xabarlar", "tanlovlar"],
  },
  "akademik-hujjatlar": {
    title: "Akademik hujjatlar",
    description:
      "Akademik faoliyat bilan bog'liq me'yoriy hujjatlar — o'quv jarayoni, baholash tizimi, diplom berish.",
    keywords: ["akademik hujjatlar", "o'quv jarayoni", "baholash tizimi"],
  },
  "vazirlik-hujjatlari": {
    title: "Vazirlik hujjatlari",
    description:
      "Oliy ta'lim vazirligi hujjatlari — buyruqlar, ko'rsatmalar, me'yoriy aktlar.",
    keywords: ["vazirlik hujjatlari", "buyruqlar", "ko'rsatmalar"],
  },

  // ===== ANTIKORRUPSIYA SUBSECTIONS =====
  "aloqa-kanallari": {
    title: "Aloqa kanallari",
    description:
      "Korrupsiya holatlari haqida xabar berish uchun aloqa kanallari — ishonch telefoni, elektron pochta, anonim murojaat.",
    keywords: ["aloqa kanallari", "ishonch telefoni", "anonim murojaat", "korrupsiya"],
  },
  "idoraviy-hujjatlar": {
    title: "Idoraviy hujjatlar",
    description:
      "Antikorrupsiya bo'yicha idoraviy hujjatlar — korrupsiyaga qarshi kurash dasturi, rejalar.",
    keywords: ["idoraviy hujjatlar", "antikorrupsiya dasturi", "korrupsiyaga qarshi"],
  },

  // ===== ILMIY FAOLIYAT SUBSECTIONS =====
  tadqiqot: {
    title: "Tadqiqot",
    description:
      "ToshDTU Termiz filialida olib borilayotgan ilmiy tadqiqotlar — tibbiy fanlar, innovatsiyalar, laboratoriya ishlari.",
    keywords: ["tadqiqot", "ilmiy tadqiqot", "tibbiy fanlar", "laboratoriya"],
  },
  "ilmiy-konferensiyalar": {
    title: "Konferensiyalar",
    description:
      "ToshDTU Termiz filali ilmiy konferensiyalari — xalqaro va respublika miqyosidagi ilmiy anjumanlar.",
    keywords: ["ilmiy konferensiya", "anjuman", "simpozium"],
  },
  "ilmiy-ishlar": {
    title: "Ilmiy ishlar va innovatsiyalar",
    description:
      "Ilmiy ishlar va innovatsion loyihalar — dissertatsiyalar, ilmiy maqolalar, patentlar.",
    keywords: ["ilmiy ishlar", "innovatsiyalar", "dissertatsiya", "patent"],
  },
  doktorantura: {
    title: "Doktorantura",
    description:
      "ToshDTU Termiz filiali doktorantura dasturlari — PhD va DSc, ilmiy rahbarlar, tadqiqot yo'nalishlari.",
    keywords: ["doktorantura", "PhD", "DSc", "ilmiy rahbar"],
  },
  tadqiqotchilar: {
    title: "Tadqiqotchilar",
    description:
      "ToshDTU Termiz filiali doktorantura tadqiqotchilari — mavzulari, ilmiy rahbarlari, tadqiqot natijalari.",
    keywords: ["tadqiqotchilar", "doktorantlar", "ilmiy ishlar"],
  },
  "imtihon-dasturlari": {
    title: "Imtihon dasturlari",
    description:
      "Doktoranturaga kirish imtihonlari dasturlari — fan bo'yicha mavzular, adabiyotlar ro'yxati.",
    keywords: ["imtihon dasturlari", "doktorantura imtihon", "dastur"],
  },
  "imtihon-savollari": {
    title: "Imtihon savollari",
    description:
      "Doktoranturaga kirish imtihon savollari — namuna savollar, javoblar uchun tayyorgarlik.",
    keywords: ["imtihon savollari", "doktorantura savollari", "tayyorgarlik"],
  },
  "iqtidorli-talabalar": {
    title: "Iqtidorli talabalar",
    description:
      "ToshDTU Termiz filialining iqtidorli talabalari — ilmiy yutuqlar, olimpiadalar, grantlar.",
    keywords: ["iqtidorli talabalar", "olimpiada", "ilmiy yutuqlar"],
  },
  "oaq-tavsiya-nashrlar": {
    title: "OAK tavsiya nashrlar",
    description:
      "Oliy attestatsiya komissiyasi (OAK) tomonidan tavsiya etilgan nashrlar ro'yxati.",
    keywords: ["OAK", "tavsiya nashrlar", "ilmiy jurnallar"],
  },

  // ===== O'QUV FAOLIYATI SUBSECTIONS =====
  "oquv-rejalari-bakalavriat": {
    title: "Bakalavriat o'quv rejalari",
    description:
      "ToshDTU Termiz filiali bakalavriat o'quv rejalari — fanlar taqsimoti, kredit soatlari, amaliy mashg'ulotlar.",
    keywords: ["o'quv rejalari", "bakalavriat", "kredit soatlar", "fan taqsimoti"],
  },
  "oquv-rejalari-magistratura": {
    title: "Magistratura o'quv rejalari",
    description:
      "ToshDTU Termiz filiali magistratura o'quv rejalari — ixtisoslik fanlari, tadqiqot ishlari, amaliyot.",
    keywords: ["o'quv rejalari", "magistratura", "ixtisoslik fanlari"],
  },

  // ===== BOSHQA QOLGAN SAHIFALAR =====
  "oqishni-kochirish": {
    title: "O'qishni ko'chirish va tiklash",
    description:
      "ToshDTU Termiz filialida o'qishni ko'chirish va tiklash tartibi — kerakli hujjatlar, muddatlar, shartlar.",
    keywords: ["o'qishni ko'chirish", "tiklash", "transfer", "o'qishni davom ettirish"],
  },
  "konsultativ-organlar": {
    title: "Konsultativ-maslahat organlari",
    description:
      "ToshDTU Termiz filiali konsultativ-maslahat organlari — ilmiy kengash, professura, tarkibiy tuzilma.",
    keywords: ["konsultativ organlar", "ilmiy kengash", "maslahat"],
  },
  filiallar: {
    title: "Filiallar",
    description:
      "ToshDTU Termiz filialining hududiy bo'limlari va filiallar tarmog'i haqida ma'lumot.",
    keywords: ["filiallar", "hududiy bo'limlar", "tashkiliy tuzilma"],
  },
  "bosh-ish-orinlari": {
    title: "Bo'sh ish o'rinlari",
    description:
      "ToshDTU Termiz filialida bo'sh ish o'rinlari — ishga qabul, vakansiyalar, ariza yuborish.",
    keywords: ["bo'sh ish o'rinlari", "vakansiyalar", "ishga qabul", "karyera"],
  },

  // ===== JURNAL =====
  "jurnal-bosh-sahifa": {
    title: "Bosh sahifa",
    description:
      "ToshDTU Termiz filiali ilmiy jurnali — tibbiyot sohasida peer-reviewed ilmiy nashr, maqolalar, tadqiqot natijalari.",
    keywords: ["ilmiy jurnal", "tibbiy nashr", "peer-review", "maqolalar"],
  },
  "jurnal-nashrlar": {
    title: "Nashrlar",
    description:
      "Ilmiy jurnal nashrlari arxivi — barcha sonlar, yillar bo'yicha ilmiy maqolalar to'plami.",
    keywords: ["nashrlar", "jurnal sonlari", "arxiv", "ilmiy maqolalar"],
  },
  "jurnal-haqida": {
    title: "Jurnal haqida",
    description:
      "ToshDTU Termiz filiali ilmiy jurnali haqida — missiya, tahrir hay'ati, indekslash, ta'sir ko'rsatgichi.",
    keywords: ["jurnal haqida", "tahrir hayati", "indekslash", "ISSN"],
  },
  "jurnal-yoriqnoma": {
    title: "Yo'riqnoma",
    description:
      "Ilmiy jurnalga maqola yuborish yo'riqnomasi — formatlash talablari, ko'rib chiqish jarayoni, muddatlar.",
    keywords: ["yo'riqnoma", "maqola yuborish", "formatlash", "talablar"],
  },
  "jurnal-boglanish": {
    title: "Bog'lanish",
    description:
      "Ilmiy jurnal tahririyati bilan bog'lanish — manzil, telefon, elektron pochta, murojaat formasi.",
    keywords: ["bog'lanish", "tahririyat", "murojaat", "jurnal aloqa"],
  },
};

// ============ Helper: Build full Metadata ============

export function buildMetadata(
  pageKey: string,
  overrides?: Partial<PageSEO> & { path?: string; image?: string; locale?: string }
): Metadata {
  const seo = PAGE_SEO[pageKey];
  if (!seo) {
    return {
      title: overrides?.title || pageKey,
      description: overrides?.description,
    };
  }

  const locale = overrides?.locale || "uz";
  const title = overrides?.title || seo.title;
  const description = overrides?.description || seo.description;
  const ogTitle = overrides?.ogTitle || seo.ogTitle || title;
  const ogDescription = overrides?.ogDescription || seo.ogDescription || description;
  const path = overrides?.path || overrides?.canonical || seo.canonical || "";
  const canonicalUrl = path ? `${SITE_URL}/${locale}${path}` : `${SITE_URL}/${locale}`;
  const ogImage = overrides?.image || DEFAULT_OG_IMAGE;
  const keywords = [...(seo.keywords || []), ...(overrides?.keywords || [])];

  const ogLocale = locale === "ru" ? "ru_RU" : locale === "en" ? "en_US" : "uz_UZ";
  const siteName = locale === "ru" ? SITE_NAME_RU : locale === "en" ? SITE_NAME_EN : SITE_NAME_UZ;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        uz: `${SITE_URL}/uz${path}`,
        ru: `${SITE_URL}/ru${path}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName,
      locale: ogLocale,
      alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale),
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: DEFAULT_OG_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

// ============ Helper: Build Article Metadata (for news) ============

export function buildArticleMetadata(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  category?: string;
  locale?: string;
}): Metadata {
  const locale = article.locale || "uz";
  const path = `/yangiliklar/${article.slug}`;
  const url = `${SITE_URL}/${locale}${path}`;
  const ogImage = article.image || DEFAULT_OG_IMAGE;
  const ogLocale = locale === "ru" ? "ru_RU" : locale === "en" ? "en_US" : "uz_UZ";
  const siteName = locale === "ru" ? SITE_NAME_RU : locale === "en" ? SITE_NAME_EN : SITE_NAME_UZ;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: url,
      languages: {
        uz: `${SITE_URL}/uz${path}`,
        ru: `${SITE_URL}/ru${path}`,
        en: `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName,
      locale: ogLocale,
      alternateLocale: ["uz_UZ", "ru_RU", "en_US"].filter((l) => l !== ogLocale),
      type: "article",
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || undefined,
      section: article.category || "Yangiliklar",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogImage],
    },
  };
}

// ============ JSON-LD Structured Data ============

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "MedicalOrganization", "CollegeOrUniversity"],
    "@id": `${SITE_URL}/#organization`,
    name: "Toshkent Davlat Tibbiyot Universiteti Termiz Filiali",
    alternateName: [
      "ToshDTU Termiz filiali",
      "TdTUTF",
      "Ташкентский государственный медицинский университет Термезский филиал",
      "Tashkent State Medical University Termez Branch",
      "TashSMU Termez Branch",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/favicon.webp`,
      width: 512,
      height: 512,
    },
    image: DEFAULT_OG_IMAGE,
    description:
      "Toshkent Davlat Tibbiyot Universiteti Termiz filiali — Surxondaryo viloyatida yetakchi tibbiyot oliy ta'lim muassasasi. Bakalavriat, magistratura, klinik ordinatura dasturlari.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Surxondaryo viloyati, Termiz shahri",
      addressLocality: "Termiz",
      addressRegion: "Surxondaryo",
      addressCountry: {
        "@type": "Country",
        name: "Uzbekistan",
      },
      postalCode: "190100",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.2242,
      longitude: 67.2783,
    },
    telephone: "+998 76 221-40-30",
    email: "info@tashmedunitf.uz",
    foundingDate: "2024",
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Toshkent Davlat Tibbiyot Universiteti",
      alternateName: "Ташкентский государственный медицинский университет",
      url: "https://tashpmi.uz",
    },
    sameAs: [
      "https://t.me/tdtutf",
      "https://instagram.com/tdtutf",
      "https://facebook.com/tdtutf",
      "https://youtube.com/@tdtutf",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ta'lim dasturlari",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Bakalavriat — Davolash ishi",
            educationalProgramMode: "full-time",
            timeToComplete: "P6Y",
            educationalCredentialAwarded: "Bakalavr diplomi",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Bakalavriat — Farmatsevtika ishi",
            educationalProgramMode: "full-time",
            timeToComplete: "P5Y",
            educationalCredentialAwarded: "Bakalavr diplomi",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "EducationalOccupationalProgram",
            name: "Bakalavriat — Pediatriya ishi",
            educationalProgramMode: "full-time",
            timeToComplete: "P6Y",
            educationalCredentialAwarded: "Bakalavr diplomi",
          },
        },
      ],
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Surxondaryo viloyati",
    },
  };
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "ToshDTU Termiz filiali",
    alternateName: ["TdTUTF", "TashSMU Termez Branch"],
    url: SITE_URL,
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: [
      { "@type": "Language", name: "Uzbek", alternateName: "uz" },
      { "@type": "Language", name: "Russian", alternateName: "ru" },
      { "@type": "Language", name: "English", alternateName: "en" },
    ],
  };
}

export function getBreadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function getArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.image || DEFAULT_OG_IMAGE,
    url: `${SITE_URL}/yangiliklar/${article.slug}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Organization",
      name: "ToshDTU Termiz filiali",
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/yangiliklar/${article.slug}`,
    },
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ============ Advanced JSON-LD Schemas ============

export function getCourseSchema(params: {
  name: string;
  description: string;
  provider?: string;
  duration?: string;
  level?: string;
  price?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: params.name,
    description: params.description,
    provider: {
      "@type": "EducationalOrganization",
      name: params.provider || SITE_NAME_UZ,
      url: SITE_URL,
    },
    ...(params.duration && { timeRequired: params.duration }),
    ...(params.level && { educationalLevel: params.level }),
    ...(params.price && {
      offers: {
        "@type": "Offer",
        price: params.price,
        priceCurrency: "UZS",
        availability: "https://schema.org/InStock",
      },
    }),
    ...(params.url && { url: `${SITE_URL}${params.url}` }),
    inLanguage: "uz",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      courseWorkload: params.duration || "4 yil",
    },
  };
}

export function getEventSchema(params: {
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  image?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationEvent",
    name: params.name,
    description: params.description,
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
    location: {
      "@type": "Place",
      name: params.location || "ToshDTU Termiz filiali",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Termiz",
        addressRegion: "Surxondaryo",
        addressCountry: "UZ",
      },
    },
    organizer: {
      "@type": "EducationalOrganization",
      name: SITE_NAME_UZ,
      url: SITE_URL,
    },
    ...(params.image && { image: params.image }),
    ...(params.url && { url: `${SITE_URL}${params.url}` }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  };
}

export function getPersonSchema(params: {
  name: string;
  position?: string;
  department?: string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: params.name,
    ...(params.position && { jobTitle: params.position }),
    ...(params.department && {
      worksFor: {
        "@type": "EducationalOrganization",
        name: params.department,
        parentOrganization: {
          "@type": "EducationalOrganization",
          name: SITE_NAME_UZ,
          url: SITE_URL,
        },
      },
    }),
    ...(params.image && { image: params.image }),
    ...(params.email && { email: params.email }),
    ...(params.phone && { telephone: params.phone }),
    ...(params.url && { url: `${SITE_URL}${params.url}` }),
    affiliation: {
      "@type": "EducationalOrganization",
      name: SITE_NAME_UZ,
    },
  };
}

export function getDepartmentSchema(params: {
  name: string;
  description?: string;
  head?: string;
  phone?: string;
  email?: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: params.name,
    ...(params.description && { description: params.description }),
    ...(params.head && {
      employee: {
        "@type": "Person",
        name: params.head,
        jobTitle: "Kafedra mudiri",
      },
    }),
    ...(params.phone && { telephone: params.phone }),
    ...(params.email && { email: params.email }),
    ...(params.url && { url: `${SITE_URL}${params.url}` }),
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: SITE_NAME_UZ,
      url: SITE_URL,
    },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "MedicalBusiness"],
    name: SITE_NAME_UZ,
    url: SITE_URL,
    telephone: "+998762214030",
    email: "info@tashmedunitf.uz",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Termiz shahri",
      addressLocality: "Termiz",
      addressRegion: "Surxondaryo viloyati",
      postalCode: "190100",
      addressCountry: "UZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.2242,
      longitude: 67.2783,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    sameAs: [
      "https://t.me/tdtutf",
      "https://instagram.com/tdtutf",
      "https://facebook.com/tdtutf",
      "https://youtube.com/@tdtutf",
    ],
  };
}
