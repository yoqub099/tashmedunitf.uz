import Container from "@/components/shared/Container";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { getPageByPath } from "@/lib/services";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { getLanguage } from "@/lib/language";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ChevronRight,
  FileText,
  Calendar,
  Download,
  ArrowUpRight,
  ImageIcon,
  FolderOpen,
  Home,
  Link2,
  FileArchive,
  FileVideo,
  File as FileIcon,
} from "lucide-react";

// ── Metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = (locale === "ru" || locale === "en") ? locale : "uz";
  const path = slug.join("/");

  try {
    const res = await getPageByPath(path);
    if (!res.success || !res.data) return {};

    const page = res.data;
    const title = t(page.title, lang);
    const plain = t(page.content, lang)?.replace(/<[^>]*>/g, "").trim();

    return {
      title,
      description: plain?.slice(0, 160) || title,
      openGraph: {
        title,
        description: plain?.slice(0, 160),
        type: "article",
      },
      alternates: {
        canonical: `/${lang}/${path}`,
        languages: {
          uz: `/uz/${path}`,
          ru: `/ru/${path}`,
          en: `/en/${path}`,
        },
      },
    };
  } catch {
    return {};
  }
}

// ── Helpers ──
function getFileIcon(filename: string) {
  const ext = filename?.split(".").pop()?.toLowerCase();
  if (["pdf"].includes(ext || "")) return { Icon: FileText, color: "text-rose-500", bg: "bg-rose-50" };
  if (["doc", "docx"].includes(ext || "")) return { Icon: FileText, color: "text-blue-500", bg: "bg-blue-50" };
  if (["xls", "xlsx"].includes(ext || "")) return { Icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" };
  if (["ppt", "pptx"].includes(ext || "")) return { Icon: FileText, color: "text-orange-500", bg: "bg-orange-50" };
  if (["zip", "rar", "7z"].includes(ext || "")) return { Icon: FileArchive, color: "text-amber-500", bg: "bg-amber-50" };
  if (["mp4", "webm", "mov"].includes(ext || "")) return { Icon: FileVideo, color: "text-purple-500", bg: "bg-purple-50" };
  return { Icon: FileIcon, color: "text-slate-500", bg: "bg-slate-50" };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ── Breadcrumb ──
function Breadcrumbs({
  segments,
  lang,
}: {
  segments: { label: string; href: string }[];
  lang: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>{s("common.home", lang as "uz" | "ru" | "en")}</span>
          </Link>
        </li>
        {segments.map((seg, i) => (
          <li key={seg.href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-white/40" aria-hidden />
            {i === segments.length - 1 ? (
              <span className="font-semibold text-white">{seg.label}</span>
            ) : (
              <Link
                href={seg.href}
                className="text-white/70 hover:text-white transition-colors"
              >
                {seg.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ── Children grid ──
function ChildrenPages({
  children,
  lang,
}: {
  children: Array<{
    title: { uz?: string; ru?: string; en?: string };
    slug: string;
    full_path?: string;
    page_type?: string;
    external_url?: string;
  }>;
  lang: string;
}) {
  return (
    <section className="mt-12 pt-10 border-t border-slate-200">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md shadow-teal-500/25">
          <FolderOpen className="w-5 h-5 text-white" strokeWidth={2.2} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {s("common.related_pages", lang as "uz" | "ru" | "en")}
          </h2>
          <p className="text-sm text-slate-500">
            {children.length} {lang === "uz" ? "ta bo'lim" : lang === "ru" ? "разделов" : "sections"}
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children.map((child) => {
          const isLink = child.page_type === "link" && child.external_url;
          const childPath = child.full_path || child.slug;
          const href = isLink ? child.external_url! : `/${lang}/${childPath}`;
          const ChildIcon = isLink ? Link2 : FileText;

          return (
            <Link
              key={child.slug}
              href={href}
              target={isLink ? "_blank" : undefined}
              rel={isLink ? "noopener noreferrer" : undefined}
              className="group relative flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-teal-300 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-0.5"
            >
              <div className="flex-none w-11 h-11 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 flex items-center justify-center group-hover:from-teal-500 group-hover:to-cyan-500 group-hover:border-transparent transition-all">
                <ChildIcon className="w-5 h-5 text-teal-600 group-hover:text-white transition-colors" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                  {t(child.title, lang)}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  {isLink ? "Tashqi havola" : `/${childPath}`}
                </p>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-slate-300 group-hover:text-teal-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" aria-hidden />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

// ── Main page ──
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { slug } = await params;
  const lang = await getLanguage();
  const path = slug.join("/");

  let page;
  try {
    const res = await getPageByPath(path);
    if (!res.success || !res.data) {
      notFound();
    }
    page = res.data;
  } catch {
    notFound();
  }

  const title = t(page.title, lang);
  const content = t(page.content, lang);
  const sanitizedContent = content ? DOMPurify.sanitize(content) : "";

  // Breadcrumb segments
  const breadcrumbSegments: { label: string; href: string }[] = [];
  for (let i = 0; i < slug.length; i++) {
    const partPath = slug.slice(0, i + 1).join("/");
    const label =
      i === slug.length - 1
        ? title
        : slug[i].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    breadcrumbSegments.push({
      label,
      href: `/${lang}/${partPath}`,
    });
  }

  const hasDocuments = page.documents && page.documents.length > 0;
  const hasImages = page.images && page.images.length > 0;
  const hasChildren = page.children && page.children.length > 0;
  const hasContent = sanitizedContent && sanitizedContent.trim().length > 0;

  // Last updated
  const updatedAt = page.updated_at ? new Date(page.updated_at) : null;
  const updatedLabel = updatedAt
    ? updatedAt.toLocaleDateString(
        lang === "ru" ? "ru-RU" : lang === "en" ? "en-US" : "uz-UZ",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50/50 via-white to-white">
      {/* ═══════════════════════════════════════════
          Hero section — gradient + pattern + breadcrumbs
          ═══════════════════════════════════════════ */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-blue-800 to-blue-900" aria-hidden />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-400/10 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-teal-400/10 blur-3xl"
          aria-hidden
        />

        <div className="relative pt-28 pb-14 lg:pt-32 lg:pb-16">
          <Container>
            <Breadcrumbs segments={breadcrumbSegments} lang={lang} />

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] max-w-4xl">
              {title}
            </h1>

            {updatedLabel && (
              <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-xs text-white/90">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {lang === "uz" ? "So'nggi yangilanish: " : lang === "ru" ? "Обновлено: " : "Last updated: "}
                  <span className="font-semibold">{updatedLabel}</span>
                </span>
              </div>
            )}
          </Container>
        </div>
      </header>

      <Container className="py-10 lg:py-14">
        <article className="mx-auto max-w-4xl">
          {/* ── Main content ── */}
          {hasContent ? (
            <div
              className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-slate-200
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-slate-900 prose-strong:font-semibold
                prose-ul:my-4 prose-ol:my-4
                prose-li:my-1.5
                prose-blockquote:border-l-teal-500 prose-blockquote:bg-teal-50/50 prose-blockquote:py-2 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                prose-img:rounded-xl prose-img:shadow-md
                prose-hr:border-slate-200"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          ) : !hasChildren && !hasDocuments && !hasImages ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700 mb-1">
                {lang === "uz"
                  ? "Kontent tez orada qo'shiladi"
                  : lang === "ru"
                  ? "Контент скоро появится"
                  : "Content coming soon"}
              </h2>
              <p className="text-sm text-slate-500">
                {lang === "uz"
                  ? "Bu sahifaga ma'lumot hali qo'shilmagan."
                  : lang === "ru"
                  ? "Информация для этой страницы еще не добавлена."
                  : "Information for this page hasn't been added yet."}
              </p>
            </div>
          ) : null}

          {/* ── Images gallery ── */}
          {hasImages && (
            <section className="mt-12 pt-10 border-t border-slate-200">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-orange-500/25">
                  <ImageIcon className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {s("common.gallery", lang)}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {page.images!.length}{" "}
                    {lang === "uz" ? "ta rasm" : lang === "ru" ? "изображений" : "images"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {page.images!.map((img) => (
                  <a
                    key={img.id}
                    href={img.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.name || ""}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs text-white font-medium truncate">
                        {img.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ── Documents ── */}
          {hasDocuments && (
            <section className="mt-12 pt-10 border-t border-slate-200">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/25">
                  <FileText className="w-5 h-5 text-white" strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {s("common.documents", lang)}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {page.documents!.length}{" "}
                    {lang === "uz" ? "ta hujjat" : lang === "ru" ? "документов" : "files"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {page.documents!.map((doc) => {
                  const { Icon, color, bg } = getFileIcon(doc.file_name || "");
                  return (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 transition-all hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div className={`flex-none w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${color}`} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors truncate">
                          {doc.name || doc.file_name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatFileSize(doc.size || 0)}
                        </p>
                      </div>
                      <div className="flex-none w-9 h-9 rounded-xl bg-slate-50 group-hover:bg-indigo-500 border border-slate-200 group-hover:border-indigo-500 flex items-center justify-center transition-all">
                        <Download className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Children pages ── */}
          {hasChildren && <ChildrenPages children={page.children!} lang={lang} />}
        </article>
      </Container>
    </main>
  );
}
