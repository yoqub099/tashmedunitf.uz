"use client";

import { useEffect } from "react";
import { X, Globe, Monitor, Clock, Hash, Link2, User as UserIcon } from "lucide-react";
import type { LookActivity, LookError } from "@/lib/services/lookService";
import {
  DiffTable,
  eventMeta,
  subjectLabel,
  formatDateTime,
  color,
  SOURCE_META,
  LEVEL_META,
  Pill,
} from "./shared";
import { cn } from "@/lib/utils";

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-6">
      <div
        className="my-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function MetaRow({ Icon, label, value }: { Icon: React.ElementType; label: string; value?: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
      <span className="text-gray-400">{label}:</span>
      <span className="break-all font-medium text-gray-700">{value}</span>
    </div>
  );
}

export function ActivityDetailModal({ activity, onClose }: { activity: LookActivity; onClose: () => void }) {
  const meta = eventMeta(activity.event);
  const c = color(meta.color);

  return (
    <Overlay title="Faollik tafsiloti" onClose={onClose}>
      <div className="space-y-5" onClick={(e) => e.stopPropagation()}>
        {/* Sarlavha */}
        <div className="flex items-start gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white", c.bg)}>
            <meta.Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">
              {activity.causer.name ?? "Anonim"}{" "}
              <span className={cn("font-medium", c.text)}>{meta.label.toLowerCase()}</span>
            </p>
            {activity.subject.type && (
              <p className="text-sm text-gray-500">
                {subjectLabel(activity.subject.type)}
                {activity.subject.label ? `: ${activity.subject.label}` : ""}
              </p>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
          <MetaRow Icon={UserIcon} label="Rol" value={activity.causer.role} />
          <MetaRow Icon={Clock} label="Vaqt" value={formatDateTime(activity.created_at)} />
          <MetaRow Icon={Globe} label="IP" value={activity.ip} />
          <MetaRow Icon={Hash} label="ID" value={activity.subject.id ? `#${activity.subject.id}` : null} />
          <MetaRow Icon={Link2} label="URL" value={activity.url} />
          <MetaRow Icon={Monitor} label="Metod" value={activity.method} />
        </div>

        {/* Login urinish ma'lumoti */}
        {activity.properties?.email ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Kiritilgan email: <span className="font-mono font-semibold">{String(activity.properties.email)}</span>
          </div>
        ) : null}

        {/* O'zgarish (diff) */}
        {(activity.old_values || activity.new_values) && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">O&apos;zgarish</p>
            <DiffTable oldValues={activity.old_values} newValues={activity.new_values} />
          </div>
        )}
      </div>
    </Overlay>
  );
}

export function ErrorDetailModal({ error, onClose }: { error: LookError; onClose: () => void }) {
  const src = SOURCE_META[error.source] ?? { label: error.source, color: "gray" };
  const lvl = LEVEL_META[error.level] ?? { label: error.level, color: "gray" };
  const trace = (error.context?.trace ?? []) as Array<{ file?: string; line?: number; function?: string }>;

  return (
    <Overlay title="Xato tafsiloti" onClose={onClose}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <Pill label={src.label} colorName={src.color} />
          <Pill label={lvl.label} colorName={lvl.color} />
          {error.type && <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-[11px] text-gray-600">{error.type}</span>}
          {error.count > 1 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">×{error.count}</span>
          )}
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
          <p className="break-words text-sm font-medium text-red-900">{error.message}</p>
        </div>

        <div className="grid grid-cols-1 gap-2 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
          <MetaRow Icon={Clock} label="Birinchi" value={formatDateTime(error.created_at)} />
          <MetaRow Icon={Clock} label="Oxirgi" value={formatDateTime(error.updated_at)} />
          <MetaRow Icon={Link2} label="URL" value={error.url} />
          <MetaRow Icon={Monitor} label="Fayl" value={error.file ? `${error.file}${error.line ? ":" + error.line : ""}` : null} />
          <MetaRow Icon={UserIcon} label="Foydalanuvchi" value={error.user.name} />
          <MetaRow Icon={Globe} label="IP" value={error.ip} />
          <MetaRow Icon={Hash} label="Status" value={error.status_code} />
        </div>

        {/* Backend stack-trace */}
        {trace.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Stack trace</p>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-900 p-3 font-mono text-[11px] leading-relaxed text-gray-300">
              {trace.map((t, i) => (
                <div key={i} className="border-b border-white/5 py-1 last:border-0">
                  <span className="text-cyan-400">{t.function || "?"}</span>
                  <div className="text-gray-500">
                    {t.file}
                    {t.line ? `:${t.line}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frontend stack */}
        {error.context?.stack && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Brauzer stack</p>
            <pre className="max-h-72 overflow-auto rounded-xl border border-gray-200 bg-gray-900 p-3 font-mono text-[11px] leading-relaxed text-gray-300 whitespace-pre-wrap break-words">
              {error.context.stack}
            </pre>
          </div>
        )}
      </div>
    </Overlay>
  );
}
