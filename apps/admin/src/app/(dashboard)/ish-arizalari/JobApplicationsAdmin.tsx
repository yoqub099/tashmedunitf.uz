"use client";

import { useState, useEffect, useCallback } from "react";
import { jobApplicationService } from "@/lib/services/jobApplicationService";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { JobApplication, JobApplicationFile } from "@/types";
import {
  Briefcase,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  FileText,
  X,
} from "lucide-react";

/* ── File labels ── */
const FILE_LABELS: Record<string, string> = {
  resume: "Rezyume",
  photo: "Rasm",
  motivation_letter: "Motivatsion xat",
  work_report: "Ish hisoboti",
  future_vision: "Kelajak fikri",
  teaching_portfolio: "O'qitish portfeli",
  research_statement: "Tadqiqot bayonoti",
  dissertation: "Dissertatsiya",
  diplomas: "Diplomlar",
  transcripts: "Transkriptlar",
  english_cert: "Ingliz tili sertifikati",
  recommendation: "Tavsiya xatlari",
};

/* ── Detail row ── */
function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <span className="min-w-32 shrink-0 text-sm text-gray-500">{label}:</span>
      <span className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-sm font-medium text-gray-900">
        {value || "Ko'rsatilmagan"}
      </span>
    </div>
  );
}

/** Private faylni auth-token bilan yuklab olish (local disk). */
async function downloadAuthFile(fileInfo: JobApplicationFile) {
  try {
    const res = await api.get(fileInfo.url, { responseType: "blob" });
    const blobUrl = window.URL.createObjectURL(res.data);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileInfo.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("[ish-arizalari] file download failed:", err);
    toast.error("Faylni yuklab olishda xato!");
  }
}

type ReadFilter = "all" | "unread" | "read";

export default function JobApplicationsAdmin() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [selected, setSelected] = useState<JobApplication | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = { page, per_page: perPage };
      if (readFilter === "read") params["filter[is_read]"] = true;
      if (readFilter === "unread") params["filter[is_read]"] = false;
      if (search) params["filter[name]"] = search;
      const res = await jobApplicationService.getAll(params);
      setApplications(res.data);
      setTotalPages(res.meta.last_page);
      setTotal(res.meta.total);
    } catch (err) {
      console.error("[ish-arizalari] fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, readFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [readFilter, perPage, search]);

  // Escape key — modal yopish
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (deleteId) setDeleteId(null);
      else if (selected) setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, deleteId]);

  const handleView = async (id: number) => {
    try {
      const app = await jobApplicationService.getById(id);
      setSelected(app);
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
      );
    } catch (err) {
      console.error("[ish-arizalari] view failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await jobApplicationService.delete(deleteId);
      setApplications((prev) => prev.filter((a) => a.id !== deleteId));
      setTotal((p) => p - 1);
      setDeleteId(null);
      if (selected?.id === deleteId) setSelected(null);
    } catch (err) {
      console.error("[ish-arizalari] delete failed:", err);
    }
  };

  // Search endi server-side — filter[name]= backendga uzatiladi
  const filtered = applications;

  const hasActiveFilters = search || readFilter !== "all";
  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setReadFilter("all");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100">
              <Briefcase className="size-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ish arizalari</h1>
              <p className="text-sm text-gray-500">Jami: {total} ta ariza</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Qidirish..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Status:</span>
          {(["all", "unread", "read"] as ReadFilter[]).map((f) => {
            const label = f === "all" ? "Barchasi" : f === "unread" ? "Yangi" : "O'qilgan";
            const active = readFilter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setReadFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "bg-teal-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500">Per page:</label>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:border-teal-500 focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
              >
                <X className="w-3 h-3" />
                Filter&apos;ni tozalash
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-500">#</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Ism Familiya</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Telefon</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Lavozim</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Daraja</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Sana</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      Yuklanmoqda...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                      Arizalar topilmadi
                    </td>
                  </tr>
                ) : (
                  filtered.map((app, i) => (
                    <tr
                      key={app.id}
                      className={`transition-colors hover:bg-gray-50 ${!app.is_read ? "bg-teal-50/50" : ""}`}
                    >
                      <td className="px-4 py-3 text-gray-400">{(page - 1) * perPage + i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {!app.is_read && (
                            <span className="inline-block size-2 rounded-full bg-teal-500" />
                          )}
                          {app.name} {app.last_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{app.email}</td>
                      <td className="px-4 py-3 text-gray-600">{app.phone || "—"}</td>
                      <td className="max-w-40 truncate px-4 py-3 text-gray-600">{app.position}</td>
                      <td className="px-4 py-3 text-gray-600">{app.degree || "—"}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {new Date(app.created_at).toLocaleDateString("uz-UZ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(app.id)}
                            className="flex size-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-teal-50 hover:text-teal-600"
                            title="Ko'rish"
                            aria-label="Ko'rish"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(app.id)}
                            className="flex size-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="O'chirish"
                            aria-label="O'chirish"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">
                Sahifa {page} / {totalPages}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          View Modal — full application details
          ══════════════════════════════════════════ */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm py-8"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative mx-4 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100">
                <Briefcase className="size-5 text-teal-600" />
              </div>
              <div>
                <h4 className="font-serif text-xl font-semibold text-gray-900">
                  {selected.name} {selected.last_name}
                </h4>
                <p className="text-sm text-gray-500">{selected.position}</p>
              </div>
            </div>

            {/* ── Asosiy ma'lumotlar ── */}
            <div className="space-y-2">
              <h5 className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-2">
                Asosiy ma&apos;lumotlar
              </h5>
              <DetailRow label="Ism" value={selected.name} />
              <DetailRow label="Familiya" value={selected.last_name} />
              <DetailRow label="Otasining ismi" value={selected.middle_name} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Telefon" value={selected.phone} />
              <DetailRow label="Lavozim" value={selected.position} />
              <DetailRow label="Kompaniya" value={selected.company} />
              <DetailRow label="Maosh" value={selected.salary} />
              <DetailRow label="Tug'ilgan sana" value={selected.birthday} />
              <DetailRow label="Skype" value={selected.skype} />
            </div>

            {/* ── Qo'shimcha ma'lumotlar ── */}
            <div className="mt-6 space-y-2">
              <h5 className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-2">
                Qo&apos;shimcha ma&apos;lumotlar
              </h5>
              <DetailRow label="Fuqarolik" value={selected.citizenship} />
              <DetailRow label="Aloqa telefon" value={selected.contact_phone} />
              <DetailRow label="Qo'shimcha email" value={selected.extra_email} />
              <DetailRow label="Ijtimoiy tarmoqlar" value={selected.social_media_link} />
              <DetailRow label="Sudlanganmi" value={selected.is_convicted ? "Ha" : "Yo'q"} />
              <DetailRow label="Qayerdan topgan" value={selected.how_find_vacancy} />
              <DetailRow label="Hozir ishlayaptimi" value={selected.is_currently_working ? "Ha" : "Yo'q"} />
              <DetailRow label="Avval ariza bergan" value={selected.applied_before_comment} />
              <DetailRow label="Qarindoshi bormi" value={selected.relative_detail_at_university} />
              <DetailRow label="Ko'nikmalar" value={selected.skills} />
              <DetailRow label="Qo'shimcha ma'lumot" value={selected.additional_info} />
              <DetailRow label="Tadqiqot ID" value={selected.research_identifier} />
              <DetailRow label="Daraja" value={selected.degree} />
              <DetailRow label="O'zbekistondami" value={selected.is_currently_in_uzbekistan ? "Ha" : "Yo'q"} />
              <DetailRow label="Avval ishlagan" value={selected.is_previously_worked_at_university ? "Ha" : "Yo'q"} />
              <DetailRow label="Motivatsiya" value={selected.about_motivation} />
              <DetailRow
                label="Sana"
                value={new Date(selected.created_at).toLocaleString("uz-UZ")}
              />
            </div>

            {/* ── Fayllar ── */}
            {selected.files && Object.values(selected.files).some(Boolean) && (
              <div className="mt-6">
                <h5 className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-3">
                  Yuklangan fayllar
                </h5>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {Object.entries(selected.files).map(([key, fileInfo]) => {
                    if (!fileInfo) return null;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => downloadAuthFile(fileInfo)}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 p-3 transition-colors hover:border-teal-300 hover:bg-teal-50 text-left"
                        aria-label={`${FILE_LABELS[key] || key}ni yuklab olish`}
                      >
                        <FileText className="size-4 text-teal-600 shrink-0" />
                        <span className="flex-1 truncate text-sm font-medium text-gray-700">
                          {FILE_LABELS[key] || key}
                        </span>
                        <Download className="size-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Actions ── */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteId(selected.id);
                  setSelected(null);
                }}
                className="rounded-full border border-red-300 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
              >
                O&apos;chirish
              </button>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border border-teal-600 px-5 py-2 text-sm font-medium text-teal-600 transition-colors hover:bg-teal-600 hover:text-white"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif text-lg font-semibold text-gray-900">
              O&apos;chirishni tasdiqlang
            </h4>
            <p className="mt-2 text-sm text-gray-500">
              Ushbu arizani o&apos;chirishni xohlaysizmi? Bu amalni ortga qaytarib
              bo&apos;lmaydi.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                O&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
