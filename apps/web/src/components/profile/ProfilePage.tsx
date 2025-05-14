import { useState, useEffect } from 'react';
import { useAccount, useEnsName, useEnsAvatar, useChainId, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

interface ProfileData {
  username: string;
  bio: string;
  favGenres: string[];
}

const defaultGenres = [
  'Hip-Hop', 'Electronic', 'Pop', 'Rock', 'Lo-Fi', 'Jazz', 'Classical', 'Ambient'
];

const ProfilePage = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName?.toString() });
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    bio: '',
    favGenres: ['Electronic', 'Lo-Fi']
  });
  const [isEditing, setIsEditing] = useState(false);

  // Check if user is on the correct network
  const isWrongNetwork = isConnected && chainId !== sepolia.id;

  useEffect(() => {
    if (isConnected && address) {
      // Here you would fetch the user's profile data from your backend
      // For now, we'll just use mock data
      setProfileData({
        username: ensName || formatAddress(address),
        bio: 'Web3 enthusiast and NFT collector passionate about AI-generated music.',
        favGenres: ['Electronic', 'Lo-Fi']
      });
    }
  }, [address, isConnected, ensName]);

  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // API call would go here
  };

  const toggleGenre = (genre: string) => {
    if (profileData.favGenres.includes(genre)) {
      setProfileData({
        ...profileData,
        favGenres: profileData.favGenres.filter(g => g !== genre)
      });
    } else {
      setProfileData({
        ...profileData,
        favGenres: [...profileData.favGenres, genre]
      });
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
            MintFlip runs on Sepolia Testnet. Please switch your network to continue.
          </p>
        </div>
        <button
          onClick={() => switchChain({ chainId: sepolia.id })}
          className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Switch to Sepolia Testnet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Your Profile</h2>
        <ConnectButton showBalance chainStatus="icon" />
      </div>
      
      <div className="bg-card rounded-xl shadow overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-primary-dark to-primary relative"></div>
        
        <div className="p-6 pt-0 relative">
          {/* Avatar */}
          <div className="absolute -top-12 left-6 w-24 h-24 rounded-full border-4 border-card overflow-hidden bg-background-elevated">
            {ensAvatar ? (
              <img src={ensAvatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark">
                <span className="text-2xl font-bold text-white">
                  {profileData.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          
          {/* Wallet Address Card */}
          <div className="flex justify-end mb-4">
            <div className="bg-background-elevated rounded-lg px-4 py-2 inline-flex items-center text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              {address && (
                <a 
                  href={`https://sepolia.etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {formatAddress(address)}
                </a>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-6 mt-12">
              <div>
                <label className="block text-sm font-medium mb-2">Display Name</label>
                <input
                  type="text"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  className="w-full p-3 border rounded-lg bg-background-elevated focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="How you want to be known"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full p-3 border rounded-lg bg-background-elevated min-h-32 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Tell the community about yourself"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Favorite Music Genres</label>
                <div className="flex flex-wrap gap-2">
                  {defaultGenres.map(genre => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        profileData.favGenres.includes(genre)
                          ? 'bg-primary text-white'
                          : 'bg-background-elevated text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border rounded-lg hover:bg-background-elevated transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Save Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-12">
              <h1 className="text-2xl font-bold mb-1">{profileData.username}</h1>
              <p className="text-text-secondary mb-6">{profileData.bio}</p>
              
              <div className="mb-8">
                <h3 className="text-sm font-medium uppercase tracking-wider text-text-secondary mb-3">Favorite Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.favGenres.map(genre => (
                    <span key={genre} className="px-3 py-1.5 bg-background-elevated rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="block text-xl font-bold">0</span>
                    <span className="text-sm text-text-secondary">NFTs</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xl font-bold">0</span>
                    <span className="text-sm text-text-secondary">Collections</span>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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
      <div className="mt-8 bg-card rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-4">Your NFT Collection</h3>
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-elevated flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <path d="M2 15h10"></path>
              <path d="M7 10l-5 5 5 5"></path>
            </svg>
          </div>
          <h4 className="text-lg font-medium mb-2">No NFTs Yet</h4>
          <p className="text-text-secondary max-w-md mx-auto mb-6">Start building your collection by discovering and purchasing AI-generated music tracks.</p>
          <button className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            Browse Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
