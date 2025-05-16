import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useMintMusic } from '../../hooks/useMintMusic';
import type { MusicTrackMetadata } from '../../hooks/useMintMusic';

export default function UploadMusicForm() {
  const { address } = useAccount();
  const { 
    uploadAndMint, 
    isUploading, 
    uploadProgress,
    isMinting,
    isConfirming,
    isConfirmed,
    ipfsUri,
    error,
    transactionHash
  } = useMintMusic();
  
  const [formData, setFormData] = useState<Omit<MusicTrackMetadata, 'audioFile' | 'coverImage'>>({
    name: '',
    description: '',
    artist: '',
    genre: '',
    licenseType: 'Standard',
    price: '0.01'
  });
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!audioFile) {
      alert('Please select an audio file');
      return;
    }
    
    const trackData: MusicTrackMetadata = {
      ...formData,
      audioFile,
      coverImage: coverImage || undefined
    };
    
    const result = await uploadAndMint(trackData, address);
    
    if (result.success) {
      setSuccess(true);
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-[#1c1c1c] to-[#111] rounded-xl shadow-xl overflow-hidden border border-[#333] p-6">
      {success || isConfirmed ? (
        <div className="flex flex-col items-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1db954] flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Success!</h2>
          <p className="text-gray-400 mb-6">Your music track has been successfully minted as an NFT.</p>
          
          {ipfsUri && (
            <p className="mb-4">
              <a 
                href={ipfsUri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#1db954] hover:text-[#3ed672] transition-colors underline"
              >
                View NFT Metadata on IPFS
              </a>
            </p>
          )}
          
          {transactionHash && (
            <p>
              <a 
                href={`http://localhost:8545/tx/${transactionHash}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1db954] hover:text-[#3ed672] transition-colors underline"
              >
                View Transaction
              </a>
            </p>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2 bg-[#222] border border-[#333] rounded-lg hover:bg-[#2a2a2a] transition-colors"
          >
            Upload Another Track
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-xl font-bold mb-4">Track Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Track Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none"
                placeholder="Enter track name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Artist Name</label>
              <input
                type="text"
                name="artist"
                value={formData.artist}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none"
                placeholder="Enter artist name"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none"
              placeholder="Describe your track"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Genre</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none"
                placeholder="e.g. Electronic, Hip-Hop, Lo-Fi"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">License Type</label>
              <select
                name="licenseType"
                value={formData.licenseType}
                onChange={handleInputChange}
                className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none"
              >
                <option value="Standard">Standard</option>
                <option value="Commercial">Commercial</option>
                <option value="Exclusive">Exclusive</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Price (ETH)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.001"
              min="0"
              required
              className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none"
              placeholder="0.01"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Audio File</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                required
                className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[#1db954] file:text-white hover:file:bg-[#1aa34a]"
              />
              {audioFile && (
                <p className="text-sm text-gray-400 mt-1">Selected: {audioFile.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Cover Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-[#1db954] focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[#1db954] file:text-white hover:file:bg-[#1aa34a]"
              />
              {coverImage && (
                <p className="text-sm text-gray-400 mt-1">Selected: {coverImage.name}</p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isUploading || isMinting || isConfirming}
            className="w-full bg-[#1db954] text-white py-3 px-4 rounded-lg hover:bg-[#1aa34a] transition-colors disabled:bg-[#1aa34a]/50 disabled:cursor-not-allowed"
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 
             isMinting ? 'Minting...' : 
             isConfirming ? 'Confirming Transaction...' : 'Mint Music NFT'}
          </button>
          
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-200 p-4 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error.message}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
