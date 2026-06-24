"use client";

import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { useLookActivities } from "@/hooks/useLook";
import type { LookActivity } from "@/lib/services/lookService";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { eventMeta, color, subjectLabel, timeAgo, CauserAvatar, RoleBadge } from "./shared";
import { cn } from "@/lib/utils";

const EVENT_FILTERS = [
  { value: "", label: "Barchasi" },
  { value: "created", label: "Yaratish" },
  { value: "updated", label: "O'zgartirish" },
  { value: "deleted", label: "O'chirish" },
  { value: "force_deleted", label: "Butunlay o'chirish" },
];

const LOG_FILTERS = [
  { value: "", label: "Hammasi" },
  { value: "content", label: "Kontent" },
  { value: "media", label: "Media" },
  { value: "auth", label: "Kirish/chiqish" },
];

export default function ActivityFeed({
  live,
  onSelect,
}: {
  live: boolean;
  onSelect: (a: LookActivity) => void;
}) {
  const [page, setPage] = useState(1);
  const [event, setEvent] = useState("");
  const [logName, setLogName] = useState("");
  const [q, setQ] = useState("");

  const params = {
    page,
    per_page: 25,
    event: event || undefined,
    log_name: logName || undefined,
    q: q || undefined,
  };

  const { data, isLoading, isFetching } = useLookActivities(params, live);
  const items = data?.data ?? [];
  const meta = data?.meta;

  const resetTo = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Filtrlar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {EVENT_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => resetTo(() => setEvent(f.value))}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                event === f.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={logName}
            onChange={(e) => resetTo(() => setLogName(e.target.value))}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
          >
            {LOG_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => resetTo(() => setQ(e.target.value))}
              placeholder="Qidirish..."
              className="w-44 rounded-lg border border-gray-200 bg-white py-1.5 pl-8 pr-3 text-xs text-gray-700 focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Oqim */}
      {isLoading ? (
        <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
      ) : items.length === 0 ? (
        <EmptyState title="Faollik topilmadi" message="Tanlangan filtr bo'yicha yozuv yo'q." />
      ) : (
        <div className={cn("divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white", isFetching && "opacity-70")}>
          {items.map((a) => {
            const m = eventMeta(a.event);
            const c = color(m.color);
            return (
              <button
                key={a.id}
                onClick={() => onSelect(a)}
                className="group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", c.bg)}>
                  <m.Icon className="h-4 w-4" />
                </div>
                <CauserAvatar name={a.causer.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">
                    <span className="font-semibold text-gray-900">{a.causer.name ?? "Anonim"}</span>{" "}
                    <span className={c.text}>{m.label.toLowerCase()}</span>
                    {a.subject.type && (
                      <>
                        {" · "}
                        <span className="text-gray-500">{subjectLabel(a.subject.type)}</span>
                        {a.subject.label ? <span className="text-gray-700">: {a.subject.label}</span> : null}
                      </>
                    )}
                    {a.event === "login_failed" && a.properties?.email ? (
                      <span className="font-mono text-xs text-red-500"> ({String(a.properties.email)})</span>
                    ) : null}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                    <span>{timeAgo(a.created_at)}</span>
                    {a.causer.role && (
                      <>
                        <span>·</span>
                        <RoleBadge role={a.causer.role} />
                      </>
                    )}
                    {a.ip && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{a.ip}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
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
