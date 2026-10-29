import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from './PlayerIcons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import VolumeControl from './VolumeControl';
import { useLiquidGlass } from './LiquidGlass';
import { useGlassFocus } from '@/lib/glass';
import { useDismiss } from '@/lib/useDismiss';
import ProgressScrubber from './ProgressScrubber';
import MarqueeText from './MarqueeText';
import { formatTime } from '@/lib/utils';

const SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 24,
  mass: 1,
};

const WAVEFORM_PATTERN = [
  30, 45, 30, 60, 40, 75, 50, 90, 65, 100, 70, 85,
  55, 80, 60, 95, 75, 85, 50, 70, 45, 65, 40, 55,
  35, 50, 30, 45, 25, 40, 20, 30
];

const ANIM_NAMES = ['wave-1', 'wave-2', 'wave-3', 'wave-4'];
const ANIM_DURATIONS = ['2.7s', '3.1s', '3.7s', '4.3s', '4.7s', '5.3s'];

const BUTTON_SPRING = { type: "spring" as const, stiffness: 500, damping: 28 };
const ARTWORK_SPRING = { type: "spring" as const, stiffness: 260, damping: 22 };

// Title/artist slide in from the side the user skipped towards
const TRACK_TEXT_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, x: 16 * dir, filter: 'blur(4px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({ opacity: 0, x: -16 * dir, filter: 'blur(4px)' }),
};

export default function MusicPlayer() {
  const {
    isOpen, setIsOpen,
    isPlaying, setIsPlaying,
    progress, currentTime, duration,
    currentTrack, nextTrack, prevTrack, seek,
    volume, setVolume
  } = useMusicPlayer();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [direction, setDirection] = useState(1);
  const [prevNudge, setPrevNudge] = useState(0);
  const [nextNudge, setNextNudge] = useState(0);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [isMorphing, setIsMorphing] = useState(false);

  // One shell morphs between hero button, card and pill; the hook re-measures
  // its size/radius on every morph so the refraction always fits the shape,
  // and the lens hides during the morph itself (a full-area change every frame).
  // Closed (hero button / pill) it's small enough to keep bending while scrolling
  const shellGlass = useLiquidGlass({ bezel: 28, strength: 26, hidden: isMorphing, liveWhileScrolling: !isOpen });
  // The play buttons scale on hover, and SVG refraction can't follow a transform
  // animation in Chrome (ghost outline + seams), so they use CSS-only glass.
  const { ref: setShellGlassEl } = shellGlass;
  // The open card is the biggest refracting panel; hold the page still behind it on Liquid
  useGlassFocus(isOpen);
  // Stable merged ref: the light-mode check needs playerRef, the glass needs the node too
  const setShellEl = useCallback((el: HTMLDivElement | null) => {
    playerRef.current = el;
    setShellGlassEl(el);
  }, [setShellGlassEl]);
  // Click outside the open card to close it; the navbar stays usable meanwhile
  useDismiss(isOpen, playerRef, () => setIsOpen(false), '[data-nav-root]');

  useEffect(() => {
    const aboutEl = document.getElementById('about');
    if (!aboutEl) return;
    function check() {
      const rect = aboutEl!.getBoundingClientRect();
      setIsScrolled(rect.top < window.innerHeight * 0.4);

      let light = false;
      if (playerRef.current) {
        const pRect = playerRef.current.getBoundingClientRect();
        const pCenterY = pRect.top + pRect.height / 2;

        document.querySelectorAll('.bg-white, #interests').forEach(el => {
          const r = el.getBoundingClientRect();
          if (pCenterY >= r.top && pCenterY <= r.bottom) light = true;
        });
      }
      setIsLightMode(light);
    }
    const id = setInterval(check, 100);
    check();
    return () => clearInterval(id);
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const newProgress = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(newProgress);
  };

  const isPill = !isOpen && isScrolled;
  const isHero = !isOpen && !isScrolled;

  let containerClassName = "music-player-unified lg-rim";
  if (isScrolled) {
    containerClassName += " is-fixed";
  }
  if (isPill) {
    containerClassName += " is-pill";
  }
  if (isLightMode) {
    containerClassName += " light-mode";
  }

  const iconColor = isLightMode ? "#1a1a1a" : "white";
  const iconMuted = isLightMode ? "#333333" : "white";

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        layout
        // Only spring between hero/pill/card states; resizes and re-renders snap
        layoutDependency={`${isOpen}-${isScrolled}`}
        ref={setShellEl}
        className={containerClassName}
        data-open={isOpen}
        whileHover={isHero ? { scale: 1.05 } : {}}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
        onLayoutAnimationStart={() => setIsMorphing(true)}
        onLayoutAnimationComplete={() => setIsMorphing(false)}
        // The hero button's idle bob is a CSS keyframe on .music-btn-anchor
        // (compositor); a repeating animate here restyled it on the main thread
        transition={{ layout: SPRING, default: SPRING }}
      >
        {shellGlass.lens}
        <div className="music-player-clip">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="expanded-content"
                className="music-card-content absolute inset-0 z-10"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                {/* Blurred artwork tints the glass, Apple Music-style */}
                <div className="music-ambient" aria-hidden="true">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={currentTrack.artworkUrl}
                      src={currentTrack.artworkUrl}
                      alt=""
                      className="music-ambient-img"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: 'easeInOut' }}
                    />
                  </AnimatePresence>
                </div>

                {/* Artwork shrinks back when paused, like Apple Music */}
                <motion.div
                  className="artwork-container mx-auto mt-6 mb-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isPlaying ? 1 : 0.86,
                    boxShadow: isPlaying
                      ? '0 18px 40px rgba(0, 0, 0, 0.55)'
                      : '0 8px 20px rgba(0, 0, 0, 0.35)',
                  }}
                  transition={{ ...ARTWORK_SPRING, opacity: { duration: 0.4, delay: 0.1 } }}
                >
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={currentTrack.artworkUrl}
                      src={currentTrack.artworkUrl}
                      alt={`${currentTrack.title} artwork`}
                      className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                      draggable={false}
                      initial={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, transition: { duration: 0.35 } }}
                      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  </AnimatePresence>
                </motion.div>

                <div className="music-info mt-auto">
                  <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                    <motion.div
                      key={currentTrack.title}
                      className="flex flex-col gap-1"
                      custom={direction}
                      variants={TRACK_TEXT_VARIANTS}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={SPRING}
                    >
                      <MarqueeText text={currentTrack.title} className="song-title" />
                      <MarqueeText text={currentTrack.artist} className="artist-name" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="playback-controls">
                  <ProgressScrubber
                    progress={progress}
                    currentTime={currentTime}
                    duration={duration}
                    seek={seek}
                  />

                  <div className="control-buttons">
                    <motion.button
                      className="control-btn glass-hit"
                      aria-label="Previous track"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.84 }}
                      transition={BUTTON_SPRING}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDirection(-1);
                        setPrevNudge((n) => n + 1);
                        prevTrack();
                      }}
                    >
                      <motion.span
                        key={prevNudge}
                        className="flex"
                        animate={prevNudge ? { x: [0, -6, 0] } : undefined}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      >
                        <BackwardIcon size={24} color={iconMuted} />
                      </motion.span>
                    </motion.button>

                    <motion.button
                      className="control-btn play-btn lg-rim"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.9 }}
                      transition={BUTTON_SPRING}
                      onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={isPlaying ? 'pause' : 'play'}
                          className="flex"
                          initial={{ scale: 0.4, opacity: 0, filter: 'blur(4px)' }}
                          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                          exit={{ scale: 0.4, opacity: 0, filter: 'blur(4px)' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          {isPlaying
                            ? <PauseIcon size={24} color="#1a1a1a" />
                            : <PlayIcon size={24} color="#1a1a1a" />
                          }
                        </motion.span>
                      </AnimatePresence>
                    </motion.button>

                    <motion.button
                      className="control-btn glass-hit"
                      aria-label="Next track"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.84 }}
                      transition={BUTTON_SPRING}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDirection(1);
                        setNextNudge((n) => n + 1);
                        nextTrack();
                      }}
                    >
                      <motion.span
                        key={nextNudge}
                        className="flex"
                        animate={nextNudge ? { x: [0, 6, 0] } : undefined}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      >
                        <ForwardIcon size={24} color={iconMuted} />
                      </motion.span>
                    </motion.button>

                    <VolumeControl volume={volume} setVolume={setVolume} iconColor={iconColor} />
                  </div>
                </div>

              </motion.div>
            ) : isPill ? (
              <motion.div
                key="pill-content"
                className="liquid-pill absolute inset-0 !w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ duration: 0.3 }}
              >
                <div className="pill-art">
                  <img src={currentTrack.artworkUrl} alt="album" className="pill-art-img" draggable={false} />
                </div>
                <div className="pill-track">
                  <span className="pill-title">{currentTrack.title}</span>
                  <span className="pill-artist">{currentTrack.artist}</span>
                  <div className="pill-progress-row">
                    <div className="pill-waveform-container" onClick={handleProgressClick}>
                      {WAVEFORM_PATTERN.map((height, i) => {
                        const barProgress = i / WAVEFORM_PATTERN.length;
                        const isPlayed = barProgress <= progress;

                        const animName = ANIM_NAMES[i % ANIM_NAMES.length];
                        const animDuration = ANIM_DURATIONS[(i * 3 + 1) % ANIM_DURATIONS.length];
                        const animDelay = `${-(i * 0.17)}s`;

                        return (
                          <div
                            key={i}
                            className={`waveform-bar ${isPlayed ? 'played' : 'unplayed'}`}
                            style={{
                              height: `${height}%`,
                              '--bar-opacity-played': 0.5 + (height / 100) * 0.5,
                              '--bar-opacity-unplayed': 0.15 + (height / 100) * 0.2,
                              animationName: animName,
                              animationDuration: animDuration,
                              animationDelay: animDelay,
                              animationTimingFunction: 'ease-in-out',
                              animationIterationCount: 'infinite',
                              animationPlayState: isPlaying ? 'running' : 'paused'
                            } as React.CSSProperties}
                          />
                        );
                      })}
                    </div>
                    <span className="pill-time">{formatTime(currentTime)}</span>
                  </div>
                </div>
                <button
                  className="pill-play-btn lg-rim"
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying
                    ? <PauseIcon size={16} className="pill-icon" />
                    : <PlayIcon size={16} className="pill-icon" />
                  }
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="hero-play-btn"
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.15 } }}
                transition={{ duration: 0.2, delay: 0.15 }}
              >
                <PlayIcon size={18} color="white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>


      </motion.div>
    </MotionConfig>
  );
}
