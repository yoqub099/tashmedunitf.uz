"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Container from "@/components/shared/Container";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  useSiteContents,
  useUpsertSiteContent,
  useUploadSiteImage,
  useDeleteSiteContent,
  getContentValue,
  getContentTranslatable,
} from "@/hooks/useSiteContents";
import type { FieldConfig } from "@/types/inline-edit";
import {
  GraduationCap,
  Microscope,
  UserCheck,
  FlaskConical,
  Globe2,
  Library,
  BookOpen,
  Heart,
  Shield,
  Rocket,
  Star,
  Award,
  Upload,
  Plus,
  ImageOff,
} from "lucide-react";

const SECTION = "advantages";
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";

/** Available icons pool */
const AVAILABLE_ICONS = [
  GraduationCap, Microscope, UserCheck, FlaskConical, Globe2, Library,
  BookOpen, Heart, Shield, Rocket, Star, Award,
];

/** Gradient configs rotating through for items */
const GRADIENT_POOL = [
  { gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-200" },
  { gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-200" },
  { gradient: "from-amber-500 to-orange-500", shadow: "shadow-amber-200" },
  { gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-200" },
  { gradient: "from-teal-500 to-cyan-600", shadow: "shadow-teal-200" },
  { gradient: "from-rose-500 to-red-500", shadow: "shadow-rose-200" },
  { gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-200" },
  { gradient: "from-pink-500 to-pink-600", shadow: "shadow-pink-200" },
  { gradient: "from-cyan-500 to-cyan-600", shadow: "shadow-cyan-200" },
  { gradient: "from-orange-500 to-red-500", shadow: "shadow-orange-200" },
  { gradient: "from-lime-500 to-green-600", shadow: "shadow-lime-200" },
  { gradient: "from-fuchsia-500 to-purple-600", shadow: "shadow-fuchsia-200" },
];

/** Default titles for first 6 items */
const DEFAULT_TITLES = [
  "Yuqori sifatli ta'lim",
  "Amaliy klinik tajriba",
  "Malakali professor-o'qituvchilar",
  "Zamonaviy laboratoriyalar",
  "Xalqaro hamkorlik",
  "Zamonaviy kutubxona",
];

export default function EditableAdvantagesSection() {
  const { data: siteContents } = useSiteContents(SECTION);
  const upsertSiteContent = useUpsertSiteContent();
  const uploadImage = useUploadSiteImage();
  const deleteSiteContent = useDeleteSiteContent();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingSection, setEditingSection] = useState<"header" | null>(null);
  const [editingSubtitle, setEditingSubtitle] = useState(false);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "item" | "image"; index?: number } | null>(null);

  /* ── Compute dynamic item count from DB ─── */
  const itemIndices = useMemo(() => {
    if (!siteContents) return [0, 1, 2, 3, 4, 5]; // default 6 items
    const indices: number[] = [];
    siteContents.forEach((c) => {
      const match = c.key.match(/^advantages_item_(\d+)$/);
      if (match) indices.push(parseInt(match[1], 10));
    });
    if (indices.length === 0) return [0, 1, 2, 3, 4, 5];
    return indices.sort((a, b) => a - b);
  }, [siteContents]);

  const nextIndex = useMemo(() => {
    return itemIndices.length > 0 ? Math.max(...itemIndices) + 1 : 0;
  }, [itemIndices]);

  /* ── Fields ─── */
  const HEADER_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "title", label: "Bo'lim sarlavhasi", type: "text", translatable: true, required: true },
  ], []);

  const SUBTITLE_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "subtitle", label: "Pastki sarlavha", type: "text", translatable: true, required: true },
  ], []);

  const ITEM_FIELDS: FieldConfig[] = useMemo(() => [
    { name: "title", label: "Afzallik nomi", type: "text", translatable: true, required: true },
  ], []);

  /* ── Header update ─── */
  const handleHeaderUpdate = useCallback(async (formData: FormData) => {
    const titleUz = formData.get("title[uz]") as string;
    const titleRu = formData.get("title[ru]") as string;
    const titleEn = formData.get("title[en]") as string;
    await upsertSiteContent.mutateAsync({
      key: "advantages_title",
      section: SECTION,
      value: { uz: titleUz || "", ru: titleRu || "", en: titleEn || "" },
      type: "text",
    });
    setEditingSection(null);
  }, [upsertSiteContent]);

  /* ── Subtitle update ─── */
  const handleSubtitleUpdate = useCallback(async (formData: FormData) => {
    const uz = formData.get("subtitle[uz]") as string;
    const ru = formData.get("subtitle[ru]") as string;
    const en = formData.get("subtitle[en]") as string;
    await upsertSiteContent.mutateAsync({
      key: "advantages_subtitle",
      section: SECTION,
      value: { uz: uz || "", ru: ru || "", en: en || "" },
      type: "text",
    });
    setEditingSubtitle(false);
  }, [upsertSiteContent]);

  /* ── Item update ─── */
  const handleItemUpdate = useCallback(async (formData: FormData) => {
    if (editingItem === null) return;
    const uz = formData.get("title[uz]") as string;
    const ru = formData.get("title[ru]") as string;
    const en = formData.get("title[en]") as string;
    await upsertSiteContent.mutateAsync({
      key: `advantages_item_${editingItem}`,
      section: SECTION,
      value: { uz: uz || "", ru: ru || "", en: en || "" },
      type: "text",
    });
    setEditingItem(null);
  }, [editingItem, upsertSiteContent]);

  /* ── Add new item ─── */
  const handleAddItem = useCallback(async (formData: FormData) => {
    const uz = formData.get("title[uz]") as string;
    const ru = formData.get("title[ru]") as string;
    const en = formData.get("title[en]") as string;
    await upsertSiteContent.mutateAsync({
      key: `advantages_item_${nextIndex}`,
      section: SECTION,
      value: { uz: uz || "", ru: ru || "", en: en || "" },
      type: "text",
    });
    setAddingItem(false);
  }, [nextIndex, upsertSiteContent]);

  /* ── Delete item ─── */
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "item" && deleteTarget.index !== undefined) {
      await deleteSiteContent.mutateAsync(`advantages_item_${deleteTarget.index}`);
    } else if (deleteTarget.type === "image") {
      await deleteSiteContent.mutateAsync("advantages_image");
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteSiteContent]);

  /* ── Image upload ─── */
  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadImage.mutateAsync({ file, key: "advantages_image", section: SECTION });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [uploadImage]);

  /* ── Helpers ─── */
  const getItemTitle = (index: number): string =>
    getContentValue(siteContents, `advantages_item_${index}`) || DEFAULT_TITLES[index] || `Afzallik ${index + 1}`;

  const imageUrl = getContentValue(siteContents, "advantages_image");

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <Container>
        {/* Section title - editable */}
        <EditableWrapper
          entityType="site-content"
          entityId="advantages-header"
          onEdit={() => setEditingSection("header")}
          label="Sarlavha"
        >
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl text-center mb-8 sm:mb-12">
            {getContentValue(siteContents, "advantages_title") || "Imkoniyatlar va Afzalliklar"}
          </h2>
        </EditableWrapper>

        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          {/* Left: Image — clickable to upload, deletable */}
          <EditableWrapper
            entityType="site-content"
            entityId="advantages-image"
            onEdit={() => fileInputRef.current?.click()}
            onDelete={imageUrl ? () => setDeleteTarget({ type: "image" }) : undefined}
            label="Rasm"
          >
            <div className="relative w-full max-w-160 aspect-square overflow-hidden rounded-3xl">
              {imageUrl ? (
                <Image
                  src={`${API_URL}${imageUrl}`}
                  alt="Afzalliklar rasmi"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="640px"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-white p-8 aspect-4/3 rounded-3xl bg-linear-to-br from-blue-600 to-blue-800">
                  <Upload className="h-12 w-12 lg:h-16 lg:w-16 mb-4 opacity-50" />
                  <p className="text-lg lg:text-xl font-semibold opacity-70 text-center">Rasm yuklash</p>
                  <p className="text-sm opacity-50 mt-2">Tahrirlash tugmasini bosing</p>
                </div>
              )}
              {uploadImage.isPending && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent" />
                </div>
              )}
            </div>
          </EditableWrapper>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />

          {/* Right: Content panel */}
          <div className="rounded-2xl lg:rounded-3xl bg-gray-50 p-6 sm:p-8 lg:p-14 space-y-6 sm:space-y-8 flex flex-col justify-center">
            {/* Subtitle - editable */}
            <EditableWrapper
              entityType="site-content"
              entityId="advantages-subtitle"
              onEdit={() => setEditingSubtitle(true)}
              label="Pastki sarlavha"
            >
              <h3 className="text-2xl font-bold text-gray-900 lg:text-[32px] leading-tight">
                {getContentValue(siteContents, "advantages_subtitle") || "TdTUTF sizga quyidagilarni taqdim etadi"}
              </h3>
            </EditableWrapper>

            <ul className="flex flex-col gap-4 lg:gap-6 pb-2">
              {itemIndices.map((index) => {
                const gIdx = index % GRADIENT_POOL.length;
                const IconComp = AVAILABLE_ICONS[index % AVAILABLE_ICONS.length];
                const style = GRADIENT_POOL[gIdx];
                return (
                  <EditableWrapper
                    key={index}
                    entityType="site-content"
                    entityId={`advantages-item-${index}`}
                    onEdit={() => setEditingItem(index)}
                    onDelete={() => setDeleteTarget({ type: "item", index })}
                    label={`Element ${index + 1}`}
                  >
                    <li className="flex items-center gap-4">
                      <div className={`flex h-11 w-11 lg:h-13 lg:w-13 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${style.gradient} ${style.shadow} shadow-md`}>
                        <IconComp className="h-5 w-5 lg:h-6 lg:w-6 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-lg font-semibold text-gray-900 leading-tight lg:text-xl">
                        {getItemTitle(index)}
                      </p>
                    </li>
                  </EditableWrapper>
                );
              })}
            </ul>

            {/* Add new item button */}
            <button
              onClick={() => setAddingItem(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors py-2 px-4 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 w-fit"
            >
              <Plus className="w-4 h-4" />
              Yangi afzallik qo&apos;shish
            </button>
          </div>
        </div>
      </Container>

      {/* ── Header Edit Modal ─── */}
      {editingSection === "header" && (
        <EditModal
          isOpen
          onClose={() => setEditingSection(null)}
          title="Bo'lim sarlavhasini tahrirlash"
          fields={HEADER_FIELDS}
          initialData={{
            title: getContentTranslatable(siteContents, "advantages_title").uz
              ? getContentTranslatable(siteContents, "advantages_title")
              : { uz: "Imkoniyatlar va Afzalliklar" },
          }}
          onSubmit={handleHeaderUpdate}
          isLoading={upsertSiteContent.isPending}
        />
      )}

      {/* ── Subtitle Edit Modal ─── */}
      {editingSubtitle && (
        <EditModal
          isOpen
          onClose={() => setEditingSubtitle(false)}
          title="Pastki sarlavhani tahrirlash"
          fields={SUBTITLE_FIELDS}
          initialData={{
            subtitle: getContentTranslatable(siteContents, "advantages_subtitle").uz
              ? getContentTranslatable(siteContents, "advantages_subtitle")
              : { uz: "TdTUTF sizga quyidagilarni taqdim etadi" },
          }}
          onSubmit={handleSubtitleUpdate}
          isLoading={upsertSiteContent.isPending}
        />
      )}

      {/* ── Item Edit Modal ─── */}
      {editingItem !== null && (
        <EditModal
          isOpen
          onClose={() => setEditingItem(null)}
          title={`Afzallik ${editingItem + 1} ni tahrirlash`}
          fields={ITEM_FIELDS}
          initialData={{
            title: getContentTranslatable(siteContents, `advantages_item_${editingItem}`).uz
              ? getContentTranslatable(siteContents, `advantages_item_${editingItem}`)
              : { uz: DEFAULT_TITLES[editingItem] || "" },
          }}
          onSubmit={handleItemUpdate}
          isLoading={upsertSiteContent.isPending}
        />
      )}

      {/* ── Add Item Modal ─── */}
      {addingItem && (
        <EditModal
          isOpen
          onClose={() => setAddingItem(false)}
          title="Yangi afzallik qo'shish"
          fields={ITEM_FIELDS}
          initialData={{ title: { uz: "", ru: "", en: "" } }}
          onSubmit={handleAddItem}
          isLoading={upsertSiteContent.isPending}
        />
      )}

      {/* ── Delete Confirm Dialog ─── */}
      {deleteTarget && (
        <ConfirmDialog
          isOpen
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title={deleteTarget.type === "image" ? "Rasmni o'chirish" : "Afzallikni o'chirish"}
          message={
            deleteTarget.type === "image"
              ? "Rasmni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
              : `"${deleteTarget.index !== undefined ? getItemTitle(deleteTarget.index) : ""}" o'chirilsinmi? Bu amalni ortga qaytarib bo'lmaydi.`
          }
          isLoading={deleteSiteContent.isPending}
        />
      )}
    </section>
  );
}
