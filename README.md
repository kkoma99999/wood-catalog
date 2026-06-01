# wood-catalog

Bilingual (Arabic / English) B2B catalog for a hardwood & timber supplier in Saudi Arabia. A static site that showcases wood species and routes every inquiry to WhatsApp — no cart, no forms, no backend.

## Stack

- **Astro 6** — 100% static output
- **Tailwind CSS v4**
- **TypeScript** (strict)
- **MDX** content collection for wood species (`src/content/woods/`)
- Deploys to **Cloudflare Pages**

## Features

- `/ar` (default, RTL) and `/en` (LTR) locales via Astro i18n
- Product catalog with per-species detail pages
- WhatsApp-only inquiry flow with pre-filled, localized messages — the single conversion point
- Mobile-first: bottom tab bar and a sticky inquiry CTA

## Develop

```sh
npm install
npm run dev       # dev server
npm run build     # static build → ./dist
npm run preview   # preview the production build
```

See `CLAUDE.md` for the full project conventions (i18n rules, RTL, brand palette, WhatsApp message format).
