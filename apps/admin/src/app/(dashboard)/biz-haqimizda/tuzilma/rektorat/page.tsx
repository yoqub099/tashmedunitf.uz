"use client";

import { useState, useCallback } from "react";
import { useStaff, useStaffDetail, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@/hooks/useStaff";
import { useDepartments } from "@/hooks/useDepartments";
import Container from "@/components/shared/Container";
import Button from "@/components/shared/Button";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import type { FieldConfig } from "@/types/inline-edit";
import type { Staff } from "@/types";
import { Plus } from "lucide-react";

/* ── Calendar + Clock SVG (ISFT original) ── */
function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.24887 2.49805V4.99909" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7518 2.49805V4.99909" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.33283 17.5038H4.99811C3.61682 17.5038 2.49707 16.384 2.49707 15.0027V6.24909C2.49707 4.8678 3.61682 3.74805 4.99811 3.74805H15.0023C16.3836 3.74805 17.5033 4.8678 17.5033 6.24909V8.33329" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.6631 12.4863V13.9519L14.8152 14.6547" stroke="#4B4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7516 17.5031C12.7566 17.5031 11.8023 17.108 11.0987 16.4044C10.3952 15.7008 10 14.7466 10 13.7516C10.0308 11.6912 11.6945 10.029 13.7549 10C15.0952 10.0006 16.3334 10.7162 17.003 11.8772C17.6726 13.0383 17.672 14.4683 17.0013 15.6288C16.3307 16.7892 15.0919 17.5037 13.7516 17.5031" stroke="#4B4A4A" strokeWidth="1.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
    </svg>
  );
}

/* ── ISFT-style Staff Card with admin edit/delete ── */
function StaffCard({ item, onEdit, onDelete }: { item: Staff; onEdit: () => void; onDelete: () => void }) {
  const fullName = item.full_name?.uz || "Nomsiz";
  const position = item.position?.uz || "";

  const receptionHours: Record<number, string> = {
    1: "Seshanba: 09:00-12:00",
    2: "Se., Ch., Ju.: 14:00-16:00",
    3: "Du., Ju.: 14:00-16:00",
    4: "Se., Pa.: 15:00-16:00",
  };

  const telegramHandles: Record<number, string> = {
    1: "@ttatf_director",
  };

  return (
    <EditableWrapper
      entityType="staff"
      entityId={item.id}
      onEdit={onEdit}
      onDelete={onDelete}
      label="Xodim"
    >
      <div className="rounded-2xl bg-white p-4 md:p-6 lg:rounded-3xl h-full">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#00575B] to-[#008B8B] xl:col-span-1">
            {item.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.photo_medium || item.photo}
                alt={fullName}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <svg className="h-20 w-20 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span className="mt-2 text-lg font-bold text-white/90">
                  {fullName}
                </span>
              </>
            )}
          </div>

          <div className="xl:col-span-2">
            <h2 className="text-[20px] font-bold text-[#00575B]">{position}</h2>
            <p className="text-gray-500">{fullName}</p>

            <div className="mt-8 flex flex-col gap-2">
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                  <CalendarIcon />
                  <span className="text-[14px]">Qabul vaqti:</span>
                </div>
                <div className="mx-2 mb-1 flex-grow border-b border-dashed border-gray-300" />
                <span className="text-right text-[14px]">
                  {receptionHours[item.sort_order] || "Du., Ch.: 14:00-16:00"}
                </span>
              </div>

              <div className="flex w-full justify-between">
                <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                  <PhoneIcon />
                  <span className="text-[14px]">Telefon:</span>
                </div>
                <div className="mx-2 mb-1 flex-grow border-b border-dashed border-gray-300" />
                <span className="text-right text-[14px]">{item.phone || ""}</span>
              </div>

              <div className="flex w-auto justify-between">
                <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                  <EmailIcon />
                  <span className="text-[14px]">E-mail:</span>
                </div>
                <div className="mx-2 mb-1 flex-grow border-b border-dashed border-gray-300" />
                <span className="text-right text-[14px]">{item.email || ""}</span>
              </div>

              {/* Telegram */}
              {telegramHandles[item.sort_order] && (
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-1 text-[14px] font-semibold text-gray-500">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    <span className="text-[14px]">Telegram:</span>
                  </div>
                  <div className="mx-2 mb-1 flex-grow border-b border-dashed border-gray-300" />
                  <span className="text-right text-[14px]">{telegramHandles[item.sort_order]}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </EditableWrapper>
  );
}

export default function RektoratAdminPage() {
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: editItem } = useStaffDetail(editItemId ?? 0);
  const { data: departments } = useDepartments();

  const departmentOptions = (departments?.data || []).map((d) => ({
    value: String(d.id),
    label: d.name?.uz || String(d.id),
  }));

  const staffFields: FieldConfig[] = [
    { name: "full_name", label: "To'liq ism", type: "text", translatable: true, required: true },
    { name: "position", label: "Lavozim", type: "text", translatable: true, required: true },
    { name: "bio", label: "Biografiya", type: "richtext", translatable: true },
    {
      name: "department_id",
      label: "Bo'lim",
      type: "combobox",
      options: departmentOptions,
      createParam: "department_name",
      placeholder: "Bo'lim tanlang yoki yangi nom yozing",
    },
    { name: "phone", label: "Telefon", type: "text", placeholder: "+998 76 223-40-01" },
    { name: "email", label: "Email", type: "text", placeholder: "email@ttatf.uz" },
    { name: "photo", label: "Rasm", type: "media", accept: "image/*" },
    { name: "sort_order", label: "Tartib", type: "number" },
    { name: "is_active", label: "Faol", type: "toggle" },
  ];

  const { data, isLoading, error, refetch } = useStaff({ per_page: 50 });
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();

  // Faqat rahbariyat (sort_order 1-4)
  const leadership = (data?.data || [])
    .filter((s) => s.sort_order <= 4)
    .sort((a, b) => a.sort_order - b.sort_order);

  const handleCreate = useCallback(async (formData: FormData) => {
    await createStaff.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [createStaff, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItemId) return;
    await updateStaff.mutateAsync({ id: editItemId, formData });
    setEditItemId(null);
    refetch();
  }, [editItemId, updateStaff, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteStaff.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteStaff, refetch]);

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-gray-900 md:text-[32px]">Rahbariyat</h2>
            <p className="mt-1 text-sm text-gray-500">TdTUTF filial rahbariyati</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Xodim qo&apos;shish
          </Button>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4 md:p-6 lg:rounded-3xl">
          {isLoading ? (
            <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
          ) : error ? (
            <ErrorState onRetry={() => refetch()} />
          ) : leadership.length === 0 ? (
            <EmptyState
              title="Rahbariyat topilmadi"
              message="Rahbariyat xodimlarini qo'shing"
              action={{ label: "Xodim qo'shish", onClick: () => setIsCreateOpen(true) }}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {leadership.map((item) => (
                <StaffCard
                  key={item.id}
                  item={item}
                  onEdit={() => setEditItemId(item.id)}
                  onDelete={() => setDeleteId(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Modal */}
        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi rahbar qo'shish"
          fields={staffFields}
          initialData={{ is_active: true, sort_order: 0 }}
          onSubmit={handleCreate}
          isLoading={createStaff.isPending}
        />

        {/* Edit Modal */}
        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItemId(null)}
            title="Rahbarni tahrirlash"
            fields={staffFields}
            initialData={{
              full_name: editItem.full_name,
              position: editItem.position,
              bio: editItem.bio,
              department_id: editItem.department
                ? { id: String(editItem.department.id), label: editItem.department.name?.uz || "" }
                : { id: null, label: "" },
              phone: editItem.phone,
              email: editItem.email,
              photo: editItem.photo || undefined,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateStaff.isPending}
          />
        )}

        {/* Delete Confirm */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Xodimni o'chirish"
          message="Bu xodim butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteStaff.isPending}
        />
      </Container>
    </section>
  );
}
