import { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { formatTime } from '@/lib/utils';

const SPRING = { type: 'spring' as const, stiffness: 420, damping: 32 };
// Max px the track stretches when dragged past either end (rubber band)
const MAX_STRETCH = 8;
const KEY_STEP_SECONDS = 5;
const TRACK_HEIGHT = { rest: 5, hover: 7, scrubbing: 10 };

type ProgressScrubberProps = {
  progress: number;
  currentTime: number;
  duration: number;
  seek: (progress: number) => void;
};

export default function ProgressScrubber({ progress, currentTime, duration, seek }: ProgressScrubberProps) {
  const [isHovering, setIsHovering] = useState(false);
  // Local position while dragging; we only seek on release so audio doesn't stutter
  const [scrub, setScrub] = useState<number | null>(null);

  // Signed overflow in px: positive = dragged past the right end, negative = past the left
  const stretch = useMotionValue(0);
  const scaleX = useTransform(stretch, (s) => 1 + Math.abs(s) / 280);
  const originX = useTransform(stretch, (s) => (s >= 0 ? 0 : 1));

  const isScrubbing = scrub !== null;
  const shown = scrub ?? progress;
  const shownTime = isScrubbing ? scrub * duration : currentTime;
  const remaining = Math.max(0, duration - shownTime);

  const progressFromPointer = (el: HTMLElement, clientX: number) => {
    const rect = el.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const overflowPx = raw > 1 ? (raw - 1) * rect.width : raw < 0 ? raw * rect.width : 0;
    stretch.set(Math.sign(overflowPx) * MAX_STRETCH * (1 - Math.exp(-Math.abs(overflowPx) / 60)));
    return Math.max(0, Math.min(1, raw));
  };

  const resetScrub = () => {
    setScrub(null);
    animate(stretch, 0, SPRING);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!duration) return;
    const step = KEY_STEP_SECONDS / duration;
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(1, progress + step);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(0, progress - step);
    if (e.key === 'Home') next = 0;
    if (next === null) return;
    e.preventDefault();
    seek(next);
  };

  const trackHeight = isScrubbing ? TRACK_HEIGHT.scrubbing : isHovering ? TRACK_HEIGHT.hover : TRACK_HEIGHT.rest;

  return (
    <div className={`scrubber ${isScrubbing ? 'is-scrubbing' : ''}`}>
      <div
        className="scrubber-hit"
        role="slider"
        tabIndex={0}
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration) || 0}
        aria-valuenow={Math.round(shownTime) || 0}
        aria-valuetext={`${formatTime(shownTime)} of ${formatTime(duration)}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setIsHovering(true); }}
        onPointerLeave={() => setIsHovering(false)}
        onPointerDown={(e) => {
          if (!duration) return;
          e.preventDefault();
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          setScrub(progressFromPointer(e.currentTarget, e.clientX));
        }}
        onPointerMove={(e) => {
          if (!isScrubbing) return;
          setScrub(progressFromPointer(e.currentTarget, e.clientX));
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
          if (scrub !== null) seek(scrub);
          resetScrub();
        }}
        onPointerCancel={resetScrub}
        onLostPointerCapture={() => { if (isScrubbing) resetScrub(); }}
      >
        <motion.div
          className="scrubber-track"
          style={{ scaleX, originX }}
          animate={{ height: trackHeight }}
          transition={SPRING}
        >
          <div
            className="scrubber-fill"
            style={{
              width: `${shown * 100}%`,
              // timeupdate only fires ~4x/sec, so glide between ticks unless the user is dragging
              transition: isScrubbing ? 'none' : 'width 0.25s linear',
            }}
          />
        </motion.div>
      </div>

      <motion.div
        className="time-info"
        animate={{ opacity: isScrubbing ? 1 : 0.8, y: isScrubbing ? 3 : 0 }}
        transition={SPRING}
      >
        <span>{formatTime(shownTime)}</span>
        <span>-{formatTime(remaining)}</span>
      </motion.div>
    </div>
  );
}
