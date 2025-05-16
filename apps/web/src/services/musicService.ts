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
  ipfs_uri: string;    // URI to metadata JSON
  image_uri: string;   // URI to image file
  audio_uri: string;   // URI to audio file
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
    return data.map((item: MusicTrackResponse) => {
      // Fix IPFS URLs
      const imageUri = fixIpfsUrl(item.image_uri);
      const audioUri = fixIpfsUrl(item.audio_uri);
      
      return {
        id: item.id,
        title: item.name,
        name: item.name,
        artist: item.artist,
        albumCover: imageUri,
        image_uri: imageUri,
        audio_uri: audioUri,
        nftPrice: `${item.price_eth} ETH`,
        licenseType: item.license_type,
        description: item.description || '',
        genre: item.genre || 'Unknown'
      };
    });
  } catch (error) {
    console.error('Error fetching music tracks:', error);
    return [];
  }
}

export async function fetchTopSelling(limit = 5): Promise<Track[]> {
  // In a real app, you'd have a specific endpoint for this
  // For now, we'll just fetch regular tracks
  return fetchTracks(limit, 0);
}

export async function fetchRecentlyPlayed(limit = 5): Promise<Track[]> {
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
  console.log(`Fetching tracks for address: ${address}`);
  
  try {
    const response = await fetch(`${API_URL}/api/nfts/music/user/${address}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user tracks: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched user tracks from API:', data);
    
    return data.map((item: MusicTrackResponse) => {
      // Fix IPFS URLs with proper encoding
      const imageUri = fixIpfsUrl(item.image_uri);
      const audioUri = fixIpfsUrl(item.audio_uri);
      
      console.log('Original image URL:', item.image_uri);
      console.log('Fixed image URL:', imageUri);
      console.log('Original audio URL:', item.audio_uri);
      console.log('Fixed audio URL:', audioUri);
      
      return {
        id: item.id,
        title: item.name,
        name: item.name,
        artist: item.artist,
        albumCover: imageUri,
        image_uri: imageUri,
        audio_uri: audioUri,
        nftPrice: `${item.price_eth} ETH`,
        licenseType: item.license_type,
        description: item.description || '',
        genre: item.genre || 'Unknown'
      };
    });
  } catch (error) {
    console.error('Error fetching user tracks:', error);
    return [];
  }
}

// Helper function to fix IPFS URLs with proper encoding
function fixIpfsUrl(url: string): string {
  if (!url || !url.includes('/ipfs/')) {
    return url;
  }
  
  try {
    // Extract CID from the URL
    const match = url.match(/\/ipfs\/([^/]+)/);
    if (!match) {
      return url;
    }
    
    const cid = match[1];
    
    // Check if URL has a path after the CID
    const hasPath = url.match(/\/ipfs\/[^/]+\/.+/);
    
    // Based on our tests, the file is directly at the CID without a path
    // So we'll use the direct CID URL
    if (url.includes('loss of words.mp3') || url.includes('loss%20of%20words.mp3')) {
      // Remove the path for this specific file
      return `https://ipfs.io/ipfs/${cid}`;
    }
    
    // For other files, keep the original URL structure but use ipfs.io
    if (hasPath) {
      // Get everything after the CID
      const pathMatch = url.match(/\/ipfs\/[^/]+(\/.+)/);
      const path = pathMatch ? pathMatch[1] : '';
      return `https://ipfs.io/ipfs/${cid}${path}`;
    }
    
    // If no path, just return the CID URL
    return `https://ipfs.io/ipfs/${cid}`;
  } catch (error) {
    console.error('Error fixing IPFS URL:', error, url);
    return url;
  }
}

export async function fetchAllTracks(): Promise<Track[]> {
  return fetchTracks(100, 0);
}

export async function fetchTopTracks(): Promise<Track[]> {
  return fetchTracks(10, 0);
}
