import { useState } from 'react';
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon, VolumeIcon } from '../common/Icons';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 217; // 3:37 in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="h-20 bg-background-elevated border-t border-background-highlight px-6 flex items-center">
      <div className="w-1/4 flex items-center">
        <img
          src="https://via.placeholder.com/56"
          alt="Album Cover"
          className="h-14 w-14 rounded-md shadow-md mr-4"
        />
        <div>
          <h4 className="text-sm font-medium">Song Title</h4>
          <p className="text-xs text-text-secondary">Artist Name</p>
        </div>
      </div>

      <div className="w-2/4 flex flex-col items-center">
        <div className="flex items-center mb-3">
          <button className="iconbtn text-text-secondary hover:text-white mx-2">
            <SkipPreviousIcon />
          </button>
          <button
            className="mx-3 bg-white rounded-full p-2 hover:scale-110 transition-transform"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="iconbtn text-text-secondary hover:text-white mx-2">
            <SkipNextIcon />
          </button>
        </div>

        <div className="w-full flex items-center">
          <span className="text-xs text-text-secondary mr-2 w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 h-1 bg-background-highlight rounded-full group cursor-pointer">
            <div
              className="h-1 bg-text-secondary group-hover:bg-primary rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-text-secondary ml-2 w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="w-1/4 flex justify-end items-center">
        <VolumeIcon />
        <div className="w-24 h-1 bg-background-highlight rounded-full mx-3 group cursor-pointer">
          <div
            className="h-1 bg-text-secondary group-hover:bg-primary rounded-full"
            style={{ width: `${volume}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
