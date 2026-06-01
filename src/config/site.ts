export const siteConfig = {
  brand: {
    nameEn: 'Neem Wood',
    nameAr: 'نيم للاخشاب',
  },
  // E.164 without leading '+', no spaces or dashes. Replace before launch.
  phone: '966500000000',
  whatsappBase: 'https://wa.me/',
  // Production domain placeholder — used to build absolute links inside
  // the WhatsApp pre-filled message so the merchant sees the source page.
  domain: 'https://woodcatalog.sa',
  commercialRegistration: '0000000000',
  social: {} as Record<string, string>,
} as const;

export type SiteConfig = typeof siteConfig;
