import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';

export type InterestClip = {
  /** Matches the row key and the files in /public/videos/interests */
  key: string;
  label: string;
};

// Soft and heavy: the window drifts after the cursor and settles without
// overshoot (damping ratio ~1.3), instead of snapping to it
const FOLLOW = { stiffness: 110, damping: 26, mass: 0.9 };
// The tilt eases in and out rather than reacting to every flick
const TILT = { stiffness: 120, damping: 20, mass: 0.8 };
const GAP_X = 14; // px from the cursor, sideways
const TUCK = 10; // px the window overlaps into the row's top padding
const EDGE = 16; // keep this far from the viewport edges

function canHover() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Cursor-following video window for the Outside the Code rows. Glides beside
 * the pointer, sits over the row above so the hovered row stays readable,
 * tilts gently with horizontal speed, and crossfades between rows. Only the
 * active clip is mounted, so at most one video decodes at a time.
 */
export default function InterestPreview({ active, clips }: { active: string | null; clips: InterestClip[] }) {
  const [enabled] = useState(canHover);
  const size = useRef({ w: 0, h: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, FOLLOW);
  const sy = useSpring(y, FOLLOW);
  const rotate = useSpring(useTransform(useVelocity(sx), [-1500, 0, 1500], [-4, 0, 4], { clamp: true }), TILT);
  const placed = useRef(false);

  useEffect(() => {
    if (!enabled || !active) {
      placed.current = false;
      return;
    }
    // Sideways: no hard flip from one side of the cursor to the other (that was
    // a ~600px leap). The anchor slides with the cursor's position across the
    // screen: at the left edge the window sits right of the pointer, at the
    // right edge left of it, in between proportionally. The window still always
    // moves the same way as the cursor, just a little slower.
    // Vertically it sits on the hovered row's top edge, over the row above, so
    // the row being read is never covered. No room above: sit below it.
    let last = { cx: 0, cy: 0 };
    const place = (cx: number, cy: number) => {
      last = { cx, cy };
      const { w, h } = size.current;
      const row = document.querySelector(`.q-row[data-clip="${active}"]`);
      if (!row) return;
      const rr = row.getBoundingClientRect();
      const vw = window.innerWidth;
      const t = Math.min(1, Math.max(0, (cx - EDGE) / Math.max(1, vw - 2 * EDGE)));
      let left = cx + GAP_X - t * (w + 2 * GAP_X);
      left = Math.min(Math.max(left, EDGE), vw - w - EDGE);
      let top = rr.top + TUCK - h;
      if (top < EDGE) top = Math.min(rr.bottom - TUCK, window.innerHeight - h - EDGE);
      x.set(left);
      y.set(top);
      if (!placed.current) {
        // First frame: appear in place instead of flying in from the corner
        sx.jump(left);
        sy.jump(top);
        placed.current = true;
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') place(e.clientX, e.clientY);
    };
    // The row moves under a still pointer while scrolling: re-anchor to it
    const onScroll = () => place(last.cx, last.cy);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [enabled, active, x, y, sx, sy]);

  // Window size follows its CSS (clamped to the viewport), so measure it
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      size.current = { w: el.offsetWidth, h: el.offsetHeight };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  const clip = clips.find((c) => c.key === active);

  return (
    <motion.div
      ref={boxRef}
      className="interest-preview"
      style={{ x: sx, y: sy, rotate }}
      initial={false}
      animate={clip ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.9 }}
      aria-hidden="true"
    >
      <AnimatePresence initial={false}>
        {clip && (
          <motion.div
            key={clip.key}
            className="interest-preview-clip"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <video
              // autoPlay alone is skipped sometimes when a video mounts mid-animation; nudge it
              ref={(el) => { el?.play().catch(() => {}); }}
              className="interest-preview-video"
              src={`/videos/interests/${clip.key}.mp4`}
              poster={`/videos/interests/${clip.key}.jpg`}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
            <span className="interest-preview-label">{clip.label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
