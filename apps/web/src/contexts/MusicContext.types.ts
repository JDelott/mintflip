// This file contains the types used by the MusicContext

export interface Track {
  id: number;
  title: string;
  name: string;
  artist: string;
  albumCover: string;
  image_uri: string;
  audio_uri: string;
  nftPrice: string;
  licenseType: string;
  description?: string;
  genre?: string;
}

export interface MusicContextState {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
}

export interface MusicContextValue extends MusicContextState {
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}
