import TrackCard from '../../../components/ui/TrackCard';
import { getAlbumCover } from '../../../utils/imageUtils';

const RecentlyPlayedSection = () => {
  const recentTracks = [
    {
      id: '1',
      title: 'Digital Dreams',
      artist: 'NeuroBeats',
      albumCover: getAlbumCover('Digital Dreams NeuroBeats 1'),
      nftPrice: '0.05 ETH',
      licenseType: 'Commercial'
    },
    {
      id: '2',
      title: 'Quantum Harmonies',
      artist: 'SynthSoul',
      albumCover: getAlbumCover('Quantum Harmonies SynthSoul 2'),
      nftPrice: '0.08 ETH',
      licenseType: 'Exclusive'
    },
    {
      id: '3',
      title: 'Neural Waves',
      artist: 'Artifex',
      albumCover: getAlbumCover('Neural Waves Artifex 3'),
      nftPrice: '0.03 ETH',
      licenseType: 'Standard'
    },
    {
      id: '4',
      title: 'Algorithm Blues',
      artist: 'DeepRhythm',
      albumCover: getAlbumCover('Algorithm Blues DeepRhythm 4'),
      nftPrice: '0.12 ETH',
      licenseType: 'Premium'
    },
    {
      id: '5',
      title: 'Prompt Symphonies',
      artist: 'NeuralSynth',
      albumCover: getAlbumCover('Prompt Symphonies NeuralSynth 5'),
      nftPrice: '0.06 ETH',
      licenseType: 'Commercial'
    },
  ];

  return (
    <section>
      <div className="flex justify-between items-center mb-5">
        <h2 className="sectionheading cursor-pointer">Recently Played</h2>
        <button className="text-primary font-semibold text-sm flex items-center cursor-pointer">
          View All
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {recentTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyPlayedSection;
