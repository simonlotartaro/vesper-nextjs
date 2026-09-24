/**
 * Vesper chapters.
 *
 * Events is no longer one event page: it is an index of chapters, and each
 * chapter that has happened keeps its own archive. Adding Chapter III later
 * means adding one object here — the index renders itself from this list.
 *
 * Two arrays below are deliberately empty. The repository holds no
 * photography from the Madrid night and no confirmed list of who attended,
 * and neither is something to invent: the venue's own press images are not
 * event photographs, and a guest who cancelled must never appear as if they
 * had been there. The sections read from these arrays and simply do not
 * render while they are empty.
 */

export type Lang = "en" | "es" | "fr";

/** One string for every language, or one per language. */
export type Localized = string | Record<Lang, string>;

export const localized = (value: Localized | undefined, lang: Lang): string =>
  value === undefined ? "" : typeof value === "string" ? value : value[lang];

export type VesperChapter = {
  id: string;
  /** Editorial numeral, shown in gold: "01", "02"… */
  numeral: string;
  /** "CHAPTER I" — the roman numeral carries across languages. */
  chapter: string;
  city: string;
  sport?: Localized;
  date?: Localized;
  venue?: string;
  status: "upcoming" | "past";
  tagline?: Localized;
  heroImage?: string;
  /** Only a chapter with an archive can be opened from the index. */
  hasArchive?: boolean;
};

export const CHAPTERS: readonly VesperChapter[] = [
  {
    id: "buenos-aires",
    numeral: "02",
    chapter: "CHAPTER II",
    city: "BUENOS AIRES",
    sport: "POLO",
    status: "upcoming",
    heroImage: "/assets/polo-buenos-aires.jpg",
    tagline: {
      en: "The next chapter of Vesper is taking shape around one of Argentina's defining sporting worlds.",
      es: "El próximo capítulo de Vesper comienza a tomar forma alrededor de uno de los grandes universos deportivos de Argentina.",
      fr: "Le prochain chapitre de Vesper prend forme autour de l'un des grands univers sportifs de l'Argentine.",
    },
    // No date, venue, hosts, athletes or tickets: none of it is confirmed yet.
  },
  {
    id: "madrid",
    numeral: "01",
    chapter: "CHAPTER I",
    city: "MADRID",
    date: {
      en: "13 SEPTEMBER 2026",
      es: "13 DE SEPTIEMBRE DE 2026",
      fr: "13 SEPTEMBRE 2026",
    },
    venue: "RAMSÉS · MADRID",
    status: "past",
    heroImage: "/assets/Ramses.png",
    tagline: {
      en: "Where Vesper began.",
      es: "Donde comenzó Vesper.",
      fr: "Là où Vesper a commencé.",
    },
    hasArchive: true,
  },
];

export const upcomingChapters = () => CHAPTERS.filter((c) => c.status === "upcoming");
export const pastChapters = () => CHAPTERS.filter((c) => c.status === "past");
export const chapterById = (id: string) => CHAPTERS.find((c) => c.id === id) ?? null;

export type ChapterPhoto = {
  src: string;
  alt: Localized;
  orientation: "landscape" | "portrait";
};

export type ChapterParticipant = {
  name: string;
  discipline: Localized;
};

/** Photography from the night. Empty until real images exist in the repo. */
export const MADRID_GALLERY: readonly ChapterPhoto[] = [];

/** Confirmed participants. Empty until a verified list exists — never guessed. */
export const MADRID_PARTICIPANTS: readonly ChapterParticipant[] = [];
