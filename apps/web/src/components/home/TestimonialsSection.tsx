'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Testimonial } from '@/types';
import { t } from '@/lib/translate';
import { s } from '@/lib/i18n';
import { useLanguageStore } from '@/store/useLanguageStore';
import { useMemo } from 'react';

import 'swiper/css';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

/* avatar fallback colors — vibrant palette for initials */
const AVATAR_COLORS = [
  'bg-rose-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-violet-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
  'bg-indigo-500',
  'bg-fuchsia-500',
  'bg-lime-600',
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function TestimonialCard({ item, lang }: { item: Testimonial; lang: string }) {
  const name = t(item.name, lang);
  const role = t(item.role, lang);
  const text = t(item.text, lang);
  const avatarColor = getAvatarColor(name);

  return (
    <div className="carousel-box flex h-44 cursor-pointer flex-col rounded-2xl p-4 text-gray-900 md:p-6 lg:h-52 lg:rounded-3xl">
      <div className="relative z-20 flex flex-none gap-3">
        {item.photo ? (
          <Image
            src={item.photo}
            alt={name}
            width={64}
            height={64}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <div
            className={`size-16 rounded-full ${avatarColor} flex items-center justify-center text-xl font-bold text-white`}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h5 className="font-serif text-xl font-semibold">{name}</h5>
          <p className="text-sm">{role}</p>
        </div>
      </div>
      <p className="text-container relative z-20 mt-4 line-clamp-3 text-sm leading-tight lg:text-lg">
        {text}
      </p>
    </div>
  );
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { language } = useLanguageStore();

  /* duplicate short arrays so Swiper loop has enough slides */
  const slides = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    const result = [...testimonials];
    while (result.length < 10) {
      result.push(...testimonials);
    }
    return result;
  }, [testimonials]);

  if (!testimonials || testimonials.length === 0) return null;

  const swiperConfig = {
    spaceBetween: 16,
    slidesPerView: 'auto' as const,
    loop: true,
    speed: 10000,
    allowTouchMove: true,
    grabCursor: true,
  };

  return (
    <section className="mt-10 overflow-hidden lg:mt-20">
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h2 className="font-serif text-2xl leading-tight font-semibold md:w-1/2 md:text-[32px] lg:text-[40px] xl:w-1/3">
          {s('home.testimonials_title', language)}
        </h2>
        <p className="mt-2 text-gray-500">{s('home.testimonials_subtitle', language)}</p>
      </div>

      {/* Row 1 — auto-scroll left */}
      <div className="feedbacks-swiper mt-8 w-full">
        <Swiper
          {...swiperConfig}
          autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: false }}
          modules={[Autoplay]}
          className="h-full"
        >
          {slides.map((item, index) => (
            <SwiperSlide key={`row1-${item.id}-${index}`} className="w-72! sm:w-80! lg:w-96!">
              <TestimonialCard item={item} lang={language} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Row 2 — auto-scroll right (reverse) */}
      <div className="feedbacks-swiper mt-4">
        <Swiper
          {...swiperConfig}
          autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: true }}
          modules={[Autoplay]}
          className="h-full"
        >
          {slides.map((item, index) => (
            <SwiperSlide key={`row2-${item.id}-${index}`} className="w-72! sm:w-80! lg:w-96!">
              <TestimonialCard item={item} lang={language} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
