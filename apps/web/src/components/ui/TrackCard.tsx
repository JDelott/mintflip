import { PlayIcon } from '../common/Icons';

interface Track {
  id: string;
  title: string;
  artist: string;
  albumCover: string;
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
        <button className="absolute right-3 bottom-3 bg-primary p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110 transform translate-y-2 group-hover:translate-y-0">
          <PlayIcon />
        </button>
      </div>
      <h3 className="tracktitle truncate">{track.title}</h3>
      <p className="trackartist truncate">{track.artist}</p>
    </div>
  );
};

export default TrackCard;
