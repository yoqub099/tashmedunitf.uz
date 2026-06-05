"use client";

import { useState, useCallback } from "react";
import {
  ChevronRight,
  ChevronDown,
  Pencil,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Globe,
  Eye,
  EyeOff,
  FolderOpen,
  FileText,
  ExternalLink,
} from "lucide-react";
import type { Page } from "@/types";

interface PageTreeViewProps {
  pages: Page[];
  onEdit: (page: Page) => void;
  onAddChild: (parentId: number) => void;
  onDelete: (page: Page) => void;
  onMoveUp: (page: Page) => void;
  onMoveDown: (page: Page) => void;
  searchQuery?: string;
}

/* ═══════════════════════════════════════════
   Helper: filter tree by search query
   ═══════════════════════════════════════════ */
function filterTree(pages: Page[], query: string): Page[] {
  if (!query.trim()) return pages;
  const q = query.toLowerCase();
  return pages.reduce<Page[]>((acc, page) => {
    const titleMatch = page.title?.uz?.toLowerCase().includes(q);
    const slugMatch = page.slug?.toLowerCase().includes(q);
    const filteredChildren = page.children ? filterTree(page.children, query) : [];
    if (titleMatch || slugMatch || filteredChildren.length > 0) {
      acc.push({ ...page, children: filteredChildren.length > 0 ? filteredChildren : page.children });
    }
    return acc;
  }, []);
}

/* ═══════════════════════════════════════════
   Tree Row Component
   ═══════════════════════════════════════════ */
function TreeRow({
  page,
  depth,
  isFirst,
  isLast,
  onEdit,
  onAddChild,
  onDelete,
  onMoveUp,
  onMoveDown,
  expandedIds,
  toggleExpand,
}: {
  page: Page;
  depth: number;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (page: Page) => void;
  onAddChild: (parentId: number) => void;
  onDelete: (page: Page) => void;
  onMoveUp: (page: Page) => void;
  onMoveDown: (page: Page) => void;
  expandedIds: Set<number>;
  toggleExpand: (id: number) => void;
}) {
  const hasChildren = page.children && page.children.length > 0;
  const isExpanded = expandedIds.has(page.id);

  const typeIcon = () => {
    switch (page.page_type) {
      case "group":
        return <FolderOpen className="w-4 h-4 text-amber-500" />;
      case "link":
        return <ExternalLink className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <>
      <div
        className="group flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0"
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* Tree line indicator */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 border-l-2 border-gray-200"
            style={{ left: `${(depth - 1) * 24 + 24}px` }}
          />
        )}

        {/* Expand/Collapse arrow */}
        <button
          onClick={() => hasChildren && toggleExpand(page.id)}
          className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${
            hasChildren ? "hover:bg-gray-200 text-gray-500 cursor-pointer" : "text-transparent cursor-default"
          }`}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
          )}
        </button>

        {/* Type icon */}
        {typeIcon()}

        {/* Title */}
        <span className="font-medium text-gray-900 text-sm truncate max-w-[200px] sm:max-w-[300px]">
          {page.title?.uz || "Nomsiz"}
        </span>

        {/* Slug */}
        <span className="text-xs text-gray-400 truncate max-w-[150px] hidden sm:inline">
          /{page.slug}
        </span>

        {/* Badges */}
        <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
          {page.is_nav_item && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600">
              <Globe className="w-2.5 h-2.5" />
              Nav
            </span>
          )}
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${
              page.is_published
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {page.is_published ? (
              <Eye className="w-2.5 h-2.5" />
            ) : (
              <EyeOff className="w-2.5 h-2.5" />
            )}
            {page.is_published ? "Chop" : "Qoralama"}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
              page.page_type === "group"
                ? "bg-amber-50 text-amber-600"
                : page.page_type === "link"
                ? "bg-blue-50 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {page.page_type === "group" ? "Bo'lim" : page.page_type === "link" ? "Havola" : "Sahifa"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onMoveUp(page)}
            disabled={isFirst}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Yuqoriga"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onMoveDown(page)}
            disabled={isLast}
            className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Pastga"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onAddChild(page.id)}
            className="p-1 rounded hover:bg-blue-100 text-gray-400 hover:text-blue-600"
            title="Bola sahifa qo'shish"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(page)}
            className="p-1 rounded hover:bg-green-100 text-gray-400 hover:text-green-600"
            title="Tahrirlash"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(page)}
            className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-500"
            title="O'chirish"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative">
          {page.children!.map((child, idx) => (
            <TreeRow
              key={child.id}
              page={child}
              depth={depth + 1}
              isFirst={idx === 0}
              isLast={idx === page.children!.length - 1}
              onEdit={onEdit}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
            />
          ))}
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════
   Main PageTreeView
   ═══════════════════════════════════════════ */
export default function PageTreeView({
  pages,
  onEdit,
  onAddChild,
  onDelete,
  onMoveUp,
  onMoveDown,
  searchQuery = "",
}: PageTreeViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    // Auto-expand all root items
    const ids = new Set<number>();
    pages.forEach((p) => ids.add(p.id));
    return ids;
  });

  const toggleExpand = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const filteredPages = filterTree(pages, searchQuery);

  if (filteredPages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        {searchQuery ? "Qidiruv natijasi topilmadi" : "Sahifalar topilmadi"}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
      {filteredPages.map((page, idx) => (
        <TreeRow
          key={page.id}
          page={page}
          depth={0}
          isFirst={idx === 0}
          isLast={idx === filteredPages.length - 1}
          onEdit={onEdit}
          onAddChild={onAddChild}
          onDelete={onDelete}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
        />
      ))}
    </div>
  );
}
