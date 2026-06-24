"use client";

import { useState } from "react";
import { Search, AlertTriangle, ChevronRight } from "lucide-react";
import { useLookErrors } from "@/hooks/useLook";
import type { LookError } from "@/lib/services/lookService";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { timeAgo, formatDateTime, color, SOURCE_META, LEVEL_META, Pill } from "./shared";
import { cn } from "@/lib/utils";

const SOURCE_FILTERS = [
  { value: "", label: "Barcha manbalar" },
  { value: "backend", label: "Backend" },
  { value: "web", label: "Sayt" },
  { value: "admin", label: "Admin" },
];

const LEVEL_FILTERS = [
  { value: "", label: "Barcha darajalar" },
  { value: "critical", label: "Kritik" },
  { value: "error", label: "Xato" },
  { value: "warning", label: "Ogohlantirish" },
];

export default function ErrorsPanel({
  live,
  onSelect,
}: {
  live: boolean;
  onSelect: (e: LookError) => void;
}) {
  const [page, setPage] = useState(1);
  const [source, setSource] = useState("");
  const [level, setLevel] = useState("");
  const [q, setQ] = useState("");

  const { data, isLoading, isFetching } = useLookErrors(
    { page, per_page: 25, source: source || undefined, level: level || undefined, q: q || undefined },
    live
  );
  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setSource(f.value);
                setPage(1);
              }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                source === f.value ? "bg-rose-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-rose-400 focus:outline-none"
          >
            {LEVEL_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Xato qidirish..."
              className="w-44 rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-700 focus:border-rose-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Xato topilmadi 🎉"
          message="Tanlangan filtr bo'yicha xatolik yo'q. Bu yaxshi xabar!"
        />
      ) : (
        <div className={cn("divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white", isFetching && "opacity-70")}>
          {items.map((e) => {
            const src = SOURCE_META[e.source] ?? { label: e.source, color: "gray" };
            const lvl = LEVEL_META[e.level] ?? { label: e.level, color: "gray" };
            return (
              <button
                key={e.id}
                onClick={() => onSelect(e)}
                className="group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", color(lvl.color).bg)}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Pill label={src.label} colorName={src.color} />
                    {e.type && <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500">{e.type}</span>}
                    {e.count > 1 && (
                      <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">×{e.count}</span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-gray-800">{e.message}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span title={formatDateTime(e.updated_at)}>{timeAgo(e.updated_at)}</span>
                    {e.url && (
                      <>
                        <span>·</span>
                        <span className="truncate font-mono">{e.url.replace(/^https?:\/\/[^/]+/, "")}</span>
                      </>
                    )}
                    {e.user.name && (
                      <>
                        <span>·</span>
                        <span>{e.user.name}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
              </button>
            );
          })}
        </div>
      )}

      {meta && meta.last_page > 1 && (
        <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={setPage} />
      )}
    </div>
  );
}
