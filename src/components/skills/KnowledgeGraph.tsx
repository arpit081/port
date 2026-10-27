import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useBackgroundPaused } from '@/lib/glass';

type GraphNode = { id: string; x: number; y: number; label?: string };

const NODES: GraphNode[] = [
  { id: 'intent', x: 62, y: 148, label: 'Intent' },
  { id: 'rag', x: 122, y: 52, label: 'RAG' },
  { id: 'llm', x: 206, y: 104, label: 'LLM' },
  { id: 'emb', x: 238, y: 30, label: 'Embeddings' },
  { id: 'neo', x: 322, y: 70, label: 'Neo4j' },
  { id: 'cypher', x: 366, y: 156, label: 'Cypher' },
  { id: 'spo', x: 268, y: 172, label: 'SPO triples' },
  { id: 's1', x: 28, y: 82 },
  { id: 's2', x: 158, y: 176 },
  { id: 's3', x: 398, y: 38 },
  { id: 's4', x: 176, y: 18 },
];

const EDGES: [string, string][] = [
  ['intent', 'llm'], ['rag', 'llm'], ['rag', 'emb'], ['emb', 'llm'],
  ['llm', 'neo'], ['neo', 'cypher'], ['neo', 'spo'], ['spo', 'llm'],
  ['rag', 's1'], ['intent', 's1'], ['intent', 's2'], ['llm', 's2'],
  ['neo', 's3'], ['rag', 's4'], ['emb', 's4'],
];

// How a question flows through the NIC chatbot: intent → LLM → graph → Cypher
const QUERY_PATH = ['intent', 'llm', 'neo', 'cypher'];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

export default function KnowledgeGraph() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: '-40px' });
  const paused = useBackgroundPaused();
  const path = QUERY_PATH.map((id) => byId[id]);

  return (
    <svg ref={ref} className="knowledge-graph" viewBox="0 0 420 200" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="kg-pulse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="45%" stopColor="#c4b5fd" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {EDGES.map(([a, b], i) => {
        const onPath = QUERY_PATH.some((id, k) => (id === a && QUERY_PATH[k + 1] === b) || (id === b && QUERY_PATH[k + 1] === a));
        return (
          <motion.line
            key={`${a}-${b}`}
            x1={byId[a].x} y1={byId[a].y} x2={byId[b].x} y2={byId[b].y}
            className={onPath ? 'kg-edge is-path' : 'kg-edge'}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: 0.2 + i * 0.06, ease: 'easeOut' }}
          />
        );
      })}

      {NODES.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 + i * 0.05 }}
        >
          {n.label && <circle cx={n.x} cy={n.y} r={11} className="kg-halo" style={{ animationDelay: `${-i * 0.7}s` }} />}
          <circle cx={n.x} cy={n.y} r={n.label ? 4.5 : 2.5} className={n.label ? 'kg-node' : 'kg-node is-minor'} />
          {n.label && (
            <text x={n.x} y={n.y + (n.y > 140 ? -14 : 20)} className="kg-label" textAnchor="middle">{n.label}</text>
          )}
        </motion.g>
      ))}

      {/* A query travelling along the pipeline */}
      {inView && !paused && (
        <motion.circle
          r={9}
          fill="url(#kg-pulse)"
          initial={{ cx: path[0].x, cy: path[0].y, opacity: 0 }}
          animate={{
            cx: path.map((p) => p.x),
            cy: path.map((p) => p.y),
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2, delay: 1.6 }}
        />
      )}
    </svg>
  );
}
