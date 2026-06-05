"use client";

import Link from "@/components/shared/LocaleLink";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className ?? "mb-6"}>
      <ol className="flex flex-wrap items-center gap-y-1 gap-x-1.5 sm:gap-x-2 text-sm text-gray-500">
        <li>
          <Link href="/" className="flex items-center hover:text-blue-700 min-h-[44px] min-w-[44px] justify-center sm:min-h-0 sm:min-w-0">
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <ChevronRight className="h-4 w-4 shrink-0" />
            {item.href ? (
              <Link href={item.href} className="hover:text-blue-700 truncate max-w-[180px] sm:max-w-none">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium line-clamp-1 break-all sm:break-normal">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
