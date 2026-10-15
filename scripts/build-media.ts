// Cuts web media from the Instagram source reels listed in src/content/properties.ts.
//   stills -> src/assets/stills/{key}.jpg              (720×1280; Astro optimises them at build)
//   loops  -> public/media/reels/{slug}-loop.mp4        (muted, trimmed, 540 wide, ~0.8 MB)
//   films  -> public/media/reels/{slug}-film.mp4        (full walkthrough, muted, 540 wide)
// Sources live in media-source/reels/{reelId}.mp4 (git-ignored; see docs/property-content-audit.md).
//
//   pnpm media            build anything missing
//   pnpm media --force    rebuild everything
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { properties } from "../src/content/properties.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const force = process.argv.includes("--force");
const stillsDir = `${root}src/assets/stills`;
const reelsDir = `${root}public/media/reels`;
mkdirSync(stillsDir, { recursive: true });
mkdirSync(reelsDir, { recursive: true });

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
}

const h264 = ["-an", "-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"];

for (const p of properties) {
  const src = `${root}media-source/reels/${p.source.reelId}.mp4`;
  if (!existsSync(src)) throw new Error(`Missing source reel for ${p.slug}: ${src}`);

  for (const still of [p.media.poster, ...p.media.gallery]) {
    const out = `${stillsDir}/${still.key}.jpg`;
    if (force || !existsSync(out)) ffmpeg(["-ss", String(still.t), "-i", src, "-frames:v", "1", "-q:v", "2", out]);
  }

  const loop = `${reelsDir}/${p.slug}-loop.mp4`;
  if (force || !existsSync(loop)) {
    const { start, duration } = p.media.loop;
    ffmpeg(["-ss", String(start), "-t", String(duration), "-i", src, "-vf", "fps=30,scale=540:-2", "-crf", "26", ...h264, loop]);
  }

  const film = `${reelsDir}/${p.slug}-film.mp4`;
  if (force || !existsSync(film)) ffmpeg(["-i", src, "-vf", "fps=30,scale=540:-2", "-crf", "28", ...h264, film]);

  console.log(`media: ${p.slug}`);
}
