import { useEffect, useSyncExternalStore } from 'react';

/*
 * Site-wide "glass clarity": 0 = frosted, 1 = clear liquid glass.
 * Exposed to CSS as --glass on <html> and to React via useGlass().
 * Every visit starts frosted; Liquid is opt-in via the navbar slider and
 * deliberately not remembered between visits.
 */

/**
 * SVG filters inside backdrop-filter (needed for refraction) only work in
 * Chromium. Everyone else keeps the frosted glass and never sees the slider.
 */
export const supportsLiquidGlass: boolean = (() => {
  if (typeof navigator === 'undefined') return false;
  const brands = (navigator as Navigator & { userAgentData?: { brands: { brand: string }[] } })
    .userAgentData?.brands;
  if (brands) return brands.some((b) => /Chromium/i.test(b.brand));
  // iOS Chrome reports "CriOS" and runs WebKit, so it's correctly excluded
  return /Chrome\/\d+/.test(navigator.userAgent);
})();

let clarity = 0;
// How many refracting panels (nav menu, player card) are open right now
let focusCount = 0;
const listeners = new Set<() => void>();

function applyToDocument() {
  const root = document.documentElement;
  root.style.setProperty('--glass', String(clarity));
  root.toggleAttribute('data-liquid', clarity > 0);
  root.toggleAttribute('data-glass-focus', focusCount > 0);
}
applyToDocument();

/*
 * Chrome runs SVG backdrop filters on the CPU over every pixel that changes
 * under them, so a scroll re-bends each open lens in full every frame (~14ms
 * for the card at 1× scaling). While the page scrolls, lenses fade out (CSS
 * keys off html[data-scrolling]) and fade back once it settles. Lenis scrolls
 * the window, so native scroll events cover it as well as the scrollbar/keys.
 */
let scrollTimer: number | undefined;
if (supportsLiquidGlass) {
  window.addEventListener(
    'scroll',
    () => {
      if (scrollTimer === undefined) document.documentElement.setAttribute('data-scrolling', '');
      window.clearTimeout(scrollTimer);
      // Long enough that a brief pause mid-scroll doesn't flash the rim back in
      scrollTimer = window.setTimeout(() => {
        scrollTimer = undefined;
        document.documentElement.removeAttribute('data-scrolling');
      }, 220);
    },
    { passive: true },
  );
}

export function setGlass(v: number) {
  if (!supportsLiquidGlass) return;
  clarity = Math.max(0, Math.min(1, v));
  applyToDocument();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useGlass() {
  const value = useSyncExternalStore(subscribe, () => clarity);
  return [value, setGlass] as const;
}

/*
 * Refraction is cheap while the pixels under and inside the glass hold still,
 * but anything that animates there forces it to re-bend every frame (measured:
 * 146fps → 50fps with a single drifting glow). So while a large refracting
 * panel is open on Liquid, continuous background loops pause (CSS keys off
 * html[data-liquid][data-glass-focus]; JS loops use useBackgroundPaused).
 */
export function useGlassFocus(active: boolean) {
  useEffect(() => {
    if (!active) return;
    focusCount++;
    applyToDocument();
    listeners.forEach((l) => l());
    return () => {
      focusCount--;
      applyToDocument();
      listeners.forEach((l) => l());
    };
  }, [active]);
}

/** True while decorative loops should hold still (Liquid + a glass panel open) */
export function useBackgroundPaused() {
  return useSyncExternalStore(subscribe, () => clarity > 0 && focusCount > 0);
}

/**
 * Displacement map for a rounded rectangle of glass. Inside a `bezel`-wide band
 * along the edge, each pixel points inward (R = x, G = y, 128 = no shift), with
 * strength rising towards the rim — so the backdrop near the edge is sampled
 * from further in, bending it outward like the curved rim of a lens. The flat
 * middle stays undistorted.
 */
export function buildDisplacementMap(width: number, height: number, radius: number, bezel: number): string {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const hx = w / 2;
  const hy = h / 2;
  const r = Math.min(radius, hx, hy);
  const band = Math.max(1, Math.min(bezel, hx, hy));

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - hx;
      const py = y + 0.5 - hy;
      const qx = Math.abs(px) - (hx - r);
      const qy = Math.abs(py) - (hy - r);

      // Distance in from the edge, and the outward normal at the nearest edge point
      let dist: number;
      let nx: number;
      let ny: number;
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy);
        dist = r - len;
        nx = (qx / len) * Math.sign(px);
        ny = (qy / len) * Math.sign(py);
      } else if (qx > qy) {
        dist = r - qx;
        nx = Math.sign(px);
        ny = 0;
      } else {
        dist = r - qy;
        nx = 0;
        ny = Math.sign(py);
      }

      let m = 0;
      if (dist >= 0 && dist < band) {
        const t = 1 - dist / band;
        m = t * t;
      }

      const i = (y * w + x) * 4;
      data[i] = 128 - nx * m * 127;
      data[i + 1] = 128 - ny * m * 127;
      data[i + 2] = 128;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}
