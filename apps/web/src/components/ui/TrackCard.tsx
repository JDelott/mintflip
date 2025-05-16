import { PlayIcon } from '../common/Icons';
import type { Track } from '../../contexts/MusicContext.types';

interface TrackCardProps {
  track: Track;
  onClick: () => void;
}

const TrackCard = ({ track, onClick }: TrackCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative">
        <img
          src={track.image_uri || track.albumCover}
          alt={track.name || track.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <button
            onClick={onClick}
            className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center"
          >
            <PlayIcon />
          </button>
        </div>
      </div>
      <h3 className="tracktitle mt-2">{track.name || track.title}</h3>
      <p className="trackartist">{track.artist}</p>
      <div className="flex items-center mt-1">
        <span className="mr-2 text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5">
          {track.nftPrice}
        </span>
        <span className="text-xs text-text-secondary">{track.licenseType}</span>
      </div>
    </div>
  );
};

export default TrackCard;
