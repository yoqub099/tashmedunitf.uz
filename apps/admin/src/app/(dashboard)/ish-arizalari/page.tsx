import JobApplicationsAdmin from "./JobApplicationsAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ish arizalari — Admin",
  description: "Ishga ariza berganlarni ko'rish va boshqarish",
};

export default function JobApplicationsPage() {
  return <JobApplicationsAdmin />;
}
