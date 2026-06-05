import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names without duplicates.
 *
 * @example
 *   cn('px-2', 'px-4', condition && 'text-red-500')
 *   // → 'px-4 text-red-500'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
