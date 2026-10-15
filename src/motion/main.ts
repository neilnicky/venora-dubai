// Client entry. Each module is independent and no-ops on pages without its markup.
import { initScroll } from "./scroll.ts";
import { initHero } from "./hero.ts";
import { initWipes } from "./wipe.ts";
import { initGrow } from "./grow.ts";
import { initReveals } from "./reveal.ts";
import { initVideos } from "./video.ts";
import { initHeader } from "./header.ts";
import { initMenu } from "./menu.ts";
import { initEnquiry } from "./enquiry.ts";
import { initHomesFilter } from "./homes-filter.ts";
import { initFilm } from "./film.ts";

initScroll();
initHero();
initWipes();
initGrow();
initReveals();
initVideos();
initHeader();
initMenu();
initEnquiry();
initHomesFilter();
initFilm();
