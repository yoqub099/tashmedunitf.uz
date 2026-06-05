"use client";

import { useRef } from "react";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";

export default function VideoPlayer({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { language } = useLanguageStore();

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        src={src}
        className="h-full w-full rounded-3xl object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex gap-2 sm:gap-4">
        <button
          onClick={toggleMute}
          className="flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
          aria-label={s("video.toggle_mute", language)}
        >
          <svg stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={20} width={20}>
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex size-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
          aria-label={s("video.fullscreen", language)}
        >
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
            <path d="M15 1L19 1V5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 7L19 1" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19H1L1 15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 13L1 19" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
