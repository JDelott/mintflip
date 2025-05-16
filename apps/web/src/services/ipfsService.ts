// NFT.Storage API endpoint and key
const NFT_STORAGE_API_KEY = import.meta.env.VITE_NFT_STORAGE_API_KEY || '';
const NFT_STORAGE_API_URL = 'https://api.nft.storage/upload';

/**
 * Upload a file to IPFS via NFT.Storage
 * @param file The file to upload
 * @returns CID of the uploaded file
 */
export async function uploadFileToIPFS(file: File): Promise<string> {
  try {
    if (!NFT_STORAGE_API_KEY) {
      throw new Error('NFT.Storage API key not configured');
    }
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload to NFT.Storage
    const response = await fetch(NFT_STORAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NFT_STORAGE_API_KEY}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.value.cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

/**
 * Upload metadata to IPFS
 * @param metadata The metadata object to upload
 * @returns CID of the uploaded metadata
 */
export async function uploadMetadataToIPFS(metadata: Record<string, unknown>): Promise<string> {
  try {
    if (!NFT_STORAGE_API_KEY) {
      throw new Error('NFT.Storage API key not configured');
    }
    
    // Convert metadata to a Blob
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    
    // Upload to NFT.Storage
    const response = await fetch(NFT_STORAGE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NFT_STORAGE_API_KEY}`
      },
      body: blob
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.value.cid;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
}

/**
 * Get a gateway URL for an IPFS CID
 * @param cid The IPFS CID
 * @param filename Optional filename
 * @returns The gateway URL
 */
export function getIPFSUrl(cid: string, filename?: string): string {
  if (filename) {
    return `https://${cid}.ipfs.nftstorage.link/${encodeURIComponent(filename)}`;
  }
  return `https://${cid}.ipfs.nftstorage.link`;
}
