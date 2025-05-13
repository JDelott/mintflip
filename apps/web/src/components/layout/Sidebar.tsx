import { HomeIcon, SearchIcon, LibraryIcon } from '../common/Icons';

interface SidebarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar = ({ onNavigate, currentPage }: SidebarProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'search', label: 'Search', icon: <SearchIcon /> },
    { id: 'library', label: 'Your Library', icon: <LibraryIcon /> },
  ];

  const playlists = [
    { id: 'chill', name: 'Chill Vibes' },
    { id: 'workout', name: 'Workout Mix' },
    { id: 'study', name: 'Study Focus' },
    { id: 'dinner', name: 'Dinner Party' },
    { id: 'indie', name: 'Indie Essentials' },
  ];

  return (
    <div className="w-64 bg-black py-6">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-white">MintFlip Music</h1>
      </div>
      
      <nav className="mb-8">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center w-full py-3 px-4 rounded-md transition-colors ${
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
        <h2 className="text-sm uppercase tracking-wider font-bold text-text-secondary mb-4">Playlists</h2>
        <ul className="space-y-3">
          {playlists.map(playlist => (
            <li key={playlist.id}>
              <button className="w-full text-left text-text-secondary hover:text-white transition-colors">
                {playlist.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
