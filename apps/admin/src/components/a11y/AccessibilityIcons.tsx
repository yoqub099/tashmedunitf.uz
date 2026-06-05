import type { SVGProps } from "react";

const COMMON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "data-a11y-ui-icon": "true",
};

export function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function ResetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function TextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M4 7V4h16v3" />
      <path d="M9 20h6" />
      <path d="M12 4v16" />
    </svg>
  );
}

export function PaletteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

export function SpacingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M3 8h18" />
      <path d="M3 16h18" />
      <path d="M7 4l-4 4 4 4" />
      <path d="M17 12l4 4-4 4" />
    </svg>
  );
}

export function LineHeightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

export function FontIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...COMMON_PROPS} {...props} aria-hidden="true">
      <path d="M4 20V7h6" />
      <path d="M14 20V4h6" />
      <path d="M4 13h6" />
      <path d="M14 14h6" />
    </svg>
  );
}
