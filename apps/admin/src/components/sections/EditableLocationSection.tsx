"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Phone, Mail } from "lucide-react";
import Container from "@/components/shared/Container";
import EditableWrapper from "@/components/inline-edit/EditableWrapper";
import EditModal from "@/components/inline-edit/EditModal";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  useContactLocations,
  useCreateContactLocation,
  useUpdateContactLocation,
  useDeleteContactLocation,
} from "@/hooks/useContactLocations";
import type { ContactLocation } from "@/types";
import type { FieldConfig } from "@/types/inline-edit";

const LeafletMap = dynamic(() => import("@/components/shared/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="size-full rounded-3xl bg-gray-100 animate-pulse flex items-center justify-center min-h-80">
      <p className="text-gray-400 text-sm">Xarita yuklanmoqda...</p>
    </div>
  ),
});

const TdTUTF_FALLBACK_LAT = 37.2242;
const TdTUTF_FALLBACK_LNG = 67.2784;

const locationFields: FieldConfig[] = [
  { name: "name", label: "Nomi", type: "text", translatable: true, required: true },
  { name: "address", label: "Manzil", type: "textarea", translatable: true, required: true },
  { name: "phone", label: "Telefon", type: "text", placeholder: "+998 76 221-40-30", halfWidth: true },
  { name: "email", label: "Email", type: "text", placeholder: "info@tdtutf.uz", halfWidth: true },
  { name: "lat", label: "Latitude (kenglik)", type: "number", placeholder: "37.2242", halfWidth: true },
  { name: "lng", label: "Longitude (uzunlik)", type: "number", placeholder: "67.2784", halfWidth: true },
  { name: "sort_order", label: "Tartib raqami", type: "number", halfWidth: true },
  { name: "is_active", label: "Faol", type: "toggle", halfWidth: true },
];

export default function EditableLocationSection() {
  const { data: locations } = useContactLocations();
  const createMutation = useCreateContactLocation();
  const updateMutation = useUpdateContactLocation();
  const deleteMutation = useDeleteContactLocation();
  const [editItem, setEditItem] = useState<ContactLocation | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Show first active location as primary
  const primary = locations?.find((l) => l.is_active) || locations?.[0];
  const lat = primary?.lat ?? TdTUTF_FALLBACK_LAT;
  const lng = primary?.lng ?? TdTUTF_FALLBACK_LNG;
  const name = primary?.name?.uz || "TdTU Termiz filiali";
  const address = primary?.address?.uz || "";

  const handleSubmit = async (formData: FormData) => {
    // Convert FormData to plain object for JSON service
    const payload: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      // Translatable fields arrive as name[uz], name[ru], etc.
      const match = key.match(/^(\w+)\[(\w+)\]$/);
      if (match) {
        const [, field, lang] = match;
        if (!payload[field]) payload[field] = {};
        (payload[field] as Record<string, unknown>)[lang] = value;
      } else if (key === "is_active") {
        payload[key] = value === "1";
      } else if (key === "lat" || key === "lng" || key === "sort_order") {
        payload[key] = value === "" ? undefined : Number(value);
      } else {
        payload[key] = value;
      }
    });

    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, data: payload as unknown as Parameters<typeof updateMutation.mutateAsync>[0]["data"] });
      } else {
        await createMutation.mutateAsync(payload as unknown as Parameters<typeof createMutation.mutateAsync>[0]);
      }
    } catch (err) {
      console.error("ContactLocation save error:", err);
    } finally {
      setEditItem(null);
      setIsCreateOpen(false);
    }
  };

  return (
    <section className="mt-10 lg:mt-20">
      <Container>
        <div className="grid min-h-[503px] gap-4 md:grid-cols-2">
          {/* Contact Info Card */}
          <EditableWrapper
            entityType="contact-location"
            entityId={primary?.id ?? 0}
            onEdit={() => primary ? setEditItem(primary) : setIsCreateOpen(true)}
            onDelete={primary ? () => setDeleteId(primary.id) : undefined}
            onAdd={() => setIsCreateOpen(true)}
            label="Joylashuv"
          >
            <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 lg:p-10 h-full">
              <h3 className="font-serif text-2xl font-semibold lg:text-[32px]">
                Joylashuv
              </h3>

              <div className="mt-6 space-y-6">
                <div className="flex flex-col gap-3">
                  <h6 className="font-serif text-base font-extrabold leading-tight text-[#00575B] lg:text-lg">
                    {name}
                  </h6>

                  {address && (
                    <p className="flex items-start gap-2">
                      <MapPin className="size-5 flex-none text-[#00575B] mt-0.5" />
                      <span>{address}</span>
                    </p>
                  )}

                  {primary?.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="size-5 flex-none text-[#00575B]" />
                      <a href={`tel:${primary.phone}`} className="hover:text-[#00575B]">
                        {primary.phone}
                      </a>
                    </p>
                  )}

                  {primary?.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="size-5 flex-none text-[#00575B]" />
                      <a href={`mailto:${primary.email}`} className="hover:text-[#00575B]">
                        {primary.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </EditableWrapper>

          {/* Leaflet Map */}
          <div
            className="relative z-0 rounded-2xl lg:rounded-3xl h-full min-h-80 overflow-hidden"
            style={{ isolation: "isolate" }}
          >
            <LeafletMap lat={lat} lng={lng} zoom={15} popupText={name} />
          </div>
        </div>
      </Container>

      <EditModal
        isOpen={!!editItem || isCreateOpen}
        onClose={() => {
          setEditItem(null);
          setIsCreateOpen(false);
        }}
        title={editItem ? "Joylashuvni tahrirlash" : "Yangi joylashuv"}
        fields={locationFields}
        initialData={editItem ? { ...editItem } : { is_active: true, sort_order: 0 }}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteMutation.mutate(deleteId);
          setDeleteId(null);
        }}
        title="Joylashuvni o'chirish"
        message="Haqiqatan ham bu joylashuvni o'chirmoqchimisiz?"
        isLoading={deleteMutation.isPending}
      />
    </section>
  );
}
