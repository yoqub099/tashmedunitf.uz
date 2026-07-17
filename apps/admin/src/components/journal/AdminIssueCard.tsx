"use client";

import Image from "next/image";
import { Pencil, Trash2, FileDown } from "lucide-react";
import type { JournalIssue } from "@/types";
import { t } from "@/lib/utils";

interface AdminIssueCardProps {
  issue: JournalIssue;
  onEdit: (item: JournalIssue) => void;
  onDelete: (id: number) => void;
}

export default function AdminIssueCard({ issue, onEdit, onDelete }: AdminIssueCardProps) {
  // Muqova yo'q bo'lsa gradient plashka (mavjud bo'lmagan placeholder.jpg 404 berardi)
  const cover = issue.cover_thumbnail || issue.cover || "";
  const title = t(issue.title);

  return (
    <div className="group relative p-4 lg:rounded-3xl bg-white rounded-3xl flex flex-col md:p-3 h-full w-full border border-transparent shadow-sm hover:shadow-md transition-shadow">
      {/* Action buttons */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(issue)}
          className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow hover:bg-blue-50 transition-colors"
          title="Tahrirlash"
        >
          <Pencil className="h-3.5 w-3.5 text-blue-600" />
        </button>
        <button
          onClick={() => onDelete(issue.id)}
          className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow hover:bg-red-50 transition-colors"
          title="O'chirish"
        >
          <Trash2 className="h-3.5 w-3.5 text-red-600" />
        </button>
      </div>

      {/* Status badges */}
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        {issue.is_current && (
          <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded">
            Joriy
          </span>
        )}
        {!issue.is_published && (
          <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
            Qoralama
          </span>
        )}
      </div>

      <div className="relative w-full aspect-3/4 mb-4 overflow-hidden rounded-2xl shrink-0 bg-gray-100">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#00575B] to-[#00969D] flex items-center justify-center">
            <span className="text-white/80 text-3xl font-semibold">№</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 w-full gap-2">
        <h4 className="md:text-base text-sm font-semibold leading-snug line-clamp-2">
          {title}
        </h4>
        <small className="font-medium text-[10px] text-slate-400">{issue.date}</small>
        {issue.file_url && (
          <div className="mt-auto pt-3 border-t border-slate-100">
            <a
              href={issue.file_url}
              download
              className="flex items-center gap-1.5 text-[#00575B] text-xs font-bold hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <FileDown className="h-3.5 w-3.5" />
              <span className="uppercase tracking-wider">Yuklab olish</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
