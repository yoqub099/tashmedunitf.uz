"use client";

import { useState, useRef, useCallback } from "react";
import { X, Plus } from "lucide-react";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  maxTags?: number;
  error?: string;
}

export default function TagsInput({
  value = [],
  onChange,
  label,
  placeholder = "Yangi teg qo'shish...",
  maxTags = 12,
  error,
}: TagsInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      if (value.includes(trimmed)) return;
      if (value.length >= maxTags) return;
      onChange([...value, trimmed]);
      setInput("");
    },
    [value, onChange, maxTags],
  );

  const removeTag = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div
        className={`
          min-h-11 rounded-lg border bg-white px-3 py-2 transition-colors
          focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500
          ${error ? "border-red-300" : "border-gray-300"}
        `}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex flex-wrap gap-2">
          {value.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-[#00575B]/10 px-3 py-1 text-sm font-medium text-[#00575B] transition-colors hover:bg-[#00575B]/20"
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(i);
                }}
                className="ml-0.5 rounded-full p-0.5 hover:bg-[#00575B]/20 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {value.length < maxTags && (
            <div className="inline-flex items-center gap-1 min-w-35 grow">
              <Plus className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (input.trim()) addTag(input);
                }}
                placeholder={value.length === 0 ? placeholder : "Yana qo'shish..."}
                className="w-full text-sm outline-none border-none bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Help text */}
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-gray-400">
          Enter yoki vergul bilan ajrating
        </p>
        <p className="text-xs text-gray-400">
          {value.length}/{maxTags}
        </p>
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
