import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { uploadFileToIPFS, uploadMetadataToIPFS, getIPFSUrl } from '../services/ipfsService';
import type { Track } from '../contexts/MusicContext.types';
import { API_URL } from '../config';

// NFT contract ABI for ERC-1155 MusicNFT
export const MUSIC_NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'tokenURI', type: 'string' },
      { name: 'amount', type: 'uint256' }, 
      { name: 'priceInWei', type: 'uint256' }
    ],
    name: 'mintMusicNFT',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

// Hardcoded contract address from deployment
export const MUSIC_NFT_ADDRESS = '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0' as `0x${string}`;

export interface MusicTrackMetadata {
  name: string;
  description: string;
  artist: string;
  genre: string;
  coverImage?: File;
  audioFile: File;
  licenseType: "Standard" | "Commercial" | "Exclusive" | "Premium";
  price: string; // in ETH
}

// Define attribute structure for type safety
interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export function useMintMusic() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ipfsUri, setIpfsUri] = useState<string | null>(null);
  const [lastTrackData, setLastTrackData] = useState<MusicTrackMetadata | null>(null);
  const [lastImageUrl, setLastImageUrl] = useState<string>('');
  const [lastAudioUrl, setLastAudioUrl] = useState<string>('');
  const [lastAddress, setLastAddress] = useState<string>('');
  
  const { 
    data: hash,
    writeContract,
    error: writeError,
    isPending: isMinting,
  } = useWriteContract();
  
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useWaitForTransactionReceipt({
    hash
  });
  
  const uploadAndMint = async (trackData: MusicTrackMetadata, address: string) => {
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // 1. Upload audio file
      console.log('Uploading audio file...');
      const audioCid = await uploadFileToIPFS(trackData.audioFile);
      const audioUrl = getIPFSUrl(audioCid, trackData.audioFile.name);
      setUploadProgress(40);
      
      // 2. Upload cover image if present
      let imageUrl = '';
      if (trackData.coverImage) {
        console.log('Uploading cover image...');
        const imageCid = await uploadFileToIPFS(trackData.coverImage);
        imageUrl = getIPFSUrl(imageCid, trackData.coverImage.name);
      }
      setUploadProgress(60);
      
      // 3. Prepare metadata
      const metadata = {
        name: trackData.name,
        description: trackData.description || "",
        image: imageUrl, // Cover image URL
        animation_url: audioUrl, // Audio file URL
        attributes: [
          { trait_type: 'Artist', value: trackData.artist },
          { trait_type: 'Genre', value: trackData.genre || "Unknown" },
          { trait_type: 'License', value: trackData.licenseType },
          { trait_type: 'Price', value: trackData.price },
          { trait_type: 'Owner', value: address }
        ]
      };
      
      // 4. Upload metadata
      console.log('Uploading metadata...');
      const metadataCid = await uploadMetadataToIPFS(metadata);
      const tokenUri = getIPFSUrl(metadataCid);
      setIpfsUri(tokenUri);
      setUploadProgress(90);
      
      // 5. Call smart contract to mint NFT
      console.log('Minting NFT...');
      const newTokenId = await writeContract({
        abi: MUSIC_NFT_ABI,
        address: MUSIC_NFT_ADDRESS,
        functionName: 'mintMusicNFT',
        args: [
          address as `0x${string}`, 
          tokenUri, 
          BigInt(10), // amount (10 copies) 
          parseEther(trackData.price) // convert ETH price to wei
        ]
      });
      
      setUploadProgress(100);
      
      // After the NFT is confirmed on blockchain
      if (isConfirmed && hash) {
        // Now save to the database
        try {
          const response = await fetch('/api/nfts/music', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tokenId: newTokenId, // You need to capture this from the mint transaction
              name: trackData.name,
              artist: trackData.artist,
              description: trackData.description,
              genre: trackData.genre,
              price: trackData.price,
              ipfsUri: tokenUri,
              imageUri: imageUrl,
              audioUri: audioUrl,
              ownerAddress: address,
              licenseType: trackData.licenseType
            })
          });
          
          if (!response.ok) {
            console.error('Failed to save NFT to database');
          }
        } catch (error) {
          console.error('Error saving NFT to database:', error);
        }
      }
      
      setLastTrackData(trackData);
      setLastImageUrl(imageUrl);
      setLastAudioUrl(audioUrl);
      setLastAddress(address);
      
      return { success: true, tokenUri };
    } catch (error) {
      console.error('Error in upload and mint process:', error);
      return { success: false, error };
    } finally {
      setIsUploading(false);
    }
  };
  
  useEffect(() => {
    // Check if NFT mint was confirmed and lastTrackData exists
    if (isConfirmed && hash && ipfsUri && lastTrackData) {
      const saveNFTToDatabase = async () => {
        try {
          console.log('Saving NFT data to database...');
          const response = await fetch(`${API_URL}/api/nfts/music`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tokenId: "0", // Ideally this would come from the transaction
              name: lastTrackData.name,
              artist: lastTrackData.artist,
              description: lastTrackData.description || '',
              genre: lastTrackData.genre || '',
              price: lastTrackData.price,
              ipfsUri: ipfsUri,
              imageUri: lastImageUrl,
              audioUri: lastAudioUrl,
              ownerAddress: lastAddress,
              licenseType: lastTrackData.licenseType
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to save NFT to database:', errorData);
          } else {
            console.log('NFT saved to database successfully');
          }
        } catch (error) {
          console.error('Error saving NFT to database:', error);
        }
      };

      saveNFTToDatabase();
    }
  }, [isConfirmed, hash, ipfsUri, lastTrackData, lastImageUrl, lastAudioUrl, lastAddress]);
  
  return {
    uploadAndMint,
    isUploading,
    uploadProgress,
    isMinting,
    isConfirming, 
    isConfirmed,
    ipfsUri,
    error: writeError || confirmError,
    transactionHash: hash
  };
}

export async function fetchUserTracks(address: string): Promise<Track[]> {
  console.log(`Fetching tracks for address: ${address}`);
  
  try {
    // Fetch the metadata from Pinata directly
    const metadataUrl = "https://gateway.pinata.cloud/ipfs/QmQnj1gR68ypaWLfrDEKCyv8WsVBq1WSNGZXhG3hSYmqtt";
    const response = await fetch(metadataUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const metadata = await response.json();
    const attributes = metadata.attributes as MetadataAttribute[];
    
    // Create a track from the metadata
    return [{
      id: 1,
      title: metadata.name,
      name: metadata.name,
      artist: attributes.find((attr) => attr.trait_type === 'Artist')?.value || 'Unknown Artist',
      albumCover: metadata.image,
      image_uri: metadata.image,
      audio_uri: metadata.animation_url,
      nftPrice: attributes.find((attr) => attr.trait_type === 'Price')?.value || '0.01 ETH',
      licenseType: attributes.find((attr) => attr.trait_type === 'License')?.value || 'Standard',
      description: metadata.description || 'No description',
      genre: attributes.find((attr) => attr.trait_type === 'Genre')?.value || 'Unknown'
    }];
  } catch (error) {
    console.error('Error fetching metadata:', error);
    
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
