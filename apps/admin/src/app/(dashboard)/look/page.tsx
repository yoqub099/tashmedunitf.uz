"use client";

import { useState } from "react";
import {
  Eye,
  RefreshCw,
  Radio,
  Activity,
  Users,
  LogIn,
  AlertTriangle,
  ShieldX,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useLookStats } from "@/hooks/useLook";
import type { LookActivity, LookError } from "@/lib/services/lookService";
import Container from "@/components/shared/Container";
import StatCards from "./_components/StatCards";
import ActivityFeed from "./_components/ActivityFeed";
import UsersPanel from "./_components/UsersPanel";
import SessionsPanel from "./_components/SessionsPanel";
import ErrorsPanel from "./_components/ErrorsPanel";
import { ActivityDetailModal, ErrorDetailModal } from "./_components/DetailModal";
import { cn } from "@/lib/utils";

type Tab = "activity" | "users" | "sessions" | "errors";

const TABS: { id: Tab; label: string; Icon: typeof Activity }[] = [
  { id: "activity", label: "Faollik", Icon: Activity },
  { id: "users", label: "Foydalanuvchilar", Icon: Users },
  { id: "sessions", label: "Sessiyalar", Icon: LogIn },
  { id: "errors", label: "Xatoliklar", Icon: AlertTriangle },
];

export default function LookPage() {
  const { user } = useAuthStore();
  // Backend `roles` (massiv) qaytaradi; eski tip `role` (string) bo'lishi mumkin
  const roles = ((user as { roles?: string[] } | null)?.roles) ?? [];
  const singleRole = (user as { role?: string } | null)?.role;
  const isSuperAdmin = roles.includes("super-admin") || singleRole === "super-admin";

  const [tab, setTab] = useState<Tab>("activity");
  const [live, setLive] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<LookActivity | null>(null);
  const [selectedError, setSelectedError] = useState<LookError | null>(null);

  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading, isFetching } = useLookStats(live);

  // Auth hali hidratsiya bo'lmagan bo'lsa
  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  // Faqat super-admin
  if (!isSuperAdmin) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <ShieldX className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-4 text-xl font-bold text-gray-900">Ruxsat yo&apos;q</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bu sahifa faqat <b>super-admin</b> uchun. Kuzatuv markaziga kirish huquqingiz yo&apos;q.
          </p>
        </div>
      </Container>
    );
  }

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["look"] });

  return (
    <Container className="py-6 sm:py-8">
      {/* Sarlavha */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-md">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-gray-900 sm:text-3xl">Kuzatuv markazi</h1>
            <p className="text-sm text-gray-500">
              Kim nimani o&apos;zgartirdi, qachon kirdi, qanday xatolar chiqdi — barchasi shu yerda
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLive((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
              live ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
            )}
            title={live ? "Jonli yangilanish yoqilgan" : "Jonli yangilanish o'chirilgan"}
          >
            <Radio className={cn("h-4 w-4", live && "animate-pulse")} />
            {live ? "Jonli" : "To'xtatilgan"}
          </button>
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-xl bg-gray-100 px-3.5 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            Yangilash
          </button>
        </div>
      </div>

      {/* Statistika kartalari */}
      <StatCards stats={stats} loading={statsLoading} />

      {/* Tablar */}
      <div className="mt-6 mb-4 flex items-center gap-1 overflow-x-auto border-b border-gray-200">
        {TABS.map((t) => {
          const active = tab === t.id;
          const badge = t.id === "errors" ? stats?.errors.today : undefined;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                active ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <t.Icon className="h-4 w-4" />
              {t.label}
              {badge ? (
                <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">{badge}</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Faol panel */}
      {tab === "activity" && <ActivityFeed live={live} onSelect={setSelectedActivity} />}
      {tab === "users" && <UsersPanel live={live} />}
      {tab === "sessions" && <SessionsPanel live={live} />}
      {tab === "errors" && <ErrorsPanel live={live} onSelect={setSelectedError} />}

      {/* Modallar */}
      {selectedActivity && (
        <ActivityDetailModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      )}
      {selectedError && <ErrorDetailModal error={selectedError} onClose={() => setSelectedError(null)} />}
    </Container>
  );
}
