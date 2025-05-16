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

export interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  queue: Track[];
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
}
