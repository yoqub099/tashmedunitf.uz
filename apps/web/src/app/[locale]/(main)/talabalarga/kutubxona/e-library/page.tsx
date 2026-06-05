import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "E-Library",
    robots: { index: false, follow: true },
  };
}

export default function ELibraryRedirect() {
  redirect("https://unilibrary.uz/");
}
