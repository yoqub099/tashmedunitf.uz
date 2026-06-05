import { redirect } from "next/navigation";

/**
 * Orphan route — navigation doesn't link here.
 * Active admin tadbirlar page is `/yangiliklar/tadbirlar`.
 * Redirect to avoid code duplication (300+ line copy-paste).
 */
export default function TadbirlarRedirect() {
  redirect("/yangiliklar/tadbirlar");
}
