// apps/web/src/pages/Marketplace/MarketplacePage.tsx
import { useState, useEffect } from 'react';
import { fetchTracks } from '../../services/musicService';
import TrackCard from '../../components/ui/TrackCard';
import { useMusic } from '../../hooks/useMusic';
import type { Track } from '../../contexts/MusicContext.types';

interface MarketplacePageProps {
  category?: 'all' | 'trending' | 'new';
}

const MarketplacePage = ({ category = 'all' }: MarketplacePageProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const music = useMusic();

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get base tracks
        const fetchedTracks = await fetchTracks(100);
        
        // Apply category-specific filtering or ordering
        let categoryTracks;
        switch (category) {
          case 'trending':
            // For trending, we might sort by popularity or plays if available
            // For now, we'll just show a subset to simulate trending tracks
            categoryTracks = [...fetchedTracks].sort(() => Math.random() - 0.5).slice(0, 10);
            break;
          case 'new':
            // For new, we'd sort by creation date
            // Let's simulate by taking the first few tracks, assuming newer items come first
            categoryTracks = fetchedTracks.slice(0, 12);
            break;
          default:
            // Show all tracks for the 'all' category
            categoryTracks = fetchedTracks;
        }
        
        setTracks(categoryTracks);
      } catch (err) {
        console.error('Failed to load marketplace tracks:', err);
        setError('Failed to load music tracks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [category]);

  const handlePlayTrack = (track: Track) => {
    if (music) {
      music.playTrack(track);
    }
  };

  // Get the page title based on the category
  const getCategoryTitle = () => {
    switch (category) {
      case 'trending':
        return 'Trending Tracks';
      case 'new':
        return 'New Releases';
      default:
        return 'Marketplace';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{getCategoryTitle()}</h1>
      </div>
      
      {/* Tracks grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-12 h-12 border-t-2 border-r-2 border-primary rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      ) : tracks.length === 0 ? (
        <div className="bg-background-elevated p-8 text-center rounded-xl border border-background-highlight">
          <h3 className="text-xl font-bold mb-2">No Tracks Found</h3>
          <p className="text-text-secondary mb-6">
            There are no tracks available in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <TrackCard 
              key={track.id} 
              track={track} 
              onClick={() => handlePlayTrack(track)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
