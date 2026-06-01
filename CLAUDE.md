# Wood Catalog — Bilingual B2B Site (WhatsApp-only Inquiry)

## Project Overview
B2B catalog website for a wood/timber supplier in Saudi Arabia.
- Audience: contractors, furniture makers, joinery shops, architects in KSA + Gulf
- Goal: showcase ~7 wood species and route ALL inquiries to WhatsApp Business
- NOT an e-commerce site. No cart, no forms, no email backend.
- Pure content catalog. The only "action" is opening WhatsApp with a pre-filled message.

## Tech Stack
- Framework: Astro 6.x (100% static, no SSR, no actions, no API routes)
- Styling: Tailwind CSS v4 (no custom CSS unless absolutely necessary)
- Language: TypeScript strict mode
- Content: MDX files in `/src/content/woods/` (use Content Collections via Content Layer API)
- Images: Astro `<Image>` component, AVIF + WebP fallback, sharp
- Deployment: Cloudflare Pages (static output, free tier)
- Analytics: Cloudflare Web Analytics OR Plausible (track WhatsApp button clicks)

## Astro 6 Notes (IMPORTANT — do not regress to Astro 4/5 patterns)
- Content collection config lives at `src/content.config.ts` (NOT `src/content/config.ts`)
- Import Zod from `astro/zod` (NOT from `astro:content`)
- Use explicit loaders: `loader: glob({ pattern: '**/*.mdx', base: './src/content/woods' })`
- Do NOT use `type: 'content'` or `type: 'data'` — those are removed
- Use `entry.id` (NOT `entry.slug` — that auto-derived field is gone)
- When linking to entries: `/products/${entry.id}` not `/products/${entry.slug}`

## What This Site Does NOT Have
- No cart, no quote builder, no localStorage state
- No forms (no contact form, no quote form, no newsletter)
- No backend, no API routes, no Astro Actions
- No email integration (no Resend, no SendGrid, no SMTP)
- No database, no CMS (MDX files only)
- No user accounts, no login, no authentication
- No prices displayed (prices shared on WhatsApp directly)
- No live chat widget (WhatsApp IS the chat)
- No advice / tips / expert-quote sections on product pages
- No location / origin fields on product pages

## Internationalization (CRITICAL)
- Two locales: `ar` (default for KSA traffic) and `en`
- Use Astro's built-in i18n routing: /ar/* and /en/*
- HTML lang + dir attributes MUST be set per locale (ar = rtl, en = ltr)
- All translatable strings live in `/src/i18n/{ar,en}.json`
- NEVER hardcode user-facing text in components
- Numbers in body text: Arabic-Indic digits (٠-٩) for ar locale
- Numbers in spec tables: keep ASCII for technical readability (Janka, dimensions)
- Wood species names need BOTH Arabic trade name AND Latin/botanical name

## RTL Rules
- Use Tailwind logical properties: `ms-*` not `ml-*`, `me-*` not `mr-*`, `ps-*` not `pl-*`, `pe-*` not `pr-*`
- Use `start-*` and `end-*` for positioning, not `left-*` and `right-*`
- Flex direction: prefer `flex-row` (auto-mirrors) over manual reverse
- Icons with direction (arrows, chevrons): use `rtl:rotate-180` to flip
- WhatsApp icon stays the same (brand icon, not directional)
- Test EVERY page in both locales before declaring done

## Project Structure
```
src/
├── content.config.ts      # Content Collections schema (Astro 6 location)
├── content/
│   └── woods/
│       ├── sapele.mdx
│       ├── beech.mdx
│       └── ...            # one MDX per species
├── config/
│   └── site.ts            # phone number, social links, brand constants
├── components/
│   ├── ui/                # primitives (Button, Card, Badge)
│   ├── product/           # WoodCard, SpecsTable, ImageGallery
│   ├── layout/            # Header, Footer, MobileNav, LangSwitcher, BottomTabBar
│   └── WhatsAppButton.astro   # THE central component — every CTA on the site
├── pages/
│   ├── index.astro        # redirects to /ar
│   └── [locale]/
│       ├── index.astro
│       ├── products/index.astro
│       ├── products/[slug].astro
│       ├── about.astro
│       └── contact.astro
├── i18n/
│   ├── ar.json
│   ├── en.json
│   └── utils.ts           # getLocale, t(), formatNumber
└── lib/
    └── whatsapp.ts        # buildWhatsAppUrl(opts)
```

## Wood Species Schema (Content Collection)
The collection is defined in `src/content.config.ts` with a `glob` loader pointing at `./src/content/woods`.

Each `.mdx` file frontmatter must have:
- nameAr, nameEn, scientificName
- colorFamily (one of: light, golden, reddish, dark, exotic)
- hexColor (a hex code matching the wood's typical color, used as image placeholder)
- janka (hardness in lbf)
- densityKgM3
- availableThicknessMm[], availableWidthMm[], availableLengthMm[]
- grades[] (e.g., FAS, Select, Common)
- applications[] (one of: furniture, flooring, joinery, marine, decking, decorative, doors, stairs)
- certifications[] (FSC, PEFC, etc., or empty)
- moqBoardFeet, leadTimeDays
- inStock (boolean)
- images: { stack, grain, inUse? } — optional, paths under /public/woods/, fall back to hexColor div

The MDX filename (e.g., `sapele.mdx`) becomes the entry.id used in URL routing.

Show MOQ, lead time, and dimensions openly on the page. Hide nothing.
The only thing buyers can't see is price — that's the WhatsApp conversation.

## WhatsApp Inquiry Pattern (CORE FEATURE)
This is the only "logic" on the site. Single source of all leads.

### The WhatsApp Button locations (priority order)
1. Product detail page — large primary button below the spec table
2. Product detail page — sticky floating button on mobile after scroll
3. Homepage hero — primary CTA
4. Homepage dark CTA section — big "Start chat" button
5. Site-wide header — icon-only button (mobile and desktop)
6. Mobile bottom tab bar — one of the 4 tabs

### URL Format
`https://wa.me/<PHONE>?text=<URL-encoded message>`
- PHONE: stored in src/config/site.ts (no leading +, no spaces, no dashes)
- Saudi number format example: 966500000000

### Pre-filled Message Format

For product pages (locale: en):
```
Hi, I'd like to inquire about:
*<Wood Name (English)>*
Page: https://<domain><current path>

```

For product pages (locale: ar):
```
السلام عليكم،
أرغب بالاستفسار عن:
*<اسم الخشب بالعربي>*
الرابط: https://<domain><current path>

```

For general CTAs (homepage, footer):
- en: "Hi, I'd like to inquire about your wood products."
- ar: "السلام عليكم، أرغب بالاستفسار عن منتجاتكم من الأخشاب."

### Implementation Rules
- Always use `target="_blank"` and `rel="noopener noreferrer"` on wa.me links
- Always wrap the message with `encodeURIComponent()` before injecting
- Never put the phone number directly in components — import from src/config/site.ts
- Add `data-wa-product="<id>"` attribute on every product-specific button for analytics
- For sticky mobile button: 56px height, full-width minus 16px padding, 16px from bottom, bg = WhatsApp green #25D366, white text
- Sticky button visibility: use IntersectionObserver, show after the hero section scrolls out of view (only place we add JS on the site)

## Analytics — Tracking Inquiries Without a Backend
WhatsApp button clicks ARE the conversion metric.

Use Plausible (or Cloudflare Web Analytics) custom events:
```js
document.querySelectorAll('[data-wa-product]').forEach(btn => {
  btn.addEventListener('click', () => {
    plausible('WhatsApp Click', {
      props: {
        product: btn.dataset.waProduct,
        locale: document.documentElement.lang,
        location: btn.dataset.waLocation || 'unknown'
      }
    });
  });
});
```

Place this script in BaseLayout.astro so it runs on every page.

## Brand Palette (Wood-Trade Warm Brown + Cream)
Configure as Tailwind theme extensions.

| Token | Hex | Role |
|---|---|---|
| `bg-cream-50` | #FAF6EE | Page background |
| `bg-cream-100` | #F2E8D3 | Section dividers, surface accents |
| `bg-cream-200` | #EFE3CC | Hover surface, pills |
| `bg-cream-light` | #F5E9D3 | Text on dark wood bg |
| `text-wood-900` | #2A1A0E | Headings |
| `text-wood-800` | #3D2817 | Body text on cream |
| `text-wood-700` | #5C3317 | Primary brand color, button bg |
| `text-wood-500` | #8A7660 | Muted text |
| `bg-wa-green` | #25D366 | WhatsApp button only |
| `text-wa-green-dark` | #128C7E | WhatsApp text variant |

Semantic pills:
- In stock: bg #E6F0D8, text #2E5511
- By order: bg #F5E2BD, text #5C3D0A
- Out of stock: bg #F5C1C1, text #791F1F

## Typography
- English UI font: Inter (Google Fonts) with system sans-serif fallback
- Arabic UI font: IBM Plex Sans Arabic (Google Fonts) with Tahoma fallback
- Load fonts with `display: swap`
- Headings: weight 500 (never 700 — too heavy for wood-trade aesthetic)
- Body: weight 400, line-height 1.6 for English, 1.75 for Arabic
- Letter-spacing: 0.08em on uppercase section labels, 0 everywhere else

## Mobile-First Rules
- Design at 375px width first, scale up to desktop
- Bottom tab bar fixed on mobile only (Home, Products, About, WhatsApp)
- The WhatsApp tab in the bottom bar opens WhatsApp directly (no in-app page)
- Sticky "Inquire on WhatsApp" button appears on product detail after scrolling past hero
- Product cards on mobile: horizontal layout (90px image left, content right)
- Product cards on desktop (≥768px): vertical layout (image top, content below)
- All tap targets ≥44px height

## Do Not
- Do not add a contact form, quote form, or newsletter signup
- Do not collect emails or phone numbers anywhere
- Do not use localStorage for anything
- Do not add React/Vue islands — entire site 100% static HTML+CSS (one tiny vanilla JS file for sticky button + analytics)
- Do not add a blog, 3D viewer, or AI chatbot
- Do not show prices anywhere — all pricing goes through WhatsApp
- Do not use `ml-*`, `mr-*`, `left-*`, `right-*` — RTL will break
- Do not use Google Translate for Arabic copy — needs native Gulf review
- Do not commit `.env` files. Use `.env.example` for documentation
- Do not use box shadows, gradients, or skeuomorphic effects
- Do not auto-open WhatsApp on page load — always require a tap
- Do not add origin/location fields to product pages
- Do not add tips, advice, or "expert quote" sections to product pages
- Do not put `content.config.ts` inside `src/content/` — Astro 6 requires `src/content.config.ts`
- Do not import `z` from `astro:content` — use `astro/zod` in Astro 6
- Do not reference `entry.slug` — use `entry.id` in Astro 6

## Preferred Style
- Explain the plan in 2-3 bullets before writing code for any new component
- Prefer composition over configuration: small components, clear props
- Functional patterns. Early returns. No clever one-liners
- Comments explain WHY, not WHAT
- Keep files under 200 lines; split when bigger
- Use TypeScript strict — no `any`, no `// @ts-ignore`

## Commands (Windows PowerShell, npm-based)
This project uses npm (not pnpm). All commands:
- `npm run dev` — start dev server
- `npm run build` — production build (static output to ./dist)
- `npm run preview` — preview production build locally
- `npx astro check` — TypeScript + Astro type check
- `npx astro add <integration>` — add an integration

Never call `pnpm` in build commands or scripts — it may not be on PATH.

## Git Discipline
- Commit after every completed feature, not at end of day
- Use conventional commit prefixes: feat:, fix:, chore:, docs:, style:, refactor:
- Branch naming: build/feature-name for new work
- Never force-push, never reset --hard without committing first

## Definition of Done
A feature is done when:
1. It works in both `/ar` and `/en` routes
2. RTL layout verified visually in Arabic
3. Mobile (375px) and desktop (1280px) both look correct
4. WhatsApp button (if present) opens wa.me URL with correct pre-filled message
5. Lighthouse Performance ≥ 95 on the affected page
6. No console errors or warnings
7. TypeScript compiles with strict mode, no `any`
8. Plausible custom event fires on WhatsApp button clicks (if analytics is wired)