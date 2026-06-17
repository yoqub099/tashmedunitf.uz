"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";
import Select from "@/components/shared/Select";
import ComboBox, { type ComboBoxValue } from "./ComboBox";
import Toggle from "@/components/shared/Toggle";
import LanguageTabs from "./LanguageTabs";
import MediaUploader from "./MediaUploader";
import RichTextEditor from "./RichTextEditor";
import TagsInput from "./TagsInput";
import type { EditModalProps, FieldConfig, Language } from "@/types/inline-edit";

export default function EditModal({
  isOpen,
  onClose,
  title,
  fields,
  initialData,
  onSubmit,
  isLoading = false,
}: EditModalProps) {
  const [activeLanguage, setActiveLanguage] = useState<Language>("uz");
  const [formData, setFormData] = useState<Record<string, unknown>>(
    initialData || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prevOpenRef = useRef(false);
  // Track media URL→ID mapping for targeted removal
  const mediaIdMapRef = useRef<Record<string, Record<string, number>>>({});

  // Sync formData ONLY when modal opens (not on every initialData reference change)
  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      // Modal just opened — set initial form state
      const data = { ...(initialData || {}) };

      // Normalize media objects {id, url} → URL strings, build ID map
      const idMap: Record<string, Record<string, number>> = {};
      for (const field of fields) {
        if (field.type === "media" && Array.isArray(data[field.name])) {
          const items = data[field.name] as Array<string | { id: number; url: string }>;
          const fieldMap: Record<string, number> = {};
          data[field.name] = items.map((item) => {
            if (typeof item === "object" && item !== null && "id" in item && "url" in item) {
              fieldMap[item.url] = item.id;
              return item.url;
            }
            return item;
          });
          if (Object.keys(fieldMap).length > 0) {
            idMap[field.name] = fieldMap;
          }
        }
      }
      mediaIdMapRef.current = idMap;

      setFormData(data);
      setErrors({});
      setActiveLanguage("uz");
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, initialData, fields]);

  const hasTranslatableFields = fields.some((f) => f.translatable);

  const getFieldValue = useCallback(
    (field: FieldConfig): unknown => {
      if (field.translatable) {
        const langData = formData[field.name] as Record<string, unknown> | undefined;
        return langData?.[activeLanguage] || "";
      }
      // Media fields: preserve null so removal works
      if (field.type === "media") {
        return formData[field.name] === undefined ? undefined : formData[field.name];
      }
      return formData[field.name] ?? "";
    },
    [formData, activeLanguage]
  );

  const setFieldValue = useCallback(
    (field: FieldConfig, value: unknown) => {
      setFormData((prev) => {
        if (field.translatable) {
          const existing = (prev[field.name] as Record<string, unknown>) || {};
          return {
            ...prev,
            [field.name]: { ...existing, [activeLanguage]: value },
          };
        }
        return { ...prev, [field.name]: value };
      });
      // Clear error
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field.name];
        return next;
      });
    },
    [activeLanguage]
  );

  const isRichTextEmpty = (html: string | undefined | null): boolean => {
    if (!html) return true;
    // Strip HTML tags and check if any text content remains
    const text = html.replace(/<[^>]*>/g, "").trim();
    return text.length === 0;
  };

  const validate = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required) {
        if (field.translatable) {
          const langData = formData[field.name] as Record<string, string> | undefined;
          const uzValue = langData?.uz;
          // For richtext fields, check if HTML has actual text content
          const isEmpty = field.type === "richtext"
            ? isRichTextEmpty(uzValue)
            : !uzValue?.trim();
          if (isEmpty) {
            newErrors[field.name] = `${field.label} (O'zbekcha) majburiy`;
          }
        } else if (field.type === "media") {
          // Media can be optional for updates
        } else if (field.type === "combobox") {
          const cb = formData[field.name] as ComboBoxValue | string | undefined;
          const empty =
            cb == null ||
            (typeof cb === "string" && cb.trim() === "") ||
            (typeof cb === "object" && !cb.id && !cb.label?.trim());
          if (empty) {
            newErrors[field.name] = `${field.label} majburiy`;
          }
        } else {
          const val = formData[field.name];
          if (val === undefined || val === null || val === "") {
            newErrors[field.name] = `${field.label} majburiy`;
          }
        }
      }
      // File size validation for media fields
      if (field.type === "media" && field.maxSize) {
        const val = formData[field.name];
        const maxBytes = field.maxSize * 1024;
        if (val instanceof File && val.size > maxBytes) {
          const maxMB = (field.maxSize / 1024).toFixed(0);
          const fileMB = (val.size / 1024 / 1024).toFixed(1);
          newErrors[field.name] = `Fayl hajmi ${fileMB} MB. Maksimal: ${maxMB} MB`;
        } else if (Array.isArray(val)) {
          for (const file of val) {
            if (file instanceof File && file.size > maxBytes) {
              const maxMB = (field.maxSize / 1024).toFixed(0);
              const fileMB = (file.size / 1024 / 1024).toFixed(1);
              newErrors[field.name] = `"${file.name}" hajmi ${fileMB} MB. Maksimal: ${maxMB} MB`;
              break;
            }
          }
        }
      }
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.error("[EditModal] Validation FAILED:", validationErrors);
      // If error is on translatable field, switch to uz tab
      const firstErrorField = fields.find((f) => validationErrors[f.name]);
      if (firstErrorField?.translatable) {
        setActiveLanguage("uz");
      }
      return;
    }

    const fd = new FormData();

    for (const field of fields) {
      const value = formData[field.name];

      // Media field: handle removal (null) vs unchanged (string URL) vs new file
      if (field.type === "media") {
        if (value === null) {
          // User explicitly removed the image → tell backend to delete it
          fd.append(`remove_${field.name}`, "1");
        } else if (value instanceof File) {
          fd.append(field.name, value);
        } else if (Array.isArray(value)) {
          const files = value.filter((v): v is File => v instanceof File);
          const existingUrls = value.filter((v): v is string => typeof v === "string");

          // Check if any existing images were removed (compare with initial map)
          const fieldIdMap = mediaIdMapRef.current[field.name] || {};
          const initialUrls = Object.keys(fieldIdMap);
          const removedUrls = initialUrls.filter((url) => !existingUrls.includes(url));
          const removedIds = removedUrls.map((url) => fieldIdMap[url]).filter(Boolean);

          if (existingUrls.length === 0 && initialUrls.length > 0 && files.length === 0) {
            // All existing removed, no new files → full clear
            fd.append(`remove_${field.name}`, "1");
          } else if (existingUrls.length === 0 && files.length > 0) {
            // All existing removed but new files added → clear then add
            fd.append(`remove_${field.name}`, "1");
            files.forEach((file) => fd.append(`${field.name}[]`, file));
          } else {
            // Some may be removed, some may be added
            if (removedIds.length > 0) {
              removedIds.forEach((id) => fd.append("remove_media_ids[]", String(id)));
            }
            if (files.length > 0) {
              files.forEach((file) => fd.append(`${field.name}[]`, file));
            }
          }
        }
        // If value is a string (existing URL, unchanged), skip — don't re-upload
        continue;
      }

      // Combobox: mavjud yozuv tanlangan bo'lsa id ni, yangi nom yozilgan bo'lsa
      // createParam (masalan department_name) ni yuboramiz.
      if (field.type === "combobox") {
        const cb = value as ComboBoxValue | string | null | undefined;
        if (cb && typeof cb === "object") {
          if (cb.id) {
            fd.append(field.name, String(cb.id));
          } else if (cb.label && cb.label.trim() !== "") {
            fd.append(field.createParam || field.name, cb.label.trim());
          }
        } else if (typeof cb === "string" && cb.trim() !== "") {
          fd.append(field.name, cb);
        }
        continue;
      }

      if (value === undefined || value === null) continue;
      // Bo'sh stringlarni skip qilish (nullable fieldlar uchun)
      if (typeof value === "string" && value.trim() === "" && field.type !== "toggle") continue;

      if (field.translatable && typeof value === "object") {
        const obj = value as Record<string, string>;
        for (const [lang, text] of Object.entries(obj)) {
          if (text) fd.append(`${field.name}[${lang}]`, text);
        }
      } else if (field.type === "toggle") {
        fd.append(field.name, value ? "1" : "0");
      } else if (field.type === "tags" && Array.isArray(value)) {
        (value as string[]).forEach((tag, i) => {
          fd.append(`${field.name}[${i}]`, tag);
        });
      } else {
        fd.append(field.name, String(value));
      }
    }

    try {
      await onSubmit(fd);
    } catch (err: unknown) {
      // Backend 422 validation errors
      const axiosErr = err as { response?: { status?: number; data?: { errors?: Record<string, string[]>; message?: string } } };
      if (axiosErr?.response?.status === 422 && axiosErr.response.data?.errors) {
        const backendErrors: Record<string, string> = {};
        for (const [key, messages] of Object.entries(axiosErr.response.data.errors)) {
          // Map backend field names like 'title.uz' to 'title'
          const fieldName = key.split('.')[0];
          if (!backendErrors[fieldName]) {
            backendErrors[fieldName] = (messages as string[]).join(', ');
          }
        }
        setErrors(backendErrors);
        console.error("[EditModal] Backend validation errors:", axiosErr.response.data.errors);
      } else {
        // Unknown error — show generic message
        setErrors({ _general: axiosErr?.response?.data?.message || "Xatolik yuz berdi. Qaytadan urinib ko'ring." });
        console.error("[EditModal] Save FAILED:", err);
      }
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = getFieldValue(field);
    const error = errors[field.name];
    const key = field.translatable
      ? `${field.name}-${activeLanguage}`
      : field.name;

    switch (field.type) {
      case "text":
        return (
          <Input
            key={key}
            label={field.translatable ? undefined : field.label}
            value={(value as string) || ""}
            onChange={(e) => setFieldValue(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required && (!field.translatable || activeLanguage === "uz")}
            error={activeLanguage === "uz" ? error : undefined}
          />
        );

      case "textarea":
        return (
          <Textarea
            key={key}
            label={field.translatable ? undefined : field.label}
            value={(value as string) || ""}
            onChange={(e) => setFieldValue(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required && (!field.translatable || activeLanguage === "uz")}
            error={activeLanguage === "uz" ? error : undefined}
          />
        );

      case "richtext":
        return (
          <div key={key}>
            {!field.translatable && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
            )}
            <RichTextEditor
              content={(value as string) || ""}
              onChange={(html) => setFieldValue(field, html)}
              placeholder={field.placeholder}
            />
            {error && activeLanguage === "uz" && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
        );

      case "select":
        return (
          <Select
            key={key}
            label={field.label}
            value={(value as string) || ""}
            onChange={(e) => setFieldValue(field, e.target.value)}
            options={field.options || []}
            placeholder={field.placeholder}
            required={field.required}
            error={error}
          />
        );

      case "combobox":
        return (
          <ComboBox
            key={key}
            label={field.label}
            value={value as ComboBoxValue | string | null}
            options={field.options || []}
            onChange={(v) => setFieldValue(field, v)}
            placeholder={field.placeholder}
            required={field.required}
            allowCreate={field.allowCreate !== false}
            error={error}
          />
        );

      case "number":
        return (
          <Input
            key={key}
            type="number"
            label={field.label}
            value={(value as string) || ""}
            onChange={(e) => setFieldValue(field, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            error={error}
          />
        );

      case "date": {
        // Backend returns ISO 8601 "2026-02-28T16:28:18.000000Z"
        // but datetime-local input requires "yyyy-MM-ddThh:mm"
        const rawDate = (value as string) || "";
        const formattedDate = rawDate ? rawDate.replace(/(\.\d+)?Z$/, "").slice(0, 16) : "";
        return (
          <Input
            key={key}
            type="datetime-local"
            label={field.label}
            value={formattedDate}
            onChange={(e) => setFieldValue(field, e.target.value)}
            required={field.required}
            error={error}
          />
        );
      }

      case "media":
        return (
          <MediaUploader
            key={key}
            accept={field.accept}
            multiple={field.multiple}
            value={value as File | (File | string)[] | string | null | undefined}
            onChange={(files) => setFieldValue(field, files)}
            label={field.label}
          />
        );

      case "toggle":
        return (
          <Toggle
            key={key}
            label={field.label}
            checked={!!value}
            onChange={(checked) => setFieldValue(field, checked)}
          />
        );

      case "tags":
        return (
          <TagsInput
            key={key}
            label={field.label}
            value={Array.isArray(value) ? value as string[] : []}
            onChange={(tags) => setFieldValue(field, tags)}
            placeholder={field.placeholder}
            error={error}
          />
        );

      case "hidden":
        return null;

      default:
        return null;
    }
  };

  // Split fields into translatable, non-translatable, and hidden
  const translatableFields = fields.filter((f) => f.translatable && f.type !== "hidden");
  const nonTranslatableFields = fields.filter((f) => !f.translatable && f.type !== "hidden");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size={fields.some((f) => f.type === "richtext") ? "xl" : "lg"}
    >
      <div className="space-y-5">
        {/* Validation error banner */}
        {Object.keys(errors).length > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-sm font-medium text-red-800">
              Quyidagi maydonlarni to&apos;ldiring:
            </p>
            <ul className="mt-1 list-disc list-inside text-sm text-red-600">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Language tabs + translatable fields */}
        {hasTranslatableFields && (
          <div>
            <LanguageTabs
              activeLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
            />
            <div className="space-y-4">
              {translatableFields.map((field) => (
                <div key={`${field.name}-wrapper`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && activeLanguage === "uz" && (
                      <span className="text-red-500 ml-0.5">*</span>
                    )}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Non-translatable fields */}
        {nonTranslatableFields.length > 0 && (
          <div>
            {hasTranslatableFields && (
              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider">
                  Umumiy sozlamalar
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nonTranslatableFields.map((field) => {
                const isHalf = field.halfWidth;
                return (
                  <div key={field.name} className={isHalf ? "col-span-1" : "col-span-2"}>
                    {field.sectionLabel && (
                      <div className="col-span-2 border-t border-gray-100 pt-3 mb-1 -mt-1">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">
                          {field.sectionLabel}
                        </p>
                      </div>
                    )}
                    {renderField(field)}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Saqlash
          </Button>
        </div>
      </div>
    </Modal>
  );
}
