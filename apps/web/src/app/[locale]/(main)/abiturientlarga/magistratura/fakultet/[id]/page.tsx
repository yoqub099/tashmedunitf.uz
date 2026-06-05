import FacultyDetailPage from "@/components/directions/FacultyDetailPage";
import { buildFacultyMetadata, loadFacultyPage } from "@/lib/abiturient-helpers";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return buildFacultyMetadata(id, "magistratura");
}

export default async function MagistraturaFacultyPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadFacultyPage(id, "magistratura");
  if (!data) return null;
  return <FacultyDetailPage {...data} />;
}
