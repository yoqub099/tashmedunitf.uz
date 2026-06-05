"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";
import LanguageTabs from "@/components/inline-edit/LanguageTabs";
import type { Language } from "@/types/inline-edit";
import type { Translatable, SiteContentUpsertData } from "@/types";

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  contentKey: string;
  section: string;
  initialValue: Translatable;
  type?: "text" | "textarea";
  onSubmit: (data: SiteContentUpsertData) => Promise<void>;
  isLoading?: boolean;
}

export default function TextEditModal({
  isOpen,
  onClose,
  title,
  contentKey,
  section,
  initialValue,
  type = "text",
  onSubmit,
  isLoading = false,
}: TextEditModalProps) {
  const [activeLanguage, setActiveLanguage] = useState<Language>("uz");
  const [value, setValue] = useState<Translatable>({
    uz: initialValue?.uz || "",
    ru: initialValue?.ru || "",
    en: initialValue?.en || "",
  });

  // Reset when modal opens or initialValue changes
  useEffect(() => {
    if (isOpen) {
      setValue({
        uz: initialValue?.uz || "",
        ru: initialValue?.ru || "",
        en: initialValue?.en || "",
      });
      setActiveLanguage("uz");
    }
  }, [isOpen, initialValue]);

  const handleSubmit = async () => {
    await onSubmit({
      key: contentKey,
      section,
      value,
      type: type === "textarea" ? "textarea" : "text",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <LanguageTabs
          activeLanguage={activeLanguage}
          onLanguageChange={setActiveLanguage}
        />

        {type === "textarea" ? (
          <Textarea
            label={title}
            value={(value[activeLanguage] || "") as string}
            onChange={(e) =>
              setValue((prev) => ({
                ...prev,
                [activeLanguage]: e.target.value,
              }))
            }
            rows={4}
            placeholder={`${title} (${activeLanguage.toUpperCase()})`}
          />
        ) : (
          <Input
            label={title}
            value={(value[activeLanguage] || "") as string}
            onChange={(e) =>
              setValue((prev) => ({
                ...prev,
                [activeLanguage]: e.target.value,
              }))
            }
            placeholder={`${title} (${activeLanguage.toUpperCase()})`}
          />
        )}

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
