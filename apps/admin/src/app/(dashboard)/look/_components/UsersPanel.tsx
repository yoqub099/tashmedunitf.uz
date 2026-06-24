"use client";

import { Mail, Activity, Clock, LogIn } from "lucide-react";
import { useLookUsers } from "@/hooks/useLook";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EmptyState from "@/components/shared/EmptyState";
import { CauserAvatar, RoleBadge, timeAgo, formatDateTime } from "./shared";

export default function UsersPanel({ live }: { live: boolean }) {
  const { data: users, isLoading } = useLookUsers(live);

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />;
  }
  if (!users || users.length === 0) {
    return <EmptyState title="Foydalanuvchi topilmadi" message="Hozircha foydalanuvchi yo'q." />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((u) => (
        <div key={u.id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <CauserAvatar name={u.name} online={u.is_online} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-semibold text-gray-900">{u.name}</p>
                {u.is_online && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    onlayn
                  </span>
                )}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-400">
                <Mail className="h-3 w-3" />
                <span className="truncate">{u.email}</span>
              </div>
            </div>
            <RoleBadge role={u.role} />
          </div>

          {/* Faollik sanoqlari */}
          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-2 text-center">
            <div>
              <p className="text-lg font-bold tabular-nums text-gray-900">{u.actions_today}</p>
              <p className="text-[10px] text-gray-400">bugun</p>
            </div>
            <div className="border-x border-gray-200">
              <p className="text-lg font-bold tabular-nums text-gray-900">{u.actions_week}</p>
              <p className="text-[10px] text-gray-400">hafta</p>
            </div>
            <div>
              <p className="text-lg font-bold tabular-nums text-gray-900">{u.actions_total}</p>
              <p className="text-[10px] text-gray-400">jami</p>
            </div>
          </div>

          {/* Vaqtlar */}
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <LogIn className="h-3.5 w-3.5 text-gray-400" />
              <span>Oxirgi kirish:</span>
              <span className="font-medium text-gray-700" title={formatDateTime(u.last_login)}>{timeAgo(u.last_login)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Activity className="h-3.5 w-3.5 text-gray-400" />
              <span>Oxirgi faollik:</span>
              <span className="font-medium text-gray-700" title={formatDateTime(u.last_activity)}>{timeAgo(u.last_activity)}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>Oxirgi ko&apos;rinish:</span>
              <span className="font-medium text-gray-700" title={formatDateTime(u.last_seen)}>{timeAgo(u.last_seen)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
