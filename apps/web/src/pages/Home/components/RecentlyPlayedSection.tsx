import TrackCard from '../../../components/ui/TrackCard';

const RecentlyPlayedSection = () => {
  const recentTracks = [
    {
      id: '1',
      title: 'Dreams',
      artist: 'Fleetwood Mac',
      albumCover: 'https://via.placeholder.com/300/555/fff?text=Dreams',
    },
    {
      id: '2',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      albumCover: 'https://via.placeholder.com/300/444/fff?text=Blinding+Lights',
    },
    {
      id: '3',
      title: 'Don\'t Start Now',
      artist: 'Dua Lipa',
      albumCover: 'https://via.placeholder.com/300/666/fff?text=Don\'t+Start+Now',
    },
    {
      id: '4',
      title: 'Levitating',
      artist: 'Dua Lipa ft. DaBaby',
      albumCover: 'https://via.placeholder.com/300/777/fff?text=Levitating',
    },
    {
      id: '5',
      title: 'Heat Waves',
      artist: 'Glass Animals',
      albumCover: 'https://via.placeholder.com/300/333/fff?text=Heat+Waves',
    },
  ];

  return (
    <section>
      <h2 className="sectionheading">Recently Played</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {recentTracks.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyPlayedSection;
