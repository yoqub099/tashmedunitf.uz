"use client";

import AdminJournalNavbar from "@/components/journal/AdminJournalNavbar";

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminJournalNavbar />
      {children}
    </>
  );
}
