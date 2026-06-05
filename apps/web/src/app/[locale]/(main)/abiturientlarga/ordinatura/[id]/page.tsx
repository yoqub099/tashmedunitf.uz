import DirectionDetailPage from "@/components/directions/DirectionDetailPage";
import { buildDirectionMetadata, loadDirectionPage } from "@/lib/abiturient-helpers";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return buildDirectionMetadata(id, "ordinatura");
}

export default async function OrdinaturaDirectionPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadDirectionPage(id, "ordinatura");
  if (!data) return null;
  return <DirectionDetailPage {...data} />;
}
