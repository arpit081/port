import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeIn from './FadeIn';
import LiveProjectButton from './LiveProjectButton';

type Project = { number: string; category: string; name: string; description: string; images: string[] };

const projects: Project[] = [
  { 
    number: '01', 
    category: 'NIC PROJECT', 
    name: 'AI CHATBOT SYSTEM', 
    description: 'An intelligent chatbot that actually understands intent. Built with LLMs, RAG, and a Neo4j knowledge graph that generates Cypher queries on the fly.',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    ] 
  },
  { 
    number: '02', 
    category: 'PERSONAL PROJECT', 
    name: 'AI-POWERED EXCEL REPORT GENERATOR', 
    description: 'Because writing Excel reports manually is terrible. You just type what you want in plain English, and an LLM extracts the data to build the structured report for you.',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    ] 
  },
  { 
    number: '03', 
    category: 'PERSONAL PROJECT', 
    name: 'AI HOVER MOUSE', 
    description: 'A mouse you control with your hands. Because apparently using a mouse normally wasn\'t interesting enough. Built in real-time with Python, OpenCV and MediaPipe.',
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    ] 
  },
];

/* ---------- helpers ---------- */

/** Walk the offsetParent chain to get absolute page‑top position */
function getPageTop(el: HTMLElement): number {
  let top = 0;
  let cur: HTMLElement | null = el;
  while (cur) {
    top += cur.offsetTop;
    cur = cur.offsetParent as HTMLElement | null;
  }
  return top;
}

/* ---------- ProjectCard ---------- */

function ProjectCard({
  project,
  index,
  containerRef,
}: {
  project: Project;
  index: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const cardPageTop = useRef(0);
  const cardHeight = useRef(0);
  const containerPageBottom = useRef(0);

  /* ---- measure layout position (unaffected by transforms) ---- */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      cardPageTop.current = getPageTop(el);
      cardHeight.current = el.offsetHeight;
      if (containerRef.current) {
        containerPageBottom.current = getPageTop(containerRef.current) + containerRef.current.offsetHeight;
      }
    };
    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [containerRef]);

  /* ---- JS‑driven sticky: replaces CSS position:sticky ---- */
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, (latest) => {
    const pageTop = cardPageTop.current;
    if (!pageTop || !containerPageBottom.current) return 0;

    const isSmall = typeof window !== 'undefined' && window.innerWidth < 640;
    const baseVh = isSmall ? 5 : 8;
    const stepVh = isSmall ? 1.5 : 2;
    const targetTopVh = baseVh + index * stepVh;

    const totalCards = projects.length;
    const lastCardTargetVh = baseVh + (totalCards - 1) * stepVh;
    const lastCardTargetPx = (lastCardTargetVh / 100) * window.innerHeight;
    
    // The exact scrollY where the LAST card hits the bottom of the container
    const maxScrollY = containerPageBottom.current - cardHeight.current - lastCardTargetPx;
    
    // Freeze all cards at this scroll point so they maintain their staggered layout
    const effectiveLatest = maxScrollY > 0 ? Math.min(latest, maxScrollY) : latest;

    const targetPx = (targetTopVh / 100) * window.innerHeight;
    const naturalVpTop = pageTop - effectiveLatest; 
    if (naturalVpTop <= targetPx) {
      return targetPx - naturalVpTop; 
    }
    return 0; 
  });

  /* ---- scale animation (3D depth) ---- */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const totalCards = projects.length;
  const isLast = index === totalCards - 1;
  const targetScale = 1 - (totalCards - 1 - index) * 0.035;

  const scaleRange: [number, number] = isLast
    ? [0, 1]
    : [index / (totalCards - 1), (index + 1) / (totalCards - 1)];

  const scale = useTransform(
    scrollYProgress,
    scaleRange,
    isLast ? [1, 1] : [1, targetScale],
  );

  /* ---- render ---- */
  return (
    <motion.article
      ref={cardRef}
      className="relative flex h-[76dvh] min-h-[480px] max-h-[820px] flex-col overflow-hidden rounded-[28px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-3.5 xs:rounded-[36px] xs:p-5 sm:min-h-[560px] sm:rounded-[48px] sm:p-7 md:rounded-[56px] md:p-8"
      style={{
        y,
        scale,
        transformOrigin: 'top center',
        zIndex: index + 1,
        willChange: 'transform',
      }}
    >
      <div className="flex items-start justify-between gap-2.5 xs:gap-4">
        <div className="flex items-start gap-2.5 xs:gap-4 sm:gap-7">
          <span
            className="shrink-0 font-black leading-none text-[#D7E2EA]"
            style={{ fontSize: 'clamp(2rem, 7vw, 120px)' }}
          >
            {project.number}
          </span>
          <div className="pt-1 xs:pt-1.5 sm:pt-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D7E2EA]/60 xs:text-xs sm:text-sm">
              {project.category}
            </p>
            <h3 className="mt-0.5 text-sm font-medium uppercase leading-tight text-[#D7E2EA] xs:text-base sm:text-2xl md:text-3xl">
              {project.name}
            </h3>
            <p className="mt-1 line-clamp-2 max-w-[450px] text-xs font-light text-[#D7E2EA]/75 sm:line-clamp-none sm:text-sm">
              {project.description}
            </p>
          </div>
        </div>
        <LiveProjectButton className="shrink-0 px-3 py-1.5 text-[9px] xs:px-4 xs:py-2 xs:text-[10px] sm:px-6 sm:py-2.5 sm:text-xs md:px-8 md:py-3 md:text-sm" />
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[38%_62%] gap-2 xs:mt-4 xs:gap-2.5 sm:mt-6 sm:grid-cols-[40%_60%] sm:gap-3">
        <div className="flex min-h-0 flex-col gap-2 xs:gap-2.5 sm:gap-3">
          <img
            src={project.images[0]}
            alt={`${project.name} detail 1`}
            className="min-h-0 w-full flex-1 rounded-[16px] object-cover xs:rounded-[22px] sm:rounded-[36px] md:rounded-[44px]"
          />
          <img
            src={project.images[1]}
            alt={`${project.name} detail 2`}
            className="min-h-0 w-full flex-[1.35] rounded-[16px] object-cover xs:rounded-[22px] sm:rounded-[36px] md:rounded-[44px]"
          />
        </div>
        <img
          src={project.images[2]}
          alt={`${project.name} showcase`}
          className="h-full min-h-0 w-full rounded-[16px] object-cover xs:rounded-[22px] sm:rounded-[36px] md:rounded-[44px]"
        />
      </div>
    </motion.article>
  );
}

/* ---------- ProjectsSection ---------- */

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="projects"
      className="relative z-10 -mt-8 rounded-t-[32px] bg-[#0C0C0C] px-4 pt-16 pb-20 xs:-mt-10 xs:rounded-t-[40px] xs:px-6 xs:pt-20 xs:pb-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-32 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32 md:pb-40"
    >
      <FadeIn
        y={40}
        as="h2"
        className="hero-heading mb-6 text-center font-black uppercase leading-none tracking-tight sm:mb-8 md:mb-12"
        style={{ fontSize: 'clamp(2.4rem, 9.5vw, 150px)' }}
      >
        THINGS I MADE
      </FadeIn>
      <FadeIn y={30} delay={0.2} className="mx-auto mb-12 max-w-2xl text-center sm:mb-16 md:mb-20">
        <p className="text-xs font-light leading-relaxed text-[#D7E2EA]/70 xs:text-sm sm:text-base md:text-lg">
          Some started with a problem. Some started with &quot;this would be cool.&quot; A few started with absolutely no good reason. Either way, I built them.
        </p>
      </FadeIn>
      <div ref={containerRef} className="mx-auto flex max-w-6xl flex-col gap-[8vh] pb-[12vh] sm:gap-[10vh] sm:pb-[15vh]">
        {projects.map((project, index) => (
          <ProjectCard key={project.number} project={project} index={index} containerRef={containerRef} />
        ))}
      </div>
    </section>
  );
}
