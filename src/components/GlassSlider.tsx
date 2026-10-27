import { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Droplet } from 'lucide-react';
import { useGlass } from '@/lib/glass';

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 32 };
const CAPSULE_HEIGHT = 30;
// Max px the capsule stretches when dragged past either end (rubber band)
const MAX_STRETCH = 10;
const KEY_STEP = 0.05;

/** Frosted ↔ liquid glass control: a horizontal twin of the volume capsule */
export default function GlassSlider() {
  const [clarity, setClarity] = useGlass();
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [width, setWidth] = useState(0);

  // Signed overflow in px: positive = past the right end, negative = past the left
  const stretch = useMotionValue(0);
  const scaleX = useTransform(stretch, (s) => 1 + Math.abs(s) / 240);
  const scaleY = useTransform(stretch, (s) => 1 - Math.abs(s) / (CAPSULE_HEIGHT * 4));
  const originX = useTransform(stretch, (s) => (s >= 0 ? 0 : 1));

  const updateFromPointer = (el: HTMLElement, clientX: number) => {
    const rect = el.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const overflowPx = raw > 1 ? (raw - 1) * rect.width : raw < 0 ? raw * rect.width : 0;
    stretch.set(Math.sign(overflowPx) * MAX_STRETCH * (1 - Math.exp(-Math.abs(overflowPx) / 60)));
    setClarity(Math.max(0, Math.min(1, raw)));
  };

  const endDrag = () => {
    setIsDragging(false);
    setHasMoved(false);
    animate(stretch, 0, SPRING);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(1, clarity + KEY_STEP);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, clarity - KEY_STEP);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = 1;
    if (next === null) return;
    e.preventDefault();
    setClarity(next);
  };

  // Droplet sits ~15px in from the left; flip its colour once the fill covers it
  const iconCovered = clarity * width > 26;

  return (
    <div className="glass-slider">
      <div className="glass-slider-labels" aria-hidden="true">
        <span>Frosted</span>
        <span>Liquid</span>
      </div>
      <div
        className="glass-slider-hit"
        role="slider"
        tabIndex={0}
        aria-label="Glass clarity"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clarity * 100)}
        aria-valuetext={clarity < 0.05 ? 'Frosted' : clarity > 0.95 ? 'Liquid' : `${Math.round(clarity * 100)}% liquid`}
        ref={(el) => { if (el && el.offsetWidth !== width) setWidth(el.offsetWidth); }}
        onKeyDown={handleKeyDown}
        onPointerDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setIsDragging(true);
          updateFromPointer(e.currentTarget, e.clientX);
        }}
        onPointerMove={(e) => {
          if (!isDragging) return;
          if (!hasMoved) setHasMoved(true);
          updateFromPointer(e.currentTarget, e.clientX);
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
          endDrag();
        }}
        onPointerCancel={endDrag}
        onLostPointerCapture={() => { if (isDragging) endDrag(); }}
      >
        <motion.div
          className="glass-slider-press"
          animate={{ scale: isDragging ? 1.04 : 1 }}
          transition={SPRING}
        >
          <motion.div
            className="glass-slider-capsule"
            style={{ height: CAPSULE_HEIGHT, scaleX, scaleY, originX }}
          >
            <div
              className="glass-slider-fill"
              style={{
                width: `${clarity * 100}%`,
                transition: hasMoved ? 'none' : 'width 0.18s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            />
            <span className={`glass-slider-icon ${iconCovered ? 'is-covered' : ''}`}>
              <Droplet size={15} strokeWidth={2.2} fill={clarity > 0.5 ? 'none' : 'currentColor'} fillOpacity={0.35} />
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
