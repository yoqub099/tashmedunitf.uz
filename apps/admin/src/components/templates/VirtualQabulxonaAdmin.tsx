"use client";

import { useState, useEffect } from "react";
import Container from "@/components/shared/Container";
import { useContacts, useUnreadCount, useUpdateContact, useDeleteContact } from "@/hooks/useContacts";
import { format } from "date-fns";
import {
  Mail,
  MailOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Send,
  Inbox,
  CheckCircle2,
  Clock,
  CircleDot,
} from "lucide-react";
import type { Contact } from "@/types";
import toast from "react-hot-toast";
import { siteConfig } from "@/config/site";

const STATUS_CONFIG = {
  new: { label: "Yangi", color: "text-yellow-600", bg: "bg-yellow-100", icon: CircleDot },
  accepted: { label: "Qabul qilindi", color: "text-blue-600", bg: "bg-blue-100", icon: Clock },
  completed: { label: "Bajarildi", color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

export default function VirtualQabulxonaAdmin() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | StatusKey>("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [stats, setStats] = useState({ total: 0, new: 0, accepted: 0, completed: 0 });

  const params: Record<string, unknown> = {
    page,
    per_page: 10,
    ...(filter !== "all" ? { "filter[status]": filter } : {}),
  };

  const { data, isLoading } = useContacts(params);
  const { data: unreadCount = 0 } = useUnreadCount();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const contacts = data?.data ?? [];
  const meta = data?.meta;

  // Fetch real stats from API
  useEffect(() => {
    fetch(`${siteConfig.apiUrl}/contact/stats`)
      .then((res) => res.json())
      .then((res) => { if (res.data) setStats(res.data); })
      .catch(() => {});
  }, [page, filter]);

  const handleMarkRead = (contact: Contact) => {
    if (!contact.is_read) {
      updateContact.mutate({ id: contact.id, data: { is_read: true } });
    }
  };

  const handleStatusChange = (contact: Contact, status: StatusKey) => {
    updateContact.mutate(
      { id: contact.id, data: { status } },
      {
        onSuccess: () => {
          toast.success(`Status "${STATUS_CONFIG[status].label}" ga o'zgartirildi`);
          setSelectedContact({ ...contact, status });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (confirm("Bu xabarni o'chirmoqchimisiz?")) {
      deleteContact.mutate(id);
      if (selectedContact?.id === id) setSelectedContact(null);
    }
  };

  const getStatusBadge = (status?: string) => {
    const key = (status || "new") as StatusKey;
    const config = STATUS_CONFIG[key] || STATUS_CONFIG.new;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="py-6 sm:py-10">
      <Container>
        {/* Title */}
        <h1 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px]">
          Virtual Qabulxona
        </h1>
        <p className="mt-2 text-gray-500">Onlayn qabul va murojaatlar tizimi</p>

        {/* Content: Messages + Statistics sidebar (like frontend) */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* Left: Messages list */}
          <div className="flex-1 min-w-0">
            <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h5 className="font-serif text-xl font-semibold">
                  Murojaatlar
                </h5>
                {/* Filter tabs */}
                <div className="flex flex-wrap gap-1 rounded-lg bg-gray-200/60 p-0.5">
                  {[
                    { key: "all" as const, label: "Barchasi" },
                    { key: "new" as const, label: "Yangi" },
                    { key: "accepted" as const, label: "Qabul qilindi" },
                    { key: "completed" as const, label: "Bajarildi" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => { setFilter(tab.key); setPage(1); }}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                        filter === tab.key
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#00575B]" />
                </div>
              ) : contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Inbox className="h-14 w-14 text-gray-300 mb-4" />
                  <p className="text-gray-400">Xabarlar topilmadi</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => {
                        setSelectedContact(contact);
                        handleMarkRead(contact);
                      }}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 transition hover:bg-white hover:shadow-sm ${
                        !contact.is_read ? "bg-blue-50/50" : ""
                      } ${selectedContact?.id === contact.id ? "bg-white shadow-sm ring-1 ring-[#00575B]/20" : ""}`}
                    >
                      <div className={`mt-0.5 shrink-0 rounded-lg p-2 ${!contact.is_read ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                        {contact.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm truncate ${!contact.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                            {contact.name}
                          </span>
                          {getStatusBadge(contact.status)}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{contact.message}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-xs text-gray-400">{format(new Date(contact.created_at), "dd.MM")}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedContact(contact); handleMarkRead(contact); }}
                            className="p-1 text-gray-400 hover:text-[#00575B] transition"
                            title="Ko'rish"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(contact.id); }}
                            className="p-1 text-gray-400 hover:text-red-500 transition"
                            title="O'chirish"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-xs text-gray-400">
                    {meta.total} ta xabar
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-medium text-gray-600">
                      {page} / {meta.last_page}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                      disabled={page >= meta.last_page}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: Statistics + Detail */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-6">
            {/* Statistics card */}
            <div className="rounded-2xl bg-gray-50 p-5 text-gray-900 md:p-6 lg:rounded-3xl space-y-5">
              <h5 className="font-serif text-xl font-semibold">
                Murojaatlar statistikasi
              </h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-end gap-2">
                  <span className="font-semibold text-yellow-600">Yangi:</span>
                  <div className="flex-1 border-b border-dashed border-yellow-300" />
                  <span className="ml-auto font-medium">{stats.new}</span>
                </li>
                <li className="flex items-end gap-2">
                  <span className="font-semibold text-blue-600">Qabul qilindi:</span>
                  <div className="flex-1 border-b border-dashed border-blue-300" />
                  <span className="ml-auto font-medium">{stats.accepted}</span>
                </li>
                <li className="flex items-end gap-2">
                  <span className="font-semibold text-green-600">Bajarildi:</span>
                  <div className="flex-1 border-b border-dashed border-green-300" />
                  <span className="ml-auto font-medium">{stats.completed}</span>
                </li>
                <li className="flex items-end gap-2">
                  <span className="font-semibold">Umumiy:</span>
                  <div className="flex-1 border-b border-dashed border-gray-300" />
                  <span className="ml-auto font-semibold">{stats.total}</span>
                </li>
              </ul>
            </div>

            {/* Selected contact detail */}
            {selectedContact && (
              <div className="rounded-2xl bg-gray-50 p-4 text-gray-900 md:p-6 lg:rounded-3xl space-y-4 lg:sticky lg:top-24">
                <div className="flex items-center justify-between">
                  <h5 className="font-serif text-lg font-semibold">Xabar tafsiloti</h5>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    Yopish
                  </button>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-400">Ism:</span>
                    <p className="font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="font-medium">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <span className="text-gray-400">Telefon:</span>
                      <p className="font-medium">{selectedContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Mavzu:</span>
                    <p className="font-medium">{selectedContact.subject}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Xabar:</span>
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{selectedContact.message}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Sana:</span>
                    <p className="font-medium">{format(new Date(selectedContact.created_at), "dd.MM.yyyy HH:mm")}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedContact.status)}</div>
                  </div>
                  {selectedContact.attachment_url && (
                    <div>
                      <span className="text-gray-400">Biriktirma:</span>
                      <a
                        href={selectedContact.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block"
                      >
                        <div className="max-w-sm max-h-64 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          <img
                            src={selectedContact.attachment_url}
                            alt="Biriktirma"
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </a>
                    </div>
                  )}
                </div>

                {/* Status change buttons */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs text-gray-400 font-medium">Statusni o&apos;zgartirish:</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((key) => {
                      const config = STATUS_CONFIG[key];
                      const isActive = (selectedContact.status || "new") === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleStatusChange(selectedContact, key)}
                          disabled={isActive}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                            isActive
                              ? `${config.bg} ${config.color} ring-1 ring-current cursor-default`
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <a
                    href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                    className="flex items-center gap-1.5 rounded-full border border-[#00575B] px-4 py-2 text-xs font-medium text-[#00575B] hover:bg-[#00575B] hover:text-white transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Javob berish
                  </a>
                  <button
                    onClick={() => handleDelete(selectedContact.id)}
                    className="flex items-center gap-1.5 rounded-full border border-red-400 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    O&apos;chirish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
