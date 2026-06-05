"use client";

import Image from "next/image";
import { Partner } from "@/types";
import Container from "@/components/shared/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import "swiper/css";

interface PartnersSectionProps {
  partners: Partner[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  const { language } = useLanguageStore();

  if (!partners || partners.length === 0) return null;

  return (
    <section className="mt-10 lg:mt-20 pb-10 lg:pb-20">
      <Container>
        <h2 className="font-serif text-2xl font-semibold leading-tight md:text-[32px] lg:text-[40px] text-center">
          {s("home.partners_title", language)}
        </h2>

        <div className="mt-5">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            loop={partners.length > 4}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
              1280: { slidesPerView: 6 },
            }}
            className="partners-swiper"
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <a
                  href={partner.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center py-4"
                >
                  {partner.logo ? (
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={400}
                      height={200}
                      className="my-auto object-contain max-h-24"
                    />
                  ) : (
                    <span className="text-sm text-gray-500 text-center font-medium">
                      {partner.name}
                    </span>
                  )}
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Container>
    </section>
  );
}
