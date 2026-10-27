import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useBackgroundPaused } from '@/lib/glass';

const LINES = [
  { text: '$ curl -X POST /ask', tone: 'cmd' },
  { text: '{ "q": "who is eligible for this scheme?" }', tone: 'muted' },
  { text: '→ intent   eligibility_lookup', tone: 'info' },
  { text: '→ cypher   MATCH (s:Scheme)-[:FOR]->(g)', tone: 'info' },
  { text: '← 200 OK · 142ms', tone: 'ok' },
] as const;

const TOTAL = LINES.reduce((n, l) => n + l.text.length, 0);
const TICK_MS = 32;
const HOLD_TICKS = 70; // ~2.2s pause on the finished response before looping

/** A request typing itself out and getting answered, on loop while visible */
export default function ApiTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-40px' });
  const paused = useBackgroundPaused();
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (!inView || paused) return;
    const id = window.setInterval(() => {
      setTyped((n) => (n >= TOTAL + HOLD_TICKS ? 0 : n + 1));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [inView, paused]);

  let remaining = typed;
  return (
    <div ref={ref} className="api-terminal" aria-hidden="true">
      <div className="api-terminal-dots"><span /><span /><span /></div>
      {LINES.map((line, i) => {
        const shown = Math.max(0, Math.min(line.text.length, remaining));
        const isTyping = remaining > 0 && remaining < line.text.length;
        remaining -= line.text.length;
        if (shown === 0 && !(i === 0 && typed === 0)) return <div key={i} className="api-line" />;
        return (
          <div key={i} className={`api-line tone-${line.tone}`}>
            {line.text.slice(0, shown)}
            {(isTyping || (i === 0 && typed === 0)) && <span className="api-caret" />}
          </div>
        );
      })}
    </div>
  );
}
