"use client";

import { useState, useRef, type FormEvent } from "react";
import { sendContactMessage } from "@/lib/services";
import { FileText, Send } from "lucide-react";
import toast from "react-hot-toast";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function VirtualQabulxonaForm() {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { language } = useLanguageStore();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const name = (fd.get("full_name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const phone = (fd.get("phone") as string)?.trim();
    const subject = (fd.get("title") as string)?.trim();
    const message = (fd.get("description") as string)?.trim();

    if (!name || !email || !subject || !message) {
      toast.error(s("form.fill_required", language));
      return;
    }

    setLoading(true);
    try {
      const file = fileRef.current?.files?.[0];
      await sendContactMessage({ name, email, phone, subject, message, ...(file ? { file } : {}) });
      toast.success(s("form.success", language));
      form.reset();
      setFileName(null);
    } catch {
      toast.error(s("form.error", language));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mt-6 space-y-4">
        {/* Ism familiya */}
        <label className="block w-full">
          <span className="text-xs font-medium text-gray-500">{s("form.name", language)}</span>
          <input
            name="full_name"
            placeholder={s("form.name_placeholder", language)}
            required
            className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]"
          />
        </label>

        {/* Tashkilot */}
        <label className="block w-full">
          <span className="text-xs font-medium text-gray-500">{s("form.organization", language)}</span>
          <input
            name="company"
            placeholder={s("form.organization_placeholder", language)}
            className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]"
          />
        </label>

        {/* Elektron manzil */}
        <label className="block w-full">
          <span className="text-xs font-medium text-gray-500">{s("form.email", language)}</span>
          <input
            name="email"
            type="email"
            placeholder={s("form.email_placeholder", language)}
            required
            className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]"
          />
        </label>

        {/* Telefon raqam */}
        <label className="block w-full">
          <span className="text-xs font-medium text-gray-500">{s("form.phone", language)}</span>
          <input
            name="phone"
            placeholder="+998"
            maxLength={13}
            defaultValue="+998"
            className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]"
          />
        </label>

        {/* Manzil */}
        <label className="block w-full">
          <span className="text-xs font-medium text-gray-500">{s("form.address", language)}</span>
          <input
            name="address"
            placeholder={s("form.address_placeholder", language)}
            className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]"
          />
        </label>

        {/* Murojaat mavzusi */}
        <label className="block w-full">
          <span className="text-xs font-medium text-gray-500">{s("form.subject", language)}</span>
          <input
            name="title"
            placeholder={s("form.subject_placeholder", language)}
            required
            className="mt-1 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]"
          />
        </label>

        {/* Murojaat matni */}
        <label className="block w-full">
          <span className="text-xs font-medium text-gray-500">{s("form.message", language)}</span>
          <textarea
            name="description"
            rows={5}
            placeholder={s("form.message_placeholder", language)}
            required
            className="mt-1 block w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#00575B] focus:ring-1 focus:ring-[#00575B]"
          />
        </label>
      </div>

      {/* Fayl yuklash */}
      <div>
        <input
          ref={fileRef}
          accept=".png,.jpg,.jpeg,.gif"
          className="hidden"
          type="file"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl bg-gray-50 p-2 transition hover:bg-gray-100"
        >
          <div className="rounded-lg bg-gray-200 p-3">
            <FileText className="h-7 w-7 text-gray-400" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm font-medium">{fileName ?? s("form.file_upload", language)}</p>
            <p className="text-xs">
              <span className="text-gray-400">{s("form.format", language)}: </span>
              <span>jpg, png, gif</span>
              <span className="ml-5 text-gray-400">{s("form.max_size", language)}: </span>
              <span>{s("form.max_size_value", language)}</span>
            </p>
          </div>
        </button>
      </div>

      {/* Jo'natish */}
      <div className="flex w-full">
        <button
          type="submit"
          disabled={loading}
          className="ml-auto flex items-center gap-2 rounded-full border border-[#00575B] px-5 py-2.5 font-medium text-[#00575B] transition hover:bg-[#00575B] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{loading ? s("common.sending", language) : s("common.send", language)}</span>
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
