/**
 * Vesper Moment — Chapter I, Madrid.
 *
 * The conversations filmed during the event. The list is empty until the edits
 * come back; /moment renders its "coming soon" state while it is, and switches
 * to the collection on its own as soon as entries appear here. Adding a
 * conversation means adding one object below — nothing else in the page needs
 * to change.
 *
 *   {
 *     id: "01",
 *     order: 1,
 *     athlete: "Marat Safin",
 *     discipline: "Tennis",
 *     videoUrl: "https://vimeo.com/123456789",
 *     thumbnail: "/assets/moment-01.jpg",
 *   }
 *
 * Any text field also accepts a per-language object when the wording should
 * differ: discipline: { en: "Tennis", es: "Tenis", fr: "Tennis" }.
 *
 * Videos are never committed to the repository or served from /public — they
 * live on Vimeo and travel as a URL.
 */

export type Lang = "en" | "es" | "fr";

/** One string for every language, or one per language. */
export type Localized = string | Record<Lang, string>;

export type VesperMoment = {
  /** Editorial numeral, shown in gold: "01", "02"… */
  id: string;
  /** Sort position within the chapter. */
  order: number;
  athlete: string;
  discipline: Localized;
  title?: Localized;
  description?: Localized;
  /** "12:40" — shown next to the discipline when present. */
  duration?: string;
  /** Vimeo link, in any of its forms. Absent means the entry stays a placeholder. */
  videoUrl?: string;
  /** Poster image under /public/assets. Absent falls back to a typographic plate. */
  thumbnail?: string;
};

export const MOMENTS: readonly VesperMoment[] = [];

/** Chapter order is data, never DOM order. */
export const orderedMoments = () => [...MOMENTS].sort((a, b) => a.order - b.order);

export const localized = (value: Localized | undefined, lang: Lang): string =>
  value === undefined ? "" : typeof value === "string" ? value : value[lang];

/**
 * Accepts https://vimeo.com/ID, https://vimeo.com/ID/HASH (unlisted videos),
 * or a player URL, and returns the embed source. Returns null for anything it
 * cannot read, so a malformed link degrades to the placeholder instead of
 * rendering a broken iframe.
 */
export function vimeoEmbedUrl(videoUrl: string | undefined): string | null {
  if (!videoUrl) return null;
  const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)(?:[/?]([0-9a-zA-Z]+))?/);
  if (!match) return null;
  const [, id, hash] = match;
  const params = new URLSearchParams({ title: "0", byline: "0", portrait: "0", dnt: "1" });
  if (hash) params.set("h", hash);
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}
