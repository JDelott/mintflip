import { createContext, useState, type ReactNode } from 'react';
import type { Track, MusicContextType } from './MusicContext.types';

// Export the context so it can be imported by useMusic
export const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setCurrentTrack(nextTrack);
      setQueue(prev => prev.slice(1));
      setIsPlaying(true);
    }
  };

  const previousTrack = () => {
    // Implementation depends on if you want to store history
    // This is a simple implementation that just restarts the current track
    if (currentTrack) {
      setIsPlaying(true);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        queue,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        addToQueue,
        clearQueue
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}
