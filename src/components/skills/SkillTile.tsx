import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';

type SkillTileProps = {
  index: string;
  title: string;
  blurb: string;
  chips?: string[];
  className?: string;
  delay?: number;
  children: ReactNode;
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

/*
 * No SVG refraction here, on purpose: bending a soft aurora is invisible, and
 * measured in Chrome it took the section from 144fps to 14fps on Liquid. The
 * tiles follow the glass slider in pure CSS instead (clearer blur, rim
 * highlight, edge glow), which costs no more than the frosted look.
 */
export default function SkillTile({ index, title, blurb, chips, className = '', delay = 0, children }: SkillTileProps) {
  // Chips pop in, one after another, the first time the tile is on screen
  const [seen, setSeen] = useState(false);
  // Feeds the cursor-following highlight in CSS
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    // Fades itself in rather than via a FadeIn wrapper: an ancestor with
    // opacity < 1 would cut the tile's backdrop blur off mid-animation
    <motion.article
      className={`skill-tile lg-rim ${seen ? 'is-seen' : ''} ${className}`}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      onViewportEnter={() => setSeen(true)}
      whileHover={{ y: -4 }}
      transition={{
        opacity: { duration: 0.7, delay, ease: EASE },
        scale: { duration: 0.7, delay, ease: EASE },
        y: { type: 'spring', stiffness: 400, damping: 30 },
      }}
      onPointerMove={handlePointerMove}
    >
      <header className="skill-tile-header">
        <span className="skill-tile-index">{index}</span>
        <h3 className="skill-tile-title">{title}</h3>
        <p className="skill-tile-blurb">{blurb}</p>
      </header>

      <div className="skill-tile-visual">{children}</div>

      {chips && (
        <ul className="skill-chips" aria-label={`${title} skills`}>
          {chips.map((chip, i) => <li key={chip} style={{ '--ci': i } as CSSProperties}>{chip}</li>)}
        </ul>
      )}
    </motion.article>
  );
}
