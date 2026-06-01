import type { Dict } from '../i18n/utils';

interface WoodImages {
  stack?: string;
  grain?: string;
  inUse?: string;
}

// Primary hero photo: prefer the stacked-board shot, then the grain close-up,
// then an in-use scene. Returns undefined so callers fall back to the hexColor
// block. One home for the precedence rule shared by the card and detail page.
export function heroImage(images?: WoodImages): string | undefined {
  return images?.stack ?? images?.grain ?? images?.inUse;
}

// Stock badge styling + label. Two states only (boolean inStock): available now
// or made-to-order. Keeps the pill mapping out of every card, detail, and spec view.
export function stockPill(inStock: boolean, d: Dict): { class: string; label: string } {
  return inStock
    ? { class: 'pill-in-stock', label: d.wood.inStock }
    : { class: 'pill-by-order', label: d.wood.byOrder };
}
