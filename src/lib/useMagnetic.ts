import { useCallback, useRef } from 'react';

const canMagnet = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Callback ref that makes an element lean toward the cursor while hovered.
 * It only sets --mx/--my on the element itself; the .magnetic class turns them
 * into the `translate` property (separate from `transform`, so hover scales
 * keep working) with an eased transition. Mouse only; touch gets nothing.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3, max = 10) {
  const cleanup = useRef<(() => void) | null>(null);

  return useCallback(
    (el: T | null) => {
      cleanup.current?.();
      cleanup.current = null;
      if (!el || !canMagnet()) return;

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const clamp = (v: number) => Math.max(-max, Math.min(max, v));
        el.style.setProperty('--mx', `${clamp((e.clientX - (r.left + r.width / 2)) * strength)}px`);
        el.style.setProperty('--my', `${clamp((e.clientY - (r.top + r.height / 2)) * strength)}px`);
      };
      const leave = () => {
        el.style.setProperty('--mx', '0px');
        el.style.setProperty('--my', '0px');
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanup.current = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    [strength, max],
  );
}
