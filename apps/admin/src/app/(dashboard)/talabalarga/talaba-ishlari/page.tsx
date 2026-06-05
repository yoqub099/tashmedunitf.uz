"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { studentWorkService } from "@/lib/services/studentWorkService";
import { QUERY_KEYS } from "@/lib/constants";
import type { StudentWork } from "@/types";
import {
  Trash2, Eye, Download, Mail, Phone, MapPin, Building2, User, FileText,
  X, ChevronLeft, ChevronRight, Search,
} from "lucide-react";

type ReadFilter = "all" | "unread" | "read";

export default function TalabaIshlariPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [selected, setSelected] = useState<StudentWork | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Debounce search — 300ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [readFilter, perPage, search]);

  // Escape key — close modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (deleteId !== null) setDeleteId(null);
      else if (selected) setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, deleteId]);

  const { data, isLoading, error } = useQuery({
    queryKey: [...QUERY_KEYS.STUDENT_WORKS, { page, perPage, readFilter, search }],
    queryFn: () =>
      studentWorkService.getAll({
        page,
        per_page: perPage,
        is_read: readFilter === "read" ? 1 : readFilter === "unread" ? 0 : undefined,
        search: search || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => studentWorkService.delete(id),
    onSuccess: () => {
      toast.success("Ariza o'chirildi!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_WORKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_WORKS_UNREAD });
      setSelected(null);
      setDeleteId(null);
    },
    onError: (err) => {
      console.error("[talaba-ishlari] delete failed:", err);
      toast.error("O'chirishda xato!");
    },
  });

  const handleView = useCallback(async (work: StudentWork) => {
    try {
      const detail = await studentWorkService.getById(work.id);
      setSelected(detail);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_WORKS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENT_WORKS_UNREAD });
    } catch (err) {
      console.error("[talaba-ishlari] view failed:", err);
      toast.error("Ma'lumotlarni olishda xato!");
    }
  }, [queryClient]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("uz-UZ", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });

  // Search endi server-side — filter[search] backendga yuboriladi
  const works = data?.data || [];
  const meta = data?.meta;
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
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100">
              <FileText className="size-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Talaba ishlari</h1>
              <p className="text-sm text-gray-500">Jami: {meta?.total || 0} ta ariza</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <label htmlFor="student-works-search" className="sr-only">
              Qidirish
            </label>
            <input
              id="student-works-search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Qidirish..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="student-works-per-page" className="text-xs font-medium text-gray-500">Per page:</label>
            <select
              id="student-works-per-page"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
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
                  <th className="px-4 py-3 font-medium text-gray-500">Ism familiya</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Tashkilot</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Telefon</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Sana</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Fayl</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">Yuklanmoqda...</td></tr>
                ) : error ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-red-500">Ma&apos;lumotlarni yuklashda xatolik</td></tr>
                ) : works.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">Arizalar topilmadi</td></tr>
                ) : (
                  works.map((work, idx) => (
                    <tr
                      key={work.id}
                      className={`transition-colors hover:bg-gray-50 ${!work.is_read ? "bg-indigo-50/50" : ""}`}
                    >
                      <td className="px-4 py-3 text-gray-400">
                        {((meta?.current_page || 1) - 1) * perPage + idx + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {!work.is_read && (
                            <span className="inline-block size-2 rounded-full bg-indigo-500" />
                          )}
                          {work.fullname}
                        </div>
                      </td>
                      <td className="max-w-40 truncate px-4 py-3 text-gray-600">{work.organization}</td>
                      <td className="px-4 py-3 text-gray-600">{work.email}</td>
                      <td className="px-4 py-3 text-gray-600">{work.phone}</td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(work.created_at)}</td>
                      <td className="px-4 py-3">
                        {work.file_path ? (
                          <a
                            href={work.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                          >
                            <Download className="size-3.5" />
                            <span className="text-xs">Yuklab olish</span>
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(work)}
                            className="flex size-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title="Ko'rish"
                            aria-label="Ko'rish"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(work.id)}
                            className="flex size-10 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
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
          {meta && meta.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <p className="text-sm text-gray-500">
                Sahifa {meta.current_page} / {meta.last_page}
              </p>
              <div className="flex gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  aria-label="Oldingi sahifa"
                  className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={page >= meta.last_page}
                  aria-label="Keyingi sahifa"
                  className="flex size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="student-work-modal-title"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 id="student-work-modal-title" className="text-lg font-semibold">
                Talaba ishi #{selected.id}
              </h3>
              <button
                onClick={() => setSelected(null)}
                aria-label="Yopish"
                className="flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { icon: User, label: "Ism familiya", value: selected.fullname },
                { icon: Building2, label: "Tashkilot", value: selected.organization },
                { icon: Mail, label: "Elektron manzil", value: selected.email },
                { icon: Phone, label: "Telefon raqam", value: selected.phone },
                { icon: MapPin, label: "Manzil", value: selected.address },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <f.icon className="mt-0.5 size-4 text-gray-400 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">{f.label}</p>
                    <p className="break-words font-medium">{f.value || "—"}</p>
                  </div>
                </div>
              ))}

              {selected.file_path && (
                <a
                  href={selected.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl border border-indigo-600 p-3 text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Download className="size-4" />
                  <span className="text-sm font-medium truncate">
                    {selected.file_name || "Faylni yuklab olish"}
                  </span>
                </a>
              )}

              <p className="text-xs text-gray-400">Yuborilgan: {formatDate(selected.created_at)}</p>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteId(selected.id);
                  setSelected(null);
                }}
                className="rounded-full border border-red-300 px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                O&apos;chirish
              </button>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full border border-indigo-600 px-5 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif text-lg font-semibold text-gray-900">O&apos;chirishni tasdiqlang</h4>
            <p className="mt-2 text-sm text-gray-500">
              Ushbu talaba ishini o&apos;chirishni xohlaysizmi? Bu amalni ortga qaytarib bo&apos;lmaydi.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "O'chirilmoqda..." : "O'chirish"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
