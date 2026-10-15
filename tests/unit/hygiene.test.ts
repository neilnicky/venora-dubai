// Keeps the public codebase Venora-only. Retired names are stored as SHA-256 hashes so this file
// never spells them out. Scans every file Git would track (respecting .gitignore).
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../", import.meta.url));

/** sha256 of retired names, lowercased with all separators removed. */
const retired = new Set([
  "7a4573fe2e5115c186e0f9c5b1ee459d24426262ec4757cf7ee63adf598e0419",
  "34db9b278697ebfa6bacc4c8931a40a91b55336379666b6dc5fc59b3bf025091",
  "a43135b82ff7df35103b9adb7917956e52f231c593fd74eb7b114b54ae332c2f",
]);

const binary = /\.(mp4|jpe?g|png|webp|avif|gif|ico|woff2?|ttf)$/i;
const sha = (s: string) => createHash("sha256").update(s).digest("hex");

function trackableFiles(): string[] {
  const out = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { cwd: root, encoding: "utf8" });
  return out.split("\n").filter((f) => f && !binary.test(f));
}

/** Words plus runs of up to 4 adjacent words joined, so spaced, hyphenated or dotted forms all match. */
function hits(text: string): boolean {
  const words = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  for (let i = 0; i < words.length; i++) {
    let joined = "";
    for (let n = 0; n < 4 && i + n < words.length; n++) {
      joined += words[i + n];
      if (retired.has(sha(joined))) return true;
    }
  }
  return false;
}

describe("repository hygiene", () => {
  const files = trackableFiles();

  it("finds the files Git would commit", () => {
    expect(files).toContain("package.json");
    expect(files.some((f) => f.startsWith("src/"))).toBe(true);
  });

  it("keeps internal notes out of version control", () => {
    expect(files.filter((f) => f.startsWith("docs/internal/") || /_brief\.md$/i.test(f))).toEqual([]);
  });

  it("never uses retired names in paths or contents", () => {
    const offenders = files.filter((f) => hits(f) || hits(readFileSync(`${root}${f}`, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("detects the retired names in any spelling", () => {
    // Self-check without spelling the names: rebuild one from its parts at runtime.
    const parts = ["fi", "nd", "real", "es", "tate"];
    expect(hits(`${parts[0]}${parts[1]} ${parts[2]}-${parts[3]}${parts[4]}.com`)).toBe(true);
    expect(hits("Venora luxury real estate")).toBe(false);
  });
});
