"use client";

import { useState, useCallback } from "react";
import { useStaff, useStaffDetail, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@/hooks/useStaff";
import { useDepartments } from "@/hooks/useDepartments";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import SearchInput from "@/components/shared/SearchInput";
import Pagination from "@/components/shared/Pagination";
import Badge from "@/components/shared/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import Avatar from "@/components/shared/Avatar";
import type { FieldConfig } from "@/types/inline-edit";
import { Plus, Mail, Phone } from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface StaffCrudAdminProps {
  title: string;
  subtitle?: string;
  departmentId?: number;
  breadcrumbItems?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export default function StaffCrudAdmin({ title, subtitle, departmentId, breadcrumbItems, children }: StaffCrudAdminProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Detail query — edit modal uchun to'liq ma'lumot (bio bilan)
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
      name: "department_id", label: "Bo'lim", type: "combobox",
      options: departmentOptions,
      createParam: "department_name",
      placeholder: "Bo'lim tanlang yoki yangi nom yozing",
      required: true,
    },
    { name: "phone", label: "Telefon", type: "text", placeholder: "+998 90 123 45 67" },
    { name: "email", label: "Email", type: "text", placeholder: "email@tdtutf.uz" },
    { name: "photo", label: "Rasm", type: "media", accept: "image/*", maxSize: 10240 },
    { name: "sort_order", label: "Tartib", type: "number" },
    { name: "is_active", label: "Faol", type: "toggle" },
  ];

  const { data, isLoading, error, refetch } = useStaff({
    page,
    per_page: 12,
    search: search || undefined,
    department_id: departmentId,
  });

  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();
  const deleteStaff = useDeleteStaff();

  const handleCreate = useCallback(async (formData: FormData) => {
    if (departmentId) {
      // Bo'limga bog'langan sahifada bo'lim kontekstdan olinadi — comboboxdagi
      // erkin nom (department_name) bekor qilinadi.
      formData.set("department_id", String(departmentId));
      formData.delete("department_name");
    }
    await createStaff.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [departmentId, createStaff, refetch]);

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

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const items = data?.data || [];
  const meta = data?.meta;

  return (
    <section className="py-6 sm:py-8">
      <Container>
        {breadcrumbItems ? (
          <div className="mb-6">
            <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
              {title}
            </h1>
            <Breadcrumb items={breadcrumbItems} className="mt-3" />
          </div>
        ) : (
          <SectionTitle title={title} subtitle={subtitle} />
        )}

        {children && <div className="mb-8">{children}</div>}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SearchInput value={search} onChange={handleSearch} className="w-full sm:w-72" />
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Xodim qo&apos;shish
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Xodimlar topilmadi"
            message={search ? `"${search}" bo'yicha natija yo'q` : "Hozircha xodim qo'shilmagan"}
            action={{ label: "Xodim qo'shish", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((item) => (
                <EditableWrapper
                  key={item.id}
                  entityType="staff"
                  entityId={item.id}
                  onEdit={() => setEditItemId(item.id)}
                  onDelete={() => setDeleteId(item.id)}
                  label="Xodim"
                >
                  <Card className="text-center">
                    <div className="flex flex-col items-center">
                      <Avatar
                        src={item.photo}
                        alt={item.full_name?.uz || ""}
                        size="lg"
                        className="mb-3 sm:mb-4"
                      />
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900">{item.full_name?.uz || "Nomsiz"}</h3>
                      <p className="text-xs sm:text-sm text-blue-600 mt-1">{item.position?.uz || ""}</p>
                      {item.department && (
                        <Badge variant="info" className="mt-2">{item.department.name?.uz}</Badge>
                      )}
                      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-400">
                        {item.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {item.phone}
                          </span>
                        )}
                        {item.email && (
                          <span className="flex items-center gap-1 truncate max-w-40 sm:max-w-none">
                            <Mail className="w-3 h-3 shrink-0" /> {item.email}
                          </span>
                        )}
                      </div>
                      <Badge variant={item.is_active ? "success" : "warning"} className="mt-3">
                        {item.is_active ? "Faol" : "Nofaol"}
                      </Badge>
                    </div>
                  </Card>
                </EditableWrapper>
              ))}
            </div>
            {meta && meta.last_page > 1 && (
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={setPage}
                className="mt-8"
              />
            )}
          </>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi xodim qo'shish"
          fields={staffFields}
          initialData={{ is_active: true, sort_order: 0 }}
          onSubmit={handleCreate}
          isLoading={createStaff.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItemId(null)}
            title="Xodimni tahrirlash"
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
