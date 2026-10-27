import { useRef } from 'react';
import FadeIn from './FadeIn';
import MusicPlayer from './MusicPlayer';
import HeroLens from './HeroLens';
import ScrollCue from './ScrollCue';

const HEADING_CLASS = 'hero-heading w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]';
const INTRO_CLASS = 'max-w-[240px] sm:max-w-[320px] md:max-w-[400px]';

/**
 * The hero's text layout. Rendered twice: once on the page (with entrance
 * animations), and once as a static copy inside the glass lens, drawn larger
 * so the magnified text stays sharp. Same markup, so the two always line up.
 */
function HeroCopy({ replica = false }: { replica?: boolean }) {
  const heading = <>Hi, i&apos;m arpit</>;
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
    </>
  );

  return (
    <>
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        {replica ? (
          <div className={HEADING_CLASS}>{heading}</div>
        ) : (
          <FadeIn delay={0.15} y={40} as="h1" className={HEADING_CLASS}>
            {heading}
          </FadeIn>
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

  return (
    <section
      id="home"
      className="flex h-screen flex-col"
      style={{ overflowX: 'clip' }}
    >
      <div ref={areaRef} className="relative flex flex-1 flex-col pt-16 sm:pt-20">
        <HeroCopy />

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
