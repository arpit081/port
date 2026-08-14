import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

interface FloatingMusicButtonProps {
  onClick: () => void;
}

export default function FloatingMusicButton({ onClick }: FloatingMusicButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Play music"
      className="music-btn"
      /* Fade-in on load */
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Idle floating animation is handled by CSS @keyframes
          to avoid fighting with framer-motion's animate prop */}
      <span className="music-btn-glass">
        <Play size={18} fill="white" stroke="none" style={{ marginLeft: 2 }} />
      </span>
    </motion.button>
  );
}
