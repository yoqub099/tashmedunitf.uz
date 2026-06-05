"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText, Film, ImageOff, Trash2, RefreshCw, ZoomIn } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import type { MediaUploaderProps } from "@/types/inline-edit";

export default function MediaUploader({
  accept = "image/*",
  multiple = false,
  value,
  onChange,
  label = "Fayl yuklash",
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (multiple) {
        // Append new files to existing items (URLs + Files)
        const existing = Array.isArray(value) ? value : value ? [value] : [];
        onChange([...existing, ...files]);
      } else {
        onChange(files[0] || null);
      }
    },
    [multiple, onChange, value]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (multiple) {
        // Append new files to existing items (URLs + Files)
        const existing = Array.isArray(value) ? value : value ? [value] : [];
        onChange([...existing, ...files]);
      } else {
        onChange(files[0] || null);
      }
      // Reset img error when new file selected
      setImgError(false);
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [multiple, onChange, value]
  );

  const handleRemove = useCallback(() => {
    onChange(null);
    setImgError(false);
  }, [onChange]);

  const getPreviewUrl = (file: File | string): string => {
    if (typeof file === "string") return file;
    return URL.createObjectURL(file);
  };

  const isImageFile = (file: File | string): boolean => {
    if (typeof file === "string") {
      // Check common image extensions, ignore query params
      const path = file.split("?")[0];
      return /\.(jpg|jpeg|png|gif|webp|svg|avif|bmp)$/i.test(path);
    }
    return file.type.startsWith("image/");
  };

  const isVideoFile = (file: File | string): boolean => {
    if (typeof file === "string") {
      const path = file.split("?")[0];
      return /\.(mp4|webm|ogg)$/i.test(path);
    }
    return file.type.startsWith("video/");
  };

  const getFileName = (file: File | string): string => {
    if (typeof file === "string") {
      try {
        const url = new URL(file);
        const parts = url.pathname.split("/");
        return decodeURIComponent(parts[parts.length - 1] || "fayl");
      } catch {
        return file.split("/").pop() || "fayl";
      }
    }
    return file.name;
  };

  // Determine what we have
  const existingUrl = typeof value === "string" && value.length > 0 ? value : null;
  const newFile = value instanceof File ? value : null;
  const hasContent = existingUrl !== null || newFile !== null || (Array.isArray(value) && value.length > 0);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      {/* Existing URL indicator — shown when editing existing media */}
      {existingUrl && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3">
          {/* Thumbnail */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            {isImageFile(existingUrl) && !imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={existingUrl}
                alt="Mavjud rasm"
                className="h-full w-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : isImageFile(existingUrl) && imgError ? (
              <div className="flex h-full w-full items-center justify-center">
                <ImageOff className="h-5 w-5 text-gray-400" />
              </div>
            ) : isVideoFile(existingUrl) ? (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="h-5 w-5 text-gray-400" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-blue-800">Mavjud fayl</p>
            <p className="mt-0.5 truncate text-xs text-blue-600" title={getFileName(existingUrl)}>
              {getFileName(existingUrl)}
            </p>
          </div>

          {/* Remove button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            O&apos;chirish
          </button>
        </div>
      )}

      {/* New file preview */}
      {newFile && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
            {isImageFile(newFile) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={URL.createObjectURL(newFile)}
                alt="Yangi rasm"
                className="h-full w-full object-cover"
              />
            ) : isVideoFile(newFile) ? (
              <div className="flex h-full w-full items-center justify-center">
                <Film className="h-5 w-5 text-gray-400" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-green-800">Yangi fayl</p>
            <p className="mt-0.5 truncate text-xs text-green-600">{newFile.name}</p>
            <p className="text-[10px] text-green-500">{formatFileSize(newFile.size)}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRemove();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-600"
          >
            <X className="h-3.5 w-3.5" />
            Bekor
          </button>
        </div>
      )}

      {/* Multiple files preview */}
      {Array.isArray(value) && value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {value.map((item, idx) => {
            const previewSrc = getPreviewUrl(item);
            const isExisting = typeof item === "string";
            return (
              <div
                key={idx}
                className="group relative aspect-square rounded-xl border border-gray-200 bg-gray-100 overflow-hidden"
              >
                {/* Image / video / file preview */}
                {isImageFile(item) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewSrc}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : isVideoFile(item) ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Film className="h-10 w-10 text-gray-400" />
                  </div>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center p-2">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <span className="mt-1 max-w-full truncate text-[10px] text-gray-500">
                      {getFileName(item)}
                    </span>
                  </div>
                )}

                {/* Status badge */}
                <span
                  className={cn(
                    "absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium shadow-sm",
                    isExisting
                      ? "bg-blue-500/90 text-white"
                      : "bg-green-500/90 text-white"
                  )}
                >
                  {isExisting ? "Mavjud" : "Yangi"}
                </span>

                {/* File size badge for new files */}
                {!isExisting && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] text-white">
                    {formatFileSize((item as File).size)}
                  </span>
                )}

                {/* Hover overlay with actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {/* Preview / zoom button */}
                  {isImageFile(item) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setPreviewImage(previewSrc);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white"
                      title="Ko'rish"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  )}

                  {/* Replace button */}
                  <label
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition-colors hover:bg-white"
                    title="Almashtirish"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RefreshCw className="h-4 w-4" />
                    <input
                      type="file"
                      accept={accept}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const updated = [...(value as (File | string)[])];
                          updated[idx] = file;
                          onChange(updated);
                        }
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      const updated = (value as (File | string)[]).filter((_, i) => i !== idx);
                      onChange(updated.length > 0 ? updated : null);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/90 text-white shadow-md transition-colors hover:bg-red-600"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen image preview modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40"
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Drop zone — always show for uploading new/replacement file */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors",
          hasContent ? "p-4" : "p-6",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        )}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload
          className={cn(
            "mb-2",
            hasContent ? "w-6 h-6" : "w-8 h-8",
            isDragging ? "text-blue-500" : "text-gray-400"
          )}
        />
        <p className={cn("text-gray-600 text-center", hasContent ? "text-xs" : "text-sm")}>
          <span className="text-blue-700 font-medium">
            {hasContent
              ? multiple
                ? "Yana qo'shish uchun tanlang"
                : "Almashtirish uchun tanlang"
              : "Fayl tanlang"}
          </span>
          {!hasContent && " yoki shu yerga tashlang"}
        </p>
        {!hasContent && (
          <p className="text-xs text-gray-400 mt-1">
            {accept === "image/*"
              ? "JPG, PNG, WebP, GIF"
              : accept === "video/*"
              ? "MP4, WebM"
              : accept}
          </p>
        )}
      </div>
    </div>
  );
}
