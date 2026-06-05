import { redirect } from "next/navigation";

/**
 * Orphan route — navigation links to `/yangiliklar/konferensiyalar`.
 * Redirect to avoid 300+ line copy-paste maintenance.
 */
export default function KonferensiyalarRedirect() {
  redirect("/yangiliklar/konferensiyalar");
}
