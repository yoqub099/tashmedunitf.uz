"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useFaculties, useCreateFaculty, useUpdateFaculty, useDeleteFaculty } from "@/hooks/useFaculties";
import { useCreateDirection, useUpdateDirection, useDeleteDirection } from "@/hooks/useDirections";
import { t } from "@/lib/utils";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { FieldConfig } from "@/types/inline-edit";

const facultyFields: FieldConfig[] = [
  { name: "name", label: "Nomi", type: "text", translatable: true, required: true },
  { name: "description", label: "Tavsif", type: "textarea", translatable: true },
  { name: "level", label: "Daraja", type: "hidden" },
  { name: "is_active", label: "Faol", type: "toggle" },
  { name: "sort_order", label: "Tartib", type: "number" },
];

const directionFields: FieldConfig[] = [
  { name: "name", label: "Yo'nalish nomi", type: "text", translatable: true, required: true },
  { name: "code", label: "Kod", type: "text" },
  { name: "description", label: "Tavsif", type: "textarea", translatable: true },
  { name: "level", label: "Daraja", type: "hidden" },
  { name: "faculty_id", label: "Fakultet", type: "hidden" },
  { name: "is_active", label: "Faol", type: "toggle" },
  { name: "sort_order", label: "Tartib", type: "number" },
];

function GlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="shrink-0">
      <path d="M14 24.5C8.2005 24.5 3.5 19.7995 3.5 14C3.5 8.2005 8.2005 3.5 14 3.5C19.7995 3.5 24.5 8.2005 24.5 14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 10.5H23.7766" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.09497 17.5H14" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.6667 14C18.6667 10.7753 17.8232 7.55062 16.1386 4.73662C15.1504 3.08812 12.8497 3.08812 11.8627 4.73662C8.49107 10.3658 8.49107 17.6353 11.8627 23.2645C12.3562 24.0881 13.1787 24.5011 14.0012 24.5011" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.3649 22.365L25.2874 21.196C25.8019 20.9907 25.7902 20.258 25.2699 20.0678L18.3095 17.5373C17.8289 17.3623 17.3634 17.829 17.5372 18.3097L20.0677 25.27C20.2567 25.7915 20.9894 25.802 21.1959 25.2875L22.3649 22.365Z" stroke="#00575B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BakalavriатOquvRejalariPage() {
  const { data: facultiesData, isLoading } = useFaculties({ level: "bakalavriat", per_page: 50 });
  const createFaculty = useCreateFaculty();
  const updateFaculty = useUpdateFaculty();
  const deleteFaculty = useDeleteFaculty();
  const createDirection = useCreateDirection();
  const updateDirection = useUpdateDirection();
  const deleteDirection = useDeleteDirection();

  const [editFaculty, setEditFaculty] = useState<any>(null);
  const [isCreateFaculty, setIsCreateFaculty] = useState(false);
  const [deleteFacultyId, setDeleteFacultyId] = useState<number | null>(null);

  const [editDirection, setEditDirection] = useState<any>(null);
  const [createDirectionFacultyId, setCreateDirectionFacultyId] = useState<number | null>(null);
  const [deleteDirectionId, setDeleteDirectionId] = useState<number | null>(null);

  const faculties = facultiesData?.data || [];

  if (isLoading) {
    return (
      <section className="py-8 sm:py-12">
        <Container>
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-lg bg-gray-200" />
            <div className="h-48 rounded-2xl bg-gray-200" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            O&apos;quv rejalari — Bakalavriat
          </h2>
          <button
            onClick={() => setIsCreateFaculty(true)}
            className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600"
          >
            <Plus className="h-4 w-4" /> Fakultet qo&apos;shish
          </button>
        </div>

        <Breadcrumb
          items={[
            { label: "Faoliyat", href: "/faoliyat" },
            { label: "O'quv faoliyati", href: "/faoliyat/oquv-faoliyati" },
            { label: "Bakalavriat" },
          ]}
          className="mt-3"
        />

        {faculties.length === 0 ? (
          <p className="mt-8 text-gray-500">Bakalavriat fakultetlari topilmadi.</p>
        ) : (
          <div className="mt-6 space-y-6">
            {faculties.map((faculty: any) => (
              <div key={faculty.id} className="rounded-2xl p-4 md:p-6 lg:rounded-3xl w-full bg-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-2xl font-semibold flex gap-3 text-[#00575B]">
                    <GlobeIcon />
                    <span>{t(faculty.name, "uz")}</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCreateDirectionFacultyId(faculty.id)}
                      className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600"
                      title="Yo'nalish qo'shish"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setEditFaculty(faculty)}
                      className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      title="Tahrirlash"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteFacultyId(faculty.id)}
                      className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                      title="O'chirish"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  {(faculty.directions || []).map((direction: any) => (
                    <div key={direction.id} className="rounded-[20px] bg-white p-4 md:p-6 flex items-center justify-between group">
                      <div>
                        <h6 className="font-serif text-base font-semibold leading-tight lg:text-lg">
                          {t(direction.name, "uz")}
                        </h6>
                        {direction.code && <span className="text-xs text-gray-400 mt-1">{direction.code}</span>}
                      </div>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditDirection({ ...direction, faculty_id: faculty.id })}
                          className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteDirectionId(direction.id)}
                          className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>

      {/* Faculty Create/Edit Modal */}
      <EditModal
        isOpen={!!editFaculty || isCreateFaculty}
        onClose={() => { setEditFaculty(null); setIsCreateFaculty(false); }}
        title={editFaculty ? "Fakultetni tahrirlash" : "Yangi fakultet"}
        fields={facultyFields}
        initialData={editFaculty ? { ...editFaculty, level: "bakalavriat" } : { level: "bakalavriat", is_active: true }}
        onSubmit={async (formData) => {
          formData.append("level", "bakalavriat");
          if (editFaculty) {
            await updateFaculty.mutateAsync({ id: editFaculty.id, formData });
          } else {
            await createFaculty.mutateAsync(formData);
          }
          setEditFaculty(null);
          setIsCreateFaculty(false);
        }}
        isLoading={createFaculty.isPending || updateFaculty.isPending}
      />

      {/* Faculty Delete */}
      <ConfirmDialog
        isOpen={!!deleteFacultyId}
        onClose={() => setDeleteFacultyId(null)}
        onConfirm={() => { if (deleteFacultyId) deleteFaculty.mutate(deleteFacultyId); setDeleteFacultyId(null); }}
        title="Fakultetni o'chirish"
        message="Haqiqatan ham bu fakultetni o'chirmoqchimisiz? Barcha yo'nalishlari ham o'chiriladi."
        isLoading={deleteFaculty.isPending}
      />

      {/* Direction Create/Edit Modal */}
      <EditModal
        isOpen={!!editDirection || !!createDirectionFacultyId}
        onClose={() => { setEditDirection(null); setCreateDirectionFacultyId(null); }}
        title={editDirection ? "Yo'nalishni tahrirlash" : "Yangi yo'nalish"}
        fields={directionFields}
        initialData={editDirection ? { ...editDirection, level: "bakalavriat" } : { level: "bakalavriat", faculty_id: createDirectionFacultyId, is_active: true }}
        onSubmit={async (formData) => {
          formData.append("level", "bakalavriat");
          if (!editDirection && createDirectionFacultyId) {
            formData.append("faculty_id", String(createDirectionFacultyId));
          }
          if (editDirection) {
            await updateDirection.mutateAsync({ id: editDirection.id, formData });
          } else {
            await createDirection.mutateAsync(formData);
          }
          setEditDirection(null);
          setCreateDirectionFacultyId(null);
        }}
        isLoading={createDirection.isPending || updateDirection.isPending}
      />

      {/* Direction Delete */}
      <ConfirmDialog
        isOpen={!!deleteDirectionId}
        onClose={() => setDeleteDirectionId(null)}
        onConfirm={() => { if (deleteDirectionId) deleteDirection.mutate(deleteDirectionId); setDeleteDirectionId(null); }}
        title="Yo'nalishni o'chirish"
        message="Haqiqatan ham bu yo'nalishni o'chirmoqchimisiz?"
        isLoading={deleteDirection.isPending}
      />
    </section>
  );
}
