import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';

export default function RoadSoFarSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      id="road-so-far"
      className="relative z-10 rounded-t-[32px] xs:rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] bg-white px-4 py-14 xs:px-6 xs:py-18 sm:px-8 sm:py-24 md:px-10 md:py-32"
    >
      <FadeIn
        y={40}
        as="h2"
        className="mb-6 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-8 md:mb-12"
        style={{ fontSize: 'clamp(2.4rem, 9.5vw, 150px)' }}
      >
        ROAD SO FAR
      </FadeIn>

      <FadeIn y={30} delay={0.2} className="mx-auto mb-12 max-w-2xl text-center sm:mb-16 md:mb-20">
        <p className="text-xs font-light leading-relaxed text-[#0C0C0C]/70 xs:text-sm sm:text-base md:text-lg">
          I&apos;ve spent the last few years jumping between things I wanted to understand, things I wanted to build, and places where I got to learn by actually doing. Some of those steps had company names attached to them. Some didn&apos;t. And I&apos;m still figuring out what&apos;s next.
        </p>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {/* Entry 01 */}
        <FadeIn delay={0.1} y={30}>
          <article className="flex gap-3 border-t border-[rgba(12,12,12,0.15)] py-6 xs:gap-5 xs:py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <div
              className="shrink-0 font-black leading-none text-[#0C0C0C]"
              style={{ fontSize: 'clamp(2.2rem, 7.5vw, 130px)' }}
            >
              01
            </div>
            <div className="flex-1 pt-1 sm:pt-3">
              <div className="mb-3 flex flex-col sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3
                    className="font-medium uppercase text-[#0C0C0C]"
                    style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}
                  >
                    NIC INDIA
                  </h3>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/60 xs:text-xs sm:text-sm">
                    AI BACKEND ENGINEER
                  </p>
                </div>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-[#0C0C0C]/40 xs:text-xs sm:mt-0 sm:text-sm">
                  JULY 2025 — AUGUST 2025
                </p>
              </div>
              <p
                className="max-w-3xl font-light leading-relaxed text-[#0C0C0C]/80"
                style={{ fontSize: 'clamp(0.82rem, 1.4vw, 1.2rem)' }}
              >
                Designed and built a complete backend pipeline for an LLM-powered chatbot. Worked with offline government PDF data, transforming it into{' '}
                <strong className="font-semibold text-[#0C0C0C]">
                  5,000+ structured Subject–Predicate–Object triples
                </strong>{' '}
                and ingesting them into a Neo4j knowledge graph. Built an intent-classification and dynamic Cypher-generation module, improving query accuracy by{' '}
                <strong className="font-semibold text-[#0C0C0C]">40%</strong> and automating retrieval with zero manual intervention.
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0C0C0C]/50 xs:text-xs sm:text-sm">
                FastAPI · RAG · Neo4j · LLMs
              </p>
            </div>
          </article>
        </FadeIn>

        {/* Entry 02 */}
        <FadeIn delay={0.2} y={30}>
          <article className="flex gap-3 border-t border-[rgba(12,12,12,0.15)] py-6 xs:gap-5 xs:py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <div
              className="shrink-0 font-black leading-none text-[#0C0C0C]"
              style={{ fontSize: 'clamp(2.2rem, 7.5vw, 130px)' }}
            >
              02
            </div>
            <div className="flex-1 pt-1 sm:pt-3">
              <div className="mb-3 flex flex-col sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3
                    className="font-medium uppercase text-[#0C0C0C]"
                    style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}
                  >
                    EDUTAINER
                  </h3>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/60 xs:text-xs sm:text-sm">
                    WEB DEVELOPMENT INTERN
                  </p>
                </div>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-widest text-[#0C0C0C]/40 xs:text-xs sm:mt-0 sm:text-sm">
                  FEB 2026 — MAY 2026
                </p>
              </div>
              <p
                className="max-w-3xl font-light leading-relaxed text-[#0C0C0C]/80"
                style={{ fontSize: 'clamp(0.82rem, 1.4vw, 1.2rem)' }}
              >
                Built and deployed a full-stack business portfolio website from scratch. Implemented responsive UI components, built core backend routes and logic, and gained hands-on experience driving the complete end-to-end web development lifecycle.
              </p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0C0C0C]/50 xs:text-xs sm:text-sm">
                HTML · CSS · JavaScript · Node.js
              </p>
            </div>
          </article>
        </FadeIn>

        {/* Entry 03 */}
        <FadeIn delay={0.3} y={30}>
          <article className="flex gap-3 border-t border-[rgba(12,12,12,0.15)] py-6 xs:gap-5 xs:py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <div
              className="shrink-0 font-black leading-none text-[#0C0C0C]"
              style={{ fontSize: 'clamp(2.2rem, 7.5vw, 130px)' }}
            >
              03
            </div>
            <div className="flex-1 pt-1 sm:pt-3">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 sm:mb-5">
                    <h3
                      className="font-medium uppercase text-[#0C0C0C]"
                      style={{ fontSize: 'clamp(1rem, 2vw, 2rem)' }}
                    >
                      STILL BECOMING
                    </h3>
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/60 xs:text-xs sm:text-sm">
                      THE PART THAT DOESN&apos;T HAVE A JOB TITLE YET
                    </p>
                  </div>
                  <div
                    className="max-w-3xl font-light italic leading-relaxed text-[#0C0C0C]/60"
                    style={{ fontSize: 'clamp(0.82rem, 1.4vw, 1.2rem)' }}
                  >
                    <p className="mb-3">Not every step came with a company name or a neat little title.</p>
                    <p className="mb-3">
                      Some of it has just been me — following things that caught my attention, going down rabbit holes, building things because I wanted to see if I could, and slowly figuring out what kind of person I want to become along the way.
                    </p>
                    <p className="mb-3">I&apos;m still figuring it out.</p>
                    <p>And honestly, I think that&apos;s the point.</p>
                  </div>
                </div>

                <div className="relative mt-2 shrink-0 lg:mt-0 lg:ml-6 lg:mr-2">
                  {/* Backdrop on mobile when expanded */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                        onClick={() => setIsExpanded(false)}
                      />
                    )}
                  </AnimatePresence>

                  {/* Invisible placeholder to prevent flex reflow */}
                  <div className="invisible pointer-events-none opacity-0">
                    <div className="flex w-[240px] items-center justify-center rounded-full border px-6 py-3 xs:w-[260px] sm:px-8 sm:py-4">
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs">
                        SEE WHAT I WORK WITH &rarr;
                      </span>
                    </div>
                  </div>

                  <motion.div
                    layout
                    initial={false}
                    transition={{
                      layout: { type: 'spring', stiffness: 300, damping: 24, mass: 1 },
                      default: { duration: 0.3 },
                    }}
                    className={`transition-colors duration-300 ${
                      isExpanded
                        ? 'fixed inset-x-4 bottom-6 z-50 mx-auto max-h-[82dvh] max-w-lg cursor-default overflow-y-auto rounded-[24px] skills-glass-panel p-5 xs:p-6 sm:max-w-xl sm:rounded-[30px] sm:p-8 lg:absolute lg:inset-auto lg:bottom-0 lg:right-0 lg:max-h-none lg:w-[480px] lg:origin-bottom-right xl:w-[540px] xl:p-10'
                        : 'absolute bottom-0 left-0 z-20 flex h-[46px] w-[240px] cursor-pointer items-center justify-center rounded-full bg-black/[0.04] px-5 py-3 skills-glass-pill hover:bg-black/[0.06] xs:w-[260px] sm:h-[48px] sm:px-8 sm:py-4 lg:left-auto lg:right-0'
                    }`}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                  >
                    {/* Collapsed Content */}
                    <motion.div
                      className={`flex h-full w-full items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C] sm:text-xs ${
                        isExpanded ? 'absolute inset-0 pointer-events-none opacity-0' : 'relative opacity-100'
                      }`}
                      animate={{ opacity: isExpanded ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      SEE WHAT I WORK WITH &rarr;
                    </motion.div>

                    {/* Expanded Content */}
                    <motion.div
                      className={`flex w-full flex-col ${
                        isExpanded ? 'relative opacity-100' : 'absolute pointer-events-none opacity-0'
                      }`}
                      initial={{ y: 10 }}
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        y: isExpanded ? 0 : 10,
                      }}
                      transition={{ duration: 0.3, delay: isExpanded ? 0.1 : 0 }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        aria-label="Close skills"
                        className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 text-lg text-[#0C0C0C]/60 transition-colors hover:bg-black/10 hover:text-[#0C0C0C] sm:h-8 sm:w-8"
                      >
                        &times;
                      </button>

                      <div className="mb-6 pr-8 sm:mb-8 sm:pr-10">
                        <h4 className="mb-1 text-lg font-bold uppercase tracking-tight text-[#0C0C0C] sm:text-xl">
                          SKILLS
                        </h4>
                        <p className="text-xs font-light italic text-[#0C0C0C]/60 sm:text-sm">
                          A few things I&apos;ve spent way too much time figuring out.
                        </p>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:gap-8">
                        <div>
                          <h5 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80 xs:text-xs">
                            BACKEND
                          </h5>
                          <p className="text-xs font-medium leading-relaxed text-[#0C0C0C]/60 xs:text-sm">
                            Python &middot; FastAPI &middot; REST APIs &middot; LLM Integration &middot; RAG &middot; Neo4j &middot; Cypher
                          </p>
                        </div>

                        <div>
                          <h5 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80 xs:text-xs">
                            AI / ML / NLP
                          </h5>
                          <p className="text-xs font-medium leading-relaxed text-[#0C0C0C]/60 xs:text-sm">
                            Intent Classification &middot; Entity Relation Extraction &middot; Knowledge Graph Modeling &middot; SPO Triple Generation &middot; Embeddings &middot; Prompt Engineering &middot; PyTorch
                          </p>
                        </div>

                        <div>
                          <h5 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80 xs:text-xs">
                            FRONTEND
                          </h5>
                          <p className="text-xs font-medium leading-relaxed text-[#0C0C0C]/60 xs:text-sm">
                            React.js &middot; JavaScript &middot; HTML &middot; CSS &middot; Bootstrap
                          </p>
                        </div>

                        <div>
                          <h5 className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80 xs:text-xs">
                            TOOLS / SYSTEMS
                          </h5>
                          <p className="text-xs font-medium leading-relaxed text-[#0C0C0C]/60 xs:text-sm">
                            MongoDB &middot; MySQL &middot; SQL &middot; Docker &middot; Kubernetes &middot; Postman &middot; Git &middot; GitHub &middot; Vercel &middot; Linux
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </article>
        </FadeIn>

        <div className="border-t border-[rgba(12,12,12,0.15)]" />
      </div>
    </section>
  );
}
