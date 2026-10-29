import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import type { CSSProperties } from 'react';
import FadeIn from './FadeIn';
import MusicPlayer from './MusicPlayer';
import HeroLens from './HeroLens';
import ScrollCue from './ScrollCue';
import RollText from './RollText';
import { RESUME_URL } from '@/lib/utils';
import { useMagnetic } from '@/lib/useMagnetic';

// The gradient sits on each letter (.hero-letter), not here: a parent's
// text-clipped background doesn't follow letters that move
// Size: .hero-title (fits the ink between the page's side margins)
const HEADING_CLASS = 'hero-title w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-tight';
const HEADING_TEXT = "Hi, i'm arpit";
// rem, not px, so the intro scales with the root size on big monitors
const INTRO_CLASS = 'max-w-[15rem] sm:max-w-[20rem] md:max-w-[25rem]';

/**
 * The hero's text layout. Rendered twice: once on the page (with entrance
 * animations), and once as a static copy inside the glass lens, drawn larger
 * so the magnified text stays sharp. Same markup, so the two always line up.
 */
/** Repeatable pseudo-random in [-1, 1] per letter, so the scatter is always the same */
const seed = (i: number, a: number, b: number) => ((i * a + b) % 19) / 9 - 1;
const MID = (HEADING_TEXT.length - 1) / 2;

/**
 * One headline letter. On scroll out of the hero it drifts up at its own
 * speed, sways and tilts, and fades: the name dissolves into the page. The
 * wrapper carries that motion so the letter keeps its entrance animation.
 */
function ScatterLetter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], [0, -(140 + (seed(i, 37, 11) + 1) * 120)]);
  // Sideways drift is inward (edge letters converge toward the middle), so
  // the outer letters never cross the hero's edge and get clipped
  const x = useTransform(progress, [0, 1], [0, ((MID - i) / MID) * 36 + seed(i, 53, 7) * 6]);
  const rotate = useTransform(progress, [0, 1], [0, seed(i, 29, 5) * 18]);
  const opacity = useTransform(progress, [0, 0.75], [1, 0]);
  return (
    <motion.span className="hero-letter-wrap" style={{ x, y, rotate, opacity }}>
      <span className="hero-letter hero-heading is-rising" style={{ '--i': i } as CSSProperties}>{ch}</span>
    </motion.span>
  );
}

function HeroCopy({ replica = false, progress }: { replica?: boolean; progress?: MotionValue<number> }) {
  const magnet = useMagnetic<HTMLAnchorElement>();
  // Letters rise in one after another on first load (the lens copy stays still)
  const heading = (
    <>
      <span className="sr-only">Hi, I&apos;m Arpit</span>
      <span aria-hidden="true">
        {HEADING_TEXT.split('').map((ch, i) =>
          ch === ' ' ? ' ' : progress ? (
            <ScatterLetter key={i} ch={ch} i={i} progress={progress} />
          ) : (
            <span key={i} className={`hero-letter hero-heading ${replica ? '' : 'is-rising'}`} style={{ '--i': i } as CSSProperties}>
              {ch}
            </span>
          ),
        )}
      </span>
    </>
  );
  const resumeLabel = <><RollText>View resume</RollText> <span className="hero-resume-arrow" aria-hidden="true">↗</span></>;
  const intro = (
    <>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#D7E2EA] sm:text-sm">
        AI ENGINEER / BACKEND DEVELOPER
      </p>
      <p
        className="font-light uppercase leading-snug tracking-wide text-[#D7E2EA]"
        style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
      >
        I BUILD AI SYSTEMS, BREAK THINGS, FIX THEM, AND THEN BUILD SOMETHING ELSE.
      </p>
      <p className="mt-3 text-xs font-light text-[#D7E2EA]/70 sm:text-sm">
        Mostly interested in the space where AI, software and good ideas collide.
      </p>
      {/* The lens copy only draws it; the real link sits underneath */}
      {replica ? (
        <span className="hero-resume">{resumeLabel}</span>
      ) : (
        <a ref={magnet} className="hero-resume magnetic" href={RESUME_URL} target="_blank" rel="noopener noreferrer" aria-label="View resume (PDF, opens in a new tab)">
          {resumeLabel}
        </a>
      )}
    </>
  );

  return (
    <>
      {/* Clip sideways only (the headline is nearly full-width); vertically the
          comma hangs below the line, and on short screens this box is one line tall */}
      <div className="hero-title-box flex flex-1 items-center justify-center overflow-x-clip">
        {replica ? (
          <div className={HEADING_CLASS}>{heading}</div>
        ) : (
          <h1 className={HEADING_CLASS}>{heading}</h1>
        )}
      </div>

      <div className="flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        {replica ? (
          <div className={INTRO_CLASS}>{intro}</div>
        ) : (
          <FadeIn delay={0.35} y={20} as="div" className={INTRO_CLASS}>
            {intro}
          </FadeIn>
        )}
      </div>
    </>
  );
}

export default function HeroSection() {
  const areaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // The ambient glow only drifts while the hero is on screen
  const isLive = useInView(sectionRef, { margin: '100px' });
  // 0 at the top, 1 once the hero has scrolled away: drives the letter scatter
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  return (
    <section
      ref={sectionRef}
      id="home"
      className={`relative flex h-screen flex-col ${isLive ? 'is-live' : ''}`}
      style={{ overflowX: 'clip' }}
    >
      {/* Two soft colour pools drifting behind the headline (see "Hero glow") */}
      <div className="hero-glow" aria-hidden="true">
        <span className="hero-glow-blob hero-glow-a" />
        <span className="hero-glow-blob hero-glow-b" />
      </div>

      <div ref={areaRef} className="relative flex flex-1 flex-col pt-16 sm:pt-20">
        <HeroCopy progress={reduce ? undefined : scrollYProgress} />

        {/* Glass bubble that follows the cursor and magnifies the headline */}
        <HeroLens areaRef={areaRef} replica={<HeroCopy replica />} />

        {/* Floating music button — bottom-left, above the intro text */}
        <div className="music-btn-anchor">
          <MusicPlayer />
        </div>

        <ScrollCue />
      </div>
    </section>
  );
}
