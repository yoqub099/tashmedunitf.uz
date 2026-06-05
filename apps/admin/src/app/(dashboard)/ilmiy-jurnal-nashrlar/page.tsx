import JournalIssuesCrudAdmin from "@/components/templates/JournalIssuesCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ilmiy jurnal nashrlari — Admin",
  description: "Jurnal sonlari va PDF fayllari boshqaruvi",
};

export default function IlmiyJurnalNashrlarPage() {
  return <JournalIssuesCrudAdmin />;
}
