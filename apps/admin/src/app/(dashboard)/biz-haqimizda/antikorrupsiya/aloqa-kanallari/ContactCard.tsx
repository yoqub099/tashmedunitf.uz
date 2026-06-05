"use client";

import { useState } from "react";
import Link from "next/link";
import { sanitizeHtml } from "@/lib/sanitize";

interface ContactCardProps {
  title: string;
  description: string;
  href?: string;
  externalHref?: string;
}

export default function ContactCard({ title, description, href, externalHref }: ContactCardProps) {
  const [hovered, setHovered] = useState(false);

  const cardContent = (
    <>
      <h6
        className="font-serif text-base font-semibold leading-tight lg:text-lg transition-colors duration-300"
        style={{ color: hovered ? "#fff" : "#111" }}
      >
        {title}
      </h6>
      <div
        className="text-sm leading-relaxed lg:text-base transition-colors duration-300 [&_a]:text-blue-600 [&_a]:underline"
        style={{ color: hovered ? "#fff" : "#333" }}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
      />
    </>
  );

  const className =
    "rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-48 flex-col gap-4 border transition-all duration-300 cursor-pointer block";

  const style = {
    background: hovered
      ? "linear-gradient(135deg, #00575B 0%, #00838F 50%, rgba(77,182,172,0.3) 100%)"
      : "#f3f4f6",
    borderColor: hovered ? "transparent" : "#e5e7eb",
  };

  const handlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  if (href) {
    return (
      <Link href={href} className={className} style={style} {...handlers}>
        {cardContent}
      </Link>
    );
  }

  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        {...handlers}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className={className} style={style} {...handlers}>
      {cardContent}
    </div>
  );
}
