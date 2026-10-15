// Mobile menu: native <dialog> gives focus trapping, Escape and inert background.
import { lockScroll } from "./scroll.ts";

export function initMenu() {
  const menu = document.querySelector<HTMLDialogElement>("[data-menu]");
  const opener = document.querySelector<HTMLButtonElement>("[data-menu-open]");
  if (!menu || !opener) return;
  opener.addEventListener("click", () => {
    menu.showModal();
    opener.setAttribute("aria-expanded", "true");
    lockScroll(true);
  });
  menu.querySelector("[data-menu-close]")?.addEventListener("click", () => menu.close());
  menu.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a")) menu.close();
  });
  menu.addEventListener("close", () => {
    opener.setAttribute("aria-expanded", "false");
    lockScroll(false);
  });
  // Close if the viewport grows past the mobile breakpoint.
  window.matchMedia("(min-width: 900px)").addEventListener("change", (e) => e.matches && menu.open && menu.close());
}
