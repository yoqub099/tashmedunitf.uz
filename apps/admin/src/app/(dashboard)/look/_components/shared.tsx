"use client";

import {
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Flame,
  LogIn,
  LogOut,
  ShieldAlert,
  Upload,
  ImageOff,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// Vaqt yordamchilari (o'zbekcha)
// ============================================

export function timeAgo(iso?: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const sec = Math.floor((Date.now() - then) / 1000);
  if (sec < 10) return "hozir";
  if (sec < 60) return `${sec} soniya oldin`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} daqiqa oldin`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} soat oldin`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} kun oldin`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon} oy oldin`;
  return `${Math.floor(mon / 12)} yil oldin`;
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ============================================
// Rang sxemasi
// ============================================

type ColorSet = { bg: string; text: string; dot: string; soft: string };

export const COLOR_CLASSES: Record<string, ColorSet> = {
  emerald: { bg: "bg-emerald-500", text: "text-emerald-700", dot: "bg-emerald-500", soft: "bg-emerald-50 text-emerald-700" },
  blue: { bg: "bg-blue-500", text: "text-blue-700", dot: "bg-blue-500", soft: "bg-blue-50 text-blue-700" },
  amber: { bg: "bg-amber-500", text: "text-amber-700", dot: "bg-amber-500", soft: "bg-amber-50 text-amber-700" },
  red: { bg: "bg-red-500", text: "text-red-700", dot: "bg-red-500", soft: "bg-red-50 text-red-700" },
  teal: { bg: "bg-teal-500", text: "text-teal-700", dot: "bg-teal-500", soft: "bg-teal-50 text-teal-700" },
  indigo: { bg: "bg-indigo-500", text: "text-indigo-700", dot: "bg-indigo-500", soft: "bg-indigo-50 text-indigo-700" },
  gray: { bg: "bg-gray-400", text: "text-gray-600", dot: "bg-gray-400", soft: "bg-gray-100 text-gray-600" },
  purple: { bg: "bg-purple-500", text: "text-purple-700", dot: "bg-purple-500", soft: "bg-purple-50 text-purple-700" },
};

export function color(name: string): ColorSet {
  return COLOR_CLASSES[name] ?? COLOR_CLASSES.gray!;
}

// ============================================
// Hodisa (event) metadata
// ============================================

export const EVENT_META: Record<string, { label: string; color: string; Icon: LucideIcon }> = {
  created: { label: "Yaratdi", color: "emerald", Icon: Plus },
  updated: { label: "O'zgartirdi", color: "blue", Icon: Pencil },
  deleted: { label: "O'chirdi", color: "amber", Icon: Trash2 },
  force_deleted: { label: "Butunlay o'chirdi", color: "red", Icon: Flame },
  restored: { label: "Tikladi", color: "teal", Icon: RotateCcw },
  login: { label: "Tizimga kirdi", color: "emerald", Icon: LogIn },
  logout: { label: "Tizimdan chiqdi", color: "gray", Icon: LogOut },
  login_failed: { label: "Kirish urinishi (xato)", color: "red", Icon: ShieldAlert },
  media_uploaded: { label: "Fayl yukladi", color: "indigo", Icon: Upload },
  media_deleted: { label: "Fayl o'chirdi", color: "amber", Icon: ImageOff },
};

export function eventMeta(event: string) {
  return EVENT_META[event] ?? { label: event, color: "gray", Icon: Activity };
}

// ============================================
// Subject (model) o'zbekcha nomlari
// ============================================

export const SUBJECT_LABELS: Record<string, string> = {
  News: "Yangilik",
  Department: "Kafedra",
  Staff: "Xodim",
  Direction: "Yo'nalish",
  Faq: "Savol-javob",
  Banner: "Banner",
  Partner: "Hamkor",
  Testimonial: "Fikr-mulohaza",
  Page: "Sahifa",
  Faculty: "Fakultet",
  SiteContent: "Sayt kontenti",
  SiteMedia: "Sayt media",
  ContactLocation: "Manzil",
  LibraryResource: "Kutubxona resursi",
  JournalIssue: "Jurnal soni",
  Translation: "Tarjima",
  CareerCenterInfo: "Karyera markazi",
  StudentLifePhoto: "Talaba hayoti rasmi",
  TalentedStudent: "Iqtidorli talaba",
  User: "Foydalanuvchi",
  ContactMessage: "Murojaat",
  ConferenceRegistration: "Konferensiya ro'yxati",
  JobApplication: "Ish arizasi",
  StudentWork: "Talaba ishi",
};

export function subjectLabel(type?: string | null): string {
  if (!type) return "—";
  return SUBJECT_LABELS[type] ?? type;
}

// ============================================
// Rol va manba metadata
// ============================================

export const ROLE_META: Record<string, { label: string; color: string }> = {
  "super-admin": { label: "Super Admin", color: "purple" },
  admin: { label: "Admin", color: "blue" },
  editor: { label: "Muharrir", color: "teal" },
};

export const SOURCE_META: Record<string, { label: string; color: string }> = {
  backend: { label: "Backend (API)", color: "purple" },
  web: { label: "Sayt (web)", color: "blue" },
  admin: { label: "Admin panel", color: "teal" },
};

export const LEVEL_META: Record<string, { label: string; color: string }> = {
  critical: { label: "Kritik", color: "red" },
  error: { label: "Xato", color: "red" },
  warning: { label: "Ogohlantirish", color: "amber" },
  info: { label: "Ma'lumot", color: "blue" },
};

// ============================================
// Kichik UI atomlar
// ============================================

export function initials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function CauserAvatar({ name, online, size = "md" }: { name?: string | null; online?: boolean; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-xs";
  return (
    <div className="relative shrink-0">
      <div className={cn("flex items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 font-bold text-white", dim)}>
        {initials(name)}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white",
            online ? "bg-emerald-500" : "bg-gray-300"
          )}
          title={online ? "Onlayn" : "Oflayn"}
        />
      )}
    </div>
  );
}

export function Pill({ label, colorName }: { label: string; colorName: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold", color(colorName).soft)}>
      {label}
    </span>
  );
}

export function RoleBadge({ role }: { role?: string | null }) {
  if (!role) return <span className="text-xs text-gray-400">—</span>;
  const meta = ROLE_META[role] ?? { label: role, color: "gray" };
  return <Pill label={meta.label} colorName={meta.color} />;
}

// ============================================
// Diff (eski → yangi) ko'rsatish
// ============================================

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-400">—</span>;
  }
  if (typeof value === "boolean") {
    return <span>{value ? "Ha" : "Yo'q"}</span>;
  }
  if (typeof value === "number" || typeof value === "string") {
    const str = String(value);
    // HTML teglarni olib tashlash (content/rich text uchun)
    const clean = str.replace(/<[^>]*>/g, "").trim();
    return <span className="break-words">{clean.length > 300 ? clean.slice(0, 300) + "…" : clean || "—"}</span>;
  }
  // Translatable {uz,ru,en} yoki array/obyekt
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const langKeys = ["uz", "ru", "en"].filter((k) => k in obj);
    if (langKeys.length > 0) {
      return (
        <div className="space-y-0.5">
          {langKeys.map((k) => (
            <div key={k} className="flex gap-1.5">
              <span className="shrink-0 font-mono text-[10px] uppercase text-gray-400">{k}</span>
              <span className="break-words">{renderValue(obj[k])}</span>
            </div>
          ))}
        </div>
      );
    }
    const json = JSON.stringify(value);
    return <span className="break-words font-mono text-[11px] text-gray-500">{json.length > 200 ? json.slice(0, 200) + "…" : json}</span>;
  }
  return <span>{String(value)}</span>;
}

export function DiffTable({
  oldValues,
  newValues,
}: {
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
}) {
  const keys = Array.from(new Set([...Object.keys(oldValues ?? {}), ...Object.keys(newValues ?? {})])).filter(
    (k) => k !== "id"
  );

  if (keys.length === 0) {
    return <p className="text-sm text-gray-400">Ko&apos;rsatiladigan o&apos;zgarish yo&apos;q.</p>;
  }

  const showBoth = oldValues && newValues;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-[11px] uppercase tracking-wide text-gray-500">
            <th className="px-3 py-2 font-semibold">Maydon</th>
            {showBoth && <th className="px-3 py-2 font-semibold">Oldin</th>}
            <th className="px-3 py-2 font-semibold">{showBoth ? "Keyin" : oldValues ? "Qiymat" : "Qiymat"}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {keys.map((key) => (
            <tr key={key} className="align-top">
              <td className="px-3 py-2 font-mono text-[12px] font-medium text-gray-700">{key}</td>
              {showBoth && (
                <td className="px-3 py-2 text-gray-500 line-through decoration-red-300/60">
                  {renderValue(oldValues?.[key])}
                </td>
              )}
              <td className="px-3 py-2 text-gray-800">
                {renderValue((newValues ?? oldValues)?.[key])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
