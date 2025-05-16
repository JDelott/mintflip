import { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, SkipNextIcon, SkipPreviousIcon, VolumeIcon } from '../common/Icons';
import { useMusic } from '../../hooks/useMusic';

const MusicPlayer = () => {
  // Hooks must be at the top level - no conditional calls
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(217); // 3:37 in seconds
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Use a safe approach to access the music context
  const musicContext = useMusic();
  const { currentTrack, isPlaying, pauseTrack, resumeTrack, nextTrack, previousTrack } = musicContext || {};
  
  // All useEffect hooks must be at the top level, before any conditional returns
  useEffect(() => {
    if (!musicContext || !currentTrack || !audioRef.current) return;
    
    // Set volume
    audioRef.current.volume = volume / 100;
    
    // Handle play/pause
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, volume, currentTrack, musicContext]);
  
  // Reset player when track changes
  useEffect(() => {
    if (!musicContext || !currentTrack || !audioRef.current) return;
    
    setCurrentTime(0);
    audioRef.current.currentTime = 0;
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Failed to play:', err);
      });
    }
  }, [currentTrack, isPlaying, musicContext]);
  
  // After all hooks, we can have conditional returns
  if (!musicContext || !currentTrack) return null;
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    audioRef.current.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };
  
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = e.currentTarget;
    const rect = volumeBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    const newVolume = Math.max(0, Math.min(100, Math.round(pos * 100)));
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
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
          src={currentTrack.image_uri.includes('/ipfs/')
              ? `https://ipfs.io/ipfs/${(currentTrack.image_uri.match(/\/ipfs\/([^/]+)/)?.[1] || '')}`
              : currentTrack.image_uri || currentTrack.albumCover
          }
          alt="Album Cover"
          className="h-14 w-14 rounded-md shadow-md mr-4 cursor-pointer"
          onError={(e) => {
            // Fallback for any loading errors
            const target = e.target as HTMLImageElement;
            if (target.src.includes('/ipfs/')) {
              const cid = target.src.match(/\/ipfs\/([^/]+)/)?.[1] || '';
              target.src = `https://ipfs.io/ipfs/${cid}`;
            }
          }}
        />
        <div>
          <h4 className="text-sm font-medium cursor-pointer">{currentTrack.name || currentTrack.title}</h4>
          <p className="text-xs text-text-secondary cursor-pointer">{currentTrack.artist}</p>
          <div className="flex items-center mt-1">
            <span className="text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5 mr-1 cursor-pointer">
              {currentTrack.nftPrice}
            </span>
            <span className="text-xs text-text-secondary cursor-pointer">
              {currentTrack.licenseType}
            </span>
          </div>
        </div>
      </div>

      <div className="w-2/4 flex flex-col items-center">
        <div className="flex items-center mb-3">
          <button 
            className="iconbtn text-text-secondary hover:text-white mx-2 cursor-pointer"
            onClick={previousTrack}
          >
            <SkipPreviousIcon />
          </button>
          <button
            className="mx-3 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
            onClick={isPlaying ? pauseTrack : resumeTrack}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button 
            className="iconbtn text-text-secondary hover:text-white mx-2 cursor-pointer"
            onClick={nextTrack}
          >
            <SkipNextIcon />
          </button>
        </div>

        <div className="w-full flex items-center">
          <span className="text-xs text-text-secondary mr-2 w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <div 
            className="flex-1 h-1 bg-background-highlight rounded-full group cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-1 bg-text-secondary group-hover:bg-primary rounded-full"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-text-secondary ml-2 w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="w-1/4 flex justify-end items-center">
        <button className="text-xs bg-primary hover:bg-primary-dark rounded-full px-3 py-1 mr-4 text-white transition-colors cursor-pointer">
          Buy NFT
        </button>
        <VolumeIcon />
        <div 
          className="w-24 h-1 bg-background-highlight rounded-full mx-3 group cursor-pointer"
          onClick={handleVolumeChange}
        >
          <div
            className="h-1 bg-text-secondary group-hover:bg-primary rounded-full"
            style={{ width: `${volume}%` }}
          ></div>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.audio_uri.includes('/ipfs/') 
             ? `https://ipfs.io/ipfs/${currentTrack.audio_uri.match(/\/ipfs\/([^/]+)/)?.[1] || ''}` 
             : currentTrack.audio_uri}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
        onError={(e) => {
          console.error('Audio error:', e);
          // Try alternate URL if we get an error
          if (audioRef.current && currentTrack.audio_uri.includes('/ipfs/')) {
            const cid = currentTrack.audio_uri.match(/\/ipfs\/([^/]+)/)?.[1] || '';
            const directUrl = `https://ipfs.io/ipfs/${cid}`;
            audioRef.current.src = directUrl;
            audioRef.current.load();
            if (isPlaying) audioRef.current.play().catch(err => console.error('Retry play error:', err));
          }
        }}
      />
    </div>
  );
};

export default MusicPlayer;
