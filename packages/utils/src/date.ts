import type { Locale } from '@tmtu/types';

const MONTHS: Record<Locale, string[]> = {
  uz: [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
  ],
  ru: [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
  ],
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
};

export type FormattedDate = {
  day: string;
  month: string;
  year: string;
  full: string;
};

export function formatDate(input: string | Date | null | undefined, locale: Locale = 'uz'): FormattedDate {
  if (!input) {
    return { day: '', month: '', year: '', full: '' };
  }

  const date = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    return { day: '', month: '', year: '', full: '' };
  }

  const day = String(date.getDate()).padStart(2, '0');
  const monthIdx = date.getMonth();
  const month = MONTHS[locale][monthIdx] ?? '';
  const year = String(date.getFullYear());

  return {
    day,
    month,
    year,
    full: `${day} ${month} ${year}`,
  };
}
