"use client";

import { useState, useMemo } from "react";
import Container from "@/components/shared/Container";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial } from "@/hooks/useTestimonials";
import type { Testimonial } from "@/types";
import type { FieldConfig } from "@/types/inline-edit";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const testimonialFields: FieldConfig[] = [
  { name: "name", label: "Ism", type: "text", translatable: true, required: true },
  { name: "role", label: "Lavozim", type: "text", translatable: true },
  { name: "text", label: "Izoh matni", type: "textarea", translatable: true, required: true },
  { name: "sort_order", label: "Tartib raqami", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
  { name: "photo", label: "Rasm", type: "media", accept: "image/*" },
];

/* avatar fallback colors */
const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-blue-500",
  "bg-violet-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-indigo-500",
  "bg-fuchsia-500",
  "bg-lime-600",
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function TestimonialCard({
  item,
  onEdit,
  onDelete,
  onAdd,
}: {
  item: Testimonial;
  onEdit: () => void;
  onDelete: () => void;
  onAdd: () => void;
}) {
  const name = item.name?.uz || "";
  const avatarColor = getAvatarColor(name);

  return (
    <EditableWrapper
      entityType="testimonial"
      entityId={item.id}
      onEdit={onEdit}
      onDelete={onDelete}
      onAdd={onAdd}
      label="Izoh"
    >
      <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl carousel-box flex h-44 flex-col lg:h-52 cursor-pointer relative">
        {!item.is_active && (
          <span className="absolute top-2 right-2 z-30 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            Nofaol
          </span>
        )}
        <div className="relative z-20 flex flex-none gap-3">
          {item.photo ? (
            <img
              src={item.photo}
              alt={name}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div
              className={`size-16 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-xl`}
            >
              {(name || "?").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h5 className="font-serif text-xl font-semibold">{name}</h5>
            <p className="text-sm">{item.role?.uz || ""}</p>
          </div>
        </div>
        <p className="relative z-20 mt-4 line-clamp-3 text-sm leading-tight text-container lg:text-lg">
          {item.text?.uz || ""}
        </p>
      </div>
    </EditableWrapper>
  );
}

export default function EditableTestimonialsSection() {
  const { data: testimonialsData } = useTestimonials();
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();
  const deleteMutation = useDeleteTestimonial();
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const testimonials = testimonialsData?.data || [];

  /* duplicate short arrays so Swiper loop has enough slides */
  const slides = useMemo(() => {
    if (testimonials.length === 0) return [];
    const result = [...testimonials];
    while (result.length < 10) {
      result.push(...testimonials);
    }
    return result;
  }, [testimonials]);

  const swiperConfig = {
    spaceBetween: 16,
    slidesPerView: "auto" as const,
    loop: true,
    speed: 10000,
    allowTouchMove: true,
    grabCursor: true,
  };

  return (
    <section className="mt-10 lg:mt-20 overflow-hidden">
      <div className="flex w-full flex-col items-center justify-center text-center px-4">
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] md:w-1/2 xl:w-1/3">
          Biz haqimizda talaba va o&apos;qituvchilarning fikri
        </h2>
        <p className="mt-2 text-gray-500">
          Ko&apos;pchilik bizning sifatli ta&apos;limimiz va filial binosida yaratilgan qulayliklardan mamnun
        </p>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#00575B] px-4 py-2 text-sm font-medium text-white hover:bg-[#004548] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yangi izoh
        </button>
      </div>

      {testimonials.length > 0 ? (
        <>
          {/* Row 1 — auto-scroll left */}
          <div className="feedbacks-swiper mt-8 w-full">
            <Swiper
              {...swiperConfig}
              autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: false }}
              modules={[Autoplay]}
              className="h-full"
            >
              {slides.map((item, index) => (
                <SwiperSlide key={`row1-${item.id}-${index}`} className="w-full max-w-80 lg:max-w-96">
                  <TestimonialCard
                    item={item}
                    onEdit={() => setEditItem(item)}
                    onDelete={() => setDeleteId(item.id)}
                    onAdd={() => setIsCreateOpen(true)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Row 2 — auto-scroll right (reverse) */}
          <div className="feedbacks-swiper mt-4">
            <Swiper
              {...swiperConfig}
              autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: true }}
              modules={[Autoplay]}
              className="h-full"
            >
              {slides.map((item, index) => (
                <SwiperSlide key={`row2-${item.id}-${index}`} className="w-full max-w-80 lg:max-w-96">
                  <TestimonialCard
                    item={item}
                    onEdit={() => setEditItem(item)}
                    onDelete={() => setDeleteId(item.id)}
                    onAdd={() => setIsCreateOpen(true)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      ) : (
        <Container>
          <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <p className="text-gray-400">Hozircha izoh yo&apos;q — yuqoridagi + bosib qo&apos;shing</p>
          </div>
        </Container>
      )}

      <EditModal
        isOpen={!!editItem || isCreateOpen}
        onClose={() => { setEditItem(null); setIsCreateOpen(false); }}
        title={editItem ? "Izohni tahrirlash" : "Yangi izoh"}
        fields={testimonialFields}
        initialData={editItem ? { ...editItem } : undefined}
        onSubmit={async (formData) => {
          try {
            if (editItem) {
              await updateMutation.mutateAsync({ id: editItem.id, formData });
            } else {
              await createMutation.mutateAsync(formData);
            }
          } catch (err) {
            console.error("Testimonial save error:", err);
          } finally {
            setEditItem(null);
            setIsCreateOpen(false);
          }
        }}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        title="Izohni o'chirish"
        message="Haqiqatan ham bu izohni o'chirmoqchimisiz?"
        isLoading={deleteMutation.isPending}
      />
    </section>
  );
}
