"use client";

import { useEffect } from "react";

export default function EmeraldRedirect() {
  useEffect(() => {
    window.location.replace("https://www.emerald.com/");
  }, []);
  return null;
}
