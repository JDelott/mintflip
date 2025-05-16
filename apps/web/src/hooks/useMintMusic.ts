import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { uploadFileToIPFS, uploadMetadataToIPFS, getIPFSUrl } from '../services/ipfsService';

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

export function useMintMusic() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ipfsUri, setIpfsUri] = useState<string | null>(null);
  
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
        description: trackData.description,
        image: imageUrl, // Cover image URL
        animation_url: audioUrl, // Audio file URL
        attributes: [
          { trait_type: 'Artist', value: trackData.artist },
          { trait_type: 'Genre', value: trackData.genre },
          { trait_type: 'License', value: trackData.licenseType },
          { trait_type: 'Price', value: trackData.price }
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
      writeContract({
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
      return { success: true, tokenUri };
    } catch (error) {
      console.error('Error in upload and mint process:', error);
      return { success: false, error };
    } finally {
      setIsUploading(false);
    }
  };
  
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
