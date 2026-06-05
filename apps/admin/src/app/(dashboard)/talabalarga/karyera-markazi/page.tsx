import KaryeraMarkaziAdmin from "./KaryeraMarkaziAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karyera markazi — Admin",
};

export default function KaryeraMarkaziPage() {
  return <KaryeraMarkaziAdmin />;
}
