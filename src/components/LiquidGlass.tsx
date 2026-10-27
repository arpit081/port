import { useEffect, useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { buildDisplacementMap, supportsLiquidGlass, useGlass } from '@/lib/glass';

type LiquidGlassOptions = {
  /** Width of the curved rim (px) where the backdrop bends */
  bezel?: number;
  /** Max refraction shift (px) at the very edge, at full clarity */
  strength?: number;
  /** How far apart the R/G/B channels refract (0 = no colour fringing) */
  aberration?: number;
  /** Hide the lens, e.g. while the panel's own open/close animation runs */
  hidden?: boolean;
  /**
   * Keep bending while the page scrolls. Only for small glass (pill, nav dot):
   * a scroll re-bends the whole lens every frame, cheap at pill size, ~14ms+
   * for the open card or menu, which fade out during scrolls instead.
   */
  liveWhileScrolling?: boolean;
  /** Ignore the Frosted ↔ Liquid slider and always refract fully (hero lens) */
  alwaysOn?: boolean;
  /**
   * 'backdrop' (default) bends the page behind the element via `lens`.
   * 'content' instead exposes `filterUrl` to put on an element's own `filter`,
   * bending what it draws itself (the hero lens's magnified text copy).
   */
  mode?: 'backdrop' | 'content';
};

type LiquidGlass = {
  /** Attach to the panel's positioned wrapper — the box the lens fills */
  ref: (el: HTMLElement | null) => void;
  /**
   * Render as the wrapper's FIRST child, before the blur surface and content.
   * It must be a sibling behind the blurred surface, never inside it: an
   * element with backdrop-filter is a "backdrop root", and a filter nested in
   * it only sees that element's own paint, not the page.
   */
  lens: ReactNode;
  /** 'content' mode: `url(#…)` for the element's CSS filter (null while inactive) */
  filterUrl: string | null;
};

// Keep only one channel (plus alpha) so three shifted copies can be recombined
const channelMatrix = {
  r: '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0',
  g: '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0',
  b: '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0',
};

/**
 * Apple-style liquid glass refraction driven by the site-wide clarity slider.
 * Chromium-only; elsewhere (or at clarity 0) the lens is null and the panel's
 * frosted CSS stays in charge.
 *
 * Cost model (measured): Chrome runs SVG backdrop filters on the CPU, and the
 * price is proportional to the pixels that changed under the lens — a 2px
 * blink inside the card is free, a scroll or a full-panel morph costs ~14ms a
 * frame at 1× scaling. So big lenses fade out during scrolls (html[data-scrolling],
 * see glass.ts; small ones opt out via `liveWhileScrolling`) and whenever the
 * caller passes `hidden` for its own morphs.
 */
export function useLiquidGlass({
  bezel = 18,
  strength = 20,
  aberration = 0.12,
  hidden = false,
  liveWhileScrolling = false,
  alwaysOn = false,
  mode = 'backdrop',
}: LiquidGlassOptions = {}): LiquidGlass {
  const [sliderClarity] = useGlass();
  const clarity = alwaysOn ? 1 : sliderClarity;
  const [el, setEl] = useState<HTMLElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number; r: number } | null>(null);
  const id = `liquid-glass-${useId().replace(/:/g, '')}`;
  const active = supportsLiquidGlass && clarity > 0;

  // Layout size (offsetWidth/Height ignore transforms, so framer scale anims don't thrash this)
  useEffect(() => {
    // Element unmounted (e.g. card closed): drop the stale filter from the page
    if (!el) {
      setBox(null);
      return;
    }
    if (!supportsLiquidGlass) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2);
      setBox((prev) => (prev && prev.w === w && prev.h === h && prev.r === r ? prev : { w, h, r }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [el]);

  const map = useMemo(
    () => (active && box ? buildDisplacementMap(box.w, box.h, box.r, bezel) : null),
    [active, box, bezel],
  );

  if (!active || !box || !map) {
    return { ref: setEl, lens: null, filterUrl: null };
  }

  // feDisplacementMap shifts by scale * (channel - 0.5), and the map peaks at ±0.5
  const scale = 2 * strength * clarity;

  const displace = (k: number, result: string) => (
    <feDisplacementMap in="SourceGraphic" in2="map" scale={scale * k} xChannelSelector="R" yChannelSelector="G" result={result} />
  );

  const filter = createPortal(
    <svg aria-hidden="true" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <filter
        id={id}
        x="0"
        y="0"
        width={box.w}
        height={box.h}
        filterUnits="userSpaceOnUse"
        primitiveUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feImage href={map} x="0" y="0" width={box.w} height={box.h} preserveAspectRatio="none" result="map" />
        {aberration > 0 ? (
          // Colour fringing: R/G/B refract by slightly different amounts, then recombine
          <>
            {displace(1 - aberration, 'r')}
            {displace(1, 'g')}
            {displace(1 + aberration, 'b')}
            <feColorMatrix in="r" type="matrix" values={channelMatrix.r} result="rr" />
            <feColorMatrix in="g" type="matrix" values={channelMatrix.g} result="gg" />
            <feColorMatrix in="b" type="matrix" values={channelMatrix.b} result="bb" />
            <feBlend in="rr" in2="gg" mode="screen" result="rg" />
            <feBlend in="rg" in2="bb" mode="screen" />
          </>
        ) : (
          displace(1, 'out')
        )}
      </filter>
    </svg>,
    document.body,
  );

  if (mode === 'content') {
    return { ref: setEl, lens: filter, filterUrl: `url(#${id})` };
  }

  const lens = (
    <>
      {filter}
      <span
        className="lg-lens"
        aria-hidden="true"
        data-hidden={hidden || undefined}
        data-scroll-live={liveWhileScrolling || undefined}
        style={{ backdropFilter: `url(#${id})`, WebkitBackdropFilter: `url(#${id})` }}
      />
    </>
  );

  return { ref: setEl, lens, filterUrl: null };
}
