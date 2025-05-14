import { HomeIcon, SearchIcon, LibraryIcon, UserIcon } from '../common/Icons';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar = ({ onNavigate, currentPage }: SidebarProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'search', label: 'Discover', icon: <SearchIcon /> },
    { id: 'library', label: 'My Collection', icon: <LibraryIcon /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon /> },
  ];

  const marketCategories = [
    { id: 'trending', name: 'Trending NFTs' },
    { id: 'new', name: 'New Releases' },
    { id: 'exclusive', name: 'Exclusive Licenses' },
    { id: 'commercial', name: 'Commercial Use' },
    { id: 'creators', name: 'Top AI Creators' },
  ];

  return (
    <div className="w-64 bg-black py-6">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-white">MintFlip NFT</h1>
        <p className="text-xs text-text-secondary mt-1">AI Music Marketplace</p>
      </div>
      
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
          {marketCategories.map(category => (
            <li key={category.id}>
              <button className="w-full text-left text-text-secondary hover:text-white transition-colors cursor-pointer">
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8 px-6">
        <button className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md font-medium transition-colors cursor-pointer">
          Upload Your AI Track
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
