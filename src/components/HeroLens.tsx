import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useLiquidGlass } from './LiquidGlass';
import { supportsLiquidGlass } from '@/lib/glass';

// Trails the cursor like a drop of glass: a touch of lag, no wobble
const FOLLOW = { stiffness: 260, damping: 28, mass: 0.7 };
const POP = { type: 'spring' as const, stiffness: 380, damping: 26 };
const ZOOM = 1.25;

function canUseLens() {
  return supportsLiquidGlass && typeof window !== 'undefined'
    && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Bubble diameter: matches clamp(110px, 11vw, 168px) */
function lensSize() {
  return Math.min(168, Math.max(110, window.innerWidth * 0.11));
}

type HeroLensProps = {
  areaRef: RefObject<HTMLElement | null>;
  /** Static copy of the hero text, laid out like the original */
  replica: ReactNode;
};

/**
 * A liquid-glass bubble that follows the cursor across the hero and magnifies
 * the text under it. The magnification is a real second copy of the text drawn
 * ZOOM× larger (sampling the page and stretching it can only blur it), panned
 * so the point under the bubble's centre lines up. The rim bend + colour
 * fringe is the shared liquid-glass filter, applied to that copy.
 * Mouse + Chromium only; independent of the glass slider.
 */
export default function HeroLens({ areaRef, replica }: HeroLensProps) {
  const [enabled] = useState(canUseLens);
  const [visible, setVisible] = useState(false);
  const [settled, setSettled] = useState(false);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [size, setSize] = useState(() => (typeof window === 'undefined' ? 110 : lensSize()));
  const visibleRef = useRef(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, FOLLOW);
  const sy = useSpring(y, FOLLOW);

  // Pan the enlarged copy so the hero point under the bubble's centre sits at
  // the centre: copy point p lands at offset + ZOOM·p inside the bubble.
  const sizeMV = useMotionValue(size);
  const panX = useTransform([sx, sizeMV], ([cx, s]: number[]) => s / 2 - cx * ZOOM);
  const panY = useTransform([sy, sizeMV], ([cy, s]: number[]) => s / 2 - cy * ZOOM);

  const glass = useLiquidGlass({
    bezel: 999, // whole bubble is curved rim
    strength: 14,
    aberration: 0.08, // a little softer than the panels: the big type fringes loudly
    alwaysOn: true,
    mode: 'content',
  });

  useEffect(() => {
    const el = areaRef.current;
    if (!el || !enabled) return;
    const measure = () => {
      setArea({ w: el.offsetWidth, h: el.offsetHeight });
      const s = lensSize();
      setSize(s);
      sizeMV.set(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [areaRef, enabled, sizeMV]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el || !enabled) return;

    const leave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      // The music player lives inside the hero but goes position: fixed once
      // scrolled, so its moves bubble up here from anywhere on screen
      if (px < 0 || py < 0 || px > rect.width || py > rect.height) {
        if (visibleRef.current) leave();
        return;
      }
      x.set(px);
      y.set(py);
      if (!visibleRef.current) {
        // Appear under the cursor instead of flying in from the last spot
        sx.jump(px);
        sy.jump(py);
        visibleRef.current = true;
        setVisible(true);
      }
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [areaRef, enabled, x, y, sx, sy]);

  if (!enabled) return null;

  return (
    <motion.div className="hero-lens-anchor" style={{ x: sx, y: sy }} aria-hidden="true">
      {glass.lens /* the rim filter definition */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="lens"
            className="hero-lens"
            style={{ width: size, height: size, left: -size / 2, top: -size / 2 }}
            initial={{ scale: 0.3 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
            transition={POP}
            onAnimationStart={() => setSettled(false)}
            onAnimationComplete={() => setSettled(true)}
          >
            {/* The view: opaque page-coloured disc showing the enlarged copy.
                The rim filter switches on once the pop-in has settled. */}
            <div
              ref={glass.ref}
              className="hero-lens-view"
              // px radius, not 50%: the glass hook reads it to shape the rim bend
              style={{ borderRadius: size / 2, filter: settled && glass.filterUrl ? glass.filterUrl : 'none' }}
            >
              <motion.div
                className="hero-lens-pan"
                style={{ x: panX, y: panY, scale: ZOOM, originX: 0, originY: 0 }}
              >
                <div className="flex flex-col pt-16 sm:pt-20" style={{ width: area.w, height: area.h }}>
                  {replica}
                </div>
              </motion.div>
            </div>
            <span className="hero-lens-surface" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
