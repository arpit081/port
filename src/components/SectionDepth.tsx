import { useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

type SectionDepthProps = Omit<HTMLMotionProps<'section'>, 'ref' | 'children'> & {
  children?: ReactNode;
  /** Pass the section's own ref when the component needs it too */
  sectionRef?: RefObject<HTMLElement | null>;
  /** Scale reached once the section has scrolled away. 1 = dim only (use it
      for sections holding position: fixed children, which a transform would trap) */
  scaleTo?: number;
  /** Darkness reached, as the overlay's opacity */
  dimTo?: number;
};

/**
 * A <section> that recedes as you scroll past it: from the moment its bottom
 * edge enters the screen until it leaves at the top, it shrinks slightly
 * toward its bottom edge and darkens under a black overlay, so the next
 * rounded section reads as sliding over a stack. Transform + opacity only;
 * the layer hint is on just while it's receding (see [data-receding]).
 */
export default function SectionDepth({ sectionRef, scaleTo = 0.94, dimTo = 0.45, style, children, ...rest }: SectionDepthProps) {
  const ownRef = useRef<HTMLElement>(null);
  const ref = sectionRef ?? ownRef;
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['end end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : scaleTo]);
  const dim = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : dimTo]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    ref.current?.toggleAttribute('data-receding', v > 0 && v < 1);
  });

  return (
    <motion.section
      ref={ref as RefObject<HTMLElement>}
      style={scaleTo === 1 ? style : { ...style, scale, transformOrigin: '50% 100%' }}
      {...rest}
    >
      {children}
      <motion.span className="recede-dim" style={{ opacity: dim }} aria-hidden="true" />
    </motion.section>
  );
}
