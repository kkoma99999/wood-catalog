// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.neem-woods.com',
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'ar',
        locales: { ar: 'ar-SA', en: 'en-US' },
      },
    }),
  ],
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
