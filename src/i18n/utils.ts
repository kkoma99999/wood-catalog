import arData from './ar.json';
import enData from './en.json';

export type Locale = 'ar' | 'en';
export type Dict = typeof enData;

export const locales = ['ar', 'en'] as const satisfies readonly Locale[];
export const defaultLocale: Locale = 'ar';

// One source of truth for shape; ar is asserted to match.
const dictionaries: Record<Locale, Dict> = {
  ar: arData as Dict,
  en: enData,
};

export function getLocale(url: URL): Locale {
  const first = url.pathname.split('/').filter(Boolean)[0];
  return first === 'ar' || first === 'en' ? first : defaultLocale;
}

export function getDir(locale: Locale): 'rtl' | 'ltr' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

export function dict(locale: Locale): Dict {
  return dictionaries[locale];
}

// Pick the locale-appropriate string from a bilingual { nameAr, nameEn } record
// (wood species names, brand name). One home for the ar/en selection rule that
// was otherwise inlined across cards, pages, and chrome.
export function pickName(record: { nameAr: string; nameEn: string }, locale: Locale): string {
  return locale === 'ar' ? record.nameAr : record.nameEn;
}

const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'] as const;

// Arabic-Indic digits for ar body copy; spec tables keep ASCII (see CLAUDE.md).
export function formatNumber(value: number | string, locale: Locale): string {
  const s = typeof value === 'string' ? value : String(value);
  if (locale === 'ar') {
    return s.replace(/\d/g, (d) => arDigits[Number(d)]);
  }
  return s;
}

// Join names into a natural-language list with the locale's separators and
// conjunction (English "A, B and C"; Arabic "أ، ب، وج").
export function formatList(items: string[], locale: Locale): string {
  if (items.length <= 1) return items[0] ?? '';
  const head = items.slice(0, -1);
  const last = items[items.length - 1];
  return locale === 'ar'
    ? `${head.join('، ')}، و${last}`
    : `${head.join(', ')} and ${last}`;
}

export function localePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : '/' + path;
  if (clean === '/') return `/${locale}`;
  return `/${locale}${clean}`;
}

export function switchLocalePath(currentPath: string, target: Locale): string {
  const segments = currentPath.split('/').filter(Boolean);
  if (segments[0] === 'ar' || segments[0] === 'en') {
    segments[0] = target;
  } else {
    segments.unshift(target);
  }
  return '/' + segments.join('/');
}
