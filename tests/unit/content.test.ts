// Guards the brief's honesty rules: no fabricated facts, no unverified contact channels, complete media.
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { properties } from "@/content/properties.ts";
import { siteConfig } from "@/content/site-config.ts";
import * as copy from "@/content/venora-content.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));

describe("property records", () => {
  it("have unique slugs and source reels", () => {
    expect(new Set(properties.map((p) => p.slug)).size).toBe(properties.length);
    expect(new Set(properties.map((p) => p.source.reelId)).size).toBe(properties.length);
  });

  it("keep unverified facts null until a source confirms them", () => {
    for (const p of properties) {
      expect(p.price, p.slug).toBeNull();
      expect(p.bedrooms, p.slug).toBeNull();
      expect(p.bathrooms, p.slug).toBeNull();
      expect(p.size, p.slug).toBeNull();
      expect(p.developer, p.slug).toBeNull();
      expect(p.completion, p.slug).toBeNull();
      expect(p.location.community, p.slug).toBeNull();
      expect(p.listing.availability, p.slug).toBeNull();
    }
  });

  it("match their caption's property type", () => {
    for (const p of properties) expect(p.source.caption.toLowerCase(), p.slug).toContain(p.type);
  });

  it("use a still only once across the site", () => {
    const keys = properties.flatMap((p) => [p.media.poster, ...p.media.gallery].map((s) => s.key));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("have alt text, stills, a loop and a film on disk", () => {
    for (const p of properties) {
      for (const still of [p.media.poster, ...p.media.gallery]) {
        expect(still.alt.length, still.key).toBeGreaterThan(10);
        expect(existsSync(`${root}src/assets/stills/${still.key}.jpg`), still.key).toBe(true);
      }
      expect(existsSync(`${root}public/media/reels/${p.slug}-loop.mp4`), p.slug).toBe(true);
      expect(existsSync(`${root}public/media/reels/${p.slug}-film.mp4`), p.slug).toBe(true);
    }
  });
});

describe("contact configuration", () => {
  it("publishes only the verified Instagram channel", () => {
    const { phone, whatsapp, email, address, instagram } = siteConfig.contact;
    expect([phone, whatsapp, email, address]).toEqual([null, null, null, null]);
    expect(instagram.dmUrl).toBe(`https://ig.me/m/${instagram.handle}`);
  });
});

describe("editorial copy", () => {
  const text = JSON.stringify(copy);
  it("makes no unsupported claims", () => {
    for (const banned of [/\btestimonial/i, /\baward/i, /\bROI\b/, /\byield/i, /guaranteed/i, /\bRERA\b/, /years of experience/i]) {
      expect(text, String(banned)).not.toMatch(banned);
    }
  });
  it("avoids em dashes (house style)", () => {
    expect(text).not.toContain("—");
  });
});
