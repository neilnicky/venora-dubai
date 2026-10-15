// Line wipe: split text into rendered lines, cover each with a 90% overlay of the
// section colour, and scrub each cover's scaleX 1 → 0 line by line as the block scrolls through.
import { addScene, remeasure } from "./scroll.ts";
import { clamp01, reducedMotion } from "./env.ts";

interface Word {
  text: string;
  em: boolean;
}

function readWords(el: HTMLElement): Word[] {
  const words: Word[] = [];
  el.childNodes.forEach((node) => {
    const em = node instanceof HTMLElement && node.classList.contains("em");
    for (const w of (node.textContent ?? "").split(/\s+/)) if (w) words.push({ text: w, em });
  });
  return words;
}

function render(el: HTMLElement, words: Word[]): HTMLElement[] {
  el.textContent = "";
  const spans = words.map((w, i) => {
    const s = document.createElement("span");
    s.textContent = w.text;
    if (w.em) s.className = "em";
    el.append(s);
    if (i < words.length - 1) el.append(" ");
    return s;
  });
  // Group words by their rendered line.
  const lines: HTMLSpanElement[][] = [];
  let lastTop = 0;
  for (const s of spans) {
    const top = s.offsetTop;
    if (lines.length === 0 || Math.abs(top - lastTop) > 2) lines.push([]);
    lines[lines.length - 1]!.push(s);
    lastTop = top;
  }
  el.textContent = "";
  const centred = getComputedStyle(el).textAlign === "center";
  return lines.map((line) => {
    const row = document.createElement("span");
    row.className = "wipe-line";
    if (centred) row.style.marginInline = "auto";
    line.forEach((s, i) => {
      row.append(s);
      if (i < line.length - 1) row.append(" ");
    });
    const cover = document.createElement("span");
    cover.className = "wipe-cover";
    cover.setAttribute("aria-hidden", "true");
    row.append(cover);
    el.append(row);
    return cover;
  });
}

export function initWipes() {
  if (reducedMotion()) return;
  document.querySelectorAll<HTMLElement>("[data-wipe]").forEach((el) => {
    const words = readWords(el);
    let covers = render(el, words);

    addScene({
      el,
      range: ({ top, height }, vh) => [top - vh * 0.85, top + height - vh * 0.4],
      update: (p) => {
        const n = covers.length;
        covers.forEach((c, i) => {
          c.style.transform = `scaleX(${1 - clamp01(p * n - i)})`;
        });
      },
    });

    window.addEventListener("venora:resize", (e) => {
      if (!(e as CustomEvent<{ widthChanged: boolean }>).detail.widthChanged) return;
      covers = render(el, words);
      remeasure();
    });
  });
}
