"use client";

import { useState, useCallback, useMemo } from "react";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "@/hooks/useDepartments";
import { useFaculties } from "@/hooks/useFaculties";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Button from "@/components/shared/Button";
import SearchInput from "@/components/shared/SearchInput";
import Badge from "@/components/shared/Badge";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EditModal from "@/components/inline-edit/EditModal";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import type { FieldConfig } from "@/types/inline-edit";
import type { Department } from "@/types";
import { Plus, Users, Phone, Mail, ChevronRight } from "lucide-react";
import Link from "next/link";

interface DepartmentsCrudAdminProps {
  title: string;
  subtitle?: string;
}

const DEPT_FIELDS: FieldConfig[] = [
  { name: "name", label: "Nomi", type: "text", translatable: true, required: true },
  { name: "description", label: "Tavsif", type: "richtext", translatable: true, required: true },
  { name: "head_name", label: "Rahbar ismi", type: "text", translatable: true },
  { name: "head_title", label: "Rahbar lavozimi", type: "text", translatable: true },
  { name: "phone", label: "Telefon", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "image", label: "Rasm", type: "media", accept: "image/*" },
  { name: "head_photo", label: "Rahbar rasmi", type: "media", accept: "image/*" },
  { name: "sort_order", label: "Tartib", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
];

/* ── Word-matching helper (frontend bilan bir xil) ── */
const stopWords = ["va", "ishi", "fanlar", "davlat", "uchun", "bo'yicha"];
function normalize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/kafedrasi|kafedra/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/\d+/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.includes(w));
}
function namesMatch(a: string, b: string): boolean {
  const wa = normalize(a);
  const wb = normalize(b);
  if (!wa.length || !wb.length) return false;
  const shorter = wa.length <= wb.length ? wa : wb;
  const longer = wa.length <= wb.length ? wb : wa;
  const primary = shorter.reduce((x, y) => (x.length >= y.length ? x : y), "");
  const found = longer.some((w) => w.includes(primary) || primary.includes(w));
  if (!found) return false;
  const shared = shorter.filter((w) => longer.some((lw) => lw.includes(w) || w.includes(lw)));
  return shared.length >= Math.max(1, Math.ceil(shorter.length * 0.5));
}

export default function DepartmentsCrudAdmin({ title, subtitle }: DepartmentsCrudAdminProps) {
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<Department | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useDepartments({
    page: 1,
    per_page: 100,
    search: search || undefined,
  });

  const { data: facultiesData } = useFaculties({ page: 1, per_page: 50 });

  const createDept = useCreateDepartment();
  const updateDept = useUpdateDepartment();
  const deleteDept = useDeleteDepartment();

  const handleCreate = useCallback(async (formData: FormData) => {
    await createDept.mutateAsync(formData);
    setIsCreateOpen(false);
    refetch();
  }, [createDept, refetch]);

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!editItem) return;
    await updateDept.mutateAsync({ id: editItem.id, formData });
    setEditItem(null);
    refetch();
  }, [editItem, updateDept, refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteDept.mutateAsync(deleteId);
    setDeleteId(null);
    refetch();
  }, [deleteId, deleteDept, refetch]);

  const handleSearch = useCallback((val: string) => {
    setSearch(val);
  }, []);

  const allDepts = useMemo(() =>
    (data?.data || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  [data]);

  const faculties = useMemo(() =>
    (facultiesData?.data || [])
      .filter((f) => f.is_active)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  [facultiesData]);

  // Group departments by faculty (frontend bilan bir xil logika)
  const groups = useMemo(() => {
    const result: { id: number; name: string; depts: Department[] }[] = [];
    const assignedIds = new Set<number>();

    for (const fac of faculties) {
      const dirs = fac.directions || [];
      const matched = allDepts.filter((d) =>
        dirs.some((dir) => namesMatch(d.name?.uz || "", dir.name?.uz || ""))
      );
      if (matched.length > 0) {
        result.push({ id: fac.id, name: fac.name?.uz || "Fakultet", depts: matched });
        matched.forEach((d) => assignedIds.add(d.id));
      }
    }

    const unmatched = allDepts.filter((d) => !assignedIds.has(d.id));
    if (unmatched.length > 0) {
      result.push({ id: 0, name: "Boshqa bo'limlar", depts: unmatched });
    }

    return result;
  }, [allDepts, faculties]);

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <SectionTitle title={title} subtitle={subtitle} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SearchInput value={search} onChange={handleSearch} className="w-full sm:w-72" />
          <Button onClick={() => setIsCreateOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Yangi bo&apos;lim
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" text="Yuklanmoqda..." className="py-16" />
        ) : error ? (
          <ErrorState onRetry={() => refetch()} />
        ) : allDepts.length === 0 ? (
          <EmptyState
            title="Bo'limlar topilmadi"
            message={search ? `"${search}" bo'yicha natija yo'q` : "Hozircha bo'lim qo'shilmagan"}
            icon={<Users className="w-8 h-8 text-gray-400" />}
            action={{ label: "Bo'lim qo'shish", onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl p-4 text-gray-900 md:p-6 lg:rounded-3xl flex min-h-[13rem] md:min-h-52 justify-between bg-gray-100"
              >
                <div className="grid w-full gap-4 md:gap-6 md:grid-cols-4">
                  {/* Left — Faculty name */}
                  <div className="flex h-auto flex-col md:col-span-2">
                    <h5 className="text-lg font-semibold sm:text-xl">{group.name}</h5>
                    <div className="mt-2 text-xs text-gray-500">{group.depts.length} ta kafedra</div>
                    <div className="mt-4 inline-flex w-full items-end justify-start md:mt-auto">
                      <Button
                        onClick={() => setIsCreateOpen(true)}
                        icon={<Plus className="w-4 h-4" />}
                        className="!rounded-full !border-[#00575B] !bg-transparent !text-[#00575B] hover:!bg-[#00575B]/5 !text-sm !font-medium"
                      >
                        Yangi bo&apos;lim
                      </Button>
                    </div>
                  </div>

                  {/* Right — Vertical divider + kafedra links */}
                  <div className="flex items-start md:items-center align-middle md:col-span-2">
                    <div className="mx-4 h-24 w-px border-l-2 hidden md:block" />
                    <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 w-full">
                      {group.depts.map((item) => (
                        <EditableWrapper
                          key={item.id}
                          entityType="department"
                          entityId={item.id}
                          onEdit={() => setEditItem(item)}
                          onDelete={() => setDeleteId(item.id)}
                          label="Bo'lim"
                        >
                          <Link
                            href={`/biz-haqimizda/tuzilma/kafedralar/${item.slug}`}
                            className="mr-4 min-h-[44px] flex items-center gap-2 text-sm text-[#00575B] hover:underline"
                          >
                            <span>{item.name?.uz || "Nomsiz"}</span>
                            {!item.is_active && (
                              <Badge variant="warning" className="text-[9px]">Nofaol</Badge>
                            )}
                          </Link>
                        </EditableWrapper>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <EditModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Yangi bo'lim qo'shish"
          fields={DEPT_FIELDS}
          initialData={{ is_active: true, sort_order: 0 }}
          onSubmit={handleCreate}
          isLoading={createDept.isPending}
        />

        {editItem && (
          <EditModal
            isOpen={!!editItem}
            onClose={() => setEditItem(null)}
            title="Bo'limni tahrirlash"
            fields={DEPT_FIELDS}
            initialData={{
              name: editItem.name,
              description: editItem.description,
              head_name: editItem.head_name,
              head_title: editItem.head_title,
              phone: editItem.phone,
              email: editItem.email,
              sort_order: editItem.sort_order,
              is_active: editItem.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateDept.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Bo'limni o'chirish"
          message="Bu bo'lim va unga tegishli ma'lumotlar o'chiriladi. Davom etasizmi?"
          isLoading={deleteDept.isPending}
        />
      </Container>
    </section>
  );
}
