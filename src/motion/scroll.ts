// One rAF-batched scroll loop drives every scrubbed scene. Scenes write transforms/opacity only.
import Lenis from "lenis";
import { clamp01, reducedMotion } from "./env.ts";

export interface Scene {
  el: HTMLElement;
  /** Scroll positions where progress is 0 and 1, from the element's document geometry. */
  range: (geom: { top: number; height: number }, vh: number) => [number, number];
  update: (p: number) => void;
  /** Called after re-measuring (resize, layout shifts). */
  measure?: () => void;
}

interface Tracked extends Scene {
  start: number;
  end: number;
  last: number;
}

const scenes: Tracked[] = [];
const frameListeners: Array<(y: number) => void> = [];
let queued = false;
let lenis: Lenis | null = null;

function measure(s: Tracked) {
  const r = s.el.getBoundingClientRect();
  const [start, end] = s.range({ top: r.top + window.scrollY, height: r.height }, window.innerHeight);
  s.start = start;
  s.end = Math.max(end, start + 1);
  s.last = -1;
  s.measure?.();
}

function tick() {
  queued = false;
  const y = window.scrollY;
  for (const s of scenes) {
    const p = clamp01((y - s.start) / (s.end - s.start));
    if (p !== s.last) {
      s.last = p;
      s.update(p);
    }
  }
  for (const fn of frameListeners) fn(y);
}

export function requestTick() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(tick);
}

export function addScene(scene: Scene) {
  const s: Tracked = { ...scene, start: 0, end: 1, last: -1 };
  scenes.push(s);
  measure(s);
  requestTick();
}

export function remeasure() {
  for (const s of scenes) measure(s);
  requestTick();
}

export function onFrame(fn: (y: number) => void) {
  frameListeners.push(fn);
  requestTick();
}

/** Pause smooth scrolling while a modal is open. */
export function lockScroll(locked: boolean) {
  if (!lenis) return;
  if (locked) lenis.stop();
  else lenis.start();
}

export function initScroll() {
  if (!reducedMotion()) {
    lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.1 });
  }
  window.addEventListener("scroll", requestTick, { passive: true });

  let lastWidth = window.innerWidth;
  let timer = 0;
  const onResize = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      const widthChanged = window.innerWidth !== lastWidth;
      lastWidth = window.innerWidth;
      window.dispatchEvent(new CustomEvent("venora:resize", { detail: { widthChanged } }));
      remeasure();
    }, 150);
  };
  window.addEventListener("resize", onResize);
  // Fonts and lazy media change page height; keep scene ranges accurate.
  new ResizeObserver(onResize).observe(document.body);
  document.fonts?.ready.then(remeasure);
}
