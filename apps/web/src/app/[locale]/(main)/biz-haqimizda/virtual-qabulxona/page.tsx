import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import VirtualQabulxonaForm from "@/components/virtual-qabulxona/VirtualQabulxonaForm";
import { getContactStats } from "@/lib/services";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLanguage } from "@/lib/language";
import { s } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata("virtual-qabulxona", { path: "/biz-haqimizda/virtual-qabulxona", locale: lang });
}

export default async function VirtualQabulxonaPage() {
  const lang = await getLanguage();
  const statsRes = await getContactStats().catch(() => ({ data: { total: 0, new: 0, accepted: 0, completed: 0 } }));
  const stats = statsRes.data;

  return (
    <div className="pt-20 lg:pt-24">
      <Container className="py-6">
        {/* Title */}
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          {s("nav.virtual_qabulxona", lang)}
        </h1>

        {/* Breadcrumb */}
        <div className="mt-3">
          <Breadcrumb
            items={[
              { label: s("nav.biz_haqimizda", lang), href: `/${lang}/biz-haqimizda` },
              { label: s("nav.virtual_qabulxona", lang) },
            ]}
          />
        </div>

        {/* Content: Form + Statistics */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row-reverse">
          {/* Statistics sidebar */}
          <div className="h-full w-full lg:w-[420px]">
            <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl space-y-5">
              <h5 className="font-serif text-xl font-semibold">
                {s("vq.stats_title", lang)}
              </h5>
              <ul className="space-y-2 text-sm">
                <li className="flex items-end gap-2">
                  <span className="font-semibold">{s("vq.new", lang)}:</span>
                  <div className="flex-1 border-b border-dashed border-gray-300" />
                  <span className="ml-auto">{stats.new}</span>
                </li>
                <li className="flex items-end gap-2">
                  <span className="font-semibold">{s("vq.accepted", lang)}:</span>
                  <div className="flex-1 border-b border-dashed border-gray-300" />
                  <span className="ml-auto">{stats.accepted}</span>
                </li>
                <li className="flex items-end gap-2">
                  <span className="font-semibold">{s("vq.completed", lang)}:</span>
                  <div className="flex-1 border-b border-dashed border-gray-300" />
                  <span className="ml-auto">{stats.completed}</span>
                </li>
                <li className="flex items-end gap-2">
                  <span className="font-semibold">{s("vq.total", lang)}:</span>
                  <div className="flex-1 border-b border-dashed border-gray-300" />
                  <span className="ml-auto">{stats.total}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="flex-1">
            <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl space-y-6">
              <h5 className="font-serif text-xl font-semibold">
                {s("vq.form_hint", lang)}
              </h5>
              <VirtualQabulxonaForm />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
