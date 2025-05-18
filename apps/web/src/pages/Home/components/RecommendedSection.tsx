import { useState, useEffect } from 'react';
import TrackCard from '../../../components/ui/TrackCard';
import { fetchTracks } from '../../../services/musicService';
import { useMusic } from '../../../hooks/useMusic';
import type { Track } from '../../../contexts/MusicContext.types';

const RecommendedSection = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const music = useMusic();

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setIsLoading(true);
        const allTracks = await fetchTracks(10);
        
        if (allTracks && allTracks.length > 0) {
          // Simulate "top selling" by taking different tracks or sorting
          // Just take a subset or sort differently than RecentlyPlayedSection
          const topTracks = [...allTracks]
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically for variety
            .slice(0, 5);
          setTracks(topTracks);
        } else {
          setTracks([]); // Empty array if no tracks
        }
      } catch (error) {
        console.error('Error loading top tracks:', error);
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, []);

  const handlePlayTrack = (track: Track) => {
    if (music) {
      music.playTrack(track);
    }
  };

  // Don't render section if no tracks
  if (!isLoading && tracks.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="sectionheading cursor-pointer">Top Selling Tracks</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin w-8 h-8 border-t-2 border-r-2 border-primary rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {tracks.map((track) => (
            <TrackCard 
              key={track.id} 
              track={track}
              onClick={() => handlePlayTrack(track)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedSection;
