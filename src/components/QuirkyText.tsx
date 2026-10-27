import type { CSSProperties } from 'react';

type QuirkyTextProps = {
  text: string;
  /** Quirk class from index.css, e.g. 'quirk-jelly' */
  variant: string;
  className?: string;
  /** Class put on every letter, e.g. 'hero-heading' so the gradient survives transforms */
  letterClassName?: string;
  /** Character that gets its own extra move (the ? in "WHO AM I?") */
  special?: string;
};

/** Repeatable pseudo-random in [-1, 1], so letters tumble the same way every time */
function jitter(i: number) {
  return ((i * 37 + 11) % 21) / 10 - 1;
}

/**
 * Splits text into words → letters so CSS can animate each letter on hover.
 * Words stay unbreakable, so headings still wrap between words, not letters.
 * Screen readers get the plain text; the letter spans are hidden from them.
 * Per-letter vars: --i index, --d distance from the middle, --r jitter;
 * per-word --w; wrapper --n letter count.
 */
export default function QuirkyText({ text, variant, className = '', letterClassName = '', special }: QuirkyTextProps) {
  const words = text.split(' ');
  const total = text.replace(/ /g, '').length;
  const mid = (total - 1) / 2;
  let i = 0;

  return (
    <span className={`quirk ${variant} ${className}`} style={{ '--n': total } as CSSProperties}>
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
    </span>
  );
}
