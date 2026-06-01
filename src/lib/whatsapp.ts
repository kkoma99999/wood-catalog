import { siteConfig } from '../config/site';
import { dict, type Locale } from '../i18n/utils';

interface BuildWhatsAppUrlOpts {
  /** Override the phone for special campaigns. Defaults to site config. */
  phone?: string;
  locale: Locale;
  /** Localized wood name; when present the message references this product. */
  productName?: string;
  /** Path of the current page; appended to the configured domain in-message. */
  currentPath?: string;
}

export function buildWhatsAppUrl({
  phone = siteConfig.phone,
  locale,
  productName,
  currentPath,
}: BuildWhatsAppUrlOpts): string {
  const message = buildMessage(locale, productName, currentPath);
  return `${siteConfig.whatsappBase}${phone}?text=${encodeURIComponent(message)}`;
}

// Message copy lives in the i18n dictionaries (CLAUDE.md: never hardcode
// user-facing text); this only assembles the URL and fills the placeholders.
function buildMessage(locale: Locale, productName?: string, currentPath?: string): string {
  const m = dict(locale).whatsapp;
  if (productName) {
    const url = `${siteConfig.domain}${currentPath ?? ''}`;
    // Function replacers avoid `$`-pattern interpretation in the substituted text.
    return m.productMessage.replace('{name}', () => productName).replace('{url}', () => url);
  }
  return m.generalMessage;
}
