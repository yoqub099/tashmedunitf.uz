"use client";

import { useState, useCallback } from "react";
import { useContacts, useDeleteContact, useUpdateContact, useUnreadCount } from "@/hooks/useContacts";
import { useContactLocations, useCreateContactLocation, useUpdateContactLocation, useDeleteContactLocation } from "@/hooks/useContactLocations";
import { contactService } from "@/lib/services/contactService";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import Card from "@/components/shared/Card";
import Button from "@/components/shared/Button";
import Badge from "@/components/shared/Badge";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorState from "@/components/shared/ErrorState";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Modal from "@/components/shared/Modal";
import type { Contact, ContactLocation } from "@/types";
import { Mail, MailOpen, Trash2, Clock, Phone, User, Pencil, Eye, CheckCheck, Search, Filter, MailX, Reply, X, Save, Plus, MapPin, Paperclip } from "lucide-react";
import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/components/shared/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-100">
      <div className="text-gray-400">Xarita yuklanmoqda...</div>
    </div>
  ),
});

type LocLang = "uz" | "ru" | "en";
const EMPTY_LOC_FORM = {
  name: { uz: "", ru: "", en: "" } as Record<LocLang, string>,
  address: { uz: "", ru: "", en: "" } as Record<LocLang, string>,
  phone: "",
  email: "",
  lat: "",
  lng: "",
};

export default function ContactsAdmin() {
  const [page, setPage] = useState(1);
  const [viewItem, setViewItem] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "messages">("info");
  const [searchQuery, setSearchQuery] = useState("");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");

  /* ─── Contact message edit form ─── */
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  /* ─── Location CRUD state ─── */
  const [editLoc, setEditLoc] = useState<ContactLocation | null>(null);
  const [addingLoc, setAddingLoc] = useState(false);
  const [deleteLocId, setDeleteLocId] = useState<number | null>(null);
  const [locForm, setLocForm] = useState(EMPTY_LOC_FORM);
  const [locLang, setLocLang] = useState<LocLang>("uz");

  /* ─── Data hooks ─── */
  const { data, isLoading, error, refetch } = useContacts({ page, per_page: 15 });
  const { data: unreadCount } = useUnreadCount();
  const deleteContact = useDeleteContact();
  const updateContact = useUpdateContact();

  const { data: locations, isLoading: locsLoading, error: locsError, refetch: refetchLocs } = useContactLocations();
  const createLocation = useCreateContactLocation();
  const updateLocation = useUpdateContactLocation();
  const deleteLocation = useDeleteContactLocation();

  /* ─── Message Handlers ─── */
  const handleView = useCallback(async (item: Contact) => {
    setViewItem(item);
    if (!item.is_read) {
      try {
        await contactService.getById(item.id);
        refetch();
      } catch { /* ignore */ }
    }
  }, [refetch]);

  const handleDelete = useCallback(async () => {
    if (deleteId === null) return;
    await deleteContact.mutateAsync(deleteId);
    setDeleteId(null);
    if (viewItem?.id === deleteId) setViewItem(null);
    if (editItem?.id === deleteId) setEditItem(null);
    refetch();
  }, [deleteId, deleteContact, viewItem, editItem, refetch]);

  const handleStartEdit = useCallback((item: Contact) => {
    setEditItem(item);
    setEditForm({
      name: item.name,
      email: item.email,
      phone: item.phone || "",
      subject: item.subject,
      message: item.message,
    });
    setViewItem(null);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editItem) return;
    await updateContact.mutateAsync({
      id: editItem.id,
      data: {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || undefined,
        subject: editForm.subject,
        message: editForm.message,
      },
    });
    setEditItem(null);
    refetch();
  }, [editItem, editForm, updateContact, refetch]);

  const handleToggleRead = useCallback(async (item: Contact) => {
    await updateContact.mutateAsync({
      id: item.id,
      data: { is_read: !item.is_read },
    });
    refetch();
  }, [updateContact, refetch]);

  /* ─── Location Handlers ─── */
  const extractTranslatable = (val: unknown): Record<LocLang, string> => {
    if (val && typeof val === "object") {
      const obj = val as { uz?: string; ru?: string; en?: string };
      return { uz: obj.uz || "", ru: obj.ru || "", en: obj.en || "" };
    }
    return { uz: typeof val === "string" ? val : "", ru: "", en: "" };
  };

  const handleStartEditLoc = useCallback((loc: ContactLocation) => {
    setEditLoc(loc);
    setAddingLoc(false);
    setLocLang("uz");
    setLocForm({
      name: extractTranslatable(loc.name),
      address: extractTranslatable(loc.address),
      phone: loc.phone || "",
      email: loc.email || "",
      lat: loc.lat ? String(loc.lat) : "",
      lng: loc.lng ? String(loc.lng) : "",
    });
  }, []);

  const handleStartAddLoc = useCallback(() => {
    setAddingLoc(true);
    setEditLoc(null);
    setLocLang("uz");
    setLocForm(EMPTY_LOC_FORM);
  }, []);

  const handleSaveLoc = useCallback(async () => {
    // Clean empty translations — faqat to'ldirilgan tillar yuboriladi
    const cleanTrans = (obj: Record<LocLang, string>): Partial<Record<LocLang, string>> => {
      const out: Partial<Record<LocLang, string>> = {};
      if (obj.uz?.trim()) out.uz = obj.uz.trim();
      if (obj.ru?.trim()) out.ru = obj.ru.trim();
      if (obj.en?.trim()) out.en = obj.en.trim();
      return out;
    };

    const payload = {
      name: cleanTrans(locForm.name),
      address: cleanTrans(locForm.address),
      phone: locForm.phone || undefined,
      email: locForm.email || undefined,
      lat: locForm.lat ? parseFloat(locForm.lat) : undefined,
      lng: locForm.lng ? parseFloat(locForm.lng) : undefined,
    };

    if (editLoc) {
      await updateLocation.mutateAsync({ id: editLoc.id, data: payload as Parameters<typeof updateLocation.mutateAsync>[0]["data"] });
      setEditLoc(null);
    } else {
      await createLocation.mutateAsync(payload as Parameters<typeof createLocation.mutateAsync>[0]);
      setAddingLoc(false);
    }
    refetchLocs();
  }, [editLoc, locForm, updateLocation, createLocation, refetchLocs]);

  const handleDeleteLoc = useCallback(async () => {
    if (deleteLocId === null) return;
    await deleteLocation.mutateAsync(deleteLocId);
    setDeleteLocId(null);
    refetchLocs();
  }, [deleteLocId, deleteLocation, refetchLocs]);

  /* ─── Filter items ─── */
  const allItems = data?.data || [];
  const meta = data?.meta;

  const items = allItems.filter((item) => {
    const matchesSearch = searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = readFilter === "all" ||
      (readFilter === "read" && item.is_read) ||
      (readFilter === "unread" && !item.is_read);

    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-8 sm:py-12">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Aloqa</h1>
          <p className="mt-1 text-sm text-gray-500">
            Joylashuv ma&apos;lumotlari va sayt orqali yuborilgan xabarlar
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "info"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M515.664-.368C305.76-.368 128 178.4 128 390.176c0 221.76 206.032 448.544 344.624 607.936.528.64 22.929 25.52 50.528 25.52h2.449c27.6 0 49.84-24.88 50.399-25.52 130.064-149.52 320-396.048 320-607.936C896 178.4 757.344-.368 515.664-.368zm12.832 955.552c-1.12 1.12-2.753 2.369-4.193 3.409-1.472-1.008-3.072-2.288-4.255-3.408l-16.737-19.248C371.92 785.2 192 578.785 192 390.176c0-177.008 148.224-326.56 323.664-326.56 218.528 0 316.336 164 316.336 326.56 0 143.184-102.128 333.296-303.504 565.008zm-15.377-761.776c-106.032 0-192 85.968-192 192s85.968 192 192 192 192-85.968 192-192-85.968-192-192-192zm0 320c-70.576 0-129.473-58.816-129.473-129.408 0-70.576 57.424-128 128-128 70.624 0 128 57.424 128 128 .032 70.592-55.903 129.408-126.527 129.408z" />
              </svg>
              Joylashuv &amp; Ma&apos;lumotlar
            </span>
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === "messages"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Mail className="h-4 w-4" />
              Xabarlar
              {typeof unreadCount === "number" && unreadCount > 0 && (
                <Badge variant="danger" size="sm">{unreadCount}</Badge>
              )}
            </span>
          </button>
        </div>

        {/* ═══════════════════════════════════════════
            TAB 1 — Joylashuv & Ma'lumotlar
            ═══════════════════════════════════════════ */}
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Location cards */}
            <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">Joylashuv</h3>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartAddLoc}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Qo&apos;shish
                </Button>
              </div>

              {locsLoading ? (
                <div className="mt-5 grid gap-4 md:grid-cols-2 animate-pulse">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-3">
                      <div className="h-5 w-32 bg-gray-200 rounded" />
                      <div className="h-4 w-48 bg-gray-100 rounded" />
                      <div className="h-4 w-36 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>
              ) : locsError ? (
                <ErrorState onRetry={() => refetchLocs()} />
              ) : !locations || locations.length === 0 ? (
                <EmptyState
                  title="Joylashuvlar topilmadi"
                  message="Yangi joylashuv qo'shing"
                  icon={<MapPin className="w-8 h-8 text-gray-400" />}
                />
              ) : (
                <div className="mt-5">
                  <h4 className="text-lg font-semibold text-gray-800">Termiz</h4>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {locations.map((loc) => (
                      <div
                        key={loc.id}
                        className="group relative flex flex-col space-y-2.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5"
                      >
                        {/* Action buttons */}
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEditLoc(loc)}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Tahrirlash"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteLocId(loc.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h6 className="text-base font-semibold leading-tight text-[#00575B] lg:text-lg pr-16">
                          {typeof loc.name === "object" ? loc.name?.uz || "" : loc.name}
                        </h6>

                        {/* Address */}
                        <p className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-0.5 flex-none">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M515.664-.368C305.76-.368 128 178.4 128 390.176c0 221.76 206.032 448.544 344.624 607.936.528.64 22.929 25.52 50.528 25.52h2.449c27.6 0 49.84-24.88 50.399-25.52 130.064-149.52 320-396.048 320-607.936C896 178.4 757.344-.368 515.664-.368zm12.832 955.552c-1.12 1.12-2.753 2.369-4.193 3.409-1.472-1.008-3.072-2.288-4.255-3.408l-16.737-19.248C371.92 785.2 192 578.785 192 390.176c0-177.008 148.224-326.56 323.664-326.56 218.528 0 316.336 164 316.336 326.56 0 143.184-102.128 333.296-303.504 565.008zm-15.377-761.776c-106.032 0-192 85.968-192 192s85.968 192 192 192 192-85.968 192-192-85.968-192-192-192zm0 320c-70.576 0-129.473-58.816-129.473-129.408 0-70.576 57.424-128 128-128 70.624 0 128 57.424 128 128 .032 70.592-55.903 129.408-126.527 129.408z"></path></svg>
                          </span>
                          <span>{typeof loc.address === "object" ? loc.address?.uz || "" : loc.address}</span>
                        </p>

                        {/* Phone */}
                        {loc.phone && (
                          <p className="flex items-center gap-2 text-sm">
                            <span className="flex-none">
                              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M262.2 37c37.4 51.6 82.002 118.197 133.602 199.598 13 22 11 48.4-5.8 79.4-6.4 13-22.6 42.6-48.4 89.2 28.4 40 71.6 89.2 129.8 147.2s106.602 101.4 145.2 129.8c46.401-27.2 76.201-43.8 89.201-50.399 16.8-9 33-13.6 48.4-13.6 11.6 0 22 2.6 31 7.8 59.4 36.2 126.601 80.8 201.4 133.6 14.2 10.4 22.2 24.601 24.2 42.601 2 18.2-3.599 37.4-16.399 58.2-6.4 9-16.8 22.2-31 39.8-14.201 17.4-35.601 39.4-64.002 65.8s-51.6 39.802-69.8 39.802h-2c-136.6-5.4-305-107.801-504.4-307.201-199.6-199.6-302-367.8-307.2-504.6 0-18 13.2-41.6 39.8-70.8 26.4-29 48.2-50 64.799-63 16.8-12.8 31-23.2 42.6-31 14.2-10.4 30.4-15.4 48.4-15.4 22.2 0 38.8 7.8 50.6 23.2zm-63.998 40.598c-27.2 19.4-52.603 41.198-76.603 64.998-23.8 24-37.8 41.6-41.6 53.2 5.2 120.2 101 273.2 287.6 459.2 186.6 186 340 282.2 460 288.6 10.4-3.8 27.4-18 51.4-42.6s45.6-50.399 64.8-77.399c3.8-5.2 5.2-9.6 3.8-13.6-77.4-54.2-142-97.4-193.8-129.801-5.2 0-11.6 2-19.4 5.8-11.6 6.4-40.6 22.6-87.2 48.4l-33 19.4-33-21.4c-42.6-29.6-94.199-75.6-154.999-137.6-60.6-60.6-105.8-112.4-135.6-155l-23.2-31 19.4-34.799c25.8-46.4 42-75.6 48.4-87.2 3.8-7.8 5.8-14.2 5.8-19.4-46-73.401-88.599-138-127.398-193.6h-2c-5 0-9.6 1.4-13.4 3.8z"></path></svg>
                            </span>
                            <a href={`tel:${loc.phone.replace(/\s/g, "")}`} className="text-gray-700 hover:text-blue-700 transition-colors">
                              {loc.phone}
                            </a>
                          </p>
                        )}

                        {/* Email */}
                        {loc.email && (
                          <p className="flex items-center gap-2 text-sm">
                            <span className="flex-none">
                              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M1023.46 232a31.629 31.629 0 0 0-2.48-18.271C1012.917 178.288 987.3 160 944.005 160h-832c-38.08 0-79.105 14-99.28 41.472-1.745 1.328-3.409 2.832-4.912 4.576-6.449 7.44-8.705 17.009-7.264 26.033-.288 2.592-.544 5.2-.544 7.92v512c0 53.024 58.992 112 112 112h832c53.024 0 80-58.976 80-112v-512c0-2.832-.368-5.313-.544-8.001zm-911.459-8l832.001-.001h.432L512.002 568.655 81.314 225.407C91.106 223.599 103.154 224 112 224zm832.001 575.999H112.003c-17.648 0-48-30.336-48-48V293.551l427.04 341.648c6.016 5.2 13.487 7.792 20.959 7.792a32.046 32.046 0 0 0 20.976-7.792l427.024-341.632v458.432c0 17.664 1.664 48-16 48z"></path></svg>
                            </span>
                            <a href={`mailto:${loc.email}`} className="text-gray-700 hover:text-blue-700 transition-colors">
                              {loc.email}
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            {locations && locations.length > 0 && (
              <div className="h-80 md:h-96">
                <ContactMap
                  locations={locations
                    .filter((l) => l.lat && l.lng)
                    .map((l) => ({ name: typeof l.name === "object" ? l.name?.uz || "" : l.name, lat: l.lat!, lng: l.lng! }))}
                  center={
                    locations[0]?.lat && locations[0]?.lng
                      ? [locations[0].lat, locations[0].lng]
                      : [37.2242, 67.2783]
                  }
                  zoom={15}
                />
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════
            TAB 2 — Xabarlar (Messages Inbox)
            ═══════════════════════════════════════════ */}
        {activeTab === "messages" && (
          <div>
            {/* Header with stats */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <SectionTitle
                  title="Aloqa xabarlari"
                  subtitle="Sayt orqali yuborilgan xabarlar"
                  align="left"
                  className="mb-0"
                />
                {typeof unreadCount === "number" && unreadCount > 0 && (
                  <Badge variant="danger" size="md">{unreadCount} yangi</Badge>
                )}
              </div>
            </div>

            {/* Search & Filter */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ism, email, mavzu bo'yicha qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
                {([
                  { key: "all", label: "Barchasi", icon: Filter },
                  { key: "unread", label: "Yangi", icon: Mail },
                  { key: "read", label: "O'qilgan", icon: MailOpen },
                ] as const).map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setReadFilter(key)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      readFilter === key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-3 animate-pulse py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-white p-4 flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                      <div className="h-3 w-64 bg-gray-100 rounded" />
                    </div>
                    <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <ErrorState onRetry={() => refetch()} />
            ) : items.length === 0 ? (
              <EmptyState
                title={searchQuery || readFilter !== "all" ? "Natija topilmadi" : "Xabarlar topilmadi"}
                message={searchQuery || readFilter !== "all" ? "Filtrlarni o'zgartiring" : "Hozircha hech kim xabar yubormagan"}
                icon={<Mail className="w-8 h-8 text-gray-400" />}
              />
            ) : (
              <>
                <div className="space-y-2.5 sm:space-y-3">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className={`group cursor-pointer transition-all hover:shadow-md ${!item.is_read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* Icon */}
                        <div
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 cursor-pointer"
                          onClick={() => handleView(item)}
                        >
                          {item.is_read ? (
                            <MailOpen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          ) : (
                            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0" onClick={() => handleView(item)}>
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-3">
                            <div>
                              <h3 className={`font-medium text-sm sm:text-base ${!item.is_read ? "text-gray-900" : "text-gray-700"}`}>
                                {item.subject}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{item.name} &middot; {item.email}</p>
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              {new Date(item.created_at).toLocaleDateString("uz-UZ")}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-1">{item.message}</p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleView(item); }}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Ko'rish"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStartEdit(item); }}
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Tahrirlash"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleRead(item); }}
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={item.is_read ? "O'qilmagan deb belgilash" : "O'qilgan deb belgilash"}
                          >
                            {item.is_read ? <MailX className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
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
          </div>
        )}

        {/* ═══════════════════════════════════════════
            View Modal — Ko'rish
            ═══════════════════════════════════════════ */}
        <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} size="md">
          {viewItem && (
            <div className="py-2">
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{viewItem.subject}</h3>
                <Badge variant={viewItem.is_read ? "default" : "info"} size="sm">
                  {viewItem.is_read ? "O'qilgan" : "Yangi"}
                </Badge>
              </div>

              <div className="space-y-2.5 sm:space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="font-medium">{viewItem.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href={`mailto:${viewItem.email}`} className="text-blue-600 hover:underline">{viewItem.email}</a>
                </div>
                {viewItem.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <a href={`tel:${viewItem.phone}`} className="text-blue-600 hover:underline">{viewItem.phone}</a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  {new Date(viewItem.created_at).toLocaleString("uz-UZ")}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{viewItem.message}</p>
              </div>

              {viewItem.attachment_url && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Paperclip className="w-4 h-4" />
                    Biriktirilgan fayl
                  </p>
                  {/\.(jpg|jpeg|png|gif|webp|avif)$/i.test(viewItem.attachment_url) ? (
                    <a
                      href={viewItem.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-xl ring-1 ring-gray-200 transition-shadow hover:shadow-md"
                    >
                      <img
                        src={viewItem.attachment_url}
                        alt="Attachment"
                        className="max-h-64 w-full object-cover"
                      />
                    </a>
                  ) : (
                    <a
                      href={viewItem.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100"
                    >
                      <Paperclip className="w-4 h-4" />
                      Faylni yuklab olish
                    </a>
                  )}
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleRead(viewItem)}
                  icon={viewItem.is_read ? <MailX className="w-4 h-4" /> : <CheckCheck className="w-4 h-4" />}
                >
                  {viewItem.is_read ? "O'qilmagan" : "O'qilgan"}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleStartEdit(viewItem)}
                  icon={<Pencil className="w-4 h-4" />}
                >
                  Tahrirlash
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteId(viewItem.id)}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  O&apos;chirish
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => window.open(`mailto:${viewItem.email}?subject=Re: ${viewItem.subject}`, "_blank")}
                  icon={<Reply className="w-4 h-4" />}
                >
                  Javob yozish
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* ═══════════════════════════════════════════
            Edit Modal — Tahrirlash
            ═══════════════════════════════════════════ */}
        <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} size="md">
          {editItem && (
            <div className="py-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-amber-500" />
                Xabarni tahrirlash
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Ism</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+998 ..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Mavzu</label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Xabar matni</label>
                  <textarea
                    value={editForm.message}
                    onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))}
                    rows={5}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditItem(null)}
                  icon={<X className="w-4 h-4" />}
                >
                  Bekor qilish
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={updateContact.isPending || !editForm.name || !editForm.email || !editForm.subject || !editForm.message}
                  icon={<Save className="w-4 h-4" />}
                >
                  {updateContact.isPending ? "Saqlanmoqda..." : "Saqlash"}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* ═══════════════════════════════════════════
            Delete Confirm — Xabar o'chirish
            ═══════════════════════════════════════════ */}
        <ConfirmDialog
          isOpen={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Xabarni o'chirish"
          message="Bu xabar butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteContact.isPending}
        />

        {/* ═══════════════════════════════════════════
            Location Add/Edit Modal
            ═══════════════════════════════════════════ */}
        <Modal isOpen={addingLoc || !!editLoc} onClose={() => { setAddingLoc(false); setEditLoc(null); }} size="md">
          <div className="py-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
              {editLoc ? <Pencil className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-green-500" />}
              {editLoc ? "Joylashuvni tahrirlash" : "Yangi joylashuv qo'shish"}
            </h3>

            <div className="space-y-4">
              {/* Language tabs */}
              <div className="flex gap-2 border-b border-gray-200 pb-0">
                {(["uz", "ru", "en"] as LocLang[]).map((lg) => {
                  const flag = lg === "uz" ? "🇺🇿" : lg === "ru" ? "🇷🇺" : "🇬🇧";
                  const label = lg === "uz" ? "O'zbekcha" : lg === "ru" ? "Русский" : "English";
                  const hasContent = locForm.name[lg].trim() || locForm.address[lg].trim();
                  const isActive = locLang === lg;
                  return (
                    <button
                      key={lg}
                      type="button"
                      onClick={() => setLocLang(lg)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg -mb-px border-b-2 transition-colors ${
                        isActive
                          ? "border-blue-600 text-blue-700 bg-blue-50"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                      {lg === "uz" && <span className="text-red-500">*</span>}
                      {hasContent && !isActive && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nomi {locLang === "uz" && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={locForm.name[locLang]}
                  onChange={(e) => setLocForm((f) => ({ ...f, name: { ...f.name, [locLang]: e.target.value } }))}
                  placeholder={locLang === "uz" ? "TdTU Termiz filiali" : locLang === "ru" ? "Термезский филиал ТашГМУ" : "TSMU Termez Branch"}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Manzil {locLang === "uz" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={locForm.address[locLang]}
                  onChange={(e) => setLocForm((f) => ({ ...f, address: { ...f.address, [locLang]: e.target.value } }))}
                  rows={2}
                  placeholder={locLang === "uz" ? "Surxondaryo viloyati, Termiz shahri..." : locLang === "ru" ? "Сурхандарьинская область, г. Термез..." : "Surkhandarya region, Termez city..."}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Telefon</label>
                  <input
                    type="text"
                    value={locForm.phone}
                    onChange={(e) => setLocForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+998 76 221-40-30"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={locForm.email}
                    onChange={(e) => setLocForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="info@tdtutf.uz"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="text"
                    value={locForm.lat}
                    onChange={(e) => setLocForm((f) => ({ ...f, lat: e.target.value }))}
                    placeholder="37.2242"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="text"
                    value={locForm.lng}
                    onChange={(e) => setLocForm((f) => ({ ...f, lng: e.target.value }))}
                    placeholder="67.2783"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-all focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setAddingLoc(false); setEditLoc(null); }}
                icon={<X className="w-4 h-4" />}
              >
                Bekor qilish
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveLoc}
                disabled={
                  (updateLocation.isPending || createLocation.isPending) ||
                  !locForm.name.uz.trim() || !locForm.address.uz.trim()
                }
                icon={<Save className="w-4 h-4" />}
              >
                {(updateLocation.isPending || createLocation.isPending) ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </div>
        </Modal>

        {/* ═══════════════════════════════════════════
            Delete Confirm — Joylashuv o'chirish
            ═══════════════════════════════════════════ */}
        <ConfirmDialog
          isOpen={deleteLocId !== null}
          onClose={() => setDeleteLocId(null)}
          onConfirm={handleDeleteLoc}
          title="Joylashuvni o'chirish"
          message="Bu joylashuv butunlay o'chiriladi. Davom etasizmi?"
          isLoading={deleteLocation.isPending}
        />
      </Container>
    </section>
  );
}
