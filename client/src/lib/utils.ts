import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, symbol = '₹') {
  return `${symbol}${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatDate(iso?: string | null, timezone = 'Asia/Kolkata') {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeZone: timezone,
  }).format(new Date(iso));
}

export function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}
