// Every home Venora has presented that we could verify. Source: @venora_dubai reels, read 15 Oct 2026.
// Only type, date, "for sale" and what the film shows are verified. Everything else stays null until
// Venora confirms it (see docs/property-content-audit.md). To add a home: add a record, run `pnpm media`.
import type { Property, PropertyType } from "./types.ts";

const CHECKED_ON = "2026-10-15";

const unverified = {
  listing: { category: "sale", availability: null },
  location: { city: "Dubai", community: null },
  price: null,
  bedrooms: null,
  bathrooms: null,
  size: null,
  developer: null,
  completion: null,
} as const satisfies Partial<Property>;

function reel(reelId: string, caption: string): Property["source"] {
  return {
    platform: "instagram",
    reelId,
    url: `https://www.instagram.com/venora_dubai/reel/${reelId}/`,
    caption,
    checkedOn: CHECKED_ON,
  };
}

function home(
  type: PropertyType,
  presentedOn: string,
  rest: Pick<Property, "title" | "observed" | "media" | "source">,
): Property {
  return { slug: `${type}-${presentedOn}`, type, presentedOn, ...unverified, ...rest };
}

export const properties: Property[] = [
  home("villa", "2026-10-13", {
    title: "Villa with a double-height salon and garden pool",
    observed: ["Double-height living room", "Full-height glazing to the garden", "Pool with a shaded cabana", "Landscaped, palm-planted garden"],
    media: {
      poster: { key: "villa-2026-10-13-a", t: 6, alt: "Double-height living room with a glass chandelier and full-height windows onto a garden", focal: "50% 45%" },
      gallery: [{ key: "villa-2026-10-13-b", t: 16, alt: "Garden pool with a cabana, lawn and mature trees", focal: "50% 60%" }],
      loop: { start: 4, duration: 8 },
    },
    source: reel("DebXKIxsAkw", "Luxury villa for sale in Dubai most prestigious community, contact us now for more information"),
  }),
  home("villa", "2026-10-09", {
    title: "Marble villa with a backlit onyx lounge",
    observed: ["Backlit onyx feature wall", "Floating staircase under a cascade chandelier", "Marble floors throughout", "Pool terrace beyond the living room"],
    media: {
      poster: { key: "villa-2026-10-09-a", t: 19, alt: "Lounge with curved sofas in front of a glowing onyx wall", focal: "45% 50%" },
      gallery: [{ key: "villa-2026-10-09-b", t: 0.5, alt: "Stone and glass villa facade with a timber pergola", focal: "40% 50%" }],
      loop: { start: 10, duration: 8 },
    },
    source: reel("DeRAGRJsSvN", "Ultra luxury villa for sale in Dubai most prestigious community, contact us now for more information"),
  }),
  home("villa", "2026-10-06", {
    title: "White villa behind a pivot door",
    observed: ["White contemporary facade", "Full-height pivot front door", "Double-height living room", "Dining room facing the garden"],
    media: {
      poster: { key: "villa-2026-10-06-a", t: 4.7, alt: "White cubic villa facade with a black pivot door and palm planting", focal: "50% 55%" },
      gallery: [{ key: "villa-2026-10-06-b", t: 7, alt: "Pivot door open onto a pale stone hall", focal: "50% 50%" }],
      loop: { start: 0, duration: 9 },
    },
    source: reel("DeLgdPpMHIa", "Ultra luxury villa for sale in Dubai most luxurious community, contact us now for more information"),
  }),
  home("villa", "2026-10-01", {
    title: "Villa with a sunken pool lounge",
    observed: ["Double-height living room", "Glass-balustrade staircase", "Sunken lounge beside an infinity pool", "Open green outlook beyond the pool"],
    media: {
      poster: { key: "villa-2026-10-01-a", t: 2.7, alt: "Bright double-height living room with a tall window onto a pool", focal: "50% 50%" },
      gallery: [{ key: "villa-2026-10-01-b", t: 26.7, alt: "Sunken outdoor lounge set into a pool deck", focal: "50% 55%" }],
      loop: { start: 0, duration: 8 },
    },
    source: reel("Dd9CQGjsh6t", "Luxury Villa for sale in Dubai."),
  }),
  home("apartment", "2026-09-30", {
    title: "Skyline apartment with an open marble kitchen",
    observed: ["Floor-to-ceiling windows with skyline views", "Open kitchen in marble and timber", "Dining area under a chandelier", "Separate living room"],
    media: {
      poster: { key: "apartment-2026-09-30-a", t: 0.5, alt: "Dining table under a chandelier with towers visible through tall windows", focal: "50% 45%" },
      gallery: [{ key: "apartment-2026-09-30-b", t: 10.3, alt: "Marble kitchen with a gas hob beside a window onto the skyline", focal: "50% 50%" }],
      loop: { start: 0, duration: 8 },
    },
    source: reel("Dd6Y9N7seI9", "Luxury apartment for sale in Dubai"),
  }),
  home("penthouse", "2026-09-28", {
    title: "Penthouse over a yacht marina",
    observed: ["Marina and tower views", "Wraparound glazing", "Open-plan living and dining", "Curved terrace"],
    media: {
      poster: { key: "penthouse-2026-09-28-a", t: 15, alt: "View from a high terrace over a yacht marina lined with towers", focal: "40% 50%" },
      gallery: [{ key: "penthouse-2026-09-28-b", t: 5, alt: "Open-plan living room with sculptural furniture and city views", focal: "50% 50%" }],
      loop: { start: 12, duration: 8 },
    },
    source: reel("Dd1SeRxMS-z", "Luxury penthouse for sale in Dubai"),
  }),
  home("villa", "2026-09-23", {
    title: "Marble villa with a chandelier atrium",
    observed: ["Marble floors", "Atrium with a full-height chandelier", "Formal dining room", "Terrace off the living areas"],
    media: {
      poster: { key: "villa-2026-09-23-a", t: 7.3, alt: "Marble living room with low sofas and a glass chandelier", focal: "50% 50%" },
      gallery: [{ key: "villa-2026-09-23-b", t: 18.2, alt: "Dining table beneath a tall atrium chandelier", focal: "50% 45%" }],
      loop: { start: 0, duration: 8 },
    },
    source: reel("Ddn1fjLshCx", "Luxury villa for sale in Dubai"),
  }),
  home("villa", "2026-09-21", {
    title: "Villa opening onto a garden pool",
    observed: ["Double-height living room", "Garden pool beyond sliding glass", "Stone island kitchen", "Travertine feature walls"],
    media: {
      poster: { key: "villa-2026-09-21-a", t: 4, alt: "Sliding glass wall open onto a garden pool and palms", focal: "50% 55%" },
      gallery: [{ key: "villa-2026-09-21-b", t: 0.5, alt: "Double-height living room with tall windows onto the garden", focal: "50% 50%" }],
      loop: { start: 0, duration: 8 },
    },
    source: reel("DdjBe4csG7h", "Luxury villa for sale in Dubai"),
  }),
  home("villa", "2026-09-16", {
    title: "Travertine villa with in-pool loungers",
    observed: ["Travertine floors and columns", "Pool with in-water loungers", "Full-height sliding glazing", "Formal dining room"],
    media: {
      poster: { key: "villa-2026-09-16-a", t: 8.5, alt: "Pool with in-water loungers seen through full-height sliding glass", focal: "55% 55%" },
      gallery: [{ key: "villa-2026-09-16-b", t: 14, alt: "Living room with grey sofas and sliding doors to the garden", focal: "50% 50%" }],
      loop: { start: 6, duration: 8 },
    },
    source: reel("DdWNDZaMOI0", "Luxury villa for sale in Dubai"),
  }),
  home("penthouse", "2026-09-14", {
    title: "Sea-view penthouse with a terrace pool",
    observed: ["Private pool on a planted terrace", "Open sea views", "Outdoor dining beside the pool", "Covered terrace walkway"],
    media: {
      poster: { key: "penthouse-2026-09-14-a", t: 3.3, alt: "Terrace pool framed by planting and an outdoor dining area", focal: "50% 60%" },
      gallery: [{ key: "penthouse-2026-09-14-b", t: 33, alt: "View over the sea from a high terrace", focal: "50% 50%" }],
      loop: { start: 0, duration: 8 },
    },
    source: reel("DdS88dKsDzG", "Luxury penthouse for sale in Dubai"),
  }),
  home("villa", "2026-09-14", {
    title: "Garden villa with a stone island kitchen",
    observed: ["Living room opening to the garden", "Stone island kitchen", "Garden pool", "Full-height glazing"],
    media: {
      poster: { key: "villa-2026-09-14-a", t: 9.1, alt: "Living room with full-height windows onto a garden pool", focal: "50% 50%" },
      gallery: [{ key: "villa-2026-09-14-b", t: 30.2, alt: "Stone kitchen island with a hob, facing the garden", focal: "50% 50%" }],
      loop: { start: 7, duration: 8 },
    },
    source: reel("DdRH57EMqE1", "Luxury villa for sale"),
  }),
  home("villa", "2026-09-09", {
    title: "Villa with marble floors and a slatted timber ceiling",
    observed: ["Marble floors", "Slatted timber ceiling", "Backlit onyx counter", "Garden views from the living areas"],
    media: {
      poster: { key: "villa-2026-09-09-a", t: 25, alt: "Marble-floored hall with timber doorways and a dining room beyond", focal: "50% 50%" },
      gallery: [{ key: "villa-2026-09-09-b", t: 10.8, alt: "Living room with a stone coffee table and garden windows", focal: "50% 50%" }],
      loop: { start: 0, duration: 8 },
    },
    source: reel("DdEQCzlMs_y", "Luxury villa for sale in Dubai"),
  }),
];
