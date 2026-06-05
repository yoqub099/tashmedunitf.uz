"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useSiteMediaByKey, useUpdateSiteMedia, useCreateSiteMedia } from "@/hooks/useSiteMedia";
import toast from "react-hot-toast";

/* ── Arrow icon (diagonal ↗) ── */
function ArrowIcon() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#00575B] text-[#00575B] transition-colors group-hover:bg-[#00575B] group-hover:text-white">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </span>
  );
}

/* ── Download icon ── */
function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Upload icon ── */
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

/* ── Inner card ── */
function ActivityCard({
  title,
  description,
  href,
  download,
  downloadLabel,
}: {
  title: string;
  description: string;
  href: string;
  download?: boolean;
  downloadLabel?: string;
}) {
  return (
    <Link
      href={href}
      {...(download ? { download: true, target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex h-52 flex-col justify-between rounded-2xl bg-white p-4 transition-shadow hover:shadow-md md:p-6"
    >
      <div>
        <h5 className="font-serif text-lg font-semibold text-gray-900">{title}</h5>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">{description}</p>
      </div>
      <div className="flex items-center justify-between">
        {downloadLabel ? (
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00575B] px-4 py-2 text-sm font-medium text-[#00575B] transition-colors group-hover:bg-[#00575B] group-hover:text-white">
            <DownloadIcon />
            {downloadLabel}
          </span>
        ) : (
          <span />
        )}
        {!downloadLabel && <ArrowIcon />}
      </div>
    </Link>
  );
}

/* ── Grafik PDF upload card ── */
function GrafikUploadCard() {
  const { data: mediaData } = useSiteMediaByKey("oquv_grafik");
  const createMutation = useCreateSiteMedia();
  const updateMutation = useUpdateSiteMedia();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fileUrl = mediaData?.file_url || null;
  const mediaId = mediaData?.id;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Faqat PDF fayl yuklash mumkin!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", "oquv_grafik");
    formData.append("title", "O'quv jarayonlari grafigi");
    formData.append("is_active", "1");

    try {
      if (mediaId) {
        formData.append("_method", "PUT");
        await updateMutation.mutateAsync({ id: mediaId, formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      toast.success("Grafik muvaffaqiyatli yuklandi!");
    } catch {
      toast.error("Yuklashda xatolik!");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-52 flex-col justify-between rounded-2xl bg-white p-4 md:p-6">
      <div>
        <h5 className="font-serif text-lg font-semibold text-gray-900">
          O&apos;quv jarayonlari grafiklari
        </h5>
        <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
          2025-2026 o&apos;quv yiliga o&apos;quv jarayoni grafigi
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Yuklash tugmasi */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-600 hover:text-white disabled:opacity-50"
        >
          <UploadIcon />
          {uploading ? "Yuklanmoqda..." : mediaId ? "PDF almashtirish" : "PDF yuklash"}
        </button>

        {/* Yuklab olish */}
        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#00575B] px-4 py-2 text-sm font-medium text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white"
          >
            <DownloadIcon />
            Yuklab olish
          </a>
        )}
      </div>
    </div>
  );
}

export default function OquvFaoliyatiPage() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Breadcrumb
          items={[
            { label: "Faoliyat", href: "/faoliyat" },
            { label: "O'quv faoliyati" },
          ]}
        />

        <h2 className="mt-3 font-serif text-2xl font-semibold text-gray-900 md:text-[32px] lg:text-[40px]">
          O&apos;quv faoliyati
        </h2>

        {/* ═══════ 2-column grid ═══════ */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* ── Left: O'quv rejalari ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              O&apos;quv rejalari
            </h4>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <ActivityCard
                title="Bakalavriat"
                description="Bakalavriat bosqichi uchun o'quv rejalari"
                href="/faoliyat/oquv-faoliyati/oquv-rejalari/bakalavriat"
              />
              <ActivityCard
                title="Magistratura"
                description="Magistratura bosqichi uchun o'quv rejalari"
                href="/faoliyat/oquv-faoliyati/oquv-rejalari/magistratura"
              />
            </div>
          </div>

          {/* ── Right: O'quv grafigi ── */}
          <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
            <h4 className="font-serif text-2xl font-semibold text-gray-900">
              O&apos;quv grafigi
            </h4>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* PDF yuklash/yuklab olish */}
              <GrafikUploadCard />

              {/* Elektron dars jadvali — tez orada */}
              <div className="flex h-52 flex-col justify-between rounded-2xl bg-gray-50 p-4 md:p-6 opacity-75 cursor-default">
                <div>
                  <h5 className="font-serif text-lg font-semibold text-gray-900">
                    Elektron dars jadvali
                  </h5>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                    2025-2026 o&apos;quv yiliga elektron dars jadvali
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Tez orada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
