import { useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import FadeIn from './FadeIn';
import QuirkyText from './QuirkyText';
import LiveProjectButton from './LiveProjectButton';
import SectionDepth from './SectionDepth';
import { useTilt } from '@/lib/useTilt';

// Images in public/projects are designed in HTML and rendered to WebP at 2x their
// on-card size: python scripts/project-images/gen.py, then render.py public/projects.
// The slots change shape with the viewport, so they're shown whole (object-contain)
// on the images' own edge colour rather than cropped.
type ProjectImage = { src: string; alt: string };
type Project = { number: string; category: string; name: string; description: string; images: ProjectImage[]; repo: string };

const projects: Project[] = [
  {
    number: '01',
    category: 'PERSONAL PROJECT',
    name: 'ENTERPRISE GRAPH-RAG & AGENT SYSTEM',
    repo: 'https://github.com/arpit081/hybrid-graph-rag-system',
    description: 'Ask in plain English, get exact answers from a knowledge graph. A LangGraph agent writes Cypher, checks its own work before running it, and answers repeat questions from Redis in ~0.1 ms.',
    images: [
      { src: '/projects/rag-1.webp', alt: 'Stats: 100% exact match across 36 benchmarks, 0.1 ms cached queries, 100% of mutating queries blocked' },
      { src: '/projects/rag-2.webp', alt: 'LangGraph state machine: router, Text-to-Cypher with a self-correcting validator, document retrieval and a Redis cache shortcut' },
      { src: '/projects/rag-3.webp', alt: 'Chat UI answering a question by generating, validating and running a read-only Cypher query' },
    ],
  },
  { 
    number: '02', 
    category: 'NIC PROJECT', 
    name: 'AI CHATBOT SYSTEM', 
    repo: 'https://github.com/arpit081/NIC-project',
    description: 'An intelligent chatbot that actually understands intent. Built with LLMs, RAG, and a Neo4j knowledge graph that generates Cypher queries on the fly.',
    images: [
      { src: '/projects/nic-1.webp', alt: 'Offline PDFs turned into Subject-Predicate-Object triples, 5,000+ in total' },
      { src: '/projects/nic-2.webp', alt: 'Intent classification and entity extraction turning a question into a dynamic Cypher query' },
      { src: '/projects/nic-3.webp', alt: 'Neo4j knowledge graph of Little Andaman villages and facilities, queried in natural language' },
    ],
  },
  { 
    number: '03', 
    category: 'PERSONAL PROJECT', 
    name: 'AI-POWERED EXCEL REPORT GENERATOR', 
    repo: 'https://github.com/arpit081/excel-sheet-generator',
    description: 'Because writing Excel reports manually is terrible. You just type what you want in plain English, and an LLM extracts the data to build the structured report for you.',
    images: [
      { src: '/projects/sheet-1.webp', alt: 'SheetAI prompt bar: describe a sheet in plain English and generate it' },
      { src: '/projects/sheet-2.webp', alt: 'Generated .xlsx ready to download, with history and ~70% less time spent on reports' },
      { src: '/projects/sheet-3.webp', alt: 'Generated spreadsheet of monthly sales by region with target, actual, variance and status' },
    ],
  },
  { 
    number: '04', 
    category: 'PERSONAL PROJECT', 
    name: 'AI HOVER MOUSE', 
    repo: 'https://github.com/arpit081/ai-hover-mouse',
    description: 'A mouse you control with your hands. Because apparently using a mouse normally wasn\'t interesting enough. Built in real-time with Python, OpenCV and MediaPipe.',
    images: [
      { src: '/projects/hover-1.webp', alt: 'Hand gestures: index finger to move, pinch to click, thumb and index spread for volume' },
      { src: '/projects/hover-2.webp', alt: 'Stats: 95% cursor accuracy, under 50 ms latency, 40% fewer false detections, 21 landmarks' },
      { src: '/projects/hover-3.webp', alt: 'Webcam view with 21 hand landmarks tracked and the cursor following the index fingertip' },
    ],
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
  const lastCardPageTop = useRef(0);

  /* ---- measure layout position (unaffected by transforms) ---- */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => {
      cardPageTop.current = getPageTop(el);
      const last = containerRef.current?.lastElementChild as HTMLElement | null | undefined;
      if (last) lastCardPageTop.current = getPageTop(last);
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
    if (!pageTop || !lastCardPageTop.current) return 0;

    const totalCards = projects.length;
    const lastCardTargetVh = 9 + (totalCards - 1) * 2;
    const lastCardTargetPx = (lastCardTargetVh / 100) * window.innerHeight;

    // The exact scrollY where the LAST card lands in its slot. The stack
    // releases right there, so it flows straight into scrolling away; waiting
    // for the container's bottom padding left a dead zone where nothing moved.
    const maxScrollY = lastCardPageTop.current - lastCardTargetPx;

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
  // Buried cards darken as they shrink, so the stack reads as depth
  const shade = useTransform(scrollYProgress, scaleRange, isLast ? [0, 0] : [0, 0.5]);
  // Images unmask the first time the card is a quarter on screen
  const seen = useInView(cardRef, { once: true, amount: 0.25 });
  const tilt0 = useTilt<HTMLImageElement>();
  const tilt1 = useTilt<HTMLImageElement>();
  const tilt2 = useTilt<HTMLImageElement>();

  /* ---- render ---- */
  return (
    <motion.article
      ref={cardRef}
      // short: (landscape phones) compact header so the images keep some room
      className={`${seen ? 'is-seen' : ''} relative flex h-[80vh] flex-col overflow-hidden rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8 short:!rounded-[32px] short:!p-4`}
      style={{
        y,
        scale,
        transformOrigin: 'top center',
        zIndex: index + 1,
        willChange: 'transform',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4 sm:gap-8">
          <span className="font-black leading-none text-[#D7E2EA] short:!text-5xl" style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}>{project.number}</span>
          <div className="pt-2 sm:pt-5 short:!pt-1">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/60 sm:text-sm short:!text-[10px]">{project.category}</p>
            <h3 className="mt-1 max-w-[20rem] text-lg font-medium uppercase leading-tight text-[#D7E2EA] sm:max-w-none sm:text-2xl md:text-3xl short:!text-lg">{project.name}</h3>
            <p className="mt-2 hidden max-w-[25rem] text-sm text-[#D7E2EA]/80 sm:block short:!hidden">{project.description}</p>
          </div>
        </div>
        <LiveProjectButton href={project.repo} label={project.name} className="self-start sm:self-auto shrink-0 px-4 py-2 text-[10px] sm:px-6 sm:py-2.5 sm:text-xs md:px-8 md:py-3 md:text-sm" />
      </div>
      <div className="mt-5 grid min-h-0 flex-1 grid-cols-[2fr_3fr] gap-2 sm:mt-8 sm:gap-3 short:!mt-3">
        <div className="flex min-h-0 flex-col gap-2 sm:gap-3">
          <img ref={tilt0} src={project.images[0].src} alt={project.images[0].alt} loading="lazy" decoding="async" style={{ animationDelay: '0.1s' }} className="tilt img-reveal min-h-0 w-full flex-1 bg-[#07070a] object-contain rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
          <img ref={tilt1} src={project.images[1].src} alt={project.images[1].alt} loading="lazy" decoding="async" style={{ animationDelay: '0.22s' }} className="tilt img-reveal min-h-0 w-full flex-[1.35] bg-[#07070a] object-contain rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
        </div>
        <img ref={tilt2} src={project.images[2].src} alt={project.images[2].alt} loading="lazy" decoding="async" style={{ animationDelay: '0s' }} className="tilt img-reveal h-full min-h-0 w-full bg-[#07070a] object-contain rounded-[30px] sm:rounded-[40px] md:rounded-[50px]" />
      </div>
      <motion.span className="card-shade" style={{ opacity: shade }} aria-hidden="true" />
    </motion.article>
  );
}

/* ---------- ProjectsSection ---------- */

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <SectionDepth id="projects" className="grain relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 pb-24 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-32 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32 md:pb-40">
      <FadeIn
        y={40}
        as="h2"
        className="mb-8 text-center font-black uppercase leading-none tracking-tight sm:mb-10 md:mb-14"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        <QuirkyText text="THINGS I MADE" variant="quirk-jelly" letterClassName="hero-heading" reveal />
      </FadeIn>
      <FadeIn y={30} delay={0.2} className="mx-auto mb-16 max-w-2xl text-center sm:mb-20 md:mb-24">
        <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/70 sm:text-base md:text-lg">
          Some started with a problem. Some started with "this would be cool." A few started with absolutely no good reason. Either way, I built them.
        </p>
      </FadeIn>
      <div ref={containerRef} className="mx-auto flex max-w-6xl flex-col gap-[10vh] pb-[15vh]">
        {projects.map((project, index) => (
          <ProjectCard key={project.number} project={project} index={index} containerRef={containerRef} />
        ))}
      </div>
    </SectionDepth>
  );
}
