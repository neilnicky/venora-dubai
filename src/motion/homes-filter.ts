// Client-side filter for /homes. The logic lives in src/lib/homes.ts; this only maps it onto the DOM.
import { filterHomes, parseQuery, queryToSearch, typeLabels, type HomeQuery } from "@/lib/homes.ts";
import type { PropertyType } from "@/content/types.ts";

export function initHomesFilter() {
  const grid = document.querySelector<HTMLElement>("[data-homes-grid]");
  if (!grid) return;
  const cards = [...grid.querySelectorAll<HTMLElement>("[data-home-card]")].map((el) => ({
    el,
    slug: el.dataset.slug!,
    type: el.dataset.type as PropertyType,
    presentedOn: el.dataset.date!,
  }));
  const pills = [...document.querySelectorAll<HTMLAnchorElement>("[data-filter]")];
  const sort = document.querySelector<HTMLSelectElement>("[data-sort]")!;
  const count = document.querySelector<HTMLElement>("[data-homes-count]")!;
  const empty = document.querySelector<HTMLElement>("[data-homes-empty]")!;
  let query: HomeQuery = parseQuery(new URLSearchParams(window.location.search));

  const apply = (push: boolean) => {
    const visible = filterHomes(cards, query);
    for (const c of cards) c.el.hidden = true;
    for (const c of visible) {
      c.el.hidden = false;
      grid.append(c.el);
    }
    for (const p of pills) p.setAttribute("aria-pressed", String(p.dataset.filter === query.type));
    sort.value = query.sort;
    const n = visible.length;
    const what = query.type === "all" ? (n === 1 ? "home" : "homes") : typeLabels[query.type][n === 1 ? "one" : "many"].toLowerCase();
    count.textContent = `Showing ${n} ${what}`;
    empty.hidden = n > 0;
    if (push) window.history.replaceState(null, "", `/homes${queryToSearch(query)}`);
  };

  for (const p of pills) {
    p.addEventListener("click", (e) => {
      e.preventDefault();
      query = { ...query, type: (p.dataset.filter ?? "all") as HomeQuery["type"] };
      apply(true);
    });
  }
  sort.addEventListener("change", () => {
    query = { ...query, sort: sort.value === "oldest" ? "oldest" : "newest" };
    apply(true);
  });
  apply(false);
}
