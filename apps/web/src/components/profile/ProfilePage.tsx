import { useState, useEffect } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { hardhat } from 'wagmi/chains';
import NftDescriptionText from './NftDescriptionText';
import { useUserAuth } from '../../hooks/useUserAuth';
import { fetchUserProfile, updateUserProfile } from '../../services/userService';
import type { UserProfile, UpdateProfileData } from '../../services/userService';

const DEFAULT_AVATAR_URL = "https://gravatar.com/avatar/00000000000000000000000000000000?d=mp";

const defaultGenres = [
  'Hip-Hop', 'Electronic', 'Pop', 'Rock', 'Lo-Fi', 'Jazz', 'Classical', 'Ambient'
];

const ProfilePage = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { token, signIn } = useUserAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileData>({
    username: '',
    bio: '',
    avatarUrl: '',
    favoriteGenres: []
  });

  // Check if user is on the correct network
  const isWrongNetwork = isConnected && chainId !== hardhat.id;

  useEffect(() => {
    async function loadProfile() {
      if (!address) return;
      
      try {
        setIsLoading(true);
        const userProfile = await fetchUserProfile(address);
        setProfile(userProfile);
        
        // Initialize form data
        setFormData({
          username: userProfile.username || '',
          bio: userProfile.bio || '',
          avatarUrl: userProfile.avatarUrl || DEFAULT_AVATAR_URL,
          favoriteGenres: userProfile.favoriteGenres || []
        });
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfile();
  }, [address]);

  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (genre: string) => {
    setFormData(prev => {
      const currentGenres = prev.favoriteGenres || [];
      const newGenres = currentGenres.includes(genre)
        ? currentGenres.filter(g => g !== genre)
        : [...currentGenres, genre];
      
      return { ...prev, favoriteGenres: newGenres };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      await signIn();
      return;
    }
    
    try {
      setIsLoading(true);
      const updatedProfile = await updateUserProfile(formData, token);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Create Your MintFlip Profile</h2>
          <p className="text-text-secondary max-w-md mx-auto mb-6">Connect your wallet to access your personalized profile and start collecting AI-generated music NFTs.</p>
        </div>
        <ConnectButton />
      </div>
    );
  }

  // Wrong network state
  if (isWrongNetwork) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Wrong Network Detected</h2>
          <p className="text-text-secondary max-w-md mx-auto mb-6">
            MintFlip runs on Hardhat local network. Please switch your network to continue.
          </p>
        </div>
        <button
          onClick={() => switchChain({ chainId: hardhat.id })}
          className="px-5 py-2.5 bg-[#1db954] text-white rounded-lg hover:bg-[#1aa34a] transition-colors cursor-pointer"
        >
          Switch to Hardhat Network
        </button>
      </div>
    );
  }

  if (isLoading && !profile) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with connect button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Profile</h2>
        <ConnectButton showBalance chainStatus="icon" />
      </div>
      
      {/* Profile card */}
      <div className="bg-gradient-to-b from-[#1c1c1c] to-[#111] rounded-xl shadow-xl overflow-hidden border border-[#333] mb-8">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#1db954] to-[#1aa34a] relative"></div>
        
        <div className="p-8 pt-0 relative">
          {/* Avatar */}
          <div className="absolute -top-12 left-8 w-24 h-24 rounded-full border-4 border-[#111] overflow-hidden shadow-lg">
            <img 
              src={profile?.avatarUrl || DEFAULT_AVATAR_URL} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Wallet Address Card */}
          <div className="flex justify-end mb-4">
            <div className="bg-[#222] rounded-xl px-4 py-2 inline-flex items-center text-sm border border-[#333] shadow-inner hover:bg-[#1a1a1a] transition-colors group">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 group-hover:animate-pulse"></span>
              {address && (
                <a 
                  href={`http://localhost:8545/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1db954] hover:text-[#3ed672] transition-colors font-mono tracking-wide"
                >
                  {formatAddress(address)}
                </a>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6 mt-12">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Display Name</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  placeholder="How you want to be known"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#333] rounded-lg bg-[#222] min-h-32 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  placeholder="Tell the community about yourself"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-300">Favorite Music Genres</label>
                <div className="flex flex-wrap gap-2">
                  {defaultGenres.map(genre => (
                    <label key={genre} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={(formData.favoriteGenres || []).includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                        className="mr-2"
                      />
                      {genre}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Avatar URL</label>
                <input
                  type="text"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#333] rounded-lg bg-[#222] focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white"
                  placeholder="https://example.com/your-avatar.jpg"
                />
                <p className="text-xs text-gray-400 mt-1">Enter a URL to an image, or use the default placeholder</p>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border border-[#333] rounded-lg hover:bg-[#222] transition-colors text-gray-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1db954] text-white rounded-lg hover:bg-[#1aa34a] transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-12">
              <h1 className="text-2xl font-bold mb-1 text-white">{profile?.username || 'Anonymous User'}</h1>
              <p className="text-gray-400 mb-6">{profile?.bio || 'No bio provided'}</p>
              
              <div className="mb-8">
                <h3 className="text-sm font-medium uppercase tracking-wide text-gray-400 mb-3">Favorite Genres</h3>
                {profile?.favoriteGenres && profile.favoriteGenres.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.favoriteGenres.map(genre => (
                      <span key={genre} className="px-3 py-1.5 bg-[#222] border border-[#333] rounded-full text-sm text-gray-300">
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>No favorite genres selected</p>
                )}
              </div>
              
              <div className="border-t border-[#333] pt-6">
                <div className="flex gap-8">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-white">0</span>
                    <span className="text-sm text-gray-400">Tracks</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-white">0</span>
                    <span className="text-sm text-gray-400">Collections</span>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 bg-[#1db954] text-white rounded-lg hover:bg-[#1aa34a] transition-colors cursor-pointer"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* NFT Collection Section (Empty State) */}
      <div className="bg-gradient-to-b from-[#1c1c1c] to-[#111] rounded-xl shadow-xl overflow-hidden border border-[#333] mb-8">
        <div className="p-6 border-b border-[#333] flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Your Music Collection</h3>
          <span className="bg-[#222] text-gray-400 text-xs px-3 py-1 rounded-full border border-[#333]">
            0 items
          </span>
        </div>
        
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-[#222] border border-[#333] flex items-center justify-center mb-8 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#1db954]">
              <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0 0a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" opacity="0.2"></path>
              <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"></path>
              <circle cx="12" cy="12" r="9"></circle>
            </svg>
          </div>
          
          <h4 className="text-2xl font-semibold mb-3 text-white">No Music Tracks in Your Collection</h4>
          <NftDescriptionText />
          
          <div className="flex flex-col gap-4">
            <button className="px-8 py-4 bg-[#1db954] text-white rounded-xl hover:bg-[#1aa34a] transition-colors shadow-lg flex items-center justify-center gap-3 font-medium cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
              Browse Marketplace
            </button>
            
            <button className="px-8 py-3 bg-transparent border border-[#333] text-gray-300 hover:bg-[#222] rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Upload Your Music
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
