import { describe, expect, it } from "vitest";
import {
  countByType,
  displayValue,
  filterHomes,
  formatDate,
  getHome,
  parseQuery,
  presentedRange,
  queryToSearch,
  relatedHomes,
  sortHomes,
} from "@/lib/homes.ts";
import { properties } from "@/content/properties.ts";

const sample = [
  { slug: "villa-2026-01-02", type: "villa", presentedOn: "2026-01-02" },
  { slug: "penthouse-2026-01-03", type: "penthouse", presentedOn: "2026-01-03" },
  { slug: "villa-2026-01-03", type: "villa", presentedOn: "2026-01-03" },
  { slug: "apartment-2026-01-01", type: "apartment", presentedOn: "2026-01-01" },
] as const;

describe("parseQuery", () => {
  it("reads valid type and sort", () => {
    expect(parseQuery(new URLSearchParams("type=penthouse&sort=oldest"))).toEqual({ type: "penthouse", sort: "oldest" });
  });
  it("falls back for unknown values", () => {
    expect(parseQuery(new URLSearchParams("type=castle&sort=price"))).toEqual({ type: "all", sort: "newest" });
  });
  it("round-trips through queryToSearch", () => {
    expect(queryToSearch({ type: "villa", sort: "oldest" })).toBe("?type=villa&sort=oldest");
    expect(queryToSearch({ type: "all", sort: "newest" })).toBe("");
  });
});

describe("filterHomes", () => {
  it("returns everything for 'all', newest first with a stable tiebreak", () => {
    expect(filterHomes(sample, { type: "all", sort: "newest" }).map((p) => p.slug)).toEqual([
      "penthouse-2026-01-03",
      "villa-2026-01-03",
      "villa-2026-01-02",
      "apartment-2026-01-01",
    ]);
  });
  it("filters by type and sorts oldest first", () => {
    expect(filterHomes(sample, { type: "villa", sort: "oldest" }).map((p) => p.slug)).toEqual(["villa-2026-01-02", "villa-2026-01-03"]);
  });
  it("does not mutate its input", () => {
    const copy = [...sample];
    sortHomes(copy, "oldest");
    expect(copy).toEqual([...sample]);
  });
});

describe("countByType", () => {
  it("counts each type and the total", () => {
    expect(countByType(sample)).toEqual({ all: 4, villa: 2, penthouse: 1, apartment: 1 });
  });
});

describe("formatDate", () => {
  it("formats long and short dates without time zone drift", () => {
    expect(formatDate("2026-10-13")).toBe("13 October 2026");
    expect(formatDate("2026-09-09", "short")).toBe("9 Sep 2026");
  });
  it("rejects malformed input", () => {
    expect(() => formatDate("13/10/2026")).toThrow();
  });
});

describe("displayValue", () => {
  it("shows the fallback for unverified fields, never a zero or blank", () => {
    expect(displayValue<number>(null, String, "On request")).toBe("On request");
    expect(displayValue(4, (n) => `${n} bedrooms`, "On request")).toBe("4 bedrooms");
  });
});

describe("real data helpers", () => {
  it("finds homes by slug", () => {
    const first = properties[0]!;
    expect(getHome(first.slug)).toBe(first);
    expect(getHome("nope")).toBeUndefined();
  });
  it("relates same-type homes first and excludes the current home", () => {
    const penthouse = properties.find((p) => p.type === "penthouse")!;
    const related = relatedHomes(penthouse, 3);
    expect(related).toHaveLength(3);
    expect(related.some((p) => p.slug === penthouse.slug)).toBe(false);
    expect(related[0]!.type).toBe("penthouse");
  });
  it("reports the presented date range", () => {
    expect(presentedRange(properties)).toEqual({ from: "2026-09-09", to: "2026-10-13" });
  });
});
