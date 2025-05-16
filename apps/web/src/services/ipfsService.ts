// apps/web/src/services/ipfsService.ts
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || '';

export async function uploadFileToIPFS(file: File): Promise<string> {
  try {
    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured. Please add VITE_PINATA_JWT to your .env file');
    }
    
    console.log('Starting upload to Pinata for file:', file.name);
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Upload successful, IpfsHash:', data.IpfsHash);
    return data.IpfsHash;
  } catch (error) {
    console.error('Error in IPFS upload process:', error);
    throw error;
  }
}

export async function uploadMetadataToIPFS(metadata: Record<string, unknown>): Promise<string> {
  try {
    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured');
    }
    
    console.log('Uploading metadata to Pinata...');
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PINATA_JWT}`
      },
      body: JSON.stringify(metadata)
    });
    
    if (!response.ok) {
      throw new Error(`Metadata upload failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Metadata upload successful, IpfsHash:', data.IpfsHash);
    return data.IpfsHash;
  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    throw error;
  }
}

export function getIPFSUrl(cid: string, filename?: string): string {
  // Use Pinata gateway
  if (filename) {
    return `https://gateway.pinata.cloud/ipfs/${cid}/${encodeURIComponent(filename)}`;
  }
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
