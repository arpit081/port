/**
 * Headings lean into a fast scroll (up to ±MAX degrees) and ease back upright.
 *
 * One shared loop for the whole page, not one per heading: it starts on
 * scroll, skews only the headings currently on screen (registered by
 * RevealWrap while in view), and stops itself once everything is upright.
 * Each heading is promoted to its own layer only while leaning. Desktop
 * (fine pointer) only, and off under reduced motion.
 */
const MAX = 3;
const FULL_LEAN_SPEED = 3000; // px/s that produces the full lean

const active = new Set<HTMLElement>();
let raf = 0;
let lastY = 0;
let lastT = 0;
let skew = 0;
let listening = false;

export const canSkew = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function apply(value: string, layer: string) {
  for (const el of active) {
    el.style.transform = value;
    el.style.willChange = layer;
  }
}

function tick(t: number) {
  const y = window.scrollY;
  const dt = Math.max(1, t - lastT);
  const speed = ((y - lastY) / dt) * 1000;
  lastY = y;
  lastT = t;
  const target = Math.max(-MAX, Math.min(MAX, (-speed / FULL_LEAN_SPEED) * MAX));
  skew += (target - skew) * 0.14; // eased, so it springs rather than snaps

  if (Math.abs(skew) < 0.02 && Math.abs(target) < 0.02) {
    skew = 0;
    apply('', '');
    raf = 0;
    return;
  }
  apply(`skewY(${skew.toFixed(3)}deg)`, 'transform');
  raf = requestAnimationFrame(tick);
}

function onScroll() {
  if (raf || active.size === 0) return;
  lastY = window.scrollY;
  lastT = performance.now();
  raf = requestAnimationFrame(tick);
}

/** Start skewing `el` while it's on screen; returns the unregister function */
export function registerSkew(el: HTMLElement) {
  active.add(el);
  if (!listening) {
    window.addEventListener('scroll', onScroll, { passive: true });
    listening = true;
  }
  return () => {
    active.delete(el);
    el.style.transform = '';
    el.style.willChange = '';
  };
}
