// Media panel that grows into place as it enters (the Why triptych).
import { addScene } from "./scroll.ts";
import { easeOut, reducedMotion } from "./env.ts";

export function initGrow() {
  if (reducedMotion()) return;
  document.querySelectorAll<HTMLElement>("[data-grow]").forEach((el) => {
    addScene({
      el,
      range: ({ top }, vh) => [top - vh, top - vh * 0.25],
      update: (p) => {
        const r = 1 - easeOut(p);
        el.style.clipPath = `inset(${r * 10}% ${r * 9}% ${r * 4}% ${r * 9}%)`;
        el.style.transform = `translate3d(0, ${r * 40}px, 0)`;
      },
    });
  });
}
