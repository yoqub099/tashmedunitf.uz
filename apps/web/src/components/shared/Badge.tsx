import { cn } from "@/lib/utils";

interface BadgeProps {
  children: string;
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" && "bg-gray-100 text-gray-700",
        variant === "primary" && "bg-blue-100 text-blue-700",
        variant === "success" && "bg-green-100 text-green-700",
        variant === "warning" && "bg-yellow-100 text-yellow-700",
        className
      )}
    >
      {children}
    </span>
  );
}
