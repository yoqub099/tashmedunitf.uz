"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { usePartners, useCreatePartner, useUpdatePartner, useDeletePartner } from "@/hooks/usePartners";
import type { Partner } from "@/types";
import type { FieldConfig } from "@/types/inline-edit";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const partnerFields: FieldConfig[] = [
  { name: "name", label: "Nomi", type: "text", required: true },
  { name: "url", label: "Veb-sayt", type: "text" },
  { name: "sort_order", label: "Tartib", type: "number" },
  { name: "is_active", label: "Faol", type: "toggle" },
  { name: "logo", label: "Logotip", type: "media", accept: "image/*" },
];

export default function EditablePartnersSection() {
  const { data: partnersData } = usePartners({ per_page: 20 });
  const createMutation = useCreatePartner();
  const updateMutation = useUpdatePartner();
  const deleteMutation = useDeletePartner();
  const [editItem, setEditItem] = useState<Partner | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const partners = partnersData?.data || [];

  return (
    <section className="mt-10 lg:mt-20 pb-10 lg:pb-20">
      <Container>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
            Hamkorlarimiz
          </h2>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-lg bg-[#00575B] px-4 py-2 text-sm font-medium text-white hover:bg-[#004548] transition-colors"
          >
            + Yangi hamkor
          </button>
        </div>

        {partners.length > 0 ? (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            loop={partners.length > 4}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="partners-swiper"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <EditableWrapper
                  entityType="partner"
                  entityId={partner.id}
                  onEdit={() => setEditItem(partner)}
                  onDelete={() => setDeleteId(partner.id)}
                  onAdd={() => setIsCreateOpen(true)}
                  label="Hamkor"
                >
                  <div className="flex flex-col items-center justify-center py-4 relative">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={partner.name || ""}
                        className="object-contain max-h-24 w-auto"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl">
                        {(partner.name || "H").charAt(0)}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-center text-gray-600 font-medium line-clamp-1">
                      {partner.name || "Nomsiz"}
                    </p>
                    {!partner.is_active && (
                      <span className="absolute top-2 right-2 rounded-full bg-yellow-50 px-2 py-0.5 text-[10px] text-yellow-700 border border-yellow-200">
                        Nofaol
                      </span>
                    )}
                  </div>
                </EditableWrapper>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <EditableWrapper
            entityType="partner"
            entityId={0}
            onEdit={() => setIsCreateOpen(true)}
            onAdd={() => setIsCreateOpen(true)}
            label="Hamkor"
          >
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-400">Hozircha hamkor yo&apos;q — + bosib qo&apos;shing</p>
            </div>
          </EditableWrapper>
        )}
      </Container>

      <EditModal
        isOpen={!!editItem || isCreateOpen}
        onClose={() => { setEditItem(null); setIsCreateOpen(false); }}
        title={editItem ? "Hamkorni tahrirlash" : "Yangi hamkor"}
        fields={partnerFields}
        initialData={editItem ? { ...editItem } : undefined}
        onSubmit={async (formData) => {
          try {
            if (editItem) {
              await updateMutation.mutateAsync({ id: editItem.id, formData });
            } else {
              await createMutation.mutateAsync(formData);
            }
          } catch (err) {
            console.error("Partner save error:", err);
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
        title="Hamkorni o'chirish"
        message="Haqiqatan ham bu hamkorni o'chirmoqchimisiz?"
        isLoading={deleteMutation.isPending}
      />
    </section>
  );
}
