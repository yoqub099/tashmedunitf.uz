"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldOption } from "@/types/inline-edit";

export interface ComboBoxValue {
  /** Mavjud yozuv tanlangan bo'lsa — uning id si (string). Yangi nom yozilsa — null. */
  id: string | null;
  /** Inputda ko'rinadigan / yoziladigan matn (bo'lim nomi). */
  label: string;
}

interface ComboBoxProps {
  label?: string;
  /** string (id), {id,label}, yoki null/undefined kelishi mumkin */
  value?: ComboBoxValue | string | null;
  options: FieldOption[];
  onChange: (value: ComboBoxValue) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  /** Yangi nom yaratishga ruxsat (default: true) */
  allowCreate?: boolean;
}

/** Turli ko'rinishdagi value ni {id,label} ga normalize qiladi */
function normalize(
  value: ComboBoxValue | string | null | undefined,
  options: FieldOption[]
): ComboBoxValue {
  if (value && typeof value === "object") {
    // label bo'sh, ammo id bor bo'lsa — labelni options'dan tiklaymiz
    if (!value.label && value.id) {
      const opt = options.find((o) => o.value === value.id);
      return { id: value.id, label: opt?.label ?? "" };
    }
    return { id: value.id ?? null, label: value.label ?? "" };
  }
  if (typeof value === "string" && value !== "") {
    const opt = options.find((o) => o.value === value);
    if (opt) return { id: opt.value, label: opt.label };
    // string bo'lsa-yu, optionsda topilmasa — bu erkin matn
    return { id: null, label: value };
  }
  return { id: null, label: "" };
}

export default function ComboBox({
  label,
  value,
  options,
  onChange,
  placeholder,
  error,
  required,
  allowCreate = true,
}: ComboBoxProps) {
  const current = useMemo(() => normalize(value, options), [value, options]);
  const [query, setQuery] = useState(current.label);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Tashqaridan value o'zgarsa (modal ochilganda) — inputni sinxronlaymiz
  useEffect(() => {
    setQuery(current.label);
  }, [current.label]);

  // Tashqariga bosilganda yopish
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const exactMatch = useMemo(
    () => options.find((o) => o.label.trim().toLowerCase() === query.trim().toLowerCase()),
    [options, query]
  );

  const canCreate = allowCreate && query.trim().length > 0 && !exactMatch;

  const commitText = useCallback(
    (text: string) => {
      const match = options.find(
        (o) => o.label.trim().toLowerCase() === text.trim().toLowerCase()
      );
      onChange({ id: match ? match.value : null, label: text });
    },
    [options, onChange]
  );

  const selectOption = useCallback(
    (opt: FieldOption) => {
      setQuery(opt.label);
      onChange({ id: opt.value, label: opt.label });
      setOpen(false);
    },
    [onChange]
  );

  const createNew = useCallback(() => {
    const text = query.trim();
    if (!text) return;
    onChange({ id: null, label: text });
    setOpen(false);
  }, [query, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - (canCreate ? 0 : 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlight < filtered.length) {
        selectOption(filtered[highlight]);
      } else if (canCreate) {
        createNew();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="space-y-1" ref={rootRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={query}
          placeholder={placeholder || "Tanlang yoki yangi nom yozing"}
          onChange={(e) => {
            const text = e.target.value;
            setQuery(text);
            setOpen(true);
            setHighlight(0);
            commitText(text);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full px-3 py-2 border rounded-lg text-sm transition-colors pr-16",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          )}
        />
        {/* Tozalash tugmasi */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              onChange({ id: null, label: "" });
              setOpen(false);
            }}
            className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
            aria-label="Tozalash"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
        />

        {open && (filtered.length > 0 || canCreate) && (
          <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {filtered.map((opt, i) => {
              const selected = current.id === opt.value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => selectOption(opt)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm",
                      highlight === i ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {selected && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
                  </button>
                </li>
              );
            })}
            {canCreate && (
              <li className="border-t border-gray-100">
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(filtered.length)}
                  onClick={createNew}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium",
                    highlight === filtered.length
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-emerald-600 hover:bg-emerald-50"
                  )}
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  <span className="truncate">Yangi qo&apos;shish: &ldquo;{query.trim()}&rdquo;</span>
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && current.id === null && query.trim() !== "" && (
        <p className="text-xs text-emerald-600">
          Yangi bo&apos;lim sifatida saqlanadi
        </p>
      )}
    </div>
  );
}
