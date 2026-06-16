export const siteConfig = {
  brand: {
    nameEn: 'Neem Woods',
    nameAr: 'نيم للاخشاب',
  },
  // E.164 without leading '+', no spaces or dashes. Powers every wa.me link
  // and the tel: link on the contact page (local form: 0560788410).
  phone: '966560788410',
  // Human-readable form shown on the contact page (kept ASCII for dialing).
  phoneDisplay: '+966 56 078 8410',
  email: 'neem926671@gmail.com',
  whatsappBase: 'https://wa.me/',
  // Production domain — used to build absolute links inside
  // the WhatsApp pre-filled message so the merchant sees the source page.
  domain: 'https://www.neem-woods.com',
  social: {} as Record<string, string>,
} as const;

export type SiteConfig = typeof siteConfig;
