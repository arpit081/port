import { useRef, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Volume2 } from 'lucide-react';

/* ────────────────────────────────────────────
   Configuration — replace the URL with your hosted audio file
   ──────────────────────────────────────────── */

const MUSIC_AUDIO_URL =
  'https://res.cloudinary.com/q0efbrrr/video/upload/v1786468325/loser_UvXvDVHG.mp3';

const ALBUM_ART_URL =
  'https://upload.wikimedia.org/wikipedia/en/9/9b/Tame_Impala_-_Currents.png';

const SONG_TITLE = 'Loser';
const ARTIST_NAME = 'Tame Impala';
const PREVIEW_DURATION = 10; // seconds

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

/* ────────────────────────────────────────────
   Waveform visualisation (pure CSS animation)
   ──────────────────────────────────────────── */

function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="mc-waveform" aria-hidden="true">
      {Array.from({ length: 7 }).map((_, i) => (
        <span
          key={i}
          className="mc-waveform-bar"
          style={{
            animationPlayState: active ? 'running' : 'paused',
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────
   MusicCard Component
   ──────────────────────────────────────────── */

interface MusicCardProps {
  /** Tailwind dimension classes matching the other marquee tiles */
  className?: string;
  /** Notifies parent to blur/unblur surrounding content */
  onExpandChange?: (expanded: boolean) => void;
}

export default function MusicCard({
  className = '',
  onExpandChange,
}: MusicCardProps) {
  const tileRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [tileRect, setTileRect] = useState<DOMRect | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  /* ── capability detection ── */
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── notify parent (controls the blur on surrounding tiles) ── */
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  /* ── play audio once the expanded overlay has mounted ── */
  useEffect(() => {
    if (!isExpanded) return;
    const id = requestAnimationFrame(() => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = 0;
      a.play().catch((err) => {
        console.warn('Music preview playback failed:', err);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [isExpanded]);

  /* ── event handlers ── */

  const handleTileMouseEnter = useCallback(() => {
    if (isTouch) return;
    const el = tileRef.current;
    if (!el) return;
    setTileRect(el.getBoundingClientRect());
    setIsExpanded(true);
  }, [isTouch]);

  const handleExpandedLeave = useCallback(() => {
    setIsExpanded(false);
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.currentTime = 0;
    }
    setCurrentTime(0);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    const t = a.currentTime;
    setCurrentTime(t);
    if (t >= PREVIEW_DURATION) {
      a.pause();
      a.currentTime = 0;
      setCurrentTime(0);
      setIsExpanded(false);
    }
  }, []);

  /* ── expanded card geometry (responsive) ── */
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const expandedW = Math.min(640, vw * 0.48);
  const expandedH = expandedW * 0.68;

  let exLeft = 0;
  let exTop = 0;
  if (tileRect) {
    const cx = tileRect.left + tileRect.width / 2;
    const cy = tileRect.top + tileRect.height / 2;
    exLeft = cx - expandedW / 2;
    exTop = cy - expandedH / 2;
    // clamp so the expanded card stays fully within the viewport
    const pad = 16;
    exLeft = Math.max(pad, Math.min(exLeft, vw - expandedW - pad));
    exTop = Math.max(pad, Math.min(exTop, vh - expandedH - pad));
  }

  const spring = reducedMotion
    ? { duration: 0.05 }
    : {
        type: 'spring' as const,
        stiffness: 220,
        damping: 24,
        mass: 0.85,
      };

  /* ── render ── */
  return (
    <>
      {/* ─── Normal marquee tile ─── */}
      <div
        ref={tileRef}
        className={`${className} mc-tile`}
        onMouseEnter={handleTileMouseEnter}
        aria-label={`Play ${SONG_TITLE} by ${ARTIST_NAME} preview`}
      >
        <img
          src={ALBUM_ART_URL}
          alt={`${SONG_TITLE} by ${ARTIST_NAME}`}
          draggable={false}
          className="mc-tile-img"
        />
        <div className="mc-tile-overlay">
          <Music size={18} className="mc-tile-note" />
          <div className="mc-tile-bottom">
            <p className="mc-tile-title">{SONG_TITLE}</p>
            <p className="mc-tile-artist">{ARTIST_NAME}</p>
          </div>
        </div>
      </div>

      {/* ─── Expanded player (portal → document.body) ─── */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isExpanded && tileRect && (
              <motion.div
                key="mc-expanded"
                className="mc-expanded"
                onMouseLeave={handleExpandedLeave}
                style={{
                  position: 'fixed',
                  zIndex: 9999,
                  overflow: 'hidden',
                }}
                initial={{
                  left: tileRect.left,
                  top: tileRect.top,
                  width: tileRect.width,
                  height: tileRect.height,
                  borderRadius: 16,
                  opacity: 1,
                }}
                animate={{
                  left: exLeft,
                  top: exTop,
                  width: expandedW,
                  height: expandedH,
                  borderRadius: 20,
                  opacity: 1,
                }}
                exit={{
                  left: tileRect.left,
                  top: tileRect.top,
                  width: tileRect.width,
                  height: tileRect.height,
                  borderRadius: 16,
                  opacity: 0,
                }}
                transition={spring}
              >
                {/* Album art background (replaces video) */}
                <img
                  src={ALBUM_ART_URL}
                  alt=""
                  className="mc-expanded-video"
                  draggable={false}
                />

                {/* Hidden audio element */}
                <audio
                  ref={audioRef}
                  src={MUSIC_AUDIO_URL}
                  preload="none"
                  onTimeUpdate={handleTimeUpdate}
                />

                {/* Dark gradient overlay */}
                <div className="mc-expanded-gradient" />

                {/* Top bar: timer + volume */}
                <motion.div
                  className="mc-expanded-topbar"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                >
                  <div className="mc-expanded-timer">
                    <Play size={11} fill="white" stroke="white" />
                    <span>
                      {formatTime(currentTime)} / {formatTime(PREVIEW_DURATION)}
                    </span>
                  </div>
                  <Volume2 size={16} className="mc-expanded-vol" />
                </motion.div>

                {/* Bottom info: album art, song, artist, waveform */}
                <motion.div
                  className="mc-expanded-bottom"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                >
                  <div className="mc-expanded-meta">
                    <img
                      src={ALBUM_ART_URL}
                      alt=""
                      className="mc-expanded-album"
                    />
                    <div>
                      <p className="mc-expanded-song">{SONG_TITLE}</p>
                      <p className="mc-expanded-artist">{ARTIST_NAME}</p>
                    </div>
                  </div>
                  <WaveformBars active={isExpanded} />
                </motion.div>

                {/* Progress bar */}
                <div className="mc-expanded-progress">
                  <div
                    className="mc-expanded-progress-fill"
                    style={{
                      width: `${(currentTime / PREVIEW_DURATION) * 100}%`,
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
