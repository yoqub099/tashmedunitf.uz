import { redirect } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Emerald",
    robots: { index: false, follow: true },
  };
}

export default function EmeraldRedirect() {
  redirect("https://www.emerald.com/");
}
