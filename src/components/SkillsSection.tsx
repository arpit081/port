import { useRef } from 'react';
import { useInView } from 'framer-motion';
import FadeIn from './FadeIn';
import QuirkyText from './QuirkyText';
import SkillTile from './skills/SkillTile';
import KnowledgeGraph from './skills/KnowledgeGraph';
import ApiTerminal from './skills/ApiTerminal';
import UiPlayground from './skills/UiPlayground';
import ToolsGrid from './skills/ToolsGrid';
import type { ToolGroup } from './skills/ToolsGrid';

// Everything from the resume's Technical Skills, plus the stack named on its projects
const AI_SKILLS = [
  'Generative AI', 'Intent Classification', 'Entity Relation Extraction', 'Knowledge Graph Modeling',
  'SPO Triple Generation', 'Embeddings', 'Vector Databases', 'Prompt Engineering', 'PyTorch',
  'OpenAI GPT', 'Gemini', 'Ollama', 'OpenCV', 'MediaPipe',
];
const BACKEND_SKILLS = ['Python', 'FastAPI', 'REST APIs', 'LLM Integration', 'RAG', 'Agentic AI Workflows', 'LangGraph', 'Neo4j', 'Cypher', 'Node.js'];
const FRONTEND_SKILLS = ['React.js', 'JavaScript', 'HTML', 'CSS', 'Bootstrap', 'Streamlit'];
const TOOL_GROUPS: ToolGroup[] = [
  { label: 'Data', tools: ['MongoDB', 'MySQL', 'SQL', 'Redis', 'Neo4j Browser'] },
  { label: 'Infra & deploy', tools: ['Docker', 'Kubernetes', 'Linux', 'Vercel', 'Server Deployment'] },
  { label: 'Workflow', tools: ['Git', 'GitHub', 'Postman', 'API Testing', 'Debugging & Optimization'] },
  { label: 'Data pipelines', tools: ['PyPDF / PDFMiner', 'Data Cleaning', 'Unstructured Data Processing', 'Knowledge Graph Ingestion', 'System Integration'] },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // CSS loops (aurora, marquee, playground) only run while the section is near the viewport
  const isLive = useInView(sectionRef, { margin: '200px' });

  return (
    <section
      ref={sectionRef}
      id="skills"
      className={`skills-section relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-[#0C0C0C] px-5 pt-20 pb-36 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 sm:pt-24 sm:pb-44 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-32 md:pb-52 ${isLive ? 'is-live' : ''}`}
    >
      {/* Slow-drifting colour behind the glass — what the refraction bends */}
      <div className="skills-aurora" aria-hidden="true">
        <span className="aurora-blob blob-1" />
        <span className="aurora-blob blob-2" />
        <span className="aurora-blob blob-3" />
        <span className="aurora-blob blob-4" />
      </div>

      <div className="relative z-[1]">
        <FadeIn
          y={40}
          as="h2"
          className="mb-8 text-center font-black uppercase leading-none tracking-tight [text-wrap:balance] sm:mb-10 md:mb-14"
          style={{ fontSize: 'clamp(3rem, 11vw, 150px)' }}
        >
          <QuirkyText text="WHAT I WORK WITH" variant="quirk-press" letterClassName="hero-heading" />
        </FadeIn>
        <FadeIn y={30} delay={0.2} className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 md:mb-20">
          <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/70 sm:text-base md:text-lg">
            A few things I've spent way too much time figuring out.
          </p>
        </FadeIn>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          <SkillTile
            index="01"
            title="AI / ML / NLP"
            blurb="Teaching machines to understand what people actually mean."
            chips={AI_SKILLS}
            className="md:col-span-2"
          >
            <KnowledgeGraph />
          </SkillTile>

          <SkillTile
            index="02"
            title="Backend"
            blurb="APIs and pipelines that quietly do the heavy lifting."
            chips={BACKEND_SKILLS}
            delay={0.1}
          >
            <ApiTerminal />
          </SkillTile>

          <SkillTile
            index="03"
            title="Frontend"
            blurb="Enough to make the things I build feel good to use."
            chips={FRONTEND_SKILLS}
            delay={0.15}
          >
            <UiPlayground />
          </SkillTile>

          <SkillTile
            index="04"
            title="Tools / Systems"
            blurb="The stuff that gets it built, shipped and kept alive."
            className="md:col-span-2"
            delay={0.2}
          >
            <ToolsGrid groups={TOOL_GROUPS} />
          </SkillTile>
        </div>
      </div>
    </section>
  );
}
