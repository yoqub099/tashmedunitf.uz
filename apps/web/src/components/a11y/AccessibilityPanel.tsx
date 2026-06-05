"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useA11yStore } from "@/store/useA11yStore";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { s, type Language } from "@/lib/i18n";
import { CloseIcon, ResetIcon, CheckIcon } from "./AccessibilityIcons";
import A11yLiveRegion from "./A11yLiveRegion";
import type {
  A11yFontSize,
  A11yScheme,
  A11yLetterSpacing,
  A11yLineHeight,
  A11yFontFamily,
} from "@/lib/a11y/types";

interface PanelProps {
  lang: Language;
  showImagesSection?: boolean;
}

const SCHEME_PREVIEW: Record<A11yScheme, { bg: string; fg: string; accent: string; label: string }> = {
  default: { bg: "#ffffff", fg: "#111827", accent: "#00575b", label: "Aa" },
  bw:      { bg: "#ffffff", fg: "#000000", accent: "#000000", label: "Aa" },
  wb:      { bg: "#000000", fg: "#ffffff", accent: "#ffffff", label: "Aa" },
  yb:      { bg: "#000000", fg: "#ffff00", accent: "#ffff00", label: "Aa" },
  by:      { bg: "#003366", fg: "#ffff00", accent: "#ffff00", label: "Aa" },
  sepia:   { bg: "#f4ecd8", fg: "#5b4636", accent: "#704214", label: "Aa" },
};

export default function AccessibilityPanel({ lang, showImagesSection = true }: PanelProps) {
  const isPanelOpen = useA11yStore((st) => st.isPanelOpen);
  const closePanel = useA11yStore((st) => st.closePanel);
  const fontSize = useA11yStore((st) => st.fontSize);
  const scheme = useA11yStore((st) => st.scheme);
  const letterSpacing = useA11yStore((st) => st.letterSpacing);
  const lineHeight = useA11yStore((st) => st.lineHeight);
  const fontFamily = useA11yStore((st) => st.fontFamily);
  const imagesVisible = useA11yStore((st) => st.imagesVisible);
  const setFontSize = useA11yStore((st) => st.setFontSize);
  const setScheme = useA11yStore((st) => st.setScheme);
  const setLetterSpacing = useA11yStore((st) => st.setLetterSpacing);
  const setLineHeight = useA11yStore((st) => st.setLineHeight);
  const setFontFamily = useA11yStore((st) => st.setFontFamily);
  const setImagesVisible = useA11yStore((st) => st.setImagesVisible);
  const reset = useA11yStore((st) => st.reset);
  const reducedMotion = useReducedMotion();

  const trapRef = useFocusTrap<HTMLDivElement>(isPanelOpen);
  useEscapeKey(closePanel, isPanelOpen);

  useEffect(() => {
    if (!isPanelOpen) return;
    if (typeof document === "undefined") return;
    const previousOverflow = document.body.style.overflow;
    const isMobile = window.matchMedia("(max-width: 480px)").matches;
    if (isMobile) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPanelOpen]);

  if (typeof document === "undefined") return null;

  const isMobile =
    typeof window !== "undefined" && window.matchMedia("(max-width: 480px)").matches;

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

  return createPortal(
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {isMobile && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="a11y-panel-backdrop"
              data-a11y-ui="true"
              aria-hidden="true"
              onClick={closePanel}
            />
          )}
          <motion.div
            key="panel"
            ref={trapRef}
            initial={{ opacity: 0, x: -24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -24, scale: 0.96 }}
            transition={transition}
            className="a11y-panel a11y-panel-modern"
            data-a11y-ui="true"
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-panel-title"
            aria-describedby="a11y-panel-subtitle"
          >
            <A11yLiveRegion lang={lang} />

            {/* ─── Header ─── */}
            <header data-a11y-ui="true" className="a11y-panel-header">
              <div data-a11y-ui="true" className="a11y-panel-header-bg" aria-hidden="true" />
              <div data-a11y-ui="true" className="a11y-panel-header-content">
                <div data-a11y-ui="true" className="a11y-panel-header-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" data-a11y-ui-icon="true">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                  </svg>
                </div>
                <div data-a11y-ui="true" style={{ flex: 1, minWidth: 0 }}>
                  <h2 id="a11y-panel-title" data-a11y-ui="true" className="a11y-panel-title">
                    {s("a11y.title", lang)}
                  </h2>
                  <p id="a11y-panel-subtitle" data-a11y-ui="true" className="a11y-panel-subtitle">
                    WCAG 2.1 AA · O'zbekiston davlat saytlari
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePanel}
                  data-a11y-ui="true"
                  aria-label={s("a11y.close", lang)}
                  className="a11y-panel-close"
                >
                  <CloseIcon width={18} height={18} />
                </button>
              </div>
            </header>

            {/* ─── Content ─── */}
            <div data-a11y-ui="true" className="a11y-panel-content">
              {/* Font size */}
              <Section number={1} title={s("a11y.font_size", lang)}>
                <div data-a11y-ui="true" className="a11y-segmented">
                  {(["small", "medium", "large"] as A11yFontSize[]).map((v) => {
                    const active = fontSize === v;
                    const fs = v === "small" ? 12 : v === "medium" ? 16 : 22;
                    const labelKey = `a11y.font_size.${v}`;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setFontSize(v)}
                        data-a11y-ui="true"
                        className={`a11y-segment ${active ? "is-active" : ""}`}
                      >
                        <span data-a11y-ui="true" style={{ fontSize: fs, fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>
                          Aa
                        </span>
                        <span data-a11y-ui="true" className="a11y-segment-label">
                          {s(labelKey, lang)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Color schemes */}
              <Section number={2} title={s("a11y.scheme", lang)}>
                <div data-a11y-ui="true" className="a11y-scheme-grid">
                  {(Object.keys(SCHEME_PREVIEW) as A11yScheme[]).map((v) => {
                    const preview = SCHEME_PREVIEW[v];
                    const active = scheme === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setScheme(v)}
                        data-a11y-ui="true"
                        className={`a11y-scheme-card ${active ? "is-active" : ""}`}
                      >
                        <span
                          data-a11y-ui="true"
                          aria-hidden="true"
                          className="a11y-scheme-preview"
                          style={{ background: preview.bg, color: preview.fg, borderColor: active ? preview.accent : "transparent" }}
                        >
                          <span data-a11y-ui="true" className="a11y-scheme-preview-bar" style={{ background: preview.accent, opacity: 0.8 }} />
                          <span data-a11y-ui="true" className="a11y-scheme-preview-text">{preview.label}</span>
                          <span data-a11y-ui="true" className="a11y-scheme-preview-line" style={{ background: preview.fg, opacity: 0.4 }} />
                          <span data-a11y-ui="true" className="a11y-scheme-preview-line" style={{ background: preview.fg, opacity: 0.25, width: "60%" }} />
                        </span>
                        {active && (
                          <span data-a11y-ui="true" className="a11y-scheme-check" aria-hidden="true">
                            <CheckIcon width={12} height={12} />
                          </span>
                        )}
                        <span data-a11y-ui="true" className="a11y-scheme-name">
                          {s(`a11y.scheme.${v}`, lang)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Letter spacing */}
              <Section number={3} title={s("a11y.letter_spacing", lang)}>
                <div data-a11y-ui="true" className="a11y-segmented">
                  {(["normal", "wide", "extra-wide"] as A11yLetterSpacing[]).map((v) => {
                    const active = letterSpacing === v;
                    const ls = v === "normal" ? "normal" : v === "wide" ? "0.05em" : "0.12em";
                    const labelKey = v === "extra-wide" ? "a11y.letter_spacing.extra" : `a11y.letter_spacing.${v}`;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setLetterSpacing(v)}
                        data-a11y-ui="true"
                        className={`a11y-segment ${active ? "is-active" : ""}`}
                      >
                        <span data-a11y-ui="true" style={{ fontSize: 14, fontWeight: 600, letterSpacing: ls, marginBottom: 4 }}>
                          Aa Bb
                        </span>
                        <span data-a11y-ui="true" className="a11y-segment-label">
                          {s(labelKey, lang)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Line height */}
              <Section number={4} title={s("a11y.line_height", lang)}>
                <div data-a11y-ui="true" className="a11y-segmented" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  {(["normal", "comfortable"] as A11yLineHeight[]).map((v) => {
                    const active = lineHeight === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setLineHeight(v)}
                        data-a11y-ui="true"
                        className={`a11y-segment ${active ? "is-active" : ""}`}
                      >
                        <span data-a11y-ui="true" aria-hidden="true" style={{ display: "flex", flexDirection: "column", gap: v === "normal" ? 2 : 6, marginBottom: 4 }}>
                          <span data-a11y-ui="true" style={{ height: 2, width: 28, background: "currentColor", borderRadius: 1 }} />
                          <span data-a11y-ui="true" style={{ height: 2, width: 22, background: "currentColor", borderRadius: 1 }} />
                          <span data-a11y-ui="true" style={{ height: 2, width: 26, background: "currentColor", borderRadius: 1 }} />
                        </span>
                        <span data-a11y-ui="true" className="a11y-segment-label">
                          {s(`a11y.line_height.${v}`, lang)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Font family */}
              <Section number={5} title={s("a11y.font_family", lang)}>
                <div data-a11y-ui="true" className="a11y-segmented" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  {(["sans", "serif"] as A11yFontFamily[]).map((v) => {
                    const active = fontFamily === v;
                    const ff = v === "sans" ? "var(--font-inter), system-ui, sans-serif" : 'Georgia, "Times New Roman", serif';
                    return (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setFontFamily(v)}
                        data-a11y-ui="true"
                        className={`a11y-segment ${active ? "is-active" : ""}`}
                      >
                        <span data-a11y-ui="true" style={{ fontSize: 22, fontWeight: 700, fontFamily: ff, lineHeight: 1, marginBottom: 4 }}>
                          Aa
                        </span>
                        <span data-a11y-ui="true" className="a11y-segment-label">
                          {s(`a11y.font_family.${v}`, lang)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>

              {/* Images toggle */}
              {showImagesSection && (
                <Section number={6} title={s("a11y.images", lang)}>
                  <div
                    data-a11y-ui="true"
                    role="switch"
                    aria-checked={imagesVisible}
                    tabIndex={0}
                    onClick={() => setImagesVisible(!imagesVisible)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setImagesVisible(!imagesVisible);
                      }
                    }}
                    className={`a11y-toggle ${imagesVisible ? "is-on" : "is-off"}`}
                  >
                    <span data-a11y-ui="true" className="a11y-toggle-label">
                      {imagesVisible ? s("a11y.images.on", lang) : s("a11y.images.off", lang)}
                    </span>
                    <span data-a11y-ui="true" className="a11y-toggle-track" aria-hidden="true">
                      <span data-a11y-ui="true" className="a11y-toggle-thumb" />
                    </span>
                  </div>
                </Section>
              )}

              {/* Reset */}
              <button
                type="button"
                onClick={reset}
                data-a11y-ui="true"
                className="a11y-reset-btn"
              >
                <ResetIcon width={16} height={16} />
                <span data-a11y-ui="true">{s("a11y.reset", lang)}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section data-a11y-ui="true" className="a11y-section">
      <h3 data-a11y-ui="true" className="a11y-section-title">
        <span data-a11y-ui="true" className="a11y-section-number" aria-hidden="true">
          {number}
        </span>
        {title}
      </h3>
      {children}
    </section>
  );
}
