export interface JournalIssue {
  title: string;
  date: string;
  cover: string;
}

export const currentIssues: JournalIssue[] = [
  {
    title: "\"Termiz tibbiyot ilmiy axborotnomasi\", 2026/1-son",
    date: "2026-03-15",
    cover: "/imgs/journal/2026-1.jpg",
  },
];

export const previousIssues: JournalIssue[] = [
  {
    title: "\"Termiz tibbiyot ilmiy axborotnomasi\", 2025/4-son",
    date: "2025-12-20",
    cover: "/imgs/journal/2025-4.jpg",
  },
  {
    title: "\"Termiz tibbiyot ilmiy axborotnomasi\", 2025/3-son",
    date: "2025-09-15",
    cover: "/imgs/journal/2025-3.jpg",
  },
  {
    title: "\"Termiz tibbiyot ilmiy axborotnomasi\", 2025/2-son",
    date: "2025-06-20",
    cover: "/imgs/journal/2025-2.jpg",
  },
  {
    title: "\"Termiz tibbiyot ilmiy axborotnomasi\", 2025/1-son",
    date: "2025-03-15",
    cover: "/imgs/journal/2025-1.jpg",
  },
];

export const sections = [
  "Klinik tibbiyot",
  "Jamoat salomatligi va gigiyena",
  "Farmatsiya va farmakologiya",
  "Fundamental tibbiyot fanlari",
  "Tibbiyot ta'limi va pedagogika",
  "Stomatologiya",
];

export const requirements = [
  "Maqola hajmi 5-15 bet (Times New Roman, 14 pt, 1.5 interval)",
  "Annotatsiya uch tilda (o'zbek, rus, ingliz) — 150-250 so'z",
  "Kalit so'zlar — 5-8 ta",
  "Adabiyotlar ro'yxati — kamida 10 ta manba",
  "Maqola antiplagiat tekshiruvidan o'tishi shart (kamida 75%)",
  "Ilmiy rahbar tavsiyasi va tashqi taqriz talab etiladi",
];
