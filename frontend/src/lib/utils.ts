import clsx, { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Get localized string based on current i18n language
export function getLocalized(obj: any, lang: string): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.en || obj.am || '';
}

export function formatPrice(price: number): string {
  return `${price.toFixed(2)} ETB`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getImageUrl(path: string | undefined): string {
  if (!path) return '/placeholder-image.png';
  if (path.startsWith('http')) return path;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
}
