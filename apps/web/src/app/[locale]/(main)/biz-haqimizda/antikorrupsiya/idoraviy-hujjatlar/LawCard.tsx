"use client";

import { useState } from "react";

export default function LawCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl p-4 md:p-6 lg:rounded-3xl flex h-48 flex-col gap-4 border transition-all duration-300 cursor-default"
      style={{
        background: hovered
          ? "linear-gradient(135deg, #00575B 0%, #00838F 50%, rgba(77,182,172,0.3) 100%)"
          : "#f3f4f6",
        borderColor: hovered ? "transparent" : "#e5e7eb",
      }}
    >
      <h6
        className="font-serif text-base font-semibold leading-tight lg:text-lg transition-colors duration-300"
        style={{ color: hovered ? "#fff" : "#111" }}
      >
        O&#39;zbekiston Respublikasining Korrupsiyaga qarshi kurashish
        to&#39;g&#39;risida qonuni
      </h6>
      <p
        className="text-sm lg:text-base transition-colors duration-300"
        style={{
          fontFamily: "'Times New Roman', Times, serif",
          color: hovered ? "#fff" : "#333",
        }}
      >
        <a
          href="https://lex.uz/docs/3088008"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: hovered ? "#fff" : "#2563eb",
            textDecoration: "underline",
            transition: "color 0.3s ease",
          }}
        >
          O&#39;zbekiston Respublikasining Qonuni, 03.01.2017 yildagi
          O&#39;RQ-419-son
        </a>
      </p>
    </div>
  );
}
