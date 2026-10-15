export const reducedMotion = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Save-Data or reduced motion: show posters instead of streaming loops. */
export const lightMedia = (): boolean =>
  reducedMotion() || Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

export const canHover = (): boolean => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Progress of `p` through the window [a, b], clamped to 0..1. */
export const segment = (p: number, a: number, b: number): number => clamp01((p - a) / (b - a));

export const easeOut = (t: number, power = 2.2): number => 1 - Math.pow(1 - t, power);
