"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { t } from "@/lib/translate";
import { s } from "@/lib/i18n";
import { useLanguageStore } from "@/store/useLanguageStore";
import type { FAQItem } from "@/types";

interface FAQContentProps {
  faqs: FAQItem[];
}

export default function FAQContent({ faqs }: FAQContentProps) {
  const { language } = useLanguageStore();
  const [openId, setOpenId] = useState<number | null>(null);
  const contentRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [heights, setHeights] = useState<Record<number, number>>({});

  // Measure content heights for smooth animation
  useEffect(() => {
    const measured: Record<number, number> = {};
    faqs.forEach((faq) => {
      const el = contentRefs.current[faq.id];
      if (el) measured[faq.id] = el.scrollHeight;
    });
    setHeights(measured);
  }, [faqs]);

  const toggle = useCallback((id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  if (faqs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <MessageCircleQuestion className="h-16 w-16 mb-4 opacity-50" />
        <p className="text-lg">{s("faq.no_questions", language)}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-3 sm:p-4 md:p-6 lg:rounded-3xl bg-gray-50">
      <h4 className="text-xl sm:text-2xl font-bold text-gray-900">{s("nav.faq", language)}</h4>

      <div className="mt-4 sm:mt-6 space-y-2">
        {faqs.map((faq) => {
          const question = t(faq.question, language);
          const answer = t(faq.answer, language);
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="faq-collapse-item rounded-xl sm:rounded-2xl bg-white transition-shadow duration-300 hover:shadow-sm"
            >
              {/* Question — clickable header */}
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-question-${faq.id}`}
                className="flex w-full items-center justify-between px-4 py-3.5 sm:px-6 sm:py-5 text-left gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl sm:rounded-2xl"
              >
                <h6 className="text-sm sm:text-base font-semibold leading-tight text-gray-900 lg:text-lg">
                  {question}
                </h6>
                <ChevronDown
                  className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-gray-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-blue-600" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Answer — smooth collapse */}
              <div
                ref={(el) => { contentRefs.current[faq.id] = el; }}
                id={`faq-answer-${faq.id}`}
                role="region"
                aria-labelledby={`faq-question-${faq.id}`}
                aria-hidden={!isOpen}
                className="overflow-hidden transition-all duration-400 ease-out"
                style={{
                  maxHeight: isOpen ? `${(heights[faq.id] ?? 9999) + 16}px` : "0px",
                  opacity: isOpen ? 1 : 0,
                  pointerEvents: isOpen ? "auto" : "none",
                }}
              >
                <div className="px-4 pb-4 sm:px-6 sm:pb-5">
                  <div
                    className="text-container text-sm sm:text-base text-gray-600 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-gray-800 [&_a]:text-blue-700 [&_a]:underline [&_a:hover]:text-blue-900 [&_br]:leading-loose"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(answer) }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
