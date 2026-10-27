import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Click anywhere outside `insideRef` to dismiss. The outside click is
 * swallowed (no link or button fires), the same as the full-screen backdrops
 * this replaces. Unlike a backdrop it never covers the page, so hover effects
 * keep working underneath. Clicks inside `ignore` (a selector) pass through
 * untouched.
 */
export function useDismiss(
  active: boolean,
  insideRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  ignore?: string,
) {
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;

  useEffect(() => {
    if (!active) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || insideRef.current?.contains(target)) return;
      if (ignore && target.closest?.(ignore)) return;
      e.preventDefault();
      e.stopPropagation();
      dismiss.current();
    };
    // Capture on window runs before React's own handlers on the root
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [active, insideRef, ignore]);
}
