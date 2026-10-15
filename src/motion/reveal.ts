// One-shot enter reveals: adds .is-in when an element first becomes visible.
export function initReveals() {
  const els = document.querySelectorAll<HTMLElement>("[data-reveal], [data-cascade]");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
  );
  els.forEach((el) => io.observe(el));
}
