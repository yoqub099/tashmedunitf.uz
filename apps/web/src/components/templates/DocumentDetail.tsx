import Container from '@/components/shared/Container';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { ExternalLink, Download } from 'lucide-react';
import { s } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

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

interface DocumentDetailProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  documents: DocumentReference[];
  lang?: Language;
}

export default function DocumentDetail({
  title,
  breadcrumbItems,
  documents,
  lang = 'uz',
}: DocumentDetailProps) {
  return (
    <div className="pt-16 sm:pt-20 lg:pt-24">
      <Container className="pt-6 pb-16 sm:pt-10 sm:pb-24">
        <h1 className="font-serif text-xl leading-tight font-semibold break-words sm:text-2xl md:text-[32px] lg:text-[40px]">
          {title}
        </h1>
        <Breadcrumb items={breadcrumbItems} className="mt-3 mb-8" />

        <div className="flex flex-col gap-4">
          {documents.map((doc, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-6 md:p-8"
            >
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:gap-4">
                <h2 className="mb-2 text-sm font-semibold break-words text-gray-900 sm:text-base md:text-lg">
                  {doc.title}
                </h2>
                {doc.downloadUrl && (
                  <a
                    href={doc.downloadUrl}
                    rel="noopener noreferrer"
                    className="-mx-3 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  >
                    {s('common.download', lang)}
                    <Download className="h-4 w-4" />
                  </a>
                )}
              </div>
              {doc.linkUrl && doc.linkText && (
                <a
                  href={doc.linkUrl}
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-start gap-1.5 py-2 text-sm break-words text-blue-700 underline transition-colors hover:text-blue-900 sm:text-base"
                >
                  <span className="min-w-0 break-words">{doc.linkText}</span>
                  <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                </a>
              )}
              {!doc.linkUrl && doc.linkText && (
                <p className="text-sm break-words text-blue-700 sm:text-base">{doc.linkText}</p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
