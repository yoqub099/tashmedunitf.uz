"use client";

import { useState, useMemo } from "react";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import type { FieldConfig } from "@/types/inline-edit";
import type { Faculty, Direction } from "@/types";
import { useFaculties } from "@/hooks/useFaculties";
import { useUpdateDirection } from "@/hooks/useDirections";
import { Home, ChevronRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

/* ───── Globe SVG icon (Faculty header) ───── */
const GlobeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 24.5C8.2005 24.5 3.5 19.7995 3.5 14C3.5 8.2005 8.2005 3.5 14 3.5C19.7995 3.5 24.5 8.2005 24.5 14" stroke="#131313" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.09497 10.5H23.7766" stroke="#131313" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.09497 17.5H14" stroke="#131313" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.6667 14C18.6667 10.7753 17.8232 7.55062 16.1386 4.73662C15.1504 3.08812 12.8497 3.08812 11.8627 4.73662C8.49107 10.3658 8.49107 17.6353 11.8627 23.2645C12.3562 24.0881 13.1787 24.5011 14.0012 24.5011" stroke="#131313" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path fillRule="evenodd" clipRule="evenodd" d="M22.3649 22.365L25.2874 21.196C25.8019 20.9907 25.7902 20.258 25.2699 20.0678L18.3095 17.5373C17.8289 17.3623 17.3634 17.829 17.5372 18.3097L20.0677 25.27C20.2567 25.7915 20.9894 25.802 21.1959 25.2875L22.3649 22.365Z" stroke="#131313" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ───── Triangle icon (Direction card) ───── */
const TriangleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.9 3L1 25.2H4.8L13.9 9.2L23.2 25.2H26.8L13.9 3Z" fill="#00575B" />
    <path d="M14 15.6L8.4 25.2H12.2L14 21.8L16.1 25.2H19.7L14 15.6Z" fill="#00575B" />
  </svg>
);

/* ───── Edit fields for exam subjects ───── */
const EXAM_SUBJECTS_FIELDS: FieldConfig[] = [
  {
    name: "exam_subjects",
    label: "Imtihon fanlari",
    type: "tags",
    placeholder: "Fan nomini kiritib Enter bosing (masalan: Matematika)",
  },
];

export default function TestFanlarPage() {
  /* ───── Data fetching ───── */
  const { data: facultiesData, isLoading, error, refetch } = useFaculties({ per_page: 100 });
  const updateDirection = useUpdateDirection();

  /* ───── Modal state ───── */
  const [editDirection, setEditDirection] = useState<Direction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  /* ───── Group faculties with non-empty directions ───── */
  const faculties = useMemo(() => {
    if (!facultiesData?.data) return [];
    return facultiesData.data
      .filter((f: Faculty) => f.is_active && f.directions && f.directions.length > 0)
      .sort((a: Faculty, b: Faculty) => a.sort_order - b.sort_order);
  }, [facultiesData]);

  /* ───── Handle save ───── */
  const handleSave = async (fd: FormData) => {
    if (!editDirection) return;

    // Extract exam_subjects from FormData
    const subjects: string[] = [];
    fd.forEach((value, key) => {
      const match = key.match(/^exam_subjects\[(\d+)\]$/);
      if (match) {
        subjects.push(String(value));
      }
    });

    // Build update FormData. When empty, omit the key entirely and let
    // backend keep existing value; to actually clear, block the submit.
    if (subjects.length === 0) {
      toast.error("Kamida 1 ta fan kiriting yoki tahrirni bekor qiling");
      return;
    }
    const updateFd = new FormData();
    subjects.forEach((s, i) => {
      updateFd.append(`exam_subjects[${i}]`, s);
    });

    await updateDirection.mutateAsync({
      id: editDirection.id,
      formData: updateFd,
    });
    setIsEditOpen(false);
    setEditDirection(null);
  };

  /* ───── Open edit modal ───── */
  const openEdit = (direction: Direction) => {
    setEditDirection(direction);
    setIsEditOpen(true);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <Container className="py-6">
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-700 font-medium mb-3">Ma&apos;lumotlarni yuklashda xatolik</p>
          <button onClick={() => refetch()} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700">
            Qayta urinish
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      {/* ───── Header ───── */}
      <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
        Test Topshiriladigan Fanlar Majmuasi
      </h1>

      {/* ───── Breadcrumb ───── */}
      <nav className="text-sm font-medium mt-3 mb-6">
        <ol className="flex items-center gap-1.5 text-gray-500 flex-wrap">
          <li className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-[#00575B] transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          </li>
          <li className="flex items-center gap-1.5">
            <Link href="/abiturientlarga" className="hover:text-[#00575B] transition-colors">
              Abiturientlarga
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          </li>
          <li className="text-[#00575B] font-semibold">
            Test Topshiriladigan Fanlar Majmuasi
          </li>
        </ol>
      </nav>

      {/* ───── Faculty groups ───── */}
      <div className="space-y-6">
        {faculties.length === 0 && (
          <div className="rounded-2xl bg-gray-100 p-8 text-center text-gray-500">
            <p className="text-lg font-medium">Fakultetlar topilmadi</p>
            <p className="text-sm mt-1">
              Avval &quot;Abiturientlarga&quot; sahifasida fakultet va yo&apos;nalishlarni qo&apos;shing.
            </p>
          </div>
        )}

        {faculties.map((faculty: Faculty) => (
          <div
            key={faculty.id}
            className="rounded-2xl p-4 md:p-6 lg:rounded-3xl w-full bg-gray-100"
          >
            {/* Faculty name */}
            <h4 className="font-serif text-2xl font-semibold flex gap-3 items-center">
              <GlobeIcon />
              <span>{faculty.name?.uz || "\u2014"}</span>
            </h4>

            {/* Directions grid */}
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {(faculty.directions || []).map((direction: Direction) => (
                <EditableWrapper
                  key={direction.id}
                  entityType="direction"
                  entityId={direction.id}
                  onEdit={() => openEdit(direction)}
                  label="Imtihon fanlari"
                >
                  <div className="rounded-[20px] p-4 md:p-6 bg-white">
                    {/* Direction name */}
                    <h6 className="font-serif text-sm font-semibold leading-none sm:text-[22px] text-[#00575B] flex items-center gap-1.5 lg:text-lg">
                      <TriangleIcon />
                      {direction.name?.uz || "\u2014"}
                    </h6>

                    {/* Exam subjects list */}
                    <ul className="mt-4 list-inside list-disc">
                      {(direction.exam_subjects || []).length > 0 ? (
                        direction.exam_subjects.map((subject: string, idx: number) => (
                          <li key={idx} className="text-sm text-gray-500 sm:text-base">
                            {subject}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-400 italic list-none">
                          Fanlar hali kiritilmagan
                        </li>
                      )}
                    </ul>
                  </div>
                </EditableWrapper>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ───── Edit Modal ───── */}
      <EditModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditDirection(null);
        }}
        title={`Imtihon fanlari \u2014 ${editDirection?.name?.uz || ""}`}
        fields={EXAM_SUBJECTS_FIELDS}
        initialData={{
          exam_subjects: editDirection?.exam_subjects || [],
        }}
        onSubmit={handleSave}
        isLoading={updateDirection.isPending}
      />
    </Container>
  );
}
