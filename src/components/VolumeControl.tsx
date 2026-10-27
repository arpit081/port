import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 32 };
const CLOSE_DELAY = 200;
const CAPSULE_HEIGHT = 150;
// Max px the capsule stretches when dragged past either end (rubber band)
const MAX_STRETCH = 12;
const KEY_STEP = 0.05;

function VolumeIcon({ volume, size, color }: { volume: number; size: number; color: string }) {
  if (volume === 0) return <VolumeX size={size} color={color} strokeWidth={2} />;
  if (volume < 0.31) return <Volume1 size={size} color={color} strokeWidth={2} />;
  return <Volume2 size={size} color={color} strokeWidth={2} />;
}

type VolumeControlProps = {
  volume: number;
  setVolume: (v: number) => void;
  iconColor: string;
};

export default function VolumeControl({ volume, setVolume, iconColor }: VolumeControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const previousVolumeRef = useRef(1);
  const closeTimer = useRef<number | undefined>(undefined);
  const isHovering = useRef(false);
  const lastPointerType = useRef('mouse');

  // Signed overflow in px: positive = dragged above the top, negative = below the bottom
  const stretch = useMotionValue(0);
  const scaleY = useTransform(stretch, (s) => 1 + Math.abs(s) / CAPSULE_HEIGHT);
  const scaleX = useTransform(stretch, (s) => 1 - Math.abs(s) / (CAPSULE_HEIGHT * 3));
  const originY = useTransform(stretch, (s) => (s >= 0 ? 1 : 0));

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const open = () => {
    window.clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setIsOpen(false), CLOSE_DELAY);
  };

  const updateFromPointer = (el: HTMLElement, clientY: number) => {
    const rect = el.getBoundingClientRect();
    const raw = (rect.bottom - clientY) / rect.height;
    const overflowPx = raw > 1 ? (raw - 1) * rect.height : raw < 0 ? raw * rect.height : 0;
    // Diminishing resistance the further past the end you pull
    stretch.set(Math.sign(overflowPx) * MAX_STRETCH * (1 - Math.exp(-Math.abs(overflowPx) / 60)));

    const next = Math.max(0, Math.min(1, raw));
    setVolume(next);
    if (next > 0) previousVolumeRef.current = next;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
    setHasMoved(false);
    animate(stretch, 0, SPRING);
    if (!isHovering.current && lastPointerType.current === 'mouse') scheduleClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') next = Math.min(1, volume + KEY_STEP);
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') next = Math.max(0, volume - KEY_STEP);
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = 1;
    if (e.key === 'Escape') setIsOpen(false);
    if (next === null) return;
    e.preventDefault();
    setVolume(next);
    if (next > 0) previousVolumeRef.current = next;
  };

  const toggleMute = () => {
    if (volume > 0) {
      previousVolumeRef.current = volume;
      setVolume(0);
    } else {
      setVolume(previousVolumeRef.current || 1);
    }
  };

  // Icon sits ~22px from the bottom; flip its colour once the fill covers it
  const iconCovered = volume * CAPSULE_HEIGHT > 22;

  return (
    <div
      className="volume-wrapper"
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        isHovering.current = true;
        open();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return;
        isHovering.current = false;
        if (!isDragging) scheduleClose();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button
        className="control-btn glass-hit"
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.84 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        onPointerDown={(e) => { lastPointerType.current = e.pointerType; }}
        onClick={(e) => {
          e.stopPropagation();
          // Touch has no hover, so a tap opens the slider instead of muting
          if (lastPointerType.current === 'mouse') toggleMute();
          else setIsOpen((v) => !v);
        }}
      >
        <VolumeIcon volume={volume} size={20} color={iconColor} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="volume-popover"
            className="volume-popover"
            // No opacity here: a fading ancestor stops the capsule's glass from seeing
            // what's behind it, so it popped in at the end of every open/close
            // (very visible over white). The capsule fades itself instead.
            initial={{ y: 8, scale: 0.92 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 8, scale: 0.92, transition: { duration: 0.15 } }}
            transition={SPRING}
          >
            <div
              className="volume-hit-area"
              role="slider"
              tabIndex={0}
              aria-label="Volume"
              aria-orientation="vertical"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(volume * 100)}
              onKeyDown={handleKeyDown}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                lastPointerType.current = e.pointerType;
                e.currentTarget.setPointerCapture(e.pointerId);
                setIsDragging(true);
                updateFromPointer(e.currentTarget, e.clientY);
              }}
              onPointerMove={(e) => {
                if (!isDragging) return;
                if (!hasMoved) setHasMoved(true);
                updateFromPointer(e.currentTarget, e.clientY);
              }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={() => {
                if (isDragging) {
                  setIsDragging(false);
                  setHasMoved(false);
                  animate(stretch, 0, SPRING);
                }
              }}
            >
              <motion.div
                className="volume-press"
                animate={{ scale: isDragging ? 1.06 : 1 }}
                transition={SPRING}
              >
                <motion.div
                  className="volume-capsule lg-rim"
                  // CSS-only glass: it stretches and scales, which SVG refraction can't follow
                  style={{ height: CAPSULE_HEIGHT, scaleX, scaleY, originY }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={SPRING}
                >
                  <div
                    className="volume-fill"
                    style={{
                      height: `${volume * 100}%`,
                      transition: hasMoved ? 'none' : 'height 0.18s cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                  />
                  <span className={`volume-capsule-icon ${iconCovered ? 'is-covered' : ''}`}>
                    <VolumeIcon volume={volume} size={18} color="currentColor" />
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
