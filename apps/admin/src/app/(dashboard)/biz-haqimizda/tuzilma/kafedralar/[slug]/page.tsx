"use client";

import { useParams } from "next/navigation";
import { useDepartmentBySlug, useDepartments, useUpdateDepartment, useDeleteDepartment } from "@/hooks/useDepartments";
import { useFaculties } from "@/hooks/useFaculties";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Badge from "@/components/shared/Badge";
import type { FieldConfig } from "@/types/inline-edit";
import Link from "next/link";
import { useState, useCallback, useMemo } from "react";
import { Phone, Mail, Calendar, ChevronLeft } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

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

const stopWords = ["va", "ishi", "fanlar", "davlat", "uchun", "bo'yicha"];
function normalize(str: string): string[] {
  return str.toLowerCase().replace(/kafedrasi|kafedra/g, "").replace(/\(.*?\)/g, "").replace(/\d+/g, "").trim().split(/\s+/).filter((w) => w.length > 2 && !stopWords.includes(w));
}
function namesMatch(a: string, b: string): boolean {
  const wa = normalize(a), wb = normalize(b);
  if (!wa.length || !wb.length) return false;
  const shorter = wa.length <= wb.length ? wa : wb;
  const longer = wa.length <= wb.length ? wb : wa;
  const primary = shorter.reduce((x, y) => (x.length >= y.length ? x : y), "");
  if (!longer.some((w) => w.includes(primary) || primary.includes(w))) return false;
  const shared = shorter.filter((w) => longer.some((lw) => lw.includes(w) || w.includes(lw)));
  return shared.length >= Math.max(1, Math.ceil(shorter.length * 0.5));
}

export default function KafedraDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: deptRes, isLoading, error, refetch } = useDepartmentBySlug(slug);
  const { data: allDeptsRes } = useDepartments({ page: 1, per_page: 50 });
  const { data: facultiesRes } = useFaculties({ page: 1, per_page: 50 });

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const updateDept = useUpdateDepartment();
  const deleteDept = useDeleteDepartment();

  const dept = deptRes;

  const handleUpdate = useCallback(async (formData: FormData) => {
    if (!dept) return;
    await updateDept.mutateAsync({ id: dept.id, formData });
    setEditOpen(false);
    refetch();
  }, [dept, updateDept, refetch]);

  const handleDelete = useCallback(async () => {
    if (!dept) return;
    await deleteDept.mutateAsync(dept.id);
    setDeleteOpen(false);
    window.location.href = "/biz-haqimizda/tuzilma/kafedralar";
  }, [dept, deleteDept]);

  const allDepts = useMemo(() =>
    (allDeptsRes?.data || []).filter((d) => d.is_active).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  [allDeptsRes]);

  const faculties = useMemo(() =>
    (facultiesRes?.data || []).filter((f) => f.is_active).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  [facultiesRes]);

  const groups = useMemo(() => {
    const result: { name: string; depts: typeof allDepts }[] = [];
    const assigned = new Set<number>();
    for (const fac of faculties) {
      const dirs = fac.directions || [];
      const matched = allDepts.filter((d) => dirs.some((dir) => namesMatch(d.name?.uz || "", dir.name?.uz || "")));
      if (matched.length > 0) { result.push({ name: fac.name?.uz || "Fakultet", depts: matched }); matched.forEach((d) => assigned.add(d.id)); }
    }
    const unmatched = allDepts.filter((d) => !assigned.has(d.id));
    if (unmatched.length > 0) result.push({ name: "Boshqa bo'limlar", depts: unmatched });
    return result;
  }, [allDepts, faculties]);

  if (isLoading) return <Container className="py-20"><LoadingSpinner size="lg" text="Yuklanmoqda..." /></Container>;
  if (error || !dept) return <Container className="py-20"><ErrorState onRetry={refetch} /></Container>;

  return (
    <section className="py-10 sm:py-16">
      <Container>
        {/* Back + Title */}
        <Link href="/biz-haqimizda/tuzilma/kafedralar" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Kafedralar
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">{dept.name?.uz || "Nomsiz"}</h2>
          <Badge variant={dept.is_active ? "success" : "warning"}>{dept.is_active ? "Faol" : "Nofaol"}</Badge>
        </div>

        {/* Frontend bilan bir xil grid: 3 col */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* LEFT — col-span-2 */}
          <div className="flex flex-col gap-6 md:col-span-2">

            {/* Head card */}
            <EditableWrapper entityType="department" entityId={dept.id} onEdit={() => setEditOpen(true)} onDelete={() => setDeleteOpen(true)} label="Bo'lim">
              <div className="rounded-2xl p-4 md:p-6 bg-gray-100">
                <div className="grid gap-6 md:grid-cols-4">
                  {dept.head_photo ? (
                    <img src={dept.head_photo} alt={dept.head_name?.uz || ""} className="h-full w-full rounded-xl object-cover md:col-span-1" />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gray-200 md:col-span-1">
                      <svg className="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
                    </div>
                  )}
                  <div className="md:col-span-3">
                    <h3 className="text-xl font-bold text-[#00575B]">{dept.head_name?.uz || "—"}</h3>
                    <p className="text-gray-500">{dept.head_title?.uz || (typeof dept.head_title === "string" ? dept.head_title : "") || "Kafedra mudiri"}</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Qabul:</span>
                        <span>Dushanba-Juma, 14:00–17:00</span>
                      </div>
                      {dept.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Telefon:</span>
                          <span>{dept.phone}</span>
                        </div>
                      )}
                      {dept.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Email:</span>
                          <span>{dept.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </EditableWrapper>

            {/* Description */}
            {dept.description?.uz && (
              <div className="rounded-2xl p-4 md:p-6 bg-gray-100">
                <div className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(dept.description.uz) }} />
              </div>
            )}
          </div>

          {/* RIGHT — sidebar */}
          <div className="md:col-span-1">
            <div className="rounded-2xl p-4 md:p-6 bg-gray-100">
              <h4 className="text-xl font-semibold mb-4">Kafedralar</h4>
              <div className="flex flex-col gap-y-5">
                {groups.map((group) => (
                  <div key={group.name} className="flex flex-col gap-2">
                    <h5 className="font-semibold text-gray-800 text-sm">{group.name}</h5>
                    {group.depts.map((d) => (
                      <Link
                        key={d.id}
                        href={`/biz-haqimizda/tuzilma/kafedralar/${d.slug}`}
                        className={`rounded-2xl p-3 text-sm font-medium transition-colors ${
                          d.slug === slug
                            ? "bg-[#00575B] text-white"
                            : "bg-white text-[#00575B] hover:bg-[#00575B]/10"
                        }`}
                      >
                        {d.name?.uz || "Nomsiz"}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {editOpen && dept && (
          <EditModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            title="Bo'limni tahrirlash"
            fields={DEPT_FIELDS}
            initialData={{
              name: dept.name, description: dept.description, head_name: dept.head_name,
              head_title: dept.head_title, phone: dept.phone, email: dept.email,
              sort_order: dept.sort_order, is_active: dept.is_active,
            }}
            onSubmit={handleUpdate}
            isLoading={updateDept.isPending}
          />
        )}

        <ConfirmDialog
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Bo'limni o'chirish"
          message="Bu bo'lim va unga tegishli ma'lumotlar o'chiriladi. Davom etasizmi?"
          isLoading={deleteDept.isPending}
        />
      </Container>
    </section>
  );
}
