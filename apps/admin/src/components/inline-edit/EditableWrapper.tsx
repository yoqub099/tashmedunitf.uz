"use client";

import { Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EditableWrapperProps } from "@/types/inline-edit";

export default function EditableWrapper({
  children,
  entityType,
  entityId,
  onEdit,
  onDelete,
  onAdd,
  className,
  label,
}: EditableWrapperProps) {
  return (
    <div className={cn("editable-wrapper group/edit relative", className)}>
      {children}

      {/* Hover overlay — pointer-events-none so clicks pass through to Link */}
      <div className="editable-overlay absolute inset-0 border-2 border-dashed border-blue-500 rounded-xl bg-blue-50/20 z-10 pointer-events-none">
        {/* Label badge — top left */}
        {label && (
          <span className="absolute top-2 left-2 bg-blue-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm pointer-events-auto">
            {label}
          </span>
        )}

        {/* Action buttons — top right */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 pointer-events-auto">
          {onAdd && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm transition-colors"
              title="Qo'shish"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            title="Tahrirlash"
          >
            <Pencil className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors"
              title="O'chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
