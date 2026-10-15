// Loop videos load only when needed and play only while visible. Card loops play on hover (fine
// pointers only). Reduced motion or Save-Data: posters only, nothing streams.
import { canHover, lightMedia } from "./env.ts";

function load(v: HTMLVideoElement) {
  if (!v.src && v.dataset.src) v.src = v.dataset.src;
}

function play(v: HTMLVideoElement) {
  load(v);
  v.play().then(
    () => v.classList.add("is-playing"),
    () => v.classList.remove("is-playing"),
  );
}

export function initVideos() {
  if (lightMedia()) return;
  const all = [...document.querySelectorAll<HTMLVideoElement>("video[data-loop]")];
  const inCards = (v: HTMLVideoElement) => v.closest("[data-home-card]");

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) play(v);
        else v.pause();
      }
    },
    { rootMargin: "150px 0px" },
  );

  for (const v of all) {
    if (inCards(v)) continue;
    if (v.preload === "auto") load(v);
    io.observe(v);
  }

  if (!canHover()) return;
  for (const v of all) {
    const card = inCards(v);
    if (!card) continue;
    card.addEventListener("pointerenter", () => play(v));
    card.addEventListener("pointerleave", () => v.pause());
  }
}
