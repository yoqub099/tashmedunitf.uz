"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Container from "@/components/shared/Container";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import TextEditModal from "@/components/inline-edit/TextEditModal";
import CardEditModal, { type CardField } from "@/components/inline-edit/CardEditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "@/hooks/useBanners";
import { useSiteContents, useUpsertSiteContent, useBatchUpsertSiteContent, getContentValue, getContentTranslatable } from "@/hooks/useSiteContents";
import type { Banner, SiteContentUpsertData } from "@/types";
import type { FieldConfig } from "@/types/inline-edit";
import { MessageCircle, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

const bannerFields: FieldConfig[] = [
  { name: "title", label: "Sarlavha", type: "text", translatable: true, required: true },
  { name: "subtitle", label: "Qo'shimcha matn", type: "textarea", translatable: true },
  { name: "link", label: "Havola (URL)", type: "text" },
  { name: "button_text", label: "Tugma matni", type: "text", translatable: true },
  { name: "sort_order", label: "Tartib raqami", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
  { name: "image", label: "Banner rasmi", type: "media", accept: "image/*", maxSize: 10240 },
];

export default function EditableHeroSection() {
  // Banner hooks
  const { data: bannersData } = useBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();
  const [editBanner, setEditBanner] = useState<Banner | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);

  // Site content hooks
  const { data: heroContents } = useSiteContents("hero");
  const upsertMutation = useUpsertSiteContent();
  const batchUpsertMutation = useBatchUpsertSiteContent();

  // Text edit modal state (single field)
  const [editingField, setEditingField] = useState<{
    key: string;
    title: string;
    type: "text" | "textarea";
  } | null>(null);

  // Card edit modal state (multiple fields)
  const [editingCard, setEditingCard] = useState<{
    title: string;
    fields: CardField[];
  } | null>(null);

  const banners = bannersData?.data || [];

  // Banner o'zgarganda current ni chegarada saqlash
  useEffect(() => {
    setCurrent((prev) => (banners.length > 0 ? Math.min(prev, banners.length - 1) : 0));
  }, [banners.length]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  const banner = banners[current];

  // Helper: kontent qiymatini olish
  const cv = (key: string) => getContentValue(heroContents, key, "uz");
  const ct = (key: string) => getContentTranslatable(heroContents, key);

  // Kontent saqlash handler (bitta field)
  const handleContentSave = async (data: SiteContentUpsertData) => {
    await upsertMutation.mutateAsync(data);
  };

  // Karta kontentlarini saqlash handler (bir nechta field)
  const handleCardSave = async (items: SiteContentUpsertData[]) => {
    await batchUpsertMutation.mutateAsync(items);
  };

  return (
    <section id="hero-section" className="relative -mt-14 rounded-es-[40px] bg-[#00575B] bg-[url('/images/hero-pattern.svg')] bg-cover bg-no-repeat pt-16 pb-6 sm:pt-18 sm:pb-8 lg:rounded-es-[80px] lg:pt-20 lg:pb-16">
      <Container>
        {/* Hero grid: ISFT-style 3-col layout */}
        <div className="hero-section grid gap-4 text-white sm:gap-6 lg:mt-4 xl:grid-cols-3">
          {/* Left — 2/3 width at xl, full width at lg */}
          <div className="xl:col-span-2">
            {/* Heading — tahrirlash mumkin */}
            <EditableWrapper
              entityType="site-content"
              entityId="hero_heading"
              onEdit={() => setEditingField({ key: "hero_heading", title: "Bosh sarlavha", type: "text" })}
              label="Bosh sarlavha"
            >
              <h1 className="font-serif text-2xl font-semibold leading-tight sm:text-3xl lg:text-5xl">
                {cv("hero_heading") || "Ta\u2019lim berish va tahsil olishda o\u2019zgacha yondashuv"}
              </h1>
            </EditableWrapper>

            {/* Empty subtitle placeholder */}
            <p className="mt-4" />

            {/* Banner area — ISFT grid wrapper */}
            <div className="mt-3 grid w-full grid-cols-3 gap-4 sm:mt-4 sm:gap-6">
              <div className="shine col-span-3 rounded-xl p-0 sm:rounded-2xl lg:rounded-3xl">
                <div className="relative group">
                  {banners.length > 0 && banner ? (
                  <EditableWrapper
                    key={banner.id}
                    entityType="banner"
                    entityId={banner.id}
                    onEdit={() => setEditBanner(banner)}
                    onDelete={() => setDeleteId(banner.id)}
                    onAdd={() => setIsCreateOpen(true)}
                    label={`Banner #${banner.sort_order}${!banner.is_active ? " (nofaol)" : ""}`}
                  >
                    {banner.image ? (
                      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-[370px] overflow-hidden rounded-3xl">
                        <Image
                          src={banner.image}
                          alt={banner.title?.uz || "Banner"}
                          fill
                          priority
                          unoptimized
                          className="object-cover transition-transform duration-700"
                        />
                        {/* Nofaol badge */}
                        {!banner.is_active && (
                          <span className="absolute top-4 left-4 z-5 inline-flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            Nofaol
                          </span>
                        )}
                        {/* TdTUTF.uz badge */}
                        <span className="absolute bottom-4 right-4 z-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          TdTUTF.uz
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 to-blue-900">
                        <div className="flex items-center justify-center p-6 h-48 sm:h-64 md:h-80 lg:h-[370px]">
                          <div className="text-center">
                            <p className="text-xl font-bold text-white">{banner.title?.uz || "Banner"}</p>
                            <p className="mt-1 text-sm text-white/80">{banner.subtitle?.uz || ""}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </EditableWrapper>
                ) : (
                  <EditableWrapper
                    entityType="banner"
                    entityId={0}
                    onEdit={() => setIsCreateOpen(true)}
                    onAdd={() => setIsCreateOpen(true)}
                    label="Banner qo'shish"
                  >
                    <div className="relative w-full overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm">
                      <div className="flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-[370px]">
                        <p className="text-white/70">Banner rasmi qo&apos;shish uchun + bosing</p>
                      </div>
                    </div>
                  </EditableWrapper>
                )}

                  {/* Nav arrows */}
                  {banners.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                        aria-label="Oldingi"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-md opacity-0 transition-opacity hover:bg-white group-hover:opacity-100"
                        aria-label="Keyingi"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {/* Dots */}
                      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
                        {banners.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-2 rounded-full transition-all ${
                              i === current ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                            }`}
                            aria-label={`Banner ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mission text — tahrirlash mumkin */}
            <EditableWrapper
              entityType="site-content"
              entityId="hero_mission_title"
              onEdit={() => setEditingField({ key: "hero_mission_title", title: "Missiya sarlavhasi", type: "text" })}
              label="Missiya sarlavhasi"
            >
              <h5 className="mt-3 font-serif text-lg font-semibold sm:mt-4 sm:text-xl">
                {cv("hero_mission_title") || "TdTUTF ning missiyasi va falsafasi"}
              </h5>
            </EditableWrapper>
            <EditableWrapper
              entityType="site-content"
              entityId="hero_mission_text"
              onEdit={() => setEditingField({ key: "hero_mission_text", title: "Missiya matni", type: "textarea" })}
              label="Missiya matni"
            >
              <p className="text-container mt-1.5 text-sm text-white/80 sm:mt-2 sm:text-base">
                {cv("hero_mission_text") || "Bizning missiyamiz - talabalarga karyera uchun zarur ko\u2019nikmalarni berish, ularni turli xil professional muhitlarda muvaffaqiyat qozonishga tayyorlashdir."}
              </p>
            </EditableWrapper>
          </div>

          {/* Right: Sidebar cards */}
          <div className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 xl:grid-cols-1 xl:h-full xl:content-center">
            {/* Contact card — gradient-box hover + tahrirlash */}
            <EditableWrapper
              entityType="site-content"
              entityId="hero_contact"
              onEdit={() => setEditingCard({
                title: "Aloqa kartasi",
                fields: [
                  { key: "hero_contact_title", label: "Sarlavha", type: "text" },
                  { key: "hero_contact_text", label: "Matn", type: "textarea" },
                ],
              })}
              label="Aloqa kartasi"
            >
              <div className="relative cursor-pointer overflow-hidden rounded-xl bg-white p-3 text-gray-900 transition-colors duration-300 group-hover/edit:bg-gradient-to-br group-hover/edit:from-cyan-600 group-hover/edit:to-cyan-800 group-hover/edit:text-white sm:rounded-2xl sm:p-4 md:p-6 lg:rounded-3xl">
                <div className="relative z-10 flex gap-2">
                  <div className="mb-3 grow">
                    <h5 className="font-serif text-lg font-semibold sm:text-xl">
                      {cv("hero_contact_title") || "Hoziroq biz bilan bog\u2019laning"}
                    </h5>
                    <p className="text-container mt-1.5 text-sm sm:mt-2 sm:text-base">
                      {cv("hero_contact_text") || "O\u2019zingiz istagan savollarga 5 daqiqa ichida javob oling va o\u2019z o\u2019rningizni band qiling."}
                    </p>
                  </div>
                  <div className="flex items-end">
                    <span className="rounded-full border border-cyan-700 p-1.5 group-hover/edit:border-white">
                      <MessageCircle className="text-3xl text-cyan-700 group-hover/edit:text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </EditableWrapper>

            {/* Stats card — tahrirlash */}
            <EditableWrapper
              entityType="site-content"
              entityId="hero_stats"
              onEdit={() => setEditingCard({
                title: "Statistika kartasi",
                fields: [
                  { key: "hero_stats_number", label: "Raqam (masalan: 25 000+)", type: "text" },
                  { key: "hero_stats_title", label: "Sarlavha", type: "text" },
                  { key: "hero_stats_text", label: "Matn", type: "text" },
                ],
              })}
              label="Statistika kartasi"
            >
              <div className="rounded-xl bg-white p-3 text-gray-900 sm:rounded-2xl sm:p-4 md:p-6 lg:rounded-3xl">
                <p className="text-3xl font-semibold text-blue-700 sm:text-4xl">
                  {cv("hero_stats_number") || "25\u00A0000+"}
                </p>
                <div className="mt-2 sm:mt-3">
                  <h5 className="font-serif text-lg font-semibold sm:text-xl">
                    {cv("hero_stats_title") || "Talabalar"}
                  </h5>
                  <p className="text-container mt-1.5 text-sm sm:mt-2 sm:text-base">
                    {cv("hero_stats_text") || "25 000 ko\u2019p inson aynan bizni tanladi!"}
                  </p>
                </div>
              </div>
            </EditableWrapper>

            {/* CTA card — with decorative circles + tahrirlash */}
            <EditableWrapper
              entityType="site-content"
              entityId="hero_cta"
              onEdit={() => setEditingCard({
                title: "CTA kartasi",
                fields: [
                  { key: "hero_cta_title", label: "Sarlavha", type: "text" },
                  { key: "hero_cta_text", label: "Matn", type: "textarea" },
                ],
              })}
              label="CTA kartasi"
            >
              <div className="relative overflow-hidden rounded-xl bg-white p-3 text-gray-900 sm:rounded-2xl sm:p-4 md:p-6 lg:rounded-3xl">
                <svg className="absolute right-0 top-0 overflow-visible" width="120" height="120" viewBox="0 0 170 170" fill="none" style={{ zIndex: 2 }}>
                  <circle cx="160" cy="10" r="160" fill="#1d4ed8" fillOpacity="0.12" className="pulse" />
                  <circle cx="160" cy="10" r="122" fill="#1d4ed8" fillOpacity="0.12" className="pulse" />
                  <circle cx="160" cy="10" r="84" fill="#1d4ed8" fillOpacity="0.12" />
                </svg>
                <div className="relative z-10 flex items-end gap-4">
                  <div>
                    <h5 className="font-serif text-lg font-semibold sm:text-xl">
                      {cv("hero_cta_title") || "Hoziroq TdTUTF talabasi bo\u2019ling"}
                    </h5>
                    <p className="text-container mt-1.5 text-sm sm:mt-2 sm:text-base">
                      {cv("hero_cta_text") || "va bizning filialimizda BEPUL o\u2019qish imkoniyatini qo\u2019lga kiriting"}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-blue-700 bg-white p-2">
                    <ArrowUpRight className="text-2xl text-blue-700" />
                  </span>
                </div>
              </div>
            </EditableWrapper>
          </div>
        </div>
      </Container>

      {/* Edit Modal */}
      <EditModal
        isOpen={!!editBanner || isCreateOpen}
        onClose={() => { setEditBanner(null); setIsCreateOpen(false); }}
        title={editBanner ? "Bannerni tahrirlash" : "Yangi banner"}
        fields={bannerFields}
        initialData={editBanner ? { ...editBanner } : undefined}
        onSubmit={async (formData) => {
          if (editBanner) {
            await updateMutation.mutateAsync({ id: editBanner.id, formData });
          } else {
            await createMutation.mutateAsync(formData);
          }
          setEditBanner(null);
          setIsCreateOpen(false);
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        title="Bannerni o'chirish"
        message="Haqiqatan ham bu bannerni o'chirmoqchimisiz?"
        isLoading={deleteMutation.isPending}
      />

      {/* Text Content Edit Modal (single field — heading, mission) */}
      <TextEditModal
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
        title={editingField?.title || ""}
        contentKey={editingField?.key || ""}
        section="hero"
        initialValue={editingField ? ct(editingField.key) : { uz: "" }}
        type={editingField?.type || "text"}
        onSubmit={handleContentSave}
        isLoading={upsertMutation.isPending}
      />

      {/* Card Edit Modal (multiple fields — cards) */}
      <CardEditModal
        isOpen={!!editingCard}
        onClose={() => setEditingCard(null)}
        title={editingCard?.title || ""}
        section="hero"
        fields={editingCard?.fields || []}
        contents={heroContents}
        onSubmit={handleCardSave}
        isLoading={batchUpsertMutation.isPending}
      />
    </section>
  );
}
