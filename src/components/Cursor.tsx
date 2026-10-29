import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { supportsLiquidGlass } from '@/lib/glass';

// Only real pill buttons opt in to the outline (data-cursor-snap); only the
// contact rows get the chip. Everything else (nav links with their own hover
// glyphs, the scroll cue, plain text links) keeps the plain small ring.
const SNAP = '[data-cursor-snap]';
const CHIP = '.hello-row-link';
const PAD = 7; // outline gap around a snapped target
const RING = 34; // idle ring diameter

const canUse = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Word for the chip beside the pointer over big targets ('' = none) */
function labelFor(el: Element) {
  const own = el.getAttribute('data-cursor');
  if (own !== null) return own;
  if (el.matches('a[download]')) return 'Save ↓';
  if (el.matches('a[target="_blank"]')) return 'Open ↗';
  if (el.matches('a[href^="mailto:"], a[href^="tel:"]')) return 'Open ↗';
  return '';
}

type View = { shown: boolean; mode: 'idle' | 'snap' | 'chip'; w: number; h: number; r: number; label: string };

/**
 * Desktop cursor companion. A dot sits exactly on the pointer; a ring trails
 * it on a spring. Both invert what's under them (difference blend), so they
 * read on black and white sections alike.
 *  - Over a pill button marked data-cursor-snap, the ring leaves the pointer
 *    and wraps that button as a rounded outline (with a little magnetic
 *    pull), so you see exactly what you're about to click. Nothing covers it.
 *  - Over a contact row, a small chip ("Open ↗") rides beside the pointer.
 *  - Everywhere else it stays a plain small ring.
 * The hero belongs to the glass lens, so the cursor steps aside there
 * entirely. Mouse only; nothing on touch.
 */
export default function Cursor() {
  const [enabled] = useState(canUse);
  const dotRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 480, damping: 40, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 480, damping: 40, mass: 0.5 });
  const [view, setView] = useState<View>({ shown: false, mode: 'idle', w: RING, h: RING, r: RING / 2, label: '' });

  useEffect(() => {
    if (!enabled) return;
    let shown = false;
    let snapEl: Element | null = null;
    let px = 0;
    let py = 0;

    // Where the ring should be: on the pointer, or on the snapped element's
    // centre nudged a little toward the pointer
    const aim = () => {
      if (snapEl) {
        const r = snapEl.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        x.set(cx + (px - cx) * 0.12);
        y.set(cy + (py - cy) * 0.12);
      } else {
        x.set(px);
        y.set(py);
      }
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px = e.clientX;
      py = e.clientY;
      const t = `translate3d(${px}px, ${py}px, 0)`;
      if (dotRef.current) dotRef.current.style.transform = t;
      if (chipRef.current) chipRef.current.style.transform = t;
      aim();
      if (!shown) {
        shown = true;
        rx.jump(x.get());
        ry.jump(y.get());
      }
    };

    const over = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = e.target as Element;
      // The hero belongs to the glass lens (buttons included), and so does the
      // top nav bar over it (it only exists up there): step aside
      const inHero = supportsLiquidGlass && !!el.closest('#home, [data-nav-root] > nav');
      const snap = el.closest(SNAP);
      const chip = el.closest(CHIP);
      if (snap) {
        snapEl = snap;
        const r = snap.getBoundingClientRect();
        const w = r.width + PAD * 2;
        const h = r.height + PAD * 2;
        const radius = Math.min(parseFloat(getComputedStyle(snap).borderTopLeftRadius) + PAD || 12, h / 2);
        setView({ shown: !inHero, mode: 'snap', w, h, r: radius, label: '' });
      } else if (chip) {
        snapEl = null;
        setView({ shown: !inHero, mode: 'chip', w: RING * 0.6, h: RING * 0.6, r: RING * 0.3, label: labelFor(chip) });
      } else {
        snapEl = null;
        setView({ shown: !inHero, mode: 'idle', w: RING, h: RING, r: RING / 2, label: '' });
      }
      aim();
    };

    // Content can move under a still pointer (scrolling): keep the outline on it
    const onScroll = () => { if (snapEl) aim(); };
    const leave = () => {
      shown = false;
      setView((v) => ({ ...v, shown: false }));
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y, rx, ry]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className={`cursor-ring ${view.shown ? 'is-shown' : ''} is-${view.mode}`} style={{ x: rx, y: ry }} aria-hidden="true">
        <span className="cursor-ring-shape" style={{ width: view.w, height: view.h, borderRadius: view.r }} />
      </motion.div>
      <div ref={dotRef} className={`cursor-dot ${view.shown ? 'is-shown' : ''}`} aria-hidden="true" />
      <div ref={chipRef} className={`cursor-chip ${view.shown && view.label ? 'is-shown' : ''}`} aria-hidden="true">
        <span className="cursor-chip-text">{view.label}</span>
      </div>
    </>
  );
}
