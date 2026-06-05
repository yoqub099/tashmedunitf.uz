"use client";

import { useState, useRef } from "react";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function StudentWorkForm() {
  const { language: lang } = useLanguageStore();
  const [form, setForm] = useState({
    fullname: "",
    organization: "",
    email: "",
    phone: "+998",
    address: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Ensure +998 prefix + digits only after it
      const digits = value.replace(/^\+998/, "").replace(/\D/g, "");
      const cleaned = "+998" + digits.slice(0, 9); // Uzbek phone: 9 digits after +998
      setForm((prev) => ({ ...prev, phone: cleaned }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 2 * 1024 * 1024) {
        setError(s("sw.file_too_large", lang));
        return;
      }
      setFile(selected);
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!file) {
      setError(s("sw.file_required", lang));
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", form.fullname);
      formData.append("organization", form.organization);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("file", file);

      // 30s timeout orqali network hang bo'lishdan himoya
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30_000);

      const res = await fetch(`${API_BASE}/v1/student-works`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeoutId));

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || s("sw.error_retry", lang)
        );
      }

      setSuccess(true);
      setForm({ fullname: "", organization: "", email: "", phone: "+998", address: "" });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : s("sw.error_occurred", lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="mt-6 space-y-4">
        <label className="block w-full" htmlFor="sw-fullname">
          <div className="pb-1">
            <span className="text-xs text-[#00575B]">{s("sw.fullname", lang)}</span>
          </div>
          <input
            id="sw-fullname"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder={s("sw.fullname_placeholder", lang)}
            required
            aria-required="true"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#00575B] focus:ring-2 focus:ring-[#00575B]/30"
          />
        </label>

        <label className="block w-full" htmlFor="sw-organization">
          <div className="pb-1">
            <span className="text-xs text-[#00575B]">{s("sw.organization", lang)}</span>
          </div>
          <input
            id="sw-organization"
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder={s("sw.organization_placeholder", lang)}
            required
            aria-required="true"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#00575B] focus:ring-2 focus:ring-[#00575B]/30"
          />
        </label>

        <label className="block w-full" htmlFor="sw-email">
          <div className="pb-1">
            <span className="text-xs text-[#00575B]">{s("sw.email", lang)}</span>
          </div>
          <input
            id="sw-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={s("sw.email_placeholder", lang)}
            required
            aria-required="true"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#00575B] focus:ring-2 focus:ring-[#00575B]/30"
          />
        </label>

        <label className="block w-full" htmlFor="sw-phone">
          <div className="pb-1">
            <span className="text-xs text-[#00575B]">{s("sw.phone", lang)}</span>
          </div>
          <input
            id="sw-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="+998 ___ __ __"
            maxLength={13}
            required
            aria-required="true"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#00575B] focus:ring-2 focus:ring-[#00575B]/30"
          />
        </label>

        <label className="block w-full" htmlFor="sw-address">
          <div className="pb-1">
            <span className="text-xs text-[#00575B]">{s("sw.address", lang)}</span>
          </div>
          <input
            id="sw-address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder={s("sw.address_placeholder", lang)}
            required
            aria-required="true"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-[#00575B] focus:ring-2 focus:ring-[#00575B]/30"
          />
        </label>
      </div>

      {/* File Upload */}
      <div>
        <input
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          className="hidden"
          type="file"
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={handleFileClick}
          aria-label={s("sw.upload_file", lang)}
          className="flex w-full items-center gap-3 rounded-xl bg-white p-2 focus:outline-none focus:ring-2 focus:ring-[#00575B]"
        >
          <div className="rounded-lg bg-gray-200 p-3">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="text-gray-400"
              height="28"
              width="28"
            >
              <path d="M19.937 8.68c-.011-.032-.02-.063-.033-.094a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.99.99 0 0 0-.05-.258zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z" />
            </svg>
          </div>
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm font-medium">
              {file ? file.name : s("sw.upload_file", lang)}
            </p>
            <p className="text-xs">
              <span className="text-gray-400">{s("sw.file_format", lang)} </span>
              <span>pdf, doc, docx</span>
              <span className="ml-5 text-gray-400">{s("sw.file_max", lang)} </span>
              <span>{s("sw.file_max_value", lang)}</span>
            </p>
          </div>
        </button>
      </div>

      {/* Error / Success — aria-live qismi screen reader uchun */}
      {error && (
        <p role="alert" aria-live="polite" className="text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p role="status" aria-live="polite" className="text-sm text-green-600">
          {s("sw.success", lang)}
        </p>
      )}

      {/* Submit Button */}
      <div className="flex w-full">
        <button
          type="submit"
          disabled={loading}
          className="ml-auto flex items-center gap-2 rounded-full border border-[#00575B] px-5 py-2.5 font-medium text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white disabled:opacity-50"
        >
          <span>{loading ? s("sw.submitting", lang) : s("sw.submit", lang)}</span>
          {!loading && (
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="20"
              width="20"
            >
              <path d="M21.7267 2.95694L16.2734 22.0432C16.1225 22.5716 15.7979 22.5956 15.5563 22.1126L11 13L1.9229 9.36919C1.41322 9.16532 1.41953 8.86022 1.95695 8.68108L21.0432 2.31901C21.5716 2.14285 21.8747 2.43866 21.7267 2.95694ZM19.0353 5.09647L6.81221 9.17085L12.4488 11.4255L15.4895 17.5068L19.0353 5.09647Z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
