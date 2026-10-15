// Querying, filtering and formatting for property records. Pure functions: the /homes page uses
// them at build time and the client-side filter uses them in the browser.
import { properties } from "@/content/properties.ts";
import type { Property, PropertyType, Unverified } from "@/content/types.ts";

export const propertyTypes: PropertyType[] = ["villa", "penthouse", "apartment"];

export const typeLabels: Record<PropertyType, { one: string; many: string }> = {
  villa: { one: "Villa", many: "Villas" },
  penthouse: { one: "Penthouse", many: "Penthouses" },
  apartment: { one: "Apartment", many: "Apartments" },
};

export type TypeFilter = PropertyType | "all";
export type SortOrder = "newest" | "oldest";

export interface HomeQuery {
  type: TypeFilter;
  sort: SortOrder;
}

export const defaultQuery: HomeQuery = { type: "all", sort: "newest" };

export function isPropertyType(value: unknown): value is PropertyType {
  return typeof value === "string" && (propertyTypes as string[]).includes(value);
}

/** Reads ?type= and ?sort= and falls back to defaults for anything unrecognised. */
export function parseQuery(params: URLSearchParams): HomeQuery {
  const type = params.get("type");
  const sort = params.get("sort");
  return {
    type: isPropertyType(type) ? type : "all",
    sort: sort === "oldest" ? "oldest" : "newest",
  };
}

export function queryToSearch(query: HomeQuery): string {
  const params = new URLSearchParams();
  if (query.type !== "all") params.set("type", query.type);
  if (query.sort !== "newest") params.set("sort", query.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
}

/** Newest first, with the slug as a stable tiebreak for homes presented on the same day. */
export function sortHomes<T extends Pick<Property, "presentedOn" | "slug">>(list: readonly T[], sort: SortOrder): T[] {
  const dir = sort === "newest" ? -1 : 1;
  return [...list].sort((a, b) => dir * a.presentedOn.localeCompare(b.presentedOn) || a.slug.localeCompare(b.slug));
}

export function filterHomes<T extends Pick<Property, "presentedOn" | "slug" | "type">>(list: readonly T[], query: HomeQuery): T[] {
  const matching = query.type === "all" ? list : list.filter((p) => p.type === query.type);
  return sortHomes(matching, query.sort);
}

export function countByType(list: readonly Pick<Property, "type">[]): Record<TypeFilter, number> {
  const counts: Record<TypeFilter, number> = { all: list.length, villa: 0, penthouse: 0, apartment: 0 };
  for (const p of list) counts[p.type] += 1;
  return counts;
}

export function allHomes(): Property[] {
  return sortHomes(properties, "newest");
}

export function getHome(slug: string): Property | undefined {
  return properties.find((p) => p.slug === slug);
}

/** Other homes, same type first, then newest. */
export function relatedHomes(home: Property, limit = 3): Property[] {
  const others = allHomes().filter((p) => p.slug !== home.slug);
  const same = others.filter((p) => p.type === home.type);
  const rest = others.filter((p) => p.type !== home.type);
  return [...same, ...rest].slice(0, limit);
}

export function presentedRange(list: readonly Pick<Property, "presentedOn">[]): { from: string; to: string } {
  const dates = list.map((p) => p.presentedOn).sort();
  return { from: dates[0] ?? "", to: dates[dates.length - 1] ?? "" };
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-10-13" -> "13 October 2026". Parsed by hand so output never depends on the runtime time zone. */
export function formatDate(iso: string, style: "long" | "short" = "long"): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d || m > 12) throw new Error(`Invalid ISO date: ${iso}`);
  const month = months[m - 1]!;
  return style === "long" ? `${d} ${month} ${y}` : `${d} ${month.slice(0, 3)} ${y}`;
}

/** Display value for an unverified field: the real value when known, otherwise the fallback label. */
export function displayValue<T>(value: Unverified<T>, format: (v: T) => string, fallback: string): string {
  return value === null ? fallback : format(value);
}
