/** Property types evidenced by Venora's captions and highlights. Add a type here only when a source shows it. */
export type PropertyType = "villa" | "penthouse" | "apartment";

/**
 * A value that has not been verified from any source.
 * `null` means unknown: the UI shows "On request", never a zero, an empty string or a guess.
 */
export type Unverified<T> = T | null;

export interface Still {
  /** File stem in src/assets/stills/ (built by `pnpm media`). */
  key: string;
  /** Timestamp in seconds within the source reel. */
  t: number;
  alt: string;
  /** CSS object-position for crops. */
  focal: string;
}

export interface InstagramSource {
  platform: "instagram";
  reelId: string;
  url: string;
  /** Caption text as published, hashtags removed. */
  caption: string;
  /** When we read the source. */
  checkedOn: string;
}

export interface Property {
  /** Stable URL id: `${type}-${presentedOn}`. */
  slug: string;
  type: PropertyType;
  /** Descriptive title written from what the film shows (proposed copy, not a marketing name). */
  title: string;
  /** ISO date Venora published the presentation. */
  presentedOn: string;
  /** The caption says "for sale"; current status is unconfirmed. */
  listing: { category: "sale"; availability: Unverified<"available" | "under-offer" | "sold"> };
  location: { city: "Dubai"; community: Unverified<string> };
  price: Unverified<{ amount: number; currency: "AED" }>;
  bedrooms: Unverified<number>;
  bathrooms: Unverified<number>;
  size: Unverified<{ value: number; unit: "sqft" | "sqm" }>;
  developer: Unverified<string>;
  completion: Unverified<string>;
  /** Features visible in the film. Observations, not specifications. */
  observed: string[];
  media: {
    poster: Still;
    gallery: Still[];
    /** Trimmed muted loop cut from the reel (seconds). */
    loop: { start: number; duration: number };
  };
  source: InstagramSource;
}
