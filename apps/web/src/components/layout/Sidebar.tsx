import { HomeIcon, SearchIcon, LibraryIcon, UserIcon } from '../common/Icons';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../services/userService';
import type { UserProfile } from '../../services/userService';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar = ({ onNavigate, currentPage }: SidebarProps) => {
  const { address, isConnected } = useAccount();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch user profile data
  useEffect(() => {
    if (!address) return;
    
    const loadProfile = async () => {
      try {
        const userData = await fetchUserProfile(address);
        setProfile(userData);
      } catch (error) {
        console.error('Error loading profile for sidebar:', error);
      }
    };
    
    loadProfile();
  }, [address]);

  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'search', label: 'Discover', icon: <SearchIcon /> },
    { id: 'library', label: 'My Collection', icon: <LibraryIcon /> },
    { id: 'profile', label: 'My Profile', icon: <UserIcon /> },
  ];

  const marketCategories = [
    { id: 'trending', name: 'Trending Tracks' },
    { id: 'new', name: 'New Releases' }
  ];

  return (
    <div className="w-64 bg-black py-6 flex flex-col h-full">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-white">MintFlip</h1>
        <p className="text-xs text-text-secondary mt-1">AI Music Marketplace</p>
      </div>
      
      {isConnected && profile?.username && (
        <div className="px-6 mb-6">
          <div className="bg-background-elevated rounded-md p-3 flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{profile.username}</p>
              <p className="text-xs text-text-secondary">
                {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : ''}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="mb-8">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full py-3 px-4 rounded-md transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-background-elevated text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                <span className="mr-4">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="px-6">
        <h2 className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4">Marketplace</h2>
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => onNavigate('marketplace')}
              className={`w-full text-left ${
                currentPage === 'marketplace' 
                  ? 'text-white font-medium' 
                  : 'text-text-secondary hover:text-white'
              } transition-colors cursor-pointer`}
            >
              All Tracks
            </button>
          </li>
          {marketCategories.map(category => (
            <li key={category.id}>
              <button 
                onClick={() => onNavigate(category.id)}
                className={`w-full text-left ${
                  currentPage === category.id 
                    ? 'text-white font-medium' 
                    : 'text-text-secondary hover:text-white'
                } transition-colors cursor-pointer`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto px-6 pb-4">
        <button 
          onClick={() => onNavigate('upload')}
          className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md font-medium transition-colors cursor-pointer"
        >
          Upload Your AI Track
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
