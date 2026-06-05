import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-6 sm:mb-8 lg:mb-10",
        align === "center" && "text-center",
        className
      )}
    >
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}
