export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "select"
  | "combobox"
  | "number"
  | "date"
  | "media"
  | "toggle"
  | "tags"
  | "hidden";

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  translatable?: boolean;
  required?: boolean;
  options?: FieldOption[];
  accept?: string;
  multiple?: boolean;
  placeholder?: string;
  maxSize?: number; // Max file size in KB (for media fields)
  halfWidth?: boolean; // Render in 2-col grid (side by side)
  sectionLabel?: string; // Section divider label above this field
  // combobox uchun: yangi nom yozilganda yuboriladigan param nomi (masalan "department_name")
  createParam?: string;
  // combobox uchun: yangi qiymat yaratishga ruxsat (default: true)
  allowCreate?: boolean;
}

export interface EditableWrapperProps {
  children: React.ReactNode;
  entityType: string;
  entityId?: number | string;
  onEdit: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  className?: string;
  label?: string;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  initialData?: Record<string, unknown>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

export type Language = "uz" | "ru" | "en";

export interface LanguageTabsProps {
  activeLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export interface MediaUploaderProps {
  accept?: string;
  multiple?: boolean;
  value?: File | (File | string)[] | string | null;
  onChange: (files: File | (File | string)[] | null) => void;
  label?: string;
}
