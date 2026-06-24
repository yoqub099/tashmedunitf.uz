"use client";

import { useEffect } from "react";
import { installGlobalErrorReporting } from "@/lib/errorReporter";

/**
 * Global JS xato tutuvchini o'rnatadi (/look kuzatuv markazi).
 * Root layout'da bir marta render qilinadi, hech narsa chizmaydi.
 */
export default function ErrorReporter() {
  useEffect(() => {
    installGlobalErrorReporting();
  }, []);

  return null;
}
