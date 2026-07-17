"use client";

import Image from "next/image";
import type { JournalIssue } from "@/types";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/translate";

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
      <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
    </svg>
  );
}

export default function JournalCard({ issue }: { issue: JournalIssue }) {
  const { language } = useLanguageStore();
  const title = t(issue.title, language);
  // Muqova yo'q bo'lsa gradient plashka ko'rsatiladi (mavjud bo'lmagan
  // /imgs/journal/placeholder.jpg ga murojaat 404 bo'lib turardi)
  const cover = issue.cover_thumbnail || issue.cover || "";
  const downloadLabel = s("common.download", language);

  return (
    <div className="p-3 sm:p-4 lg:rounded-3xl bg-white rounded-3xl flex flex-col md:p-3 h-full w-full border border-transparent shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative w-full aspect-3/4 mb-2 sm:mb-4 overflow-hidden rounded-xl sm:rounded-2xl shrink-0 bg-gray-100">
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 50vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[#00575B] to-[#00969D] flex items-center justify-center">
            <span className="text-white/80 text-4xl font-serif font-semibold">№</span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 w-full gap-2">
        <h4 className="md:text-xl text-xs sm:text-sm font-semibold leading-snug line-clamp-2 transition-colors hover:text-[#00575B] min-h-[2.4em]">
          {title}
        </h4>
        <small className="font-medium text-[10px] text-slate-400">{issue.date}</small>
        <div className="mt-auto pt-3 border-t border-slate-100">
          {issue.file_url ? (
            <a
              href={issue.file_url}
              download
              className="flex items-center gap-3 text-[#00575B] text-xs font-bold transition-opacity hover:opacity-80"
            >
              <span className="uppercase tracking-wider">{downloadLabel}</span>
              <DownloadIcon />
            </a>
          ) : (
            <span className="flex items-center gap-3 text-slate-400 text-xs font-bold cursor-default">
              <span className="uppercase tracking-wider">{downloadLabel}</span>
              <DownloadIcon />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
