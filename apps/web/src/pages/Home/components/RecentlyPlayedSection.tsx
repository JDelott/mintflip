import { useState, useEffect } from 'react';
import TrackCard from '../../../components/ui/TrackCard';
import { getAlbumCover } from '../../../utils/imageUtils';
import { fetchTracks } from '../../../services/musicService';
import { useMusic } from '../../../hooks/useMusic';
import type { Track } from '../../../contexts/MusicContext.types';

// Move dummy tracks outside the component
const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: 'Digital Dreams',
    name: 'Digital Dreams', 
    artist: 'NeuroBeats',
    albumCover: getAlbumCover('Digital Dreams NeuroBeats 1'),
    image_uri: getAlbumCover('Digital Dreams NeuroBeats 1'),
    audio_uri: 'https://example.com/audio/1.mp3',
    nftPrice: '0.05 ETH',
    licenseType: 'Commercial',
    description: '',
    genre: 'Electronic'
  },
  // Add the rest of the dummy tracks with all required fields
];

const RecentlyPlayedSection = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const music = useMusic();

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setIsLoading(true);
        const fetchedTracks = await fetchTracks(5);
        
        if (fetchedTracks && fetchedTracks.length > 0) {
          setTracks(fetchedTracks);
        } else {
          // Fall back to dummy data if no tracks found
          setTracks(DUMMY_TRACKS);
        }
      } catch (error) {
        console.error('Error loading recent tracks:', error);
        // Fall back to dummy data on error
        setTracks(DUMMY_TRACKS);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, []); // No dependencies needed

  const handlePlayTrack = (track: Track) => {
    if (music) {
      music.playTrack(track);
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-5">
        <h2 className="sectionheading cursor-pointer">Recently Added</h2>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('navigation', { detail: 'marketplace' }))}
          className="text-primary font-semibold text-sm flex items-center cursor-pointer"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
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

export default RecentlyPlayedSection;
