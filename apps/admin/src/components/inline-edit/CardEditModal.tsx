"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";
import LanguageTabs from "@/components/inline-edit/LanguageTabs";
import type { Language } from "@/types/inline-edit";
import type { Translatable, SiteContentUpsertData, SiteContent } from "@/types";

export interface CardField {
  key: string;
  label: string;
  type: "text" | "textarea";
}

interface CardEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  section: string;
  fields: CardField[];
  contents: SiteContent[] | undefined;
  onSubmit: (items: SiteContentUpsertData[]) => Promise<void>;
  isLoading?: boolean;
}

export default function CardEditModal({
  isOpen,
  onClose,
  title,
  section,
  fields,
  contents,
  onSubmit,
  isLoading = false,
}: CardEditModalProps) {
  const [activeLanguage, setActiveLanguage] = useState<Language>("uz");
  const [values, setValues] = useState<Record<string, Translatable>>({});

  // Reset when modal opens or contents change
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, Translatable> = {};
      for (const field of fields) {
        const existing = contents?.find((c) => c.key === field.key);
        initial[field.key] = {
          uz: existing?.value?.uz || "",
          ru: existing?.value?.ru || "",
          en: existing?.value?.en || "",
        };
      }
      setValues(initial);
      setActiveLanguage("uz");
    }
  }, [isOpen, contents, fields]);

  const updateValue = (key: string, lang: Language, text: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: text,
      },
    }));
  };

  const handleSubmit = async () => {
    const items: SiteContentUpsertData[] = fields.map((field) => ({
      key: field.key,
      section,
      value: values[field.key] || { uz: "" },
      type: field.type === "textarea" ? "textarea" : "text",
    }));
    await onSubmit(items);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <LanguageTabs
          activeLanguage={activeLanguage}
          onLanguageChange={setActiveLanguage}
        />

        {fields.map((field) => (
          <div key={field.key}>
            {field.type === "textarea" ? (
              <Textarea
                label={field.label}
                value={(values[field.key]?.[activeLanguage] || "") as string}
                onChange={(e) =>
                  updateValue(field.key, activeLanguage, e.target.value)
                }
                rows={3}
                placeholder={`${field.label} (${activeLanguage.toUpperCase()})`}
              />
            ) : (
              <Input
                label={field.label}
                value={(values[field.key]?.[activeLanguage] || "") as string}
                onChange={(e) =>
                  updateValue(field.key, activeLanguage, e.target.value)
                }
                placeholder={`${field.label} (${activeLanguage.toUpperCase()})`}
              />
            )}
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
