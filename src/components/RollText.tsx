import type { ReactNode } from 'react';

/**
 * Button label that rolls on hover: the text slides up out of view while an
 * identical copy rolls in from below (CSS in index.css, "Rolling labels").
 * The copy is aria-hidden, so screen readers hear the label once.
 */
export default function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">{children}</span>
    </span>
  );
}
