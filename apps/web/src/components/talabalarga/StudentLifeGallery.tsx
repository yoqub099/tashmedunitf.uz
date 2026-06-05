'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useMemo } from 'react';
import { ImageIcon } from 'lucide-react';
import { s } from '@/lib/i18n';
import { useLanguageStore } from '@/store/useLanguageStore';
import { t } from '@/lib/translate';

import 'swiper/css';

interface StudentLifePhoto {
  id: number;
  title?: { uz?: string; ru?: string; en?: string } | null;
  photo: string | null;
  is_active: boolean;
  sort_order: number;
}

interface StudentLifeGalleryProps {
  photos: StudentLifePhoto[];
}

export default function StudentLifeGallery({ photos }: StudentLifeGalleryProps) {
  const { language } = useLanguageStore();

  /* Split photos into two rows */
  const row1 = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    const half = Math.ceil(photos.length / 2);
    const base = photos.slice(0, half);
    // Duplicate to ensure enough slides for loop
    const result = [...base];
    while (result.length < 10) {
      result.push(...base);
    }
    return result;
  }, [photos]);

  const row2 = useMemo(() => {
    if (!photos || photos.length === 0) return [];
    const half = Math.ceil(photos.length / 2);
    const base = photos.slice(half);
    if (base.length === 0) return row1; // fallback if too few
    const result = [...base];
    while (result.length < 10) {
      result.push(...base);
    }
    return result;
  }, [photos, row1]);

  if (!photos || photos.length === 0) return null;

  const swiperConfig = {
    spaceBetween: 16,
    slidesPerView: 'auto' as const,
    loop: true,
    speed: 10000,
    allowTouchMove: true,
    grabCursor: true,
  };

  const getAlt = (photo: StudentLifePhoto) =>
    t(photo.title, language) || s('students.life', language);

  return (
    <>
      {/* Row 1 — auto-scroll left */}
      <div className="mt-8 w-full overflow-hidden">
        <Swiper
          {...swiperConfig}
          autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: false }}
          modules={[Autoplay]}
          className="h-full"
        >
          {row1.map((photo, index) => (
            <SwiperSlide
              key={`row1-${photo.id}-${index}`}
              className={`h-48 shrink-0 sm:h-72! ${index % 2 === 0 ? 'w-64 sm:w-110!' : 'w-36 sm:w-52!'}`}
            >
              <div className="h-full w-full overflow-hidden rounded-3xl">
                {photo.photo ? (
                  <img
                    src={photo.photo}
                    alt={getAlt(photo)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Row 2 — auto-scroll right (reverse) */}
      <div className="mt-4 w-full overflow-hidden">
        <Swiper
          {...swiperConfig}
          autoplay={{ delay: 0, disableOnInteraction: false, reverseDirection: true }}
          modules={[Autoplay]}
          className="h-full"
        >
          {row2.map((photo, index) => (
            <SwiperSlide
              key={`row2-${photo.id}-${index}`}
              className={`h-48 shrink-0 sm:h-72! ${index % 2 === 0 ? 'w-64 sm:w-110!' : 'w-36 sm:w-52!'}`}
            >
              <div className="h-full w-full overflow-hidden rounded-3xl">
                {photo.photo ? (
                  <img
                    src={photo.photo}
                    alt={getAlt(photo)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
