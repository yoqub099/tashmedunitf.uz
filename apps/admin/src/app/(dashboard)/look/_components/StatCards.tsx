"use client";

import { Activity, AlertTriangle, Users, LogIn } from "lucide-react";
import type { LookStats } from "@/lib/services/lookService";
import { cn } from "@/lib/utils";

export default function StatCards({ stats, loading }: { stats?: LookStats; loading?: boolean }) {
  const cards = [
    {
      label: "Bugungi faollik",
      value: stats?.activities.today,
      sub: `Bu hafta: ${stats?.activities.week ?? "—"} · Jami: ${stats?.activities.total ?? "—"}`,
      Icon: Activity,
      grad: "from-blue-500 to-indigo-600",
    },
    {
      label: "Hozir onlayn",
      value: stats?.online_now,
      sub: "So'nggi 5 daqiqada faol",
      Icon: Users,
      grad: "from-emerald-500 to-teal-600",
    },
    {
      label: "Bugungi xatolar",
      value: stats?.errors.today,
      sub: `Bu hafta: ${stats?.errors.week ?? "—"} · Jami: ${stats?.errors.total ?? "—"}`,
      Icon: AlertTriangle,
      grad: "from-rose-500 to-red-600",
    },
    {
      label: "Bugungi kirishlar",
      value: stats?.sessions.logins_today,
      sub: `Xato urinish: ${stats?.sessions.failed_today ?? "—"}`,
      Icon: LogIn,
      grad: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500">{c.label}</p>
              <p className="mt-1 text-3xl font-bold tabular-nums text-gray-900">
                {loading && c.value === undefined ? (
                  <span className="inline-block h-8 w-12 animate-pulse rounded bg-gray-100" />
                ) : (
                  (c.value ?? 0)
                )}
              </p>
              <p className="mt-1 truncate text-xs text-gray-400">{c.sub}</p>
            </div>
            <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md", c.grad)}>
              <c.Icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
