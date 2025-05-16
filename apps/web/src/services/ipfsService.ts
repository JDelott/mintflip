// apps/web/src/services/ipfsService.ts
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || '';

// Interface for Pinata pin list response
interface PinataPin {
  id: string;
  ipfs_pin_hash: string;
  size: number;
  user_id: string;
  date_pinned: string;
  date_unpinned: string | null;
  metadata: {
    name: string;
    keyvalues: Record<string, string>;
  };
}

// Interface for Pinata file list response
interface PinataFileListResponse {
  files: Array<{
    id: string;
    name: string;
    cid: string;
    size: number;
    number_of_files: number;
    mime_type: string;
    group_id: string | null;
    created_at: string;
  }>;
  next_page_token?: string;
}

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

// Get all pins from Pinata
export async function getAllPins(): Promise<PinataPin[]> {
  try {
    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured');
    }
    
    const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get pin list: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.rows;
  } catch (error) {
    console.error('Error fetching pins from Pinata:', error);
    throw error;
  }
}

// Get all files from Pinata (metadata JSON files)
export async function getAllFileMetadata(): Promise<PinataFileListResponse> {
  try {
    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured');
    }
    
    // Use the Pinata API to list files
    const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get file list: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching files from Pinata:', error);
    throw error;
  }
}

// Use the older pinList API instead of the newer Files API
export async function getFiles(): Promise<PinataFileListResponse> {
  try {
    if (!PINATA_JWT) {
      throw new Error('Pinata JWT not configured');
    }
    
    // Use the older pinList endpoint instead
    const response = await fetch('https://api.pinata.cloud/data/pinList?status=pinned', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get files: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the response to match our expected PinataFileListResponse format
    return {
      files: data.rows.map((pin: PinataPin) => ({
        id: pin.id || String(Date.now()),
        name: pin.metadata?.name || 'Unknown',
        cid: pin.ipfs_pin_hash,
        size: pin.size,
        number_of_files: 1,
        mime_type: pin.metadata?.keyvalues?.mimeType || '',
        group_id: null,
        created_at: pin.date_pinned
      }))
    };
  } catch (error) {
    console.error('Error fetching pins from Pinata:', error);
    throw error;
  }
}
