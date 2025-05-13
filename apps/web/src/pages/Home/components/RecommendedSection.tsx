import TrackCard from '../../../components/ui/TrackCard';

const RecommendedSection = () => {
  const recommendedTracks = [
    {
      id: '6',
      title: 'As It Was',
      artist: 'Harry Styles',
      albumCover: 'https://via.placeholder.com/300/339/fff?text=As+It+Was',
    },
    {
      id: '7',
      title: 'Stay',
      artist: 'The Kid LAROI, Justin Bieber',
      albumCover: 'https://via.placeholder.com/300/449/fff?text=Stay',
    },
    {
      id: '8',
      title: 'Bad Habits',
      artist: 'Ed Sheeran',
      albumCover: 'https://via.placeholder.com/300/559/fff?text=Bad+Habits',
    },
    {
      id: '9',
      title: 'Easy On Me',
      artist: 'Adele',
      albumCover: 'https://via.placeholder.com/300/669/fff?text=Easy+On+Me',
    },
    {
      id: '10',
      title: 'STAY (with Justin Bieber)',
      artist: 'The Kid LAROI',
      albumCover: 'https://via.placeholder.com/300/779/fff?text=STAY',
    },
  ];

  return (
    <section>
      <h2 className="sectionheading">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {recommendedTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedSection;
