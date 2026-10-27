import { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const GAP = 40;
const SPEED = 32; // px per second
const PAUSE = 2.5; // seconds to rest at the start of each loop

type MarqueeTextProps = {
  text: string;
  className?: string;
};

/** Apple Music-style title: static when it fits, slow looping scroll when it doesn't */
export default function MarqueeText({ text, className }: MarqueeTextProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const measure = () => {
      const t = textRef.current;
      if (!t) return;
      setDistance(t.offsetWidth > box.clientWidth ? t.offsetWidth + GAP : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [text]);

  const overflows = distance > 0;

  return (
    <div ref={boxRef} className={`marquee ${overflows ? 'is-overflowing' : ''}`} title={overflows ? text : undefined}>
      <motion.div
        key={`${text}-${distance}`}
        className="marquee-track"
        animate={overflows ? { x: [0, -distance] } : { x: 0 }}
        transition={
          overflows
            ? { duration: distance / SPEED, ease: 'linear', repeat: Infinity, repeatDelay: PAUSE, delay: PAUSE }
            : undefined
        }
      >
        <span ref={textRef} className={className}>{text}</span>
        {overflows && (
          <span className={className} aria-hidden="true" style={{ paddingLeft: GAP }}>{text}</span>
        )}
      </motion.div>
    </div>
  );
}
