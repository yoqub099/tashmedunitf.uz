"use client";

import { useState, useMemo, useCallback } from "react";
import Container from "@/components/shared/Container";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useFaculties, useCreateFaculty, useUpdateFaculty, useDeleteFaculty } from "@/hooks/useFaculties";
import {
  GraduationCap,
  Stethoscope,
  Building2,
  Microscope,
  Pill,
  ArrowRight,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import type { Faculty } from "@/types";
import type { FieldConfig } from "@/types/inline-edit";
import { DEGREE_OPTIONS } from "@/lib/constants";

/* ── Tab config ────────────────────────────────────── */
const tabs = [
  { key: "bakalavriat", label: "Bakalavriat", path: "/abiturientlarga/bakalavriat" },
  { key: "ordinatura", label: "Klinik ordinatura", path: "/abiturientlarga/ordinatura" },
  { key: "magistratura", label: "Magistratura", path: "/abiturientlarga/magistratura" },
] as const;

/* ── Faculty icon by keyword ───────────────────────── */
function iconForFaculty(name: string): React.ElementType {
  const lower = (name || "").toLowerCase();
  if (lower.includes("tibbiyot")) return Stethoscope;
  if (lower.includes("farmatsiya")) return Pill;
  if (lower.includes("klinik")) return Building2;
  if (lower.includes("ilmiy") || lower.includes("tadqiqot")) return Microscope;
  return GraduationCap;
}

/* ── Accent colors for each card ───────────────────── */
const CARD_ACCENTS = [
  { border: "border-l-blue-600", icon: "bg-blue-100 text-blue-700", tag: "bg-blue-50 text-blue-700 border-blue-200" },
  { border: "border-l-teal-600", icon: "bg-teal-100 text-teal-700", tag: "bg-teal-50 text-teal-700 border-teal-200" },
  { border: "border-l-emerald-600", icon: "bg-emerald-100 text-emerald-700", tag: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { border: "border-l-indigo-600", icon: "bg-indigo-100 text-indigo-700", tag: "bg-indigo-50 text-indigo-700 border-indigo-200" },
];

/* ── Form fields for faculty ───────────────────────── */
const FACULTY_FIELDS: FieldConfig[] = [
  { name: "name", label: "Fakultet nomi", type: "text", translatable: true, required: true },
  {
    name: "level", label: "Daraja", type: "select", required: true,
    options: DEGREE_OPTIONS.map((d) => ({ value: d.value, label: d.label })),
  },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true, required: true },
  { name: "image", label: "Rasm", type: "media", accept: "image/*" },
  { name: "sort_order", label: "Tartib", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
];

/* ── Component ─────────────────────────────────────── */
export default function EditableDirectionsSection() {
  const { data: facultiesData, refetch } = useFaculties({ per_page: 50 });
  const createMutation = useCreateFaculty();
  const updateMutation = useUpdateFaculty();
  const deleteMutation = useDeleteFaculty();
  const [editItem, setEditItem] = useState<Faculty | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("bakalavriat");

  const faculties = facultiesData?.data || [];

  const firstNonEmpty = useMemo(
    () => tabs.find((tb) => faculties.some((f) => f.level === tb.key))?.key ?? "bakalavriat",
    [faculties],
  );
  const currentTab = faculties.some((f) => f.level === activeTab) ? activeTab : firstNonEmpty;
  const levelPath = tabs.find((l) => l.key === currentTab)?.path || "/abiturientlarga/bakalavriat";

  const filtered = useMemo(
    () =>
      faculties
        .filter((f) => f.level === currentTab && f.is_active !== false)
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [faculties, currentTab],
  );

  const handleCreate = useCallback(async (formData: FormData) => {
    if (!formData.get("level")) formData.set("level", currentTab);
    await createMutation.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [currentTab, createMutation, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    await updateMutation.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetch();
  }, [editItem, updateMutation, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteMutation, refetch]);

  return (
    <section className="pb-10 pt-6 lg:pb-14 lg:pt-10 bg-white">
      <Container>
        {/* ── Header ───────────────────────────── */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] text-center text-gray-900">
            TdTUTF talabasi bo&apos;ling
          </h2>
          <p className="mb-8 mt-2 text-center text-gray-500">
            Quyidagi yo&apos;nalishlardan birida o&apos;qishingiz va haqiqiy
            professionallardan ta&apos;lim olishingiz mumkin
          </p>
        </div>

        {/* ── Tab Bar ──────────────────────────── */}
        <div className="flex w-full gap-4 overflow-x-auto pb-3 items-center">
          <div role="tablist" className="flex grow gap-4">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.key;
              return (
                <div key={tab.key} className="h-10 grow md:h-12">
                  <button
                    onClick={() => setActiveTab(tab.key)}
                    className={`
                      relative w-full h-full rounded-full border text-sm md:text-base
                      font-bold transition-all duration-300 cursor-pointer
                      ${isActive
                        ? "border-[#00575B] text-[#00575B] bg-white shadow-md"
                        : "border-gray-200 text-gray-400 bg-white hover:border-[#00575B] hover:text-[#00575B] hover:bg-[#00575B]/5"
                      }
                    `}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                        <span className="block h-3.5 w-3.5 rotate-45 border-b border-r border-[#00575B] bg-white" />
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add button */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="shrink-0 flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Yangi yo&apos;nalish
          </button>
        </div>

        {/* ── Content Area ─────────────────────── */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl min-h-85 w-full bg-gray-50">
          {filtered.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filtered.map((faculty, index) => {
                const Icon = iconForFaculty(faculty.name?.uz || "");
                const name = faculty.name?.uz || "Nomsiz";
                const directions = faculty.directions || [];
                const dirCount = faculty.directions_count || directions.length;
                const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

                return (
                  <EditableWrapper
                    key={faculty.id}
                    entityType="faculty"
                    entityId={faculty.id}
                    onEdit={() => setEditItem(faculty)}
                    onDelete={() => setDeleteId(faculty.id)}
                    onAdd={() => setIsCreateOpen(true)}
                    label="Fakultet"
                  >
                    <Link
                      href={`${levelPath}/fakultet/${faculty.id}`}
                      className={`group relative rounded-2xl border-l-4 ${accent.border} bg-white p-5 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block h-full`}
                    >
                      {/* Top row: icon + title + arrow */}
                      <div className="flex items-start gap-3">
                        <div className={`rounded-xl p-2.5 ${accent.icon} transition-colors duration-300`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-lg md:text-xl font-semibold text-gray-900 leading-snug">
                            {name}
                          </h5>
                          <p className="mt-0.5 text-sm text-gray-400">
                            {dirCount} ta yo&apos;nalish
                          </p>
                        </div>
                        <span className="rounded-full border border-gray-200 p-1.5 group-hover:border-[#00575B] group-hover:bg-[#00575B] transition-colors duration-300">
                          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors duration-300" />
                        </span>
                      </div>

                      {/* Direction tags */}
                      {directions.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {directions.map((dir) => (
                            <span
                              key={dir.id}
                              className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${accent.tag} transition-colors duration-300`}
                            >
                              {dir.name?.uz || "Nomsiz"}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </EditableWrapper>
                );
              })}
            </div>
          ) : (
            <EditableWrapper
              entityType="faculty"
              entityId={0}
              onEdit={() => setIsCreateOpen(true)}
              onAdd={() => setIsCreateOpen(true)}
              label="Fakultet"
              className="col-span-full"
            >
              <div className="flex flex-col items-center justify-center min-h-70 text-center">
                <GraduationCap className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-400 text-lg font-medium">
                  Bu daraja bo&apos;yicha fakultetlar tez orada qo&apos;shiladi
                </p>
                <p className="text-gray-300 text-sm mt-1">
                  + bosib yangi fakultet qo&apos;shing
                </p>
              </div>
            </EditableWrapper>
          )}
        </div>

        {/* ── CTA ──────────────────────────────── */}
        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-8 py-4 text-base font-semibold text-white">
            Hujjat topshirish
            <ArrowRight className="h-5 w-5" />
          </span>
        </div>
      </Container>

      {/* ── Modals ─────────────────────────────── */}
      <EditModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Yangi fakultet qo'shish"
        fields={FACULTY_FIELDS}
        initialData={{ level: currentTab, is_active: true, sort_order: 0 }}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {editItem && (
        <EditModal
          isOpen={!!editItem}
          onClose={() => setEditItem(null)}
          title="Fakultetni tahrirlash"
          fields={FACULTY_FIELDS}
          initialData={{
            name: editItem.name,
            level: editItem.level,
            description: editItem.description,
            sort_order: editItem.sort_order,
            is_active: editItem.is_active,
          }}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
        />
      )}

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Fakultetni o'chirish"
        message="Bu fakultet butunlay o'chiriladi. Davom etasizmi?"
        isLoading={deleteMutation.isPending}
      />
    </section>
  );
}
