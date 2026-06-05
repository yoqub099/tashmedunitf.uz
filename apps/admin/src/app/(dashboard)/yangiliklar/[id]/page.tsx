import NewsDetailAdmin from "@/components/templates/NewsDetailAdmin";

export default function NewsDetailPage(props: { params: Promise<{ id: string }> }) {
  return <NewsDetailAdmin params={props.params} />;
}
