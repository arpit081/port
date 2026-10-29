import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useInView } from 'framer-motion';
import { canSkew, registerSkew } from '@/lib/scrollSkew';

type QuirkyTextProps = {
  text: string;
  /** Quirk class from index.css, e.g. 'quirk-jelly' */
  variant: string;
  className?: string;
  /** Class put on every letter, e.g. 'hero-heading' so the gradient survives transforms */
  letterClassName?: string;
  /** Character that gets its own extra move (the ? in "WHO AM I?") */
  special?: string;
  /** Section headings: letters rise from behind a line the first time they're
      seen, and the heading leans with scroll speed */
  reveal?: boolean;
};

/** Repeatable pseudo-random in [-1, 1], so letters tumble the same way every time */
function jitter(i: number) {
  return ((i * 37 + 11) % 21) / 10 - 1;
}

const RISE_MS = 900;
const STAGGER_MS = 35;

/**
 * Splits text into words → letters so CSS can animate each letter on hover.
 * Words stay unbreakable, so headings still wrap between words, not letters.
 * Screen readers get the plain text; the letter spans are hidden from them.
 * Per-letter vars: --i index, --d distance from the middle, --r jitter;
 * per-word --w; wrapper --n letter count.
 */
export default function QuirkyText({ text, variant, className = '', letterClassName = '', special, reveal = false }: QuirkyTextProps) {
  const words = text.split(' ');
  const total = text.replace(/ /g, '').length;
  const mid = (total - 1) / 2;
  let i = 0;

  const letters = (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            {w > 0 && ' '}
            <span className="q-word" style={{ '--w': w } as CSSProperties}>
              {word.split('').map((ch) => {
                const idx = i++;
                return (
                  <span
                    key={idx}
                    className={`q-letter ${letterClassName} ${ch === special ? 'q-special' : ''}`}
                    style={{ '--i': idx, '--d': (idx - mid).toFixed(2), '--r': jitter(idx).toFixed(2) } as CSSProperties}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </>
  );

  if (reveal) {
    return (
      <RevealWrap className={`quirk ${variant} ${className}`} total={total}>
        {letters}
      </RevealWrap>
    );
  }
  return (
    <span className={`quirk ${variant} ${className}`} style={{ '--n': total } as CSSProperties}>
      {letters}
    </span>
  );
}

/**
 * The reveal + skew wrapper (headings only, so plain QuirkyText runs no hooks).
 * Once the rise has played, is-done drops the clip and the animation, so the
 * hover quirks and the letters' full glyph boxes work exactly as before.
 */
function RevealWrap({ className, total, children }: { className: string; total: number; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const onScreen = useInView(ref);
  const [done, setDone] = useState(false);

  // Lean with scroll speed only while on screen (one shared loop, desktop only)
  useEffect(() => {
    if (!onScreen || !ref.current || !canSkew()) return;
    return registerSkew(ref.current);
  }, [onScreen]);

  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setDone(true), RISE_MS + total * STAGGER_MS + 50);
    return () => window.clearTimeout(t);
  }, [inView, total]);

  return (
    <span
      ref={ref}
      className={`${className} q-reveal ${inView ? 'is-in' : ''} ${done ? 'is-done' : ''}`}
      style={{ '--n': total } as CSSProperties}
    >
      {children}
    </span>
  );
}
