"use client";

import { useState, useRef, useMemo, type FormEvent, type ChangeEvent } from "react";
import {
  User,
  FileText,
  Upload,
  Send,
  CheckCircle,
} from "lucide-react";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

/* ================================================================
   Types & helpers
   ================================================================ */

interface FileField {
  key: string;
  label: string;
  required: boolean;
  accept: string;
  hint: string;
}

interface TextField {
  name: string;
  label: string;
  placeholder: string;
  required: boolean;
  type?: string;
}

interface RadioField {
  name: string;
  label: string;
}

interface SelectField {
  name: string;
  label: string;
  required: boolean;
  options: { value: string; label: string }[];
}

/* ── File size limit: 10MB (backend limit) ── */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/* ── Reusable file upload button ── */
function FileUploadButton({
  field,
  fileName,
  onFileChange,
  onError,
  fallbackLabel,
}: {
  field: FileField;
  fileName: string | null;
  onFileChange: (key: string, file: File | null) => void;
  onError: (msg: string) => void;
  fallbackLabel: string;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <label className="w-full">
      <div className="mb-1">
        <span className="text-xs text-gray-500">
          {field.label} {field.required && "*"}
        </span>
      </div>
      <input
        ref={ref}
        accept={field.accept}
        className="hidden"
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const f = e.target.files?.[0] ?? null;
          if (f && f.size > MAX_FILE_SIZE_BYTES) {
            onError(`${field.label}: fayl hajmi 10MB dan oshmasligi kerak (${(f.size / 1024 / 1024).toFixed(1)}MB)`);
            if (ref.current) ref.current.value = "";
            onFileChange(field.key, null);
            return;
          }
          onFileChange(field.key, f);
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 transition-colors ${
          fileName
            ? "border-[#00575B] bg-[#00575B]/5"
            : "border-gray-300 hover:border-[#00575B]"
        }`}
      >
        <Upload className={`h-6 w-6 shrink-0 ${fileName ? "text-[#00575B]" : "text-gray-400"}`} />
        <div className="flex flex-1 flex-col text-left">
          <span className="text-sm font-medium">
            {fileName || fallbackLabel}
          </span>
          <span className="text-xs text-gray-500">{field.hint}</span>
        </div>
      </button>
    </label>
  );
}

/* ── Reusable text input ── */
function TextInput({ field }: { field: TextField }) {
  return (
    <label className="w-full">
      <div className="mb-1">
        <span className="text-xs text-gray-500">
          {field.label} {field.required && "*"}
        </span>
      </div>
      <input
        name={field.name}
        type={field.type || "text"}
        placeholder={field.placeholder}
        required={field.required}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-[#00575B] focus:outline-none"
      />
    </label>
  );
}

/* ── Reusable radio group (Ha / Yo'q) ── */
function RadioGroup({ field, yesLabel, noLabel }: { field: RadioField; yesLabel: string; noLabel: string }) {
  return (
    <div className="w-full">
      <div className="mb-1">
        <span className="text-xs text-gray-500">{field.label}</span>
      </div>
      <div className="flex gap-4 pt-1">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            className="h-4 w-4 rounded-full border-[#00575B] accent-[#00575B]"
            type="radio"
            value="1"
            name={field.name}
          />
          <span className="text-sm">{yesLabel}</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            className="h-4 w-4 rounded-full border-[#00575B] accent-[#00575B]"
            type="radio"
            value="0"
            name={field.name}
            defaultChecked
          />
          <span className="text-sm">{noLabel}</span>
        </label>
      </div>
    </div>
  );
}

/* ── Reusable select ── */
function SelectInput({ field, selectPlaceholder }: { field: SelectField; selectPlaceholder: string }) {
  return (
    <label className="w-full">
      <div className="mb-1">
        <span className="text-xs text-gray-500">
          {field.label} {field.required && "*"}
        </span>
      </div>
      <select
        name={field.name}
        required={field.required}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition-colors focus:border-[#00575B] focus:outline-none"
      >
        <option value="">{selectPlaceholder}</option>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ── Section heading ── */
function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: typeof User;
  title: string;
}) {
  return (
    <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg flex items-center gap-2">
      <Icon className="h-[1em] w-[1em] text-[#00575B]" />
      {title}
    </h6>
  );
}

/* ================================================================
   Field definitions
   ================================================================ */

function getBasicFiles(lang: "uz" | "ru" | "en"): FileField[] {
  return [
    {
      key: "resume",
      label: s("job.resume_label", lang),
      required: true,
      accept: ".pdf,.doc,.docx",
      hint: s("job.resume_hint", lang),
    },
    {
      key: "photo",
      label: s("job.photo_label", lang),
      required: true,
      accept: ".jpg,.jpeg,.png,.webp",
      hint: s("job.photo_hint", lang),
    },
  ];
}

function getBasicTextFields(lang: "uz" | "ru" | "en"): TextField[][] {
  return [
    [
      { name: "name", label: s("job.name", lang), placeholder: s("job.name_placeholder", lang), required: true },
      { name: "last_name", label: s("job.last_name", lang), placeholder: s("job.last_name_placeholder", lang), required: true },
    ],
    [
      { name: "middle_name", label: s("job.middle_name", lang), placeholder: s("job.middle_name_placeholder", lang), required: false },
      { name: "phone", label: s("job.phone", lang), placeholder: "+998 (__) ___-__-__", required: true },
    ],
    [
      { name: "email", label: s("job.email", lang), placeholder: s("job.email_placeholder", lang), required: true, type: "email" },
      { name: "position", label: s("job.position", lang), placeholder: s("job.position_placeholder", lang), required: true },
    ],
    [
      { name: "company", label: s("job.company", lang), placeholder: s("job.company_placeholder", lang), required: false },
      { name: "salary", label: s("job.salary_label", lang), placeholder: s("job.salary_placeholder", lang), required: false, type: "number" },
    ],
    [
      { name: "birthday", label: s("job.birthday", lang), placeholder: "", required: true, type: "date" },
      { name: "skype", label: s("job.skype", lang), placeholder: s("job.skype_placeholder", lang), required: false },
    ],
  ];
}

function getExtraFiles(lang: "uz" | "ru" | "en"): FileField[] {
  const hint = s("job.file_hint_pdf", lang);
  const docOnly = ".pdf,.doc,.docx";
  const docOrImage = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp";
  return [
    { key: "motivation_letter", label: s("job.motivation_letter", lang), required: true, accept: docOnly, hint },
    { key: "work_report", label: s("job.work_report", lang), required: false, accept: docOnly, hint },
    { key: "future_vision", label: s("job.future_vision", lang), required: false, accept: docOnly, hint },
    { key: "teaching_portfolio", label: s("job.teaching_portfolio", lang), required: false, accept: docOnly, hint },
    { key: "research_statement", label: s("job.research_statement", lang), required: false, accept: docOnly, hint },
    { key: "dissertation", label: s("job.dissertation", lang), required: false, accept: docOnly, hint },
    { key: "diplomas", label: s("job.diplomas", lang), required: false, accept: docOrImage, hint },
    { key: "transcripts", label: s("job.transcripts", lang), required: false, accept: docOrImage, hint },
    { key: "english_cert", label: s("job.english_cert", lang), required: false, accept: docOrImage, hint },
    { key: "recommendation", label: s("job.recommendation", lang), required: false, accept: docOnly, hint },
  ];
}

function getHowFindOptions(lang: "uz" | "ru" | "en") {
  return [
    { value: "TdTUTFWebsite", label: s("job.how_find_website", lang) },
    { value: "LinkedIn", label: "LinkedIn" },
    { value: "ResearchGate", label: "ResearchGate" },
    { value: "Telegram", label: "Telegram" },
    { value: "TdTUTFEmployee", label: s("job.how_find_employee", lang) },
    { value: "Other", label: s("job.how_find_other", lang) },
  ];
}

function getResearchIdOptions(lang: "uz" | "ru" | "en") {
  return [
    { value: "GoogleScholar", label: "Google Scholar" },
    { value: "ORCID", label: "ORCID" },
    { value: "Other", label: s("job.how_find_other", lang) },
  ];
}

function getDegreeOptions(lang: "uz" | "ru" | "en") {
  return [
    { value: "Bachelor", label: s("job.degree_bachelor", lang) },
    { value: "Master", label: s("job.degree_master", lang) },
    { value: "PhD candidate", label: s("job.degree_phd", lang) },
    { value: "Dotsent", label: s("job.degree_dotsent", lang) },
    { value: "Fan doktori (DSc)", label: s("job.degree_dsc", lang) },
    { value: "Professor", label: s("job.degree_professor", lang) },
  ];
}

/* ================================================================
   Main component
   ================================================================ */

export default function JobApplicationForm() {
  const { language: lang } = useLanguageStore();
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const BASIC_FILES = useMemo(() => getBasicFiles(lang), [lang]);
  const BASIC_TEXT_FIELDS = useMemo(() => getBasicTextFields(lang), [lang]);
  const EXTRA_FILES = useMemo(() => getExtraFiles(lang), [lang]);
  const HOW_FIND_OPTIONS = useMemo(() => getHowFindOptions(lang), [lang]);
  const RESEARCH_ID_OPTIONS = useMemo(() => getResearchIdOptions(lang), [lang]);
  const DEGREE_OPTIONS = useMemo(() => getDegreeOptions(lang), [lang]);

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formEl = e.currentTarget;
      const formData = new FormData();

      // Text maydonlarini qo'shish
      const textInputs = formEl.querySelectorAll("input[name], select[name]");
      textInputs.forEach((el) => {
        const input = el as HTMLInputElement | HTMLSelectElement;
        if (input.type === "file") return;
        if (input.type === "radio") {
          if ((input as HTMLInputElement).checked) {
            formData.set(input.name, input.value);
          }
          return;
        }
        if (input.value) {
          formData.set(input.name, input.value);
        }
      });

      // Fayllarni qo'shish
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const res = await fetch(`${API_URL}/v1/job-applications`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        if (body?.errors) {
          const msgs = Object.values(body.errors).flat().join(". ");
          throw new Error(msgs);
        }
        throw new Error(body?.message || s("job.error_occurred", lang));
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : s("job.error_retry", lang));
    } finally {
      setLoading(false);
    }
  };

  /* ── Success state ── */
  if (success) {
    return (
      <div className="rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
        <div className="flex flex-col items-center gap-4 py-12">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h4 className="font-serif text-xl font-semibold text-gray-900">
            {s("job.success_title", lang)}
          </h4>
          <p className="text-center text-sm text-gray-500">
            {s("job.success_desc", lang)}
          </p>
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setFiles({});
            }}
            className="mt-2 rounded-full border border-[#00575B] px-6 py-2 text-sm font-medium text-[#00575B] transition-colors hover:bg-[#00575B] hover:text-white"
          >
            {s("job.new_application", lang)}
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl space-y-6">
      {/* Header */}
      <div>
        <h4 className="font-serif text-2xl font-semibold">
          {s("job.form_title", lang)}
        </h4>
        <p className="mt-2 text-sm text-gray-500">
          {s("job.form_desc", lang)}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* ═══════ Section 1: Asosiy ariza ma'lumotlari ═══════ */}
        <div className="space-y-4">
          <SectionHeading icon={User} title={s("job.section_basic", lang)} />

          {/* File uploads */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {BASIC_FILES.map((f) => (
              <FileUploadButton
                key={f.key}
                field={f}
                fileName={files[f.key]?.name ?? null}
                onFileChange={handleFileChange}
                onError={setError}
                fallbackLabel={s("job.upload_file", lang)}
              />
            ))}
          </div>

          {/* Text inputs in rows of 2 */}
          {BASIC_TEXT_FIELDS.map((row, i) => (
            <div key={i} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {row.map((field) => (
                <TextInput key={field.name} field={field} />
              ))}
            </div>
          ))}
        </div>

        {/* ═══════ Section 2: Qo'shimcha yuklamalar ═══════ */}
        <div className="space-y-4">
          <SectionHeading icon={FileText} title={s("job.section_extra_files", lang)} />

          {/* File uploads in pairs */}
          {Array.from({ length: Math.ceil(EXTRA_FILES.length / 2) }, (_, i) => {
            const pair = EXTRA_FILES.slice(i * 2, i * 2 + 2);
            return (
              <div key={i} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {pair.map((f) => (
                  <FileUploadButton
                    key={f.key}
                    field={f}
                    fileName={files[f.key]?.name ?? null}
                    onFileChange={handleFileChange}
                    onError={setError}
                    fallbackLabel={s("job.upload_file", lang)}
                  />
                ))}
              </div>
            );
          })}
        </div>

        {/* ═══════ Section 3: Qo'shimcha ma'lumot ═══════ */}
        <div className="space-y-4">
          <SectionHeading icon={FileText} title={s("job.section_extra_info", lang)} />

          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput
              field={{ name: "citizenship", label: s("job.citizenship", lang), placeholder: s("job.citizenship_placeholder", lang), required: true }}
            />
            <TextInput
              field={{ name: "contact_phone", label: s("job.contact_phone", lang), placeholder: "+998 (__) ___-__-__", required: true }}
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput
              field={{ name: "extra_email", label: s("job.extra_email", lang), placeholder: s("job.extra_email_placeholder", lang), required: true, type: "email" }}
            />
            <TextInput
              field={{ name: "social_media_link", label: s("job.social_media", lang), placeholder: s("job.social_media_placeholder", lang), required: true }}
            />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RadioGroup
              field={{ name: "is_convicted", label: s("job.is_convicted", lang) }}
              yesLabel={s("job.yes", lang)}
              noLabel={s("job.no", lang)}
            />
            <SelectInput
              field={{
                name: "how_find_vacancy",
                label: s("job.how_find", lang),
                required: true,
                options: HOW_FIND_OPTIONS,
              }}
              selectPlaceholder={s("job.select_one", lang)}
            />
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RadioGroup
              field={{ name: "is_currently_working", label: s("job.is_currently_working", lang) }}
              yesLabel={s("job.yes", lang)}
              noLabel={s("job.no", lang)}
            />
            <TextInput
              field={{
                name: "applied_before_comment",
                label: s("job.applied_before", lang),
                placeholder: s("job.applied_before_placeholder", lang),
                required: true,
              }}
            />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput
              field={{
                name: "relative_detail_at_university",
                label: s("job.relative_at_uni", lang),
                placeholder: s("job.relative_placeholder", lang),
                required: true,
              }}
            />
            <TextInput
              field={{
                name: "skills",
                label: s("job.skills", lang),
                placeholder: s("job.skills_placeholder", lang),
                required: true,
              }}
            />
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextInput
              field={{
                name: "additional_info",
                label: s("job.additional_info", lang),
                placeholder: s("job.additional_info_placeholder", lang),
                required: true,
              }}
            />
            <SelectInput
              field={{
                name: "research_identifier",
                label: s("job.research_id", lang),
                required: true,
                options: RESEARCH_ID_OPTIONS,
              }}
              selectPlaceholder={s("job.select_one", lang)}
            />
          </div>

          {/* Row 7 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectInput
              field={{
                name: "degree",
                label: s("job.degree", lang),
                required: true,
                options: DEGREE_OPTIONS,
              }}
              selectPlaceholder={s("job.select_one", lang)}
            />
            <RadioGroup
              field={{ name: "is_currently_in_uzbekistan", label: s("job.is_in_uzbekistan", lang) }}
              yesLabel={s("job.yes", lang)}
              noLabel={s("job.no", lang)}
            />
          </div>

          {/* Row 8 */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <RadioGroup
              field={{ name: "is_previously_worked_at_university", label: s("job.previously_worked", lang) }}
              yesLabel={s("job.yes", lang)}
              noLabel={s("job.no", lang)}
            />
            <TextInput
              field={{
                name: "about_motivation",
                label: s("job.motivation", lang),
                placeholder: s("job.motivation_placeholder", lang),
                required: true,
              }}
            />
          </div>
        </div>

        {/* ═══════ Submit button ═══════ */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-[#00575B] px-8 py-3 font-medium text-white transition-all hover:bg-[#00575B]/90 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {s("job.submitting", lang)}
              </span>
            ) : (
              <>
                <Send className="h-5 w-5" />
                {s("job.submit", lang)}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
