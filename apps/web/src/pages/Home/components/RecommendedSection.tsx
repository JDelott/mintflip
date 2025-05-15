import TrackCard from '../../../components/ui/TrackCard';
import { getAlbumCover } from '../../../utils/imageUtils';

const RecommendedSection = () => {
  const recommendedTracks = [
    {
      id: '6',
      title: 'Synthetic Emotions',
      artist: 'DeepFlow',
      albumCover: getAlbumCover('Synthetic Emotions DeepFlow 6'),
      nftPrice: '0.15 ETH',
      licenseType: 'Exclusive',
      sold: 12
    },
    {
      id: '7',
      title: 'Automated Symphony',
      artist: 'Cypher Beats',
      albumCover: getAlbumCover('Automated Symphony Cypher Beats 7'),
      nftPrice: '0.09 ETH',
      licenseType: 'Commercial',
      sold: 8
    },
    {
      id: '8',
      title: 'Machine Learning Love Songs',
      artist: 'Neural Noise',
      albumCover: getAlbumCover('Machine Learning Love Songs Neural Noise 8'),
      nftPrice: '0.07 ETH',
      licenseType: 'Standard',
      sold: 15
    },
    {
      id: '9',
      title: 'Conscious Algorithm',
      artist: 'Byte Harmony',
      albumCover: getAlbumCover('Conscious Algorithm Byte Harmony 9'),
      nftPrice: '0.21 ETH',
      licenseType: 'Premium',
      sold: 5
    },
    {
      id: '10',
      title: 'Pixels and Frequencies',
      artist: 'CodeMelodics',
      albumCover: getAlbumCover('Pixels and Frequencies CodeMelodics 10'),
      nftPrice: '0.04 ETH',
      licenseType: 'Standard',
      sold: 9
    },
  ];

  return (
    <section>
      <h2 className="sectionheading cursor-pointer">Top Selling Tracks</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {recommendedTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;
