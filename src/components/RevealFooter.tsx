import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

const WORD = 'ARPIT MISHRA';

/** One wordmark letter: rises into place over its own slice of the reveal */
function RiseLetter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const start = 0.15 + i * 0.035;
  const y = useTransform(progress, [start, start + 0.45], ['110%', '0%']);
  const rotate = useTransform(progress, [start, start + 0.45], [9, 0]);
  return (
    <motion.span className="reveal-footer-letter" style={{ y, rotate }}>
      {ch}
    </motion.span>
  );
}

/**
 * White band under Say Hello with a giant wordmark. The wordmark layer is
 * position: fixed to the bottom of the screen, but clipped to this footer's own
 * box (clip-path), so it shows only as the footer scrolls into view: Say Hello
 * lifts off it, and the letters rise into place one after another as it does.
 *
 * bg-white sits on the footer box, not the fixed layer: the music pill turns
 * light over .bg-white elements, and the fixed layer is always at the bottom.
 */
export default function RevealFooter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // 0 as the footer's top enters the screen, 1 once it's fully shown
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });

  return (
    <footer ref={ref} className="reveal-footer bg-white" aria-label="Arpit Mishra">
      <div className="reveal-footer-inner">
        <div className="reveal-footer-meta">
          <span>AI Engineer / Backend Developer</span>
          <span>Thanks for scrolling all the way down ✦</span>
        </div>
        <p className="reveal-footer-word">
          <span className="sr-only">Arpit Mishra</span>
          <span aria-hidden="true">
            {WORD.split('').map((ch, i) =>
              ch === ' ' ? ' ' : reduce ? (
                <span key={i} className="reveal-footer-letter">{ch}</span>
              ) : (
                <RiseLetter key={i} ch={ch} i={i} progress={scrollYProgress} />
              ),
            )}
          </span>
        </p>
      </div>
    </footer>
  );
}
