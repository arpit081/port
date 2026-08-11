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
    description: 'An LLM-powered intelligent chatbot built around RAG, intent classification, dynamic Cypher generation and a Neo4j knowledge graph.',
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
    description: 'An AI-powered application that transforms natural-language input into structured Excel reports using LLM-based data extraction.',
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
    description: 'A real-time hand-gesture mouse controller built with Python, OpenCV and MediaPipe.',
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

  /* ---- measure layout position (unaffected by transforms) ---- */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      cardPageTop.current = getPageTop(el);
    };
    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* ---- JS‑driven sticky: replaces CSS position:sticky ---- */
  const targetTopVh = 9 + index * 2; // card 0→9vh, 1→11vh, 2→13vh
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, (latest) => {
    const pageTop = cardPageTop.current;
    if (!pageTop) return 0;
    const targetPx = (targetTopVh / 100) * window.innerHeight;
    const naturalVpTop = pageTop - latest; // where the card WOULD be without transform
    if (naturalVpTop <= targetPx) {
      return targetPx - naturalVpTop; // push it back down to the target position
    }
    return 0; // hasn't reached target yet — stay at natural position
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
      className="relative flex h-[80vh] flex-col overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      style={{
        y,
        scale,
        transformOrigin: 'top center',
        zIndex: index + 1,
        willChange: 'transform',
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 sm:gap-8">
          <span className="font-black leading-none text-[#D7E2EA]" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{project.number}</span>
          <div className="pt-2 sm:pt-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/60 sm:text-sm">{project.category}</p>
            <h3 className="mt-1 max-w-[320px] text-lg font-medium uppercase leading-tight text-[#D7E2EA] sm:max-w-none sm:text-2xl md:text-3xl">{project.name}</h3>
            <p className="mt-2 hidden max-w-[400px] text-sm text-[#D7E2EA]/80 sm:block">{project.description}</p>
          </div>
        </div>
        <LiveProjectButton className="shrink-0 px-4 py-2 text-[10px] sm:px-6 sm:py-2.5 sm:text-xs md:px-8 md:py-3 md:text-sm" />
      </div>
      <div className="mt-5 grid min-h-0 flex-1 grid-cols-[40%_60%] gap-2 sm:mt-8 sm:gap-3">
        <div className="flex min-h-0 flex-col gap-2 sm:gap-3">
          <img src={project.images[0]} alt={`${project.name} detail`} className="min-h-0 w-full flex-1 object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
          <img src={project.images[1]} alt={`${project.name} detail`} className="min-h-0 w-full flex-[1.35] object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
        </div>
        <img src={project.images[2]} alt={`${project.name} showcase`} className="h-full min-h-0 w-full object-cover rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
      </div>
    </motion.article>
  );
}

/* ---------- ProjectsSection ---------- */

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section id="projects" className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32">
      <FadeIn
        y={40}
        as="h2"
        className="hero-heading mb-16 text-center font-black uppercase leading-none tracking-tight sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Project
      </FadeIn>
      <div ref={containerRef} className="mx-auto flex max-w-6xl flex-col gap-[10vh] pb-[15vh]">
        {projects.map((project, index) => (
          <ProjectCard key={project.number} project={project} index={index} containerRef={containerRef} />
        ))}
      </div>
    </section>
  );
}
