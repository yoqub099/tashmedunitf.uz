import DirectionDetailPage from "@/components/directions/DirectionDetailPage";
import { buildDirectionMetadata, loadDirectionPage } from "@/lib/abiturient-helpers";
import type { Metadata } from "next";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return buildDirectionMetadata(id, "magistratura");
}

export default async function MagistraturaDirectionPage({ params }: PageProps) {
  const { id } = await params;
  const data = await loadDirectionPage(id, "magistratura");
  if (!data) return null;
  return <DirectionDetailPage {...data} />;
}
