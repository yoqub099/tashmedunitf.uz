"use client";

import { useState } from "react";
import { useLookSessions } from "@/hooks/useLook";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import Pagination from "@/components/shared/Pagination";
import { eventMeta, color, timeAgo, formatDateTime, CauserAvatar, RoleBadge } from "./shared";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "", label: "Barchasi" },
  { value: "login", label: "Kirishlar" },
  { value: "logout", label: "Chiqishlar" },
  { value: "login_failed", label: "Xato urinishlar" },
];

export default function SessionsPanel({ live }: { live: boolean }) {
  const [page, setPage] = useState(1);
  const [event, setEvent] = useState("");

  const { data, isLoading, isFetching } = useLookSessions(
    { page, per_page: 30, event: event || undefined },
    live
  );
  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setEvent(f.value);
              setPage(1);
            }}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              event === f.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
      ) : items.length === 0 ? (
        <EmptyState title="Sessiya topilmadi" message="Tanlangan filtr bo'yicha kirish/chiqish yozuvi yo'q." />
      ) : (
        <div className={cn("divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white", isFetching && "opacity-70")}>
          {items.map((s) => {
            const m = eventMeta(s.event);
            const c = color(m.color);
            const ua = s.user_agent ?? "";
            return (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white", c.bg)}>
                  <m.Icon className="h-4 w-4" />
                </div>
                <CauserAvatar name={s.causer.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">
                    <span className="font-semibold text-gray-900">{s.causer.name ?? "Anonim"}</span>{" "}
                    <span className={c.text}>{m.label.toLowerCase()}</span>
                    {s.event === "login_failed" && s.properties?.email ? (
                      <span className="font-mono text-xs text-red-500"> ({String(s.properties.email)})</span>
                    ) : null}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span title={formatDateTime(s.created_at)}>{timeAgo(s.created_at)}</span>
                    {s.causer.role && (
                      <>
                        <span>·</span>
                        <RoleBadge role={s.causer.role} />
                      </>
                    )}
                    {s.ip && (
                      <>
                        <span>·</span>
                        <span className="font-mono">{s.ip}</span>
                      </>
                    )}
                    {ua && <span className="hidden truncate sm:inline" title={ua}>· {ua.slice(0, 48)}</span>}
                  </div>
                </div>
              </div>
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
