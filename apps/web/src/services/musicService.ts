import { API_URL } from '../config';
import { getIPFSUrl, getFiles } from '../services/ipfsService';
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

// Interface for metadata structure from IPFS
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
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
  console.log(`Fetching tracks for address: ${address}`);
  
  try {
    // Get all files from Pinata
    const fileList = await getFiles();
    console.log(`Found ${fileList.files.length} files in Pinata`);
    
    // Ensure we have files before proceeding
    if (!fileList.files || fileList.files.length === 0) {
      throw new Error('No files found in Pinata');
    }
    
    // Fetch and process each metadata file
    const tracks: Track[] = [];
    
    for (const file of fileList.files) {
      try {
        // Skip if this isn't a JSON file (likely metadata)
        if (!file.name.endsWith('.json') && file.mime_type !== 'application/json') {
          continue;
        }
        
        // Get the IPFS URL for the metadata
        const metadataUrl = getIPFSUrl(file.cid);
        console.log('Fetching metadata from:', metadataUrl);
        
        const response = await fetch(metadataUrl);
        
        if (!response.ok) {
          console.warn(`Failed to fetch metadata from ${metadataUrl}`);
          continue;
        }
        
        const metadata = await response.json() as NFTMetadata;
        
        // Skip if this doesn't have the expected format
        if (!metadata.name) {
          console.warn('Metadata missing name property:', metadata);
          continue;
        }
        
        // Create track even if some fields are missing
        tracks.push({
          id: parseInt(file.id, 10) || tracks.length + 1,
          title: metadata.name,
          name: metadata.name,
          artist: metadata.attributes?.find(attr => attr.trait_type === 'Artist')?.value || 'Unknown Artist',
          albumCover: metadata.image || 'https://via.placeholder.com/300',
          image_uri: metadata.image || 'https://via.placeholder.com/300',
          audio_uri: metadata.animation_url || '',
          nftPrice: metadata.attributes?.find(attr => attr.trait_type === 'Price')?.value || '0.01 ETH',
          licenseType: metadata.attributes?.find(attr => attr.trait_type === 'License')?.value || 'Standard',
          description: metadata.description || 'No description',
          genre: metadata.attributes?.find(attr => attr.trait_type === 'Genre')?.value || 'Unknown'
        });
      } catch (error) {
        console.error(`Error processing metadata for file ${file.cid}:`, error);
        // Continue to next file
      }
    }
    
    console.log(`Found ${tracks.length} tracks for address ${address}`, tracks);
    
    if (tracks.length > 0) {
      return tracks;
    }
    
    // Return dummy data if no tracks found
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
  } catch (error) {
    console.error('Error fetching tracks from Pinata:', error);
    
    // Return hardcoded data as fallback
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
  }
}

export async function fetchAllTracks(): Promise<Track[]> {
  // Similar to fetchUserTracks but gets all tracks
  return fetchUserTracks('all');
}

export async function fetchTopTracks(): Promise<Track[]> {
  return fetchUserTracks('all');
}
