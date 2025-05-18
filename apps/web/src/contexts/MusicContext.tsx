import React, { createContext, useContext, useState } from 'react';
import type { Track, MusicContextValue } from './MusicContext.types';

// Create the context with a default value
export const MusicContext = createContext<MusicContextValue | null>(null);

// Create a provider component
export const MusicProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
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

  // Create the context value object
  const contextValue: MusicContextValue = {
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
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook for using the music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
