"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { usePasswordGuard } from "@/hooks/usePasswordGuard";

/**
 * Vaqtinchalik UI guard — navbar dropdown'larida yangi sahifa qo'shish tugmasi.
 * Parol "09" — usePasswordGuard hook orqali tasdiqlanadi.
 */
interface Props {
  href: string;
  onClose?: () => void;
  className?: string;
  iconSize?: "sm" | "md";
  label?: string;
}

export default function AddPageGuardedButton({
  href,
  onClose,
  className,
  iconSize = "md",
  label = "Yangi sahifa qo'shish",
}: Props) {
  const router = useRouter();
  // Bir xil sessionKey — sahifalar bo'limi uchun bitta unlock
  const { guard, modal } = usePasswordGuard("09", "admin:sahifalar:unlock");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    guard(
      () => {
        onClose?.();
        router.push(href);
      },
      {
        title: "Yangi sahifa qo'shish",
        description: "Davom etish uchun parolni kiriting",
      }
    );
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        <Plus className={iconSize === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
        {label}
      </button>
      {modal}
    </>
  );
}
