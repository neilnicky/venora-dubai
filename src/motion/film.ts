// Home page film: nothing downloads until the visitor presses play.
export function initFilm() {
  document.querySelectorAll<HTMLElement>("[data-film]").forEach((fig) => {
    const video = fig.querySelector<HTMLVideoElement>("[data-film-video]")!;
    const button = fig.querySelector<HTMLButtonElement>("[data-film-play]")!;
    button.addEventListener("click", () => {
      if (!video.src && video.dataset.src) video.src = video.dataset.src;
      video.muted = true;
      video.controls = true;
      fig.classList.add("is-playing");
      video.play().catch(() => {});
      video.focus();
    });
  });
}
