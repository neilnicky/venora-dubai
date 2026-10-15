// Hero timeline by scroll progress (docs/design-system.md, Motion):
//   0–25%  copy fades/shrinks/drifts down; wordmark outline fades in over the rising frame
//   30–50% frame crossfades into the wordmark-masked facade; outline fades out
//   always  frame scales 1 → 1.29 and climbs toward centre (ease-out); haze bank rises
//   84–98% veil fades the stage to paper, handing off to the next section
import { addScene } from "./scroll.ts";
import { easeOut, reducedMotion, segment } from "./env.ts";

export function initHero() {
  const root = document.querySelector<HTMLElement>("[data-hero]");
  if (!root || reducedMotion()) return;
  const q = <T extends Element>(sel: string) => root.querySelector<T>(sel)!;
  const content = q<HTMLElement>("[data-hero-content]");
  const frame = q<HTMLElement>("[data-hero-frame]");
  const composite = q<HTMLElement>("[data-hero-composite]");
  const outline = q<SVGElement>(".hero__outline");
  const tag = q<HTMLElement>("[data-hero-tag]");
  const haze = q<HTMLElement>("[data-hero-haze]");
  const veil = q<HTMLElement>("[data-hero-veil]");
  const mark = q<HTMLElement>("[data-hero-mark]");

  // Natural (untransformed) geometry of the frame and the wordmark box within the stage.
  let frameTop = 0;
  let frameH = 0;
  let markCenter = 0;

  addScene({
    el: root,
    range: ({ top, height }, vh) => [top, top + height - vh],
    measure: () => {
      frameTop = frame.offsetTop;
      frameH = frame.offsetHeight;
      markCenter = mark.offsetTop;
    },
    update: (p) => {
      const e = easeOut(p);
      const c = segment(p, 0, 0.25);
      content.style.opacity = String(1 - segment(p, 0, 0.2));
      content.style.transform = `translate3d(0, ${66 * c}px, 0) scale(${1 - 0.04 * c})`;
      content.style.visibility = p > 0.22 ? "hidden" : "";

      const s = 1 + 0.29 * e;
      const rise = easeOut(segment(p, 0, 0.5));
      const dy = rise * (markCenter - frameTop - (frameH * s) / 2);
      frame.style.transform = `translate3d(0, ${dy}px, 0) scale(${s})`;
      frame.style.opacity = String(1 - segment(p, 0.3, 0.5));

      outline.style.opacity = String(segment(p, 0.04, 0.24) * (1 - segment(p, 0.34, 0.5)));
      composite.style.opacity = String(segment(p, 0.3, 0.5));
      composite.style.transform = `scale(${1.08 - 0.08 * segment(p, 0.3, 0.75)})`;
      tag.style.opacity = String(segment(p, 0.46, 0.6));

      haze.style.transform = `translate3d(0, ${55 * (1 - e)}%, 0)`;
      veil.style.opacity = String(segment(p, 0.84, 0.98));
      root.dataset.headerTheme = p > 0.9 ? "light" : "dark";
    },
  });
}
