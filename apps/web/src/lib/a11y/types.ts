export type A11yFontSize = "small" | "medium" | "large";
export type A11yScheme = "default" | "bw" | "wb" | "yb" | "by" | "sepia";
export type A11yLetterSpacing = "normal" | "wide" | "extra-wide";
export type A11yLineHeight = "normal" | "comfortable";
export type A11yFontFamily = "sans" | "serif";

export interface A11ySettings {
  fontSize: A11yFontSize;
  scheme: A11yScheme;
  letterSpacing: A11yLetterSpacing;
  lineHeight: A11yLineHeight;
  fontFamily: A11yFontFamily;
  imagesVisible: boolean;
  enabled: boolean;
  version: number;
}

export const A11Y_VERSION = 1;
export const A11Y_STORAGE_KEY = "tmtu:a11y";

export const FONT_SIZES: A11yFontSize[] = ["small", "medium", "large"];
export const SCHEMES: A11yScheme[] = ["default", "bw", "wb", "yb", "by", "sepia"];
export const LETTER_SPACINGS: A11yLetterSpacing[] = ["normal", "wide", "extra-wide"];
export const LINE_HEIGHTS: A11yLineHeight[] = ["normal", "comfortable"];
export const FONT_FAMILIES: A11yFontFamily[] = ["sans", "serif"];
