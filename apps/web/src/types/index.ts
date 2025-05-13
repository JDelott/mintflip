export interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  audioSrc?: string;
  duration?: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  tracks: Track[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}
