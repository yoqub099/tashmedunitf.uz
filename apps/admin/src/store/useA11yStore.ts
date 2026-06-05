"use client";

import { create } from "zustand";
import {
  type A11ySettings,
  type A11yFontSize,
  type A11yScheme,
  type A11yLetterSpacing,
  type A11yLineHeight,
  type A11yFontFamily,
  A11Y_VERSION,
} from "@/lib/a11y/types";
import { DEFAULT_A11Y_SETTINGS } from "@/lib/a11y/defaults";
import { applySettings } from "@/lib/a11y/apply";
import { saveToStorage } from "@/lib/a11y/storage";

interface A11yStore extends A11ySettings {
  isPanelOpen: boolean;
  isHydrated: boolean;
  lastChange: string | null;
  setFontSize: (v: A11yFontSize) => void;
  setScheme: (v: A11yScheme) => void;
  setLetterSpacing: (v: A11yLetterSpacing) => void;
  setLineHeight: (v: A11yLineHeight) => void;
  setFontFamily: (v: A11yFontFamily) => void;
  setImagesVisible: (v: boolean) => void;
  setEnabled: (v: boolean) => void;
  reset: () => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  hydrate: (settings: A11ySettings) => void;
}

function persist(state: A11ySettings, lastChange: string): void {
  saveToStorage(state);
  applySettings(state);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("a11y:change", { detail: { state, lastChange } })
    );
  }
}

function pickSettings(state: A11yStore): A11ySettings {
  return {
    fontSize: state.fontSize,
    scheme: state.scheme,
    letterSpacing: state.letterSpacing,
    lineHeight: state.lineHeight,
    fontFamily: state.fontFamily,
    imagesVisible: state.imagesVisible,
    enabled: state.enabled,
    version: state.version,
  };
}

export const useA11yStore = create<A11yStore>()((set, get) => ({
  ...DEFAULT_A11Y_SETTINGS,
  isPanelOpen: false,
  isHydrated: false,
  lastChange: null,

  setFontSize: (fontSize) => {
    set({ fontSize, enabled: true, lastChange: "fontSize" });
    persist(pickSettings({ ...get(), fontSize, enabled: true }), "fontSize");
  },
  setScheme: (scheme) => {
    set({ scheme, enabled: true, lastChange: "scheme" });
    persist(pickSettings({ ...get(), scheme, enabled: true }), "scheme");
  },
  setLetterSpacing: (letterSpacing) => {
    set({ letterSpacing, enabled: true, lastChange: "letterSpacing" });
    persist(pickSettings({ ...get(), letterSpacing, enabled: true }), "letterSpacing");
  },
  setLineHeight: (lineHeight) => {
    set({ lineHeight, enabled: true, lastChange: "lineHeight" });
    persist(pickSettings({ ...get(), lineHeight, enabled: true }), "lineHeight");
  },
  setFontFamily: (fontFamily) => {
    set({ fontFamily, enabled: true, lastChange: "fontFamily" });
    persist(pickSettings({ ...get(), fontFamily, enabled: true }), "fontFamily");
  },
  setImagesVisible: (imagesVisible) => {
    set({ imagesVisible, enabled: true, lastChange: "imagesVisible" });
    persist(pickSettings({ ...get(), imagesVisible, enabled: true }), "imagesVisible");
  },
  setEnabled: (enabled) => {
    set({ enabled, lastChange: enabled ? "enabled" : "disabled" });
    persist(pickSettings({ ...get(), enabled }), enabled ? "enabled" : "disabled");
  },
  reset: () => {
    const fresh: A11ySettings = { ...DEFAULT_A11Y_SETTINGS, enabled: false, version: A11Y_VERSION };
    set({ ...fresh, lastChange: "reset" });
    persist(fresh, "reset");
  },
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  hydrate: (settings) => set({ ...settings, isHydrated: true }),
}));
