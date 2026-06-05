"use client";

import { useState, useEffect, useCallback } from "react";
import { conferenceRegistrationService } from "@/lib/services/conferenceRegistrationService";
import type { ConferenceRegistration } from "@/types";
import { ClipboardList, Trash2, Eye, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

function t(obj: unknown): string {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "object" && obj !== null) {
    const o = obj as Record<string, string>;
    return o.uz || o.ru || o.en || "";
  }
  return String(obj);
}

type ReadFilter = "all" | "unread" | "read";

export default function ConferenceRegistrationsAdmin() {
  const [registrations, setRegistrations] = useState<ConferenceRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchInput, setSearchInput] = useState("");  // instant input value
  const [search, setSearch] = useState("");             // debounced value
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [selected, setSelected] = useState<ConferenceRegistration | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Debounce search input → 300ms
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
      const res = await conferenceRegistrationService.getAll(params);
      setRegistrations(res.data);
      setTotalPages(res.meta.last_page);
      setTotal(res.meta.total);
    } catch (err) {
      console.error("[konferensiya-royxatlari] fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, readFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleView = async (id: number) => {
    try {
      const reg = await conferenceRegistrationService.getById(id);
      setSelected(reg);
      // Update local state to mark as read
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_read: true } : r))
      );
    } catch (err) {
      console.error("[konferensiya-royxatlari] view failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await conferenceRegistrationService.delete(deleteId);
      setRegistrations((prev) => prev.filter((r) => r.id !== deleteId));
      setTotal((p) => p - 1);
      setDeleteId(null);
      if (selected?.id === deleteId) setSelected(null);
    } catch (err) {
      console.error("[konferensiya-royxatlari] delete failed:", err);
    }
  };

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [readFilter, perPage]);

  const filtered = registrations.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.first_name.toLowerCase().includes(q) ||
      r.last_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone && r.phone.includes(q))
    );
  });

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
            <div className="flex size-10 items-center justify-center rounded-xl bg-green-100">
              <ClipboardList className="size-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Konferensiya ro&apos;yxatlari</h1>
              <p className="text-sm text-gray-500">Jami: {total} ta ro&apos;yxat</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Qidirish..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-green-500 focus:outline-none"
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
                    ? "bg-green-600 text-white"
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
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs focus:border-green-500 focus:outline-none"
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
                Filter'ni tozalash
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
                  <th className="px-4 py-3 font-medium text-gray-500">Konferensiya</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Sana</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      Yuklanmoqda...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      Ro&apos;yxatlar topilmadi
                    </td>
                  </tr>
                ) : (
                  filtered.map((reg, i) => (
                    <tr
                      key={reg.id}
                      className={`transition-colors hover:bg-gray-50 ${!reg.is_read ? "bg-green-50/50" : ""}`}
                    >
                      <td className="px-4 py-3 text-gray-400">{(page - 1) * perPage + i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {!reg.is_read && (
                            <span className="inline-block size-2 rounded-full bg-green-500" />
                          )}
                          {reg.first_name} {reg.last_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{reg.email}</td>
                      <td className="px-4 py-3 text-gray-600">{reg.phone || "—"}</td>
                      <td className="max-w-50 truncate px-4 py-3 text-gray-600">
                        {reg.news ? t(reg.news.title) : `#${reg.news_id}`}
                      </td>
                      <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                        {new Date(reg.created_at).toLocaleDateString("uz-UZ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleView(reg.id)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
                            title="Ko'rish"
                          >
                            <Eye className="size-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(reg.id)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                            title="O'chirish"
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
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── View Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="relative mx-4 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              ✕
            </button>

            <h4 className="font-serif text-xl font-semibold text-gray-900 mb-4">Registratsiya ma&apos;lumotlari</h4>

            <div className="space-y-3">
              {[
                { label: "Ism", value: selected.first_name },
                { label: "Familiya", value: selected.last_name },
                { label: "Email", value: selected.email },
                { label: "Telefon", value: selected.phone || "Ko'rsatilmagan" },
                { label: "Manzil", value: selected.address || "Ko'rsatilmagan" },
                { label: "Konferensiya", value: selected.news ? t(selected.news.title) : `#${selected.news_id}` },
                { label: "Sana", value: new Date(selected.created_at).toLocaleString("uz-UZ") },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-3">
                  <span className="min-w-25 text-sm text-gray-500">{f.label}:</span>
                  <span className="text-sm font-medium text-gray-900">{f.value}</span>
                </div>
              ))}
            </div>

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
                className="rounded-full border border-green-600 px-5 py-2 text-sm font-medium text-green-600 transition-colors hover:bg-green-600 hover:text-white"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)}>
          <div className="mx-4 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-serif text-lg font-semibold text-gray-900">O&apos;chirishni tasdiqlang</h4>
            <p className="mt-2 text-sm text-gray-500">
              Ushbu ro&apos;yxatni o&apos;chirishni xohlaysizmi? Bu amalni ortga qaytarib bo&apos;lmaydi.
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
