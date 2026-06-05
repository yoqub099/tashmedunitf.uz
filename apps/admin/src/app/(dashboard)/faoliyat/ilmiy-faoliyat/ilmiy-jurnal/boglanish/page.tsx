import StaticPageAdmin from "@/components/templates/StaticPageAdmin";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bog'lanish — Ilmiy jurnal — Admin",
};

const contacts = [
  {
    title: "Ilmiy jurnal tahririyati",
    items: [
      { icon: "location", text: "Termiz shahar, Al-Termiziy ko'chasi 31, 3-bino, 204-xona" },
      { icon: "phone", text: "+998 76 223 00 01 (ichki: 204)" },
      { icon: "email", text: "jurnal@tdtutf.uz" },
    ],
  },
  {
    title: "ToshDTU Termiz filiali",
    items: [
      { icon: "location", text: "Termiz shahar, Al-Termiziy ko'chasi 31" },
      { icon: "phone", text: "+998 76 223 00 01" },
      { icon: "email", text: "info@tdtutf.uz" },
    ],
  },
];

const officeHours = [
  { day: "Dushanba – Juma", time: "09:00 – 17:00" },
  { day: "Shanba", time: "09:00 – 13:00" },
  { day: "Yakshanba", time: "Dam olish kuni" },
];

const quickLinks = [
  { label: "Bosh sahifa", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal" },
  { label: "Jurnal haqida", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/jurnal-haqida" },
  { label: "Nashrlar", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/nashrlar" },
  { label: "Yo'riqnoma", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/yoriqnoma" },
];

function LocationIcon() {
  return (
    <svg className="w-5 h-5 text-[#00575B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-[#00575B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-[#00575B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function getIcon(type: string) {
  switch (type) {
    case "location": return <LocationIcon />;
    case "phone": return <PhoneIcon />;
    case "email": return <EmailIcon />;
    default: return null;
  }
}

export default function BoglanishAdminPage() {
  return (
    <StaticPageAdmin
      slug="ilmiy-jurnal-boglanish"
      title="Bog'lanish"
      description="Tahririyat aloqa ma'lumotlari"
      breadcrumbItems={[
        { label: "Faoliyat", href: "/faoliyat" },
        { label: "Ilmiy faoliyat", href: "/faoliyat/ilmiy-faoliyat" },
        { label: "Ilmiy jurnal", href: "/faoliyat/ilmiy-faoliyat/ilmiy-jurnal" },
        { label: "Bog'lanish" },
      ]}
    >
      {/* ═══════ Contact cards ═══════ */}
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-[#00575B] mb-4">
          Joylashuv
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.title}
              className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl space-y-4"
            >
              <h4 className="font-bold text-gray-900 text-base">
                {contact.title}
              </h4>
              <div className="space-y-3">
                {contact.items.map((item) => (
                  <div key={item.text} className="flex items-start gap-3">
                    {getIcon(item.icon)}
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ Map placeholder ═══════ */}
      <div className="rounded-2xl bg-gray-100 p-4 lg:rounded-3xl mb-6 h-64 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Xarita (Leaflet) — faqat frontend sahifada ko&apos;rinadi</p>
      </div>

      {/* ═══════ Office hours + Quick links ═══════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
          <h4 className="font-bold text-gray-900 text-base mb-4">
            Ish vaqti
          </h4>
          <div className="space-y-3">
            {officeHours.map((h) => (
              <div key={h.day} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-medium">{h.day}</span>
                <span className="text-gray-500">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gray-100 p-4 md:p-6 lg:rounded-3xl">
          <h4 className="font-bold text-gray-900 text-base mb-4">
            Tezkor havolalar
          </h4>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <span
                key={link.label}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#00575B] border border-[#00575B]/20"
              >
                {link.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </StaticPageAdmin>
  );
}
