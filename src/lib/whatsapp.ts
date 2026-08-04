import { siteConfig } from '../config/site';
import { dict, type Locale } from '../i18n/utils';

interface BuildWhatsAppUrlOpts {
  /** Override the phone for special campaigns. Defaults to site config. */
  phone?: string;
  locale: Locale;
  /** Localized wood name; when present the message references this product. */
  productName?: string;
  /** Supplier SKU (e.g. NW-SPL-926); quoted in the message so the merchant
   *  can identify the exact product without asking. */
  productCode?: string;
  /** Path of the current page; appended to the configured domain in-message. */
  currentPath?: string;
}

export function buildWhatsAppUrl({
  phone = siteConfig.phone,
  locale,
  productName,
  productCode,
  currentPath,
}: BuildWhatsAppUrlOpts): string {
  const message = buildMessage(locale, productName, productCode, currentPath);
  return `${siteConfig.whatsappBase}${phone}?text=${encodeURIComponent(message)}`;
}

// Message copy lives in the i18n dictionaries (CLAUDE.md: never hardcode
// user-facing text); this only assembles the URL and fills the placeholders.
// Two full product templates rather than a conditionally-stitched one, so each
// message reads end-to-end in the dictionary and stays translatable.
function buildMessage(
  locale: Locale,
  productName?: string,
  productCode?: string,
  currentPath?: string,
): string {
  const m = dict(locale).whatsapp;
  if (!productName) return m.generalMessage;

  const url = `${siteConfig.domain}${currentPath ?? ''}`;
  const template = productCode ? m.productMessageWithCode : m.productMessage;
  // Function replacers avoid `$`-pattern interpretation in the substituted text.
  return template
    .replace('{name}', () => productName)
    .replace('{code}', () => productCode ?? '')
    .replace('{url}', () => url);
}
