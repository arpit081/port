import { motion, useScroll, useTransform } from 'framer-motion';
import { smoothScrollTo } from '@/lib/utils';

/** "Scroll" with a glass bead gliding down a hairline; fades as you leave the hero */
export default function ScrollCue() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 140], [1, 0]);
  const pointerEvents = useTransform(scrollY, (v) => (v > 120 ? 'none' : 'auto'));

  return (
    <motion.a
      href="#about"
      className="scroll-cue"
      style={{ opacity, pointerEvents }}
      onClick={(e) => {
        e.preventDefault();
        smoothScrollTo('about');
      }}
      aria-label="Scroll to who am I"
    >
      {/* Entrance lives on an inner wrapper so it can't fight the scroll fade */}
      <span className="scroll-cue-inner">
        <span className="scroll-cue-label">Scroll</span>
        <span className="scroll-cue-track">
          <span className="scroll-cue-bead" />
        </span>
      </span>
    </motion.a>
  );
}
