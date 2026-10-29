import { useState } from 'react';
import FadeIn from './FadeIn';
import QuirkyText from './QuirkyText';
import InterestPreview from './interests/InterestPreview';
import type { InterestClip } from './interests/InterestPreview';
import SectionDepth from './SectionDepth';

// Fields: number, name, description, hover quirk (see "Interest row quirks"
// in index.css), preview clip key (files in /public/videos/interests)
const services = [
  ['01', 'MUSIC', 'Songs, artists and sounds that somehow became part of my everyday life.', 'quirk-beat', 'music'],
  ['02', 'GAMING', 'Competitive games, open worlds and the occasional obsession that takes way too many hours.', 'quirk-glitch', 'gaming'],
  ['03', 'ANIME', 'Stories, characters and worlds that I keep coming back to.', 'quirk-sparkle', 'anime'],
  ['04', 'TECHNOLOGY', "New tools, weird experiments and anything that makes me think, 'wait... can I build that?'", 'quirk-cursor', 'technology'],
  ['05', 'BUILDING THINGS', "Editing videos, tinkering with whatever new tech I can get my hands on, and side projects that somehow turn into actual projects.", 'quirk-stack', 'building'],
];

const clips: InterestClip[] = services.map(([, name, , , key]) => ({ key, label: name }));

export default function ServicesSection() {
  // Which row the mouse is on; drives the floating video window
  const [active, setActive] = useState<string | null>(null);

  return (
    <SectionDepth scaleTo={1} id="interests" className="relative rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn
        y={40}
        as="h2"
        className="mb-16 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        <QuirkyText text="OUTSIDE THE CODE" variant="quirk-escape" reveal />
      </FadeIn>
      <div className="mx-auto max-w-5xl" onPointerLeave={() => setActive(null)}>
        {services.map(([number, name, description, quirk, clip], index) => (
          <FadeIn key={number} delay={index * 0.1} y={30}>
            <article
              data-clip={clip}
              className="q-row interest-row flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12"
              onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActive(clip); }}
            >
              <div className="q-num shrink-0 font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{number}</div>
              <div className="pt-1 sm:pt-3">
                <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>
                  <QuirkyText text={name} variant={quirk} />
                </h3>
                <p className="mt-2 max-w-2xl font-light leading-relaxed text-[#0C0C0C]/60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>{description}</p>
              </div>
            </article>
          </FadeIn>
        ))}
        <div className="border-t border-[rgba(12,12,12,0.15)]" />
      </div>

      {/* Outside the FadeIn wrappers on purpose: it's position: fixed, and a
          transformed ancestor would pin it to that ancestor instead of the screen */}
      <InterestPreview active={active} clips={clips} />
    </SectionDepth>
  );
}
