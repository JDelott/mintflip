import { useState } from 'react';
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon, VolumeIcon } from '../common/Icons';
import { getAlbumCover } from '../../utils/imageUtils';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 217; // 3:37 in seconds
  
  const currentTrack = {
    title: "Digital Universe",
    artist: "Quantum Circuit",
    albumCover: getAlbumCover("Digital Universe Quantum Circuit current"),
    nftPrice: "0.14 ETH",
    licenseType: "Premium"
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="h-20 bg-background-elevated border-t border-background-highlight px-6 flex items-center">
      <div className="w-1/4 flex items-center">
        <img
          src={currentTrack.albumCover}
          alt="Album Cover"
          className="h-14 w-14 rounded-md shadow-md mr-4"
        />
        <div>
          <h4 className="text-sm font-medium">{currentTrack.title}</h4>
          <p className="text-xs text-text-secondary">{currentTrack.artist}</p>
          <div className="flex items-center mt-1">
            <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5 mr-1">
              {currentTrack.nftPrice}
            </span>
            <span className="text-xs text-text-secondary">
              {currentTrack.licenseType}
            </span>
          </div>
        </div>
      </div>

      <div className="w-2/4 flex flex-col items-center">
        <div className="flex items-center mb-3">
          <button className="iconbtn text-text-secondary hover:text-white mx-2">
            <SkipPreviousIcon />
          </button>
          <button
            className="mx-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform"
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
        <button className="text-xs bg-primary hover:bg-primary-dark rounded-full px-3 py-1 mr-4 text-white transition-colors">
          Buy NFT
        </button>
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
