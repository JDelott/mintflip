import { API_URL } from '../config';
import type { Track } from '../contexts/MusicContext.types';

interface MusicTrackResponse {
  id: number;
  token_id: string;
  name: string;
  artist: string;
  description?: string;
  genre?: string;
  price_eth: string;
  image_uri: string;
  audio_uri: string;
  license_type: string;
  owner_address: string;
}

export async function fetchTracks(limit = 20, offset = 0, genre?: string): Promise<Track[]> {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());
    if (genre) {
      params.append('genre', genre);
    }

    const response = await fetch(`${API_URL}/api/nfts/music?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tracks');
    }
    
    const data = await response.json();
    
    // Map API response to our Track interface
    return data.map((item: MusicTrackResponse) => ({
      id: item.id,
      title: item.name,
      name: item.name,
      artist: item.artist,
      albumCover: item.image_uri,
      image_uri: item.image_uri,
      audio_uri: item.audio_uri,
      nftPrice: `${item.price_eth} ETH`,
      licenseType: item.license_type,
      description: item.description,
      genre: item.genre
    }));
  } catch (error) {
    console.error('Error fetching music tracks:', error);
    throw error;
  }
}

export async function fetchTopSelling(limit = 5): Promise<Track[]> {
  // In a real app, you'd have a specific endpoint for this
  // For now, we'll just fetch regular tracks
  return fetchTracks(limit, 0);
}

export async function fetchRecentlyPlayed(limit = 5): Promise<Track[]> {
  // In a real app, this would fetch from user's history
  return fetchTracks(limit, 0);
}

export async function updatePlayCount(trackId: number): Promise<void> {
  try {
    await fetch(`${API_URL}/api/nfts/music/${trackId}/play`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Error updating play count:', error);
  }
}

export async function fetchUserTracks(address: string): Promise<Track[]> {
  try {
    // For testing, return mock data until the API is ready
    console.log(`Fetching tracks for address: ${address}`); // Use address to prevent unused var warning
    
    return [
      {
        id: 1,
        title: "Fallin Outta Love",
        name: "Fallin Outta Love",
        artist: "Your Artist Name",
        albumCover: "https://gateway.pinata.cloud/ipfs/QmPgztHroTqRcMK4j5TFLfWbczDQYtayFiQnuEE9cLhAG7",
        image_uri: "https://gateway.pinata.cloud/ipfs/QmPgztHroTqRcMK4j5TFLfWbczDQYtayFiQnuEE9cLhAG7",
        audio_uri: "https://gateway.pinata.cloud/ipfs/QmewvQNCRgrVphXiPf8ugZNYaQfSd3xtPbiASRdtmwUMdx",
        nftPrice: "0.01 ETH",
        licenseType: "Standard",
        description: "A beautiful track created for MintFlip demo",
        genre: "Electronic"
      }
    ];

    // When API is ready, use this code:
    /*
    const response = await fetch(`${API_URL}/api/nfts/music/user/${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user tracks');
    }
    const data = await response.json();
    return data.map((item: MusicTrackResponse) => ({
      id: item.id,
      title: item.name,
      name: item.name,
      artist: item.artist,
      albumCover: item.image_uri,
      image_uri: item.image_uri,
      audio_uri: item.audio_uri,
      nftPrice: `${item.price_eth} ETH`,
      licenseType: item.license_type,
      description: item.description,
      genre: item.genre
    }));
    */
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    return [];
  }
}

export async function fetchAllTracks(): Promise<Track[]> {
  // Similar to fetchUserTracks but gets all tracks
  return fetchUserTracks('all');
}

export async function fetchTopTracks(): Promise<Track[]> {
  return fetchUserTracks('all');
}
