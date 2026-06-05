"use client";

import { useState } from "react";
import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { useSiteContents, useUpsertSiteContent, useDeleteSiteContent } from "@/hooks/useSiteContents";
import { Pencil, Trash2, Plus, ExternalLink, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

/* Brand SVG Icons */
function TelegramSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
    </svg>
  );
}
function InstagramSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
      <path d="M12 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z" />
      <circle cx="16.806" cy="7.207" r="1.078" />
      <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z" />
    </svg>
  );
}
function FacebookSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
      <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
    </svg>
  );
}
function YouTubeSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
      <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z" />
    </svg>
  );
}
function LinkedInSvg() {
  return (
    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
    </svg>
  );
}

const SOCIAL_PLATFORMS: { key: string; label: string; color: string; bgClass: string; icon: () => React.JSX.Element }[] = [
  { key: "social_telegram",  label: "Telegram",  color: "#26A5E4", bgClass: "bg-[#26A5E4]", icon: TelegramSvg },
  { key: "social_instagram", label: "Instagram", color: "#E4405F", bgClass: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]", icon: InstagramSvg },
  { key: "social_facebook",  label: "Facebook",  color: "#1877F2", bgClass: "bg-[#1877F2]", icon: FacebookSvg },
  { key: "social_youtube",   label: "YouTube",   color: "#FF0000", bgClass: "bg-[#FF0000]", icon: YouTubeSvg },
  { key: "social_linkedin",  label: "LinkedIn",  color: "#0A66C2", bgClass: "bg-[#0A66C2]", icon: LinkedInSvg },
];

export default function SocialLinksPage() {
  const { data: contents, isLoading, refetch } = useSiteContents("social");
  const upsert = useUpsertSiteContent();
  const deleteMutation = useDeleteSiteContent();

  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [addKey, setAddKey] = useState<string | null>(null);
  const [addValue, setAddValue] = useState("");
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  const socialItems = Array.isArray(contents) ? contents : [];

  const getLink = (key: string): string => {
    const item = socialItems.find((c) => c.key === key);
    return item?.value?.uz || "";
  };

  const handleSave = async (key: string, url: string) => {
    const platform = SOCIAL_PLATFORMS.find((p) => p.key === key);
    if (!url.startsWith("http")) {
      toast.error("URL 'http' yoki 'https' bilan boshlanishi kerak");
      return;
    }
    await upsert.mutateAsync({
      key,
      section: "social",
      value: { uz: url, ru: url, en: url },
      type: "text",
    });
    setEditKey(null);
    setAddKey(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteKey) return;
    await deleteMutation.mutateAsync(deleteKey);
    setDeleteKey(null);
    refetch();
  };

  if (isLoading) {
    return (
      <section className="py-8">
        <Container>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gray-200" />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-8">
      <Container>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold md:text-3xl">
            Ijtimoiy tarmoqlar
          </h1>
        </div>

        <Breadcrumb
          items={[{ label: "Boshqaruv" }, { label: "Ijtimoiy tarmoqlar" }]}
          className="mt-3"
        />

        <div className="mt-8 space-y-4">
          {SOCIAL_PLATFORMS.map((platform) => {
            const currentUrl = getLink(platform.key);
            const isEditing = editKey === platform.key;
            const isAdding = addKey === platform.key && !currentUrl;
            const hasLink = !!currentUrl;

            return (
              <div
                key={platform.key}
                className="rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  {/* Platform icon */}
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${platform.bgClass}`}
                  >
                    <platform.icon />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{platform.label}</h3>

                    {isEditing || isAdding ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="url"
                          value={isEditing ? editValue : addValue}
                          onChange={(e) => isEditing ? setEditValue(e.target.value) : setAddValue(e.target.value)}
                          placeholder={`https://${platform.label.toLowerCase()}.com/...`}
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#00575B] focus:outline-none focus:ring-1 focus:ring-[#00575B]"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSave(platform.key, isEditing ? editValue : addValue)}
                          disabled={upsert.isPending}
                          className="rounded-lg bg-[#00575B] p-2 text-white hover:bg-[#003d40] disabled:opacity-50"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => { setEditKey(null); setAddKey(null); }}
                          className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : hasLink ? (
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 flex items-center gap-1 text-sm text-gray-500 hover:text-[#00575B] transition-colors truncate"
                      >
                        {currentUrl}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">Link qo&apos;shilmagan</p>
                    )}
                  </div>

                  {/* Actions */}
                  {!isEditing && !isAdding && (
                    <div className="flex items-center gap-2">
                      {hasLink ? (
                        <>
                          <button
                            onClick={() => { setEditKey(platform.key); setEditValue(currentUrl); }}
                            className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition"
                            title="Tahrirlash"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteKey(platform.key)}
                            className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100 transition"
                            title="O'chirish"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setAddKey(platform.key); setAddValue(""); }}
                          className="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-100 transition flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Qo&apos;shish
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete confirm */}
        <ConfirmDialog
          isOpen={!!deleteKey}
          onClose={() => setDeleteKey(null)}
          onConfirm={handleDelete}
          title="Linkni o'chirish"
          message={`${SOCIAL_PLATFORMS.find((p) => p.key === deleteKey)?.label || ""} linkini o'chirmoqchimisiz?`}
          isLoading={deleteMutation.isPending}
        />
      </Container>
    </section>
  );
}
