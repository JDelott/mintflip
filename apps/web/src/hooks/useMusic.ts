import { useContext } from 'react';
import { MusicContext } from '../contexts/MusicContext';
import type { MusicContextType } from '../contexts/MusicContext.types';

export function useMusic(): MusicContextType {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
