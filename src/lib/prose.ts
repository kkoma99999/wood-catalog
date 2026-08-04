import type { Locale } from '../i18n/utils';

// Product MDX bodies ship both languages in a single file, delimited by
// `## EN` / `## AR` headings (see src/content/woods/*.mdx). Rendering the whole
// body with <Content /> leaks the other language onto every page, so we slice
// out just the active locale's section here.

const SECTION = /^##\s+(EN|AR)\s*$/i;

/**
 * Return only the markdown chunk for the active locale, or null when the
 * `## EN` / `## AR` markers are absent — letting the caller fall back to
 * rendering the full body so single-language entries still work.
 */
export function splitLocaleProse(body: string, locale: Locale): string | null {
  const sections: Partial<Record<Locale, string[]>> = {};
  let current: Locale | null = null;

  for (const line of body.split('\n')) {
    const match = line.match(SECTION);
    if (match) {
      current = match[1].toLowerCase() as Locale;
      sections[current] = [];
      continue;
    }
    if (current) sections[current]!.push(line);
  }

  const text = (sections[locale] ?? []).join('\n').trim();
  return text === '' ? null : text;
}

const escapeHtml = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Render the small markdown subset used in product bodies: a lead paragraph,
 * `**bold**` subheadings, and `-` bullet lists. Tailwind's preflight strips
 * list markers, so the utility classes restore them. Content is author-owned
 * (in-repo files), so escaping here is defensive hygiene, not untrusted input.
 */
export function renderProse(md: string): string {
  const out: string[] = [];
  let listItems: string[] = [];

  // A `**bold**` heading sits directly above its bullets with no blank line
  // between them, so classify line-by-line rather than per blank-delimited
  // block; bullets accumulate until a non-bullet line flushes the <ul>.
  const flushList = () => {
    if (listItems.length === 0) return;
    out.push(`<ul class="ps-5 list-disc space-y-1">${listItems.join('')}</ul>`);
    listItems = [];
  };

  for (const raw of md.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }

    const heading = /^\*\*(.+)\*\*$/.exec(line);
    if (heading) {
      flushList();
      out.push(`<h3 class="mt-6 mb-2 text-lg text-wood-900">${escapeHtml(heading[1])}</h3>`);
      continue;
    }

    if (line.startsWith('- ')) {
      listItems.push(`<li>${escapeHtml(line.slice(2).trim())}</li>`);
      continue;
    }

    flushList();
    // Preflight zeroes paragraph margins, so space consecutive paragraphs here
    // (species bodies are lead + "Common Uses" prose, with no heading between).
    out.push(`<p class="leading-relaxed mt-4 first:mt-0">${escapeHtml(line)}</p>`);
  }

  flushList();
  return out.join('\n');
}
