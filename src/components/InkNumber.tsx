import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * Road So Far entry number that fills with ink as you read: it starts as a
 * hairline outline, and as the entry scrolls into reading position solid ink
 * rises inside it from the bottom until it's full.
 *
 * Transform only: a clipping window slides up while the solid copy inside it
 * slides down by the same amount, so the copy stays put and the ink line
 * appears to rise through it. The hover lift (.q-row:hover .q-num) moves the
 * outline and the ink together.
 */
export default function InkNumber({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // empty as the number comes up the screen, full once it's near the middle
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 88%', 'end 48%'] });
  const windowY = useTransform(scrollYProgress, [0, 1], ['100%', '0%']);
  const inkY = useTransform(scrollYProgress, [0, 1], ['-100%', '0%']);

  return (
    <div ref={ref} className="q-num ink-num shrink-0 font-black leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>
      <span className="ink-outline">{value}</span>
      <motion.span className="ink-window" style={reduce ? undefined : { y: windowY }} aria-hidden="true">
        <motion.span className="ink-fill" style={reduce ? undefined : { y: inkY }}>
          {value}
        </motion.span>
      </motion.span>
    </div>
  );
}
