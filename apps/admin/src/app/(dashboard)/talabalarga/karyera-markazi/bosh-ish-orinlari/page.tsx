import { redirect } from "next/navigation";

/**
 * Bu sahifa admin panelda ish arizalarini boshqarish joyiga yo'naltirilgan.
 * `/ish-arizalari` — haqiqiy CRUD inbox.
 */
export default function BoshIshOrinlariRedirect() {
  redirect("/ish-arizalari");
}
