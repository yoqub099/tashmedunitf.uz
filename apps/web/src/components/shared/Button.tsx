import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        // Variant
        variant === "primary" &&
          "bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500",
        variant === "secondary" &&
          "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
        variant === "outline" &&
          "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
        variant === "ghost" &&
          "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
        // Size
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
