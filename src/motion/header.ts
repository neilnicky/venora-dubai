// Header: hides on scroll down, returns on scroll up; transparent over the
// home hero until the pinned scene ends; picks its colour from the section beneath it.
import { onFrame } from "./scroll.ts";

export function initHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  let lastY = window.scrollY;
  let focusInside = false;

  header.addEventListener("focusin", () => {
    focusInside = true;
    header.dataset.hidden = "false";
  });
  header.addEventListener("focusout", () => (focusInside = false));

  onFrame((y) => {
    const delta = y - lastY;
    if (Math.abs(delta) > 4) {
      header.dataset.hidden = String(delta > 0 && y > 160 && !focusInside);
      lastY = y;
    }

    if (hero) {
      const heroEnd = hero.offsetTop + hero.offsetHeight - window.innerHeight * 1.05;
      header.dataset.solid = String(y > heroEnd);
    }

    const probeY = header.offsetHeight / 2;
    const under = document
      .elementsFromPoint(window.innerWidth / 2, probeY)
      .find((el) => !header.contains(el) && el !== header);
    const themed = under?.closest<HTMLElement>("[data-header-theme]");
    header.dataset.theme = themed?.dataset.headerTheme ?? "light";
  });
}
