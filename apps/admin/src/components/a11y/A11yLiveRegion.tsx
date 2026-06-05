"use client";

import { useEffect, useState } from "react";
import { useA11yStore } from "@/store/useA11yStore";
import { A11Y_LABELS } from "@/lib/a11y/labels";

export default function A11yLiveRegion() {
  const lastChange = useA11yStore((st) => st.lastChange);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!lastChange) return;
    let msg: string;
    if (lastChange === "reset") msg = A11Y_LABELS.announceReset;
    else if (lastChange === "enabled") msg = A11Y_LABELS.announceOpened;
    else msg = A11Y_LABELS.announceChanged;
    setMessage(msg);
    const t = setTimeout(() => setMessage(""), 1500);
    return () => clearTimeout(t);
  }, [lastChange]);

  return (
    <div
      className="a11y-sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-a11y-ui="true"
    >
      {message}
    </div>
  );
}
