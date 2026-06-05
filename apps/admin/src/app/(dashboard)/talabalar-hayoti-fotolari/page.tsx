import StudentLifePhotosCrudAdmin from "@/components/templates/StudentLifePhotosCrudAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talabalar hayoti — Admin",
  description: "Universitet hayotidan rasmlar gallereyasi",
};

export default function TalabalarHayotiFotolariPage() {
  return <StudentLifePhotosCrudAdmin />;
}
