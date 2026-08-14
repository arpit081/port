import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from './FadeIn';

export default function RoadSoFarSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="road-so-far" className="relative z-10 rounded-t-[40px] bg-white px-5 py-20 sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">

      <FadeIn
        y={40}
        as="h2"
        className="mb-8 text-center font-black uppercase leading-none tracking-tight text-[#0C0C0C] sm:mb-10 md:mb-14"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        ROAD SO FAR
      </FadeIn>

      <FadeIn y={30} delay={0.2} className="mx-auto mb-16 max-w-2xl text-center sm:mb-20 md:mb-24">
        <p className="text-sm font-light leading-relaxed text-[#0C0C0C]/70 sm:text-base md:text-lg">
          I've spent the last few years jumping between things I wanted to understand, things I wanted to build, and places where I got to learn by actually doing. Some of those steps had company names attached to them. Some didn't. And I'm still figuring out what's next.
        </p>
      </FadeIn>

      <div className="mx-auto max-w-5xl">
        {/* Entry 01 */}
        <FadeIn delay={0.1} y={30}>
          <article className="flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <div className="shrink-0 font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>01</div>
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
          <article className="flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <div className="shrink-0 font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>02</div>
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
          <article className="flex gap-5 border-t border-[rgba(12,12,12,0.15)] py-8 sm:gap-8 sm:py-10 md:gap-12 md:py-12">
            <div className="shrink-0 font-black leading-none text-[#0C0C0C]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>03</div>
            <div className="pt-1 flex-1 sm:pt-3">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div>
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

                <div className="relative shrink-0 lg:ml-8 lg:mr-4">
                  {/* Invisible placeholder to prevent flex reflow when card is absolute */}
                  <div className="invisible pointer-events-none opacity-0">
                    <div className="flex w-[260px] items-center justify-center rounded-full border px-6 py-3.5 sm:px-8 sm:py-4">
                      <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] sm:text-xs">
                        SEE WHAT I WORK WITH &rarr;
                      </span>
                    </div>
                  </div>

                  <motion.div
                    layout
                    initial={false}
                    transition={{
                      layout: { type: "spring", stiffness: 300, damping: 24, mass: 1 },
                      default: { duration: 0.3 }
                    }}
                    className={`absolute left-0 bottom-0 z-50 flex origin-bottom-left flex-col overflow-hidden lg:left-auto lg:right-0 lg:origin-bottom-right transition-colors duration-300 ${isExpanded
                      ? 'w-[calc(100vw-40px)] max-w-2xl cursor-default rounded-[30px] skills-glass-panel p-8 sm:p-10 lg:w-[480px] xl:w-[540px]'
                      : 'w-[260px] h-[48px] cursor-pointer items-center justify-center rounded-full skills-glass-pill bg-black/[0.04] px-6 py-3.5 hover:bg-black/[0.06] sm:px-8 sm:py-4'
                      }`}
                    onClick={() => !isExpanded && setIsExpanded(true)}
                  >
                    {/* Collapsed Content */}
                    <motion.div
                      className={`flex w-full h-full items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0C0C0C] sm:text-xs ${isExpanded ? 'absolute inset-0 pointer-events-none opacity-0' : 'relative opacity-100'
                        }`}
                      animate={{ opacity: isExpanded ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      SEE WHAT I WORK WITH &rarr;
                    </motion.div>

                    {/* Expanded Content */}
                    <motion.div
                      className={`flex w-full flex-col ${isExpanded ? 'relative opacity-100' : 'absolute pointer-events-none opacity-0'
                        }`}
                      initial={{ y: 10 }}
                      animate={{
                        opacity: isExpanded ? 1 : 0,
                        y: isExpanded ? 0 : 10
                      }}
                      transition={{ duration: 0.3, delay: isExpanded ? 0.1 : 0 }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExpanded(false);
                        }}
                        className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-lg text-[#0C0C0C]/60 transition-colors hover:bg-black/10 hover:text-[#0C0C0C]"
                      >
                        &times;
                      </button>

                      <div className="mb-8 pr-10">
                        <h4 className="mb-2 text-xl font-bold uppercase tracking-tight text-[#0C0C0C]">SKILLS</h4>
                        <p className="text-sm font-light italic text-[#0C0C0C]/60">A few things I've spent way too much time figuring out.</p>
                      </div>

                      <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                          <h5 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80">BACKEND</h5>
                          <p className="text-sm font-medium leading-relaxed text-[#0C0C0C]/60">
                            Python &middot; FastAPI &middot; REST APIs &middot; LLM Integration &middot; RAG &middot; Neo4j &middot; Cypher
                          </p>
                        </div>

                        <div>
                          <h5 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80">AI / ML / NLP</h5>
                          <p className="text-sm font-medium leading-relaxed text-[#0C0C0C]/60">
                            Intent Classification &middot; Entity Relation Extraction &middot; Knowledge Graph Modeling &middot; SPO Triple Generation &middot; Embeddings &middot; Prompt Engineering &middot; PyTorch
                          </p>
                        </div>

                        <div>
                          <h5 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80">FRONTEND</h5>
                          <p className="text-sm font-medium leading-relaxed text-[#0C0C0C]/60">
                            React.js &middot; JavaScript &middot; HTML &middot; CSS &middot; Bootstrap
                          </p>
                        </div>

                        <div>
                          <h5 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#0C0C0C]/80">TOOLS / SYSTEMS</h5>
                          <p className="text-sm font-medium leading-relaxed text-[#0C0C0C]/60">
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
