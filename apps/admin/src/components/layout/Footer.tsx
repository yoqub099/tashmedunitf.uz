"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { footerNavigation } from "@/config/navigation";
import { useSiteContents } from "@/hooks/useSiteContents";
import Container from "@/components/shared/Container";
import { Pencil } from "lucide-react";
import AccessibilityFooterLink from "@/components/a11y/AccessibilityFooterLink";

/* Inline SVG icons for social media */
function LinkedInIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="inline-block text-2xl text-[#0A66C2]" height="1em" width="1em">
      <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM8.339 18.337H5.667v-8.59h2.672v8.59zM7.003 8.574a1.548 1.548 0 1 1 0-3.096 1.548 1.548 0 0 1 0 3.096zm11.335 9.763h-2.669V14.16c0-.996-.018-2.277-1.388-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248h-2.667v-8.59h2.56v1.174h.037c.355-.675 1.227-1.387 2.524-1.387 2.704 0 3.203 1.778 3.203 4.092v4.71z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="inline-block text-2xl text-[#1877F2]" height="1em" width="1em">
      <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="inline-block text-2xl text-[#E4405F]" height="1em" width="1em">
      <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z" />
      <circle cx="16.806" cy="7.207" r="1.078" />
      <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="inline-block text-2xl text-[#26A5E4]" height="1em" width="1em">
      <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="inline-block text-2xl text-[#FF0000]" height="1em" width="1em">
      <path d="M21.593 7.203a2.506 2.506 0 0 0-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 0 0-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 0 0 1.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z" />
    </svg>
  );
}

const SOCIAL_ICON_MAP: Record<string, () => React.JSX.Element> = {
  social_linkedin: LinkedInIcon,
  social_facebook: FacebookIcon,
  social_instagram: InstagramIcon,
  social_telegram: TelegramIcon,
  social_youtube: YoutubeIcon,
};

const SOCIAL_LABEL_MAP: Record<string, string> = {
  social_linkedin: "LinkedIn",
  social_facebook: "Facebook",
  social_instagram: "Instagram",
  social_telegram: "Telegram",
  social_youtube: "YouTube",
};

export default function Footer() {
  const { data: socialContents } = useSiteContents("social");
  const socialLinks = (Array.isArray(socialContents) ? socialContents : [])
    .filter((item) => SOCIAL_ICON_MAP[item.key] && item.value?.uz)
    .map((item) => ({
      name: SOCIAL_LABEL_MAP[item.key] || item.key,
      icon: SOCIAL_ICON_MAP[item.key],
      href: item.value.uz,
    }));
  return (
    <footer>
      <Container>
        <div className="flex flex-col gap-y-8 py-6 lg:pt-12">
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-10">
            {/* Brand & Tagline */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="mt-1 font-serif text-4xl font-bold lg:mt-2 lg:text-5xl text-[#00575B]">
                <span className="select-none">{siteConfig.shortName}</span>
              </Link>
              <p className="mt-6 text-gray-600">
                Yorqin kelajagingizni {siteConfig.name} bilan boshlang!
              </p>
            </div>

            {/* Tezkor havolalar */}
            <div>
              <p className="font-serif font-bold text-gray-900">
                Tezkor havolalar
              </p>
              <ul className="mt-2 flex flex-col">
                {footerNavigation.tezkorHavolalar.map((item) => (
                  <li key={item.href} className="py-2">
                    <Link href={item.href} className="text-sm text-gray-600 hover:text-[#00575B] transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foydali havolalar */}
            <div>
              <p className="font-serif font-bold text-gray-900">
                Foydali havolalar
              </p>
              <ul className="mt-2 flex flex-col">
                {footerNavigation.foydaliHavolalar.map((item) => (
                  <li key={item.href} className="py-2">
                    <Link href={item.href} className="text-sm text-gray-600 hover:text-[#00575B] transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ta'lim dasturlari */}
            <div>
              <p className="font-serif font-bold text-gray-900">
                Ta&apos;lim dasturlari
              </p>
              <ul className="mt-2 flex flex-col">
                {footerNavigation.talimDasturlari.map((item) => (
                  <li key={item.href} className="py-2">
                    <Link href={item.href} className="text-sm text-gray-600 hover:text-[#00575B] transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sotsial medialar */}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-serif font-bold text-gray-900">
                  Sotsial medialar
                </p>
                <Link
                  href="/social-links"
                  className="rounded-md bg-blue-50 p-1 text-blue-600 hover:bg-blue-100 transition"
                  title="Boshqarish"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Link>
              </div>
              <ul className="mt-2 flex flex-col">
                {socialLinks.map((social) => (
                  <li key={social.name} className="py-2">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-[#00575B] transition-colors"
                    >
                      <social.icon />
                      <span className="ml-3">{social.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom: copyright + accessibility */}
          <div className="border-t pt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between text-gray-500">
            <p className="text-center sm:text-left">
              <span>&copy; {new Date().getFullYear()}</span>{" "}
              <Link href="/" className="hover:text-[#00575B] transition-colors">
                TdTUTF.uz
              </Link>
              , <span>Barcha huquqlar himoyalangan</span>
            </p>
            <AccessibilityFooterLink />
          </div>
        </div>
      </Container>
    </footer>
  );
}
