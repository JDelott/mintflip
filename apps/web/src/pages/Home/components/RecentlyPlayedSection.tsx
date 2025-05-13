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
      title: 'Binary Sunset',
      artist: 'DataMelody',
      albumCover: getAlbumCover('Binary Sunset DataMelody 4'),
      nftPrice: '0.12 ETH',
      licenseType: 'Premium'
    },
    {
      id: '5',
      title: 'Electric Dreams',
      artist: 'AlgoRhythm',
      albumCover: getAlbumCover('Electric Dreams AlgoRhythm 5'),
      nftPrice: '0.06 ETH',
      licenseType: 'Commercial'
    },
  ];

  return (
    <section>
      <h2 className="sectionheading">Recently Minted</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {recentTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyPlayedSection;
