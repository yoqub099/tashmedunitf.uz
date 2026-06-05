import { A11Y_LABELS } from "@/lib/a11y/labels";

export default function SkipToContent() {
  return (
    <a href="#main-content" className="a11y-skip-link" data-a11y-ui="true">
      {A11Y_LABELS.skip}
    </a>
  );
}
