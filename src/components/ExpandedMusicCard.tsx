import { motion } from 'framer-motion';
import { Play, SkipBack, SkipForward, X } from 'lucide-react';
import jakeHeadphonesImg from '../assets/image.png';

interface ExpandedMusicCardProps {
  onClose: () => void;
}

export default function ExpandedMusicCard({ onClose }: ExpandedMusicCardProps) {
  return (
    <motion.div
      className="music-card-wrapper"
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 15 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Jake image placed behind the glass layer */}
      <img src={jakeHeadphonesImg} alt="Jake" className="music-card-jake" />

      {/* The Glass Card */}
      <div className="music-card-expanded">
        <button onClick={onClose} className="music-card-close" aria-label="Close">
          <X size={18} color="white" />
        </button>

        <div className="music-card-content">
          <div className="music-info">
            <h3 className="song-title">Loser</h3>
            <p className="artist-name">Tame Impala</p>
          </div>

          <div className="playback-controls">
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: '35%' }}></div>
            </div>
            <div className="time-info">
              <span>1:24</span>
              <span>3:54</span>
            </div>

            <div className="control-buttons">
              <button className="control-btn"><SkipBack size={22} fill="white" stroke="none" /></button>
              <button className="control-btn play-btn"><Play size={24} fill="black" stroke="none" style={{ marginLeft: 2 }} /></button>
              <button className="control-btn"><SkipForward size={22} fill="white" stroke="none" /></button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
