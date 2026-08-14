import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, SkipBack, SkipForward, X, Pause } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

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

function fmt(s: number) {
  if (isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${m}:${ss.toString().padStart(2, "0")}`;
}

export default function MusicPlayer() {
  const {
    isOpen, setIsOpen,
    isPlaying, setIsPlaying,
    progress, currentTime, duration,
    currentTrack, nextTrack, prevTrack, seek
  } = useMusicPlayer();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

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

  // We toggle classNames dynamically so Framer Motion morphs between them
  let containerClassName = "music-player-unified";
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
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 cursor-default"
          onClick={() => setIsOpen(false)}
        />
      )}

      <motion.div
        layout
        ref={playerRef}
        className={containerClassName}
        data-open={isOpen}
        whileHover={isHero ? { scale: 1.05 } : {}}
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
        animate={{
          y: isHero ? [0, -5, 0] : 0,
          rotate: isHero ? [0, 0.8, 0] : 0,
        }}
        transition={{
          layout: SPRING,
          default: SPRING,
          y: isHero ? { repeat: Infinity, duration: 3.5, ease: "easeInOut" } : SPRING,
          rotate: isHero ? { repeat: Infinity, duration: 3.5, ease: "easeInOut" } : SPRING,
        }}
      >
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
                {currentTrack.artworkUrl && (
                  <motion.div 
                    className="artwork-container w-[192px] mx-auto aspect-square mt-6 mb-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                  >
                    <img
                      src={currentTrack.artworkUrl}
                      alt="Album Art"
                      className="w-full h-full object-cover rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] pointer-events-none"
                    />
                  </motion.div>
                )}

                <div className="music-info mt-auto">
                  <h3 className="song-title">{currentTrack.title}</h3>
                  <p className="artist-name">{currentTrack.artist}</p>
                </div>

                <div className="playback-controls">
                  <div 
                    className="progress-bar-container cursor-pointer" 
                    onClick={handleProgressClick}
                  >
                    <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }}></div>
                  </div>
                  <div className="time-info">
                    <span>{fmt(currentTime)}</span>
                    <span>{fmt(duration)}</span>
                  </div>

                  <div className="control-buttons">
                    <button 
                      className="control-btn" 
                      onClick={(e) => { e.stopPropagation(); prevTrack(); }}
                    >
                      <SkipBack size={22} fill={iconMuted} stroke="none" />
                    </button>
                    <button 
                      className="control-btn play-btn" 
                      onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                    >
                      {isPlaying 
                        ? <Pause size={24} fill="#1a1a1a" stroke="none" /> 
                        : <Play size={24} fill="#1a1a1a" stroke="none" style={{ marginLeft: 2 }} />
                      }
                    </button>
                    <button 
                      className="control-btn" 
                      onClick={(e) => { e.stopPropagation(); nextTrack(); }}
                    >
                      <SkipForward size={22} fill={iconMuted} stroke="none" />
                    </button>
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
                    <span className="pill-time">{fmt(currentTime)} · {fmt(duration)}</span>
                  </div>
                </div>
                <button
                  className="pill-play-btn"
                  onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying
                    ? <Pause size={16} className="pill-icon" stroke="none" />
                    : <Play size={16} className="pill-icon" stroke="none" style={{ marginLeft: 2 }} />
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
                <Play size={18} fill="white" stroke="none" style={{ marginLeft: 2 }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
