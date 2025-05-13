import { PlayIcon } from '../common/Icons';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
  nftPrice?: string;
  licenseType?: string;
  sold?: number;
}

interface TrackCardProps {
  track: Track;
}

const TrackCard = ({ track }: TrackCardProps) => {
  return (
    <div className="card group">
      <div className="relative mb-3">
        <img
          src={track.albumCover}
          alt={`${track.title} by ${track.artist}`}
          className="w-full aspect-square object-cover rounded shadow-md"
        />
        <div className="absolute top-2 right-2 bg-primary px-2 py-1 rounded-full text-xs font-bold shadow-md">
          {track.nftPrice}
        </div>
        <button className="absolute right-3 bottom-3 bg-primary p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 transform translate-y-2 group-hover:translate-y-0">
          <PlayIcon />
        </button>
      </div>
      <h3 className="tracktitle truncate">{track.title}</h3>
      <p className="trackartist truncate">{track.artist}</p>
      {track.licenseType && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs px-2 py-1 bg-background-elevated rounded-full text-text-secondary">
            {track.licenseType} License
          </span>
          {track.sold && (
            <span className="text-xs text-text-secondary">
              {track.sold} sold
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TrackCard;

// Example using the Unsplash API
const getAlbumCover = (query: string, size = 300) => {
  return `https://source.unsplash.com/random/${size}x${size}?${encodeURIComponent(query)},album,music`;
};

// Then update your track data
const recentTracks = [
  {
    id: '1',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    albumCover: getAlbumCover('dreams fleetwood mac'),
  },
  // ...more tracks
];
