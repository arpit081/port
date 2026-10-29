import { useCallback, useRef } from 'react';

const canTilt = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Callback ref: the element tips toward the cursor while hovered (up to `max`
 * degrees) and lifts a touch. Sets --rx/--ry/--ts on the element only; the
 * .tilt class turns them into an eased transform. Mouse only.
 */
export function useTilt<T extends HTMLElement>(max = 4) {
  const cleanup = useRef<(() => void) | null>(null);

  return useCallback(
    (el: T | null) => {
      cleanup.current?.();
      cleanup.current = null;
      if (!el || !canTilt()) return;

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(px * 2 * max).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-py * 2 * max).toFixed(2)}deg`);
        el.style.setProperty('--ts', '1.02');
      };
      const leave = () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--ts', '1');
      };
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanup.current = () => {
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      };
    },
    [max],
  );
}
