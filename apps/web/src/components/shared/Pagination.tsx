"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "@/components/shared/LocaleLink";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)}>
      <Link
        href={`${basePath}?page=${currentPage - 1}`}
        className={cn(
          "rounded-lg p-2 hover:bg-gray-100",
          currentPage <= 1 && "pointer-events-none opacity-50"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={`${basePath}?page=${page}`}
          className={cn(
            "rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-sm font-medium",
            page === currentPage
              ? "bg-blue-700 text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={`${basePath}?page=${currentPage + 1}`}
        className={cn(
          "rounded-lg p-2 hover:bg-gray-100",
          currentPage >= totalPages && "pointer-events-none opacity-50"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}
