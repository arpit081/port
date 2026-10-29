import InkNumber from './InkNumber';
import FadeIn from './FadeIn';
import QuirkyText from './QuirkyText';
import SectionDepth from './SectionDepth';

export default function RoadSoFarSection() {
  return (
    <SectionDepth id="road-so-far" className="relative z-10 rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">

      <FadeIn
        y={40}
        as="h2"
        className="mb-8 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-10 md:mb-14"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        <QuirkyText text="ROAD SO FAR" variant="quirk-drive" reveal />
      </FadeIn>

      <FadeIn y={30} delay={0.2} className="mx-auto mb-16 max-w-2xl text-center sm:mb-20 md:mb-24">
        <p className="text-sm font-light leading-relaxed text-[#0C0C0C]/70 sm:text-base md:text-lg">
          I've spent the last few years jumping between things I wanted to understand, things I wanted to build, and places where I got to learn by actually doing. Some of those steps had company names attached to them. Some didn't. And I'm still figuring out what's next.
        </p>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {/* Entry 01 */}
        <FadeIn delay={0.1} y={30}>
          <article className="q-row flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <InkNumber value="01" />
            <div className="pt-1 sm:pt-3 flex-1">
              <div className="mb-4 flex flex-col sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>NIC INDIA</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/60 sm:text-sm">AI BACKEND ENGINEER</p>
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[#0C0C0C]/40 sm:mt-0">JULY 2025 — AUGUST 2025</p>
              </div>
              <p className="max-w-3xl font-light leading-relaxed text-[#0C0C0C]/80" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                Designed and built a complete backend pipeline for an LLM-powered chatbot. Worked with offline government PDF data, transforming it into <strong className="font-semibold text-[#0C0C0C]">5,000+ structured Subject–Predicate–Object triples</strong> and ingesting them into a Neo4j knowledge graph. Built an intent-classification and dynamic Cypher-generation module, improving query accuracy by <strong className="font-semibold text-[#0C0C0C]">40%</strong> and automating retrieval with zero manual intervention.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/50 sm:text-sm">
                FastAPI · RAG · Neo4j · LLMs
              </p>
            </div>
          </article>
        </FadeIn>

        {/* Entry 02 */}
        <FadeIn delay={0.2} y={30}>
          <article className="q-row flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <InkNumber value="02" />
            <div className="pt-1 sm:pt-3 flex-1">
              <div className="mb-4 flex flex-col sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>EDUTAINER</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/60 sm:text-sm">WEB DEVELOPMENT INTERN</p>
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-[#0C0C0C]/40 sm:mt-0">FEB 2026 — MAY 2026</p>
              </div>
              <p className="max-w-3xl font-light leading-relaxed text-[#0C0C0C]/80" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                Built and deployed a full-stack business portfolio website from scratch. Implemented responsive UI components, built core backend routes and logic, and gained hands-on experience driving the complete end-to-end web development lifecycle.
              </p>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/50 sm:text-sm">
                HTML · CSS · JavaScript · Node.js
              </p>
            </div>
          </article>
        </FadeIn>

        {/* Entry 03 */}
        <FadeIn delay={0.3} y={30}>
          <article className="q-row flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <InkNumber value="03" />
            <div className="pt-1 flex-1 sm:pt-3">
              <div className="mb-4 sm:mb-6">
                <h3 className="font-medium uppercase text-[#0C0C0C]" style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}>STILL BECOMING</h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/60 sm:text-sm">THE PART THAT DOESN'T HAVE A JOB TITLE YET</p>
              </div>
              <div className="max-w-3xl font-light italic leading-relaxed text-[#0C0C0C]/60" style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)' }}>
                <p className="mb-4">Not every step came with a company name or a neat little title.</p>
                <p className="mb-4">Some of it has just been me — following things that caught my attention, going down rabbit holes, building things because I wanted to see if I could, and slowly figuring out what kind of person I want to become along the way.</p>
                <p className="mb-4">I'm still figuring it out.</p>
                <p>And honestly, I think that's the point.</p>
              </div>
            </div>
          </article>
        </FadeIn>

        <div className="border-t border-[rgba(12,12,12,0.15)]" />
      </div>
    </SectionDepth>
  );
}
