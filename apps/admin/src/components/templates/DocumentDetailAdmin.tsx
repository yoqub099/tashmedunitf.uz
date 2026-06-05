"use client";

import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { ExternalLink, Download } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DocumentReference {
  title: string;
  linkText?: string;
  linkUrl?: string;
  downloadUrl?: string;
}

interface DocumentDetailAdminProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  documents: DocumentReference[];
}

export default function DocumentDetailAdmin({
  title,
  breadcrumbItems,
  documents,
}: DocumentDetailAdminProps) {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            {title}
          </h1>
          <Breadcrumb items={breadcrumbItems} className="mt-3" />
        </div>

        <div className="flex flex-col gap-4">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-50 border border-gray-100 p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">
                  {doc.title}
                </h2>
                {doc.downloadUrl && (
                  <a
                    href={doc.downloadUrl}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm whitespace-nowrap transition-colors"
                  >
                    Yuklab olish
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
              {doc.linkUrl && doc.linkText && (
                <a
                  href={doc.linkUrl}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-700 hover:text-blue-900 underline text-sm sm:text-base transition-colors"
                >
                  {doc.linkText}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {!doc.linkUrl && doc.linkText && (
                <p className="text-blue-700 text-sm sm:text-base">
                  {doc.linkText}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
