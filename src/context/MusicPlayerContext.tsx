import { createContext, useContext, useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    title: "About You",
    artist: "The 1975",
    audioUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/The%201975%20-%20About%20You%20-%20(320%20Kbps).mp3",
    artworkUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/covers/about-you.jpg"
  },
  {
    title: "back to friends",
    artist: "sombr",
    audioUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/sombr%20-%20back%20to%20friends%20-%20(320%20Kbps).mp3",
    artworkUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/covers/back-to-friends.jpg"
  },
  {
    title: "I Think They Call This Love",
    artist: "Matthew Ifield",
    audioUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/Matthew%20Ifield%20-%20I%20Think%20They%20Call%20This%20Love%20(Cover)%20-%20(320%20Kbps).mp3",
    artworkUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/covers/i-think-they-call-this-love.jpg"
  },
  {
    title: "Sailor Song",
    artist: "Gigi Perez",
    audioUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/Gigi%20Perez%20-%20Sailor%20Song%20-%20(320%20Kbps).mp3",
    artworkUrl: "https://rrxddweegokgoltcfrfr.supabase.co/storage/v1/object/public/songs/audio/covers/sailor-song.jpg"
  }
];

interface Track {
  title: string;
  artist: string;
  audioUrl: string;
  artworkUrl: string;
}

interface MusicPlayerState {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
  progress: number;
  currentTime: number;
  duration: number;
  currentTrack: Track;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (progress: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[trackIndex];

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setDuration(audio.duration);
        setProgress(audio.currentTime / audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    };

    const handleError = () => {
      // On error, just silently proceed or let user try next track
      console.warn("Audio failed to load:", audio.src);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Only set source if it's different to prevent resetting playback on re-renders
    if (audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [currentTrack.audioUrl, isPlaying]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && !audio.paused) {
      audio.pause();
    }
  }, [isPlaying]);

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const seek = (newProgress: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const newTime = newProgress * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(newProgress);
  };

  return (
    <MusicPlayerContext.Provider value={{
      isOpen, setIsOpen,
      isPlaying, setIsPlaying,
      progress, currentTime, duration,
      currentTrack, nextTrack, prevTrack, seek
    }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
}
