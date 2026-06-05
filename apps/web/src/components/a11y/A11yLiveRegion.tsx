"use client";

import { useEffect, useState } from "react";
import { useA11yStore } from "@/store/useA11yStore";
import { s, type Language } from "@/lib/i18n";

export default function A11yLiveRegion({ lang }: { lang: Language }) {
  const lastChange = useA11yStore((st) => st.lastChange);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!lastChange) return;
    let key: string;
    if (lastChange === "reset") key = "a11y.announce.reset";
    else if (lastChange === "enabled") key = "a11y.announce.opened";
    else key = "a11y.announce.changed";
    setMessage(s(key, lang));
    const t = setTimeout(() => setMessage(""), 1500);
    return () => clearTimeout(t);
  }, [lastChange, lang]);

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
