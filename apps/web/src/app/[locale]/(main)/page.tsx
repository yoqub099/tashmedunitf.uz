import HeroSection from '@/components/home/HeroSection';
import DirectionsSection from '@/components/home/DirectionsSection';
import AdvantagesSection from '@/components/home/AdvantagesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsSection from '@/components/home/NewsSection';
import PartnersSection from '@/components/home/PartnersSection';
import LocationSection from '@/components/home/LocationSection';
import {
  getBanners,
  getNews,
  getFaculties,
  getTestimonials,
  getPartners,
  getSiteContents,
} from '@/lib/services';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { getLanguage } from '@/lib/language';

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  return buildMetadata('home', { path: '/', locale: lang });
}

export default async function HomePage() {
  const lang = await getLanguage();

  const [
    bannersRes,
    newsRes,
    facultiesRes,
    testimonialsRes,
    partnersRes,
    heroContentsRes,
    advantagesContentsRes,
  ] = await Promise.all([
    getBanners().catch(() => ({ success: false, data: [] })),
    getNews({ per_page: 5 }).catch(() => ({
      success: false,
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 5, total: 0 },
    })),
    getFaculties({ per_page: 50 }).catch(() => ({
      success: false,
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 },
    })),
    getTestimonials({ per_page: 10 }).catch(() => ({
      success: false,
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 },
    })),
    getPartners({ per_page: 20 }).catch(() => ({
      success: false,
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 20, total: 0 },
    })),
    getSiteContents('hero').catch(() => ({ success: false, data: [] })),
    getSiteContents('advantages').catch(() => ({ success: false, data: [] })),
  ]);

  return (
    <>
      <HeroSection banners={bannersRes.data} heroContents={heroContentsRes.data} lang={lang} />
      <DirectionsSection faculties={facultiesRes.data} />
      <AdvantagesSection advantagesContents={advantagesContentsRes.data} lang={lang} />
      <TestimonialsSection testimonials={testimonialsRes.data} />
      <NewsSection news={newsRes.data} lang={lang} />
      <LocationSection />
      <PartnersSection partners={partnersRes.data} />
    </>
  );
}
