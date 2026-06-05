"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function JournalFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden">
      {items.map((item, i) => (
        <div
          key={i}
          className="border-b border-[#00000030] transition-all duration-300 last:border-none text-base"
        >
          <button
            className="flex w-full items-center gap-3 py-3 px-2 text-left outline-hidden group cursor-pointer"
            aria-expanded={openIndex === i}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div
              className={`relative shrink-0 w-6 h-6 flex items-center justify-center transition-transform duration-300 ease-out ${
                openIndex === i ? "rotate-45" : "rotate-0"
              }`}
            >
              <svg
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute text-[#00575B]"
                height="20"
                width="20"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <p className="text-base leading-6 transition-colors duration-200 font-semibold text-[#00575B]">
              {item.question}
            </p>
          </button>
          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openIndex === i
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="pl-11 pr-4 pb-4">
                <p className="text-base font-normal text-slate-600 leading-relaxed max-w-4xl">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
