"use client";

import { useEffect } from "react";

export default function ELibraryRedirect() {
  useEffect(() => {
    window.location.replace("https://unilibrary.uz/");
  }, []);
  return null;
}
