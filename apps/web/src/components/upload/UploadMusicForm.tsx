import { useState } from 'react';
import { useAccount } from 'wagmi';
import type { MusicTrackMetadata } from '../../hooks/useMintMusic';
import { useMintMusic } from '../../hooks/useMintMusic';

export default function UploadMusicForm() {
  const { address } = useAccount();
  const { 
    uploadAndMint, 
    isUploading, 
    uploadProgress, 
    isMinting, 
    isConfirming, 
    isConfirmed, 
    error 
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  
  const isProcessing = isUploading || isMinting || isConfirming;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if the file is an audio file
      if (!file.type.startsWith('audio/')) {
        setFormError('Please upload an audio file (MP3, WAV, etc.)');
        return;
      }
      
      setAudioFile(file);
      setFormError(null);
    }
  };
  
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        setFormError('Please upload an image file for the cover');
        return;
      }
      
      setCoverImage(file);
      
      // Create a preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setFormError(null);
      
      // Clean up the object URL when it's no longer needed
      return () => URL.revokeObjectURL(objectUrl);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setFormError('Please connect your wallet first');
      return;
    }
    
    if (!audioFile) {
      setFormError('Please upload an audio file');
      return;
    }
    
    try {
      setFormError(null);
      
      // Create the track metadata
      const trackData: MusicTrackMetadata = {
        ...formData,
        audioFile,
        coverImage: coverImage || undefined
      };
      
      // Start the upload and mint process
      await uploadAndMint(trackData, address);
      
    } catch (err) {
      console.error('Error minting NFT:', err);
      setFormError('Failed to mint NFT. Please try again.');
    }
  };
  
  // Reset form after successful minting
  if (isConfirmed) {
    setTimeout(() => {
      setFormData({
        name: '',
        description: '',
        artist: '',
        genre: '',
        licenseType: 'Standard',
        price: '0.01'
      });
      setAudioFile(null);
      setCoverImage(null);
      setPreviewUrl(null);
    }, 3000);
  }
  
  return (
    <div className="bg-gradient-to-b from-[#1c1c1c] to-[#111] rounded-xl shadow-xl overflow-hidden border border-[#333] p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Upload Your Music</h2>
      
      {(formError || error) && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          {formError || (error ? 'Transaction failed. Please try again.' : '')}
        </div>
      )}
      
      {isConfirmed && (
        <div className="bg-green-900/30 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6">
          Your music has been successfully minted as an NFT!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Track Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
              placeholder="Enter track name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Artist Name</label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
              placeholder="Your artist name"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-[#333] rounded-lg bg-[#222] min-h-32 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
            placeholder="Describe your track..."
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
              placeholder="e.g. Electronic, Hip-Hop"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">License Type</label>
            <select
              name="licenseType"
              value={formData.licenseType}
              onChange={handleInputChange}
              className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
              required
            >
              <option value="Standard">Standard</option>
              <option value="Commercial">Commercial</option>
              <option value="Exclusive">Exclusive</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Price (ETH)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              step="0.001"
              min="0.001"
              className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Audio File</label>
            <div className="border-dashed border-2 border-[#333] rounded-lg p-6 text-center">
              <input
                type="file"
                onChange={handleAudioFileChange}
                className="hidden"
                id="audioFile"
                accept="audio/*"
                required={!audioFile}
              />
              {audioFile ? (
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#1db954] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <p className="text-sm text-gray-300 break-all">{audioFile.name}</p>
                  <button
                    type="button"
                    onClick={() => setAudioFile(null)}
                    className="text-xs text-red-400 mt-2 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label htmlFor="audioFile" className="cursor-pointer flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#1db954] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-300">
                    Upload MP3, WAV, or other audio file <br />
                    <span className="text-xs text-gray-500">(Max 50MB)</span>
                  </p>
                </label>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Cover Art (Optional)</label>
            <div className="border-dashed border-2 border-[#333] rounded-lg p-6 text-center h-[160px] flex items-center justify-center">
              <input
                type="file"
                onChange={handleCoverImageChange}
                className="hidden"
                id="coverImage"
                accept="image/*"
              />
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Cover art preview"
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCoverImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <label htmlFor="coverImage" className="cursor-pointer flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#1db954] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-300">
                    Upload cover image <br />
                    <span className="text-xs text-gray-500">(JPG, PNG, GIF)</span>
                  </p>
                </label>
              )}
            </div>
          </div>
        </div>
        
        {isProcessing && (
          <div className="mb-4">
            <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1db954] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-center text-gray-400 mt-2">
              {isUploading 
                ? `Uploading to IPFS... ${uploadProgress}%` 
                : isMinting 
                ? 'Waiting for confirmation...' 
                : isConfirming 
                ? 'Confirming transaction...' 
                : ''}
            </p>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isProcessing || !address}
            className={`px-8 py-3 bg-[#1db954] text-white rounded-lg hover:bg-[#1aa34a] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isProcessing ? 'Processing...' : 'Mint Music NFT'}
          </button>
        </div>
      </form>
    </div>
  );
}
