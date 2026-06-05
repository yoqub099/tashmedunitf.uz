"use client";

import Container from "@/components/shared/Container";
import Breadcrumb from "@/components/shared/Breadcrumb";
import Link from "@/components/shared/LocaleLink";
import dynamic from "next/dynamic";
import { useLanguageStore } from "@/store/useLanguageStore";
import { s } from "@/lib/i18n";

const ContactMap = dynamic(() => import("@/components/shared/ContactMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-gray-100">
      <div className="text-gray-400">{s("jp.contact_map_loading", "uz")}</div>
    </div>
  ),
});

export default function BoglanishPage() {
  const { language: lang } = useLanguageStore();

  const locations = [
    {
      name: s("jp.contact_loc1_name", lang),
      address: s("jp.contact_address", lang),
      phone: "+998 76 221-40-30",
      email: "jurnal@tdtutf.uz",
    },
    {
      name: s("jp.contact_loc2_name", lang),
      address: s("jp.contact_address", lang),
      phone: "+998 76 221-40-30",
      email: "info@tdtutf.uz",
    },
  ];

  const officeHours = [
    { day: s("jp.contact_day_weekdays", lang), time: "09:00 – 17:00" },
    { day: s("jp.contact_day_saturday", lang), time: "09:00 – 13:00" },
    { day: s("jp.contact_day_sunday", lang), time: s("jp.contact_day_off", lang) },
  ];

  return (
    <div className="space-y-16 md:space-y-20 pt-16 md:pt-20">
      <Container className="space-y-6 md:space-y-8">
        {/* ═══════ Joylashuv section (ISFT style) ═══════ */}
        <div className="rounded-2xl bg-gray-100 p-4 text-gray-900 md:p-6 lg:rounded-3xl">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row">
            <h3 className="font-serif text-2xl font-semibold lg:text-[32px]">
              {s("jp.contact_location", lang)}
            </h3>
          </div>

          <div className="mt-6">
            <div>
              <h4 className="font-serif text-2xl font-semibold">{s("jp.contact_city", lang)}</h4>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {locations.map((loc) => (
                  <div
                    key={loc.email}
                    className="flex flex-col space-y-2 rounded-2xl bg-white p-4 md:p-6 lg:rounded-3xl"
                  >
                    <h6 className="font-serif text-base font-semibold leading-tight text-[#00575B] lg:text-lg">
                      {loc.name}
                    </h6>

                    {/* Address */}
                    <p className="flex items-center gap-2">
                      <span className="flex-none">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 1024 1024"
                          height="20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M515.664-.368C305.76-.368 128 178.4 128 390.176c0 221.76 206.032 448.544 344.624 607.936.528.64 22.929 25.52 50.528 25.52h2.449c27.6 0 49.84-24.88 50.399-25.52 130.064-149.52 320-396.048 320-607.936C896 178.4 757.344-.368 515.664-.368zm12.832 955.552c-1.12 1.12-2.753 2.369-4.193 3.409-1.472-1.008-3.072-2.288-4.255-3.408l-16.737-19.248C371.92 785.2 192 578.785 192 390.176c0-177.008 148.224-326.56 323.664-326.56 218.528 0 316.336 164 316.336 326.56 0 143.184-102.128 333.296-303.504 565.008zm-15.377-761.776c-106.032 0-192 85.968-192 192s85.968 192 192 192 192-85.968 192-192-85.968-192-192-192zm0 320c-70.576 0-129.473-58.816-129.473-129.408 0-70.576 57.424-128 128-128 70.624 0 128 57.424 128 128 .032 70.592-55.903 129.408-126.527 129.408z" />
                        </svg>
                      </span>
                      <span className="text-container">{loc.address}</span>
                    </p>

                    {/* Phone */}
                    <p className="flex items-center gap-2">
                      <span className="flex-none">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 1024 1024"
                          height="20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M262.2 37c37.4 51.6 82.002 118.197 133.602 199.598 13 22 11 48.4-5.8 79.4-6.4 13-22.6 42.6-48.4 89.2 28.4 40 71.6 89.2 129.8 147.2s106.602 101.4 145.2 129.8c46.401-27.2 76.201-43.8 89.201-50.399 16.8-9 33-13.6 48.4-13.6 11.6 0 22 2.6 31 7.8 59.4 36.2 126.601 80.8 201.4 133.6 14.2 10.4 22.2 24.601 24.2 42.601 2 18.2-3.599 37.4-16.399 58.2-6.4 9-16.8 22.2-31 39.8-14.201 17.4-35.601 39.4-64.002 65.8s-51.6 39.802-69.8 39.802h-2c-136.6-5.4-305-107.801-504.4-307.201-199.6-199.6-302-367.8-307.2-504.6 0-18 13.2-41.6 39.8-70.8 26.4-29 48.2-50 64.799-63 16.8-12.8 31-23.2 42.6-31 14.2-10.4 30.4-15.4 48.4-15.4 22.2 0 38.8 7.8 50.6 23.2zm-63.998 40.598c-27.2 19.4-52.603 41.198-76.603 64.998-23.8 24-37.8 41.6-41.6 53.2 5.2 120.2 101 273.2 287.6 459.2 186.6 186 340 282.2 460 288.6 10.4-3.8 27.4-18 51.4-42.6s45.6-50.399 64.8-77.399c3.8-5.2 5.2-9.6 3.8-13.6-77.4-54.2-142-97.4-193.8-129.801-5.2 0-11.6 2-19.4 5.8-11.6 6.4-40.6 22.6-87.2 48.4l-33 19.4-33-21.4c-42.6-29.6-94.199-75.6-154.999-137.6-60.6-60.6-105.8-112.4-135.6-155l-23.2-31 19.4-34.799c25.8-46.4 42-75.6 48.4-87.2 3.8-7.8 5.8-14.2 5.8-19.4-46-73.401-88.599-138-127.398-193.6h-2c-5 0-9.6 1.4-13.4 3.8z" />
                        </svg>
                      </span>
                      <a
                        href={`tel:${loc.phone.replace(/\s/g, "")}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {loc.phone}
                      </a>
                    </p>

                    {/* Email */}
                    <p className="flex items-center gap-2">
                      <span className="flex-none">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          viewBox="0 0 1024 1024"
                          height="20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M1023.46 232a31.629 31.629 0 0 0-2.48-18.271C1012.917 178.288 987.3 160 944.005 160h-832c-38.08 0-79.105 14-99.28 41.472-1.745 1.328-3.409 2.832-4.912 4.576-6.449 7.44-8.705 17.009-7.264 26.033-.288 2.592-.544 5.2-.544 7.92v512c0 53.024 58.992 112 112 112h832c53.024 0 80-58.976 80-112v-512c0-2.832-.368-5.313-.544-8.001zm-911.459-8l832.001-.001h.432L512.002 568.655 81.314 225.407C91.106 223.599 103.154 224 112 224zm832.001 575.999H112.003c-17.648 0-48-30.336-48-48V293.551l427.04 341.648c6.016 5.2 13.487 7.792 20.959 7.792a32.046 32.046 0 0 0 20.976-7.792l427.024-341.632v458.432c0 17.664 1.664 48-16 48z" />
                        </svg>
                      </span>
                      <a
                        href={`mailto:${loc.email}`}
                        className="hover:text-blue-700 transition-colors"
                      >
                        {loc.email}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Map ═══════ */}
        <div className="mx-auto h-80 md:h-120">
          <ContactMap
            locations={[
              {
                name: s("jp.contact_map_name", lang),
                lat: 37.2242,
                lng: 67.2783,
              },
            ]}
            center={[37.2242, 67.2783]}
            zoom={15}
          />
        </div>

        {/* ═══════ Office hours ═══════ */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 transition-all">
          <h4 className="text-base md:text-xl leading-6 font-bold flex gap-3 items-center text-[#00575B]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00575B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {s("jp.contact_hours_title", lang)}
          </h4>
          <div className="mt-6 space-y-2">
            {officeHours.map((h) => (
              <div
                key={h.day}
                className="rounded-[20px] bg-white p-4 md:p-5 flex items-center justify-between"
              >
                <span className="font-serif text-base font-semibold leading-tight">
                  {h.day}
                </span>
                <span className="text-sm text-gray-600">{h.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ Quick links ═══════ */}
        <div className="rounded-2xl p-4 md:p-6 lg:rounded-3xl bg-gray-100 transition-all">
          <h4 className="text-base md:text-xl leading-6 text-gray-900 font-bold">
            {s("jp.contact_links_title", lang)}
          </h4>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/yoriqnoma"
              className="inline-flex items-center gap-2 rounded-full border border-[#00575B] px-4 py-2 text-sm font-medium text-[#00575B] hover:bg-[#00575B] hover:text-white transition-colors"
            >
              {s("jp.contact_link_guidelines", lang)}
            </Link>
            <Link
              href="/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/nashrlar"
              className="inline-flex items-center gap-2 rounded-full border border-[#00575B] px-4 py-2 text-sm font-medium text-[#00575B] hover:bg-[#00575B] hover:text-white transition-colors"
            >
              {s("jp.contact_link_issues", lang)}
            </Link>
            <Link
              href="/faoliyat/ilmiy-faoliyat/ilmiy-jurnal/jurnal-haqida"
              className="inline-flex items-center gap-2 rounded-full border border-[#00575B] px-4 py-2 text-sm font-medium text-[#00575B] hover:bg-[#00575B] hover:text-white transition-colors"
            >
              {s("jp.contact_link_about", lang)}
            </Link>
          </div>
        </div>
      </Container>

      <Breadcrumb
        items={[
          { label: s("nav.faoliyat", lang), href: `/${lang}/faoliyat` },
          { label: s("nav.ilmiy_faoliyat", lang), href: `/${lang}/faoliyat/ilmiy-faoliyat` },
          {
            label: s("nav.ilmiy_jurnal", lang),
            href: `/${lang}/faoliyat/ilmiy-faoliyat/ilmiy-jurnal`,
          },
          { label: s("jp.breadcrumb_boglanish", lang) },
        ]}
        className="hidden"
      />
    </div>
  );
}
