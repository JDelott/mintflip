import { useContext } from 'react';
import { MusicContext } from '../contexts/MusicContext';
import type { MusicContextValue } from '../contexts/MusicContext.types';

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext);
  if (context === null) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
