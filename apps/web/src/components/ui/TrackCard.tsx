import React from 'react';
import type { Track } from '../../contexts/MusicContext.types';

// Define the global key to match the one in ShoppingCartContext
const CART_GLOBAL_KEY = "MINTFLIP_GLOBAL_CART";

// Define the window interface extension
interface GlobalWindow extends Window {
  [CART_GLOBAL_KEY]?: (track: Track) => boolean;
}

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
}

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const TrackCard: React.FC<TrackCardProps> = ({ track, onClick }) => {
  if (!track || typeof track !== 'object') {
    return (
      <div className="bg-background-elevated rounded-lg p-4 border border-background-highlight text-center">
        <p className="text-red-400">Invalid track data</p>
      </div>
    );
  }
  
  // Function to fix IPFS image URLs with error handling
  const getFixedImageUrl = (url: string | undefined) => {
    if (!url) return 'https://placehold.co/300x300/1db954/FFFFFF?text=No+Image';
    
    try {
      if (url.includes('/Screenshot')) {
        return url.split('/Screenshot')[0];
      }
      return url;
    } catch {
      return 'https://placehold.co/300x300/1db954/FFFFFF?text=Error';
    }
  };

  // Safely get track properties with fallbacks
  const title = track.name || track.title || 'Untitled Track';
  const artist = track.artist || 'Unknown Artist';
  const price = track.nftPrice || '0.00 ETH';
  const licenseType = track.licenseType || 'Standard';
  const imageUrl = getFixedImageUrl(track.image_uri || track.albumCover);

  // Simplified add to cart handler that uses the global method
  const handleAddToCart = (e: React.MouseEvent) => {
    // Attempt to stop propagation but don't rely on it
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Access the global method with proper typing
    const globalAddToCart = (window as GlobalWindow)[CART_GLOBAL_KEY];
    
    if (typeof globalAddToCart === 'function') {
      try {
        globalAddToCart(track);
        console.log("Called global addToCart with track:", track.name || track.title);
      } catch (error) {
        console.error("Error in global addToCart:", error instanceof Error ? error.message : String(error));
      }
    } else {
      console.error("Global addToCart function not found!");
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="group">
      <div 
        className="relative cursor-pointer" 
        onClick={onClick}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full aspect-square object-cover rounded-lg"
          onError={(e) => {
            try {
              const target = e.target as HTMLImageElement;
              const url = target.src;
              if (url.includes('/ipfs/')) {
                const cid = url.match(/\/ipfs\/([^/]+)/)?.[1] || '';
                target.src = `https://ipfs.io/ipfs/${cid}`;
              } else {
                target.src = 'https://placehold.co/300x300/1db954/FFFFFF?text=Error';
              }
            } catch (imgError) {
              console.error('Error handling image load failure:', imgError);
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/1db954/FFFFFF?text=Error';
            }
          }}
        />
        
        {/* Overlay with buttons */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePlayClick}
              className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <PlayIcon />
            </button>
            
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <CartIcon />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <div onClick={onClick} className="cursor-pointer flex-1">
          <h3 className="tracktitle overflow-hidden text-ellipsis whitespace-nowrap">{title}</h3>
          <p className="trackartist overflow-hidden text-ellipsis whitespace-nowrap">{artist}</p>
          <div className="flex items-center mt-1">
            <span className="mr-2 text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5">
              {price}
            </span>
            <span className="text-xs text-text-secondary">{licenseType}</span>
          </div>
        </div>
        
        {/* Stand-alone cart button */}
        <div 
          onClick={handleAddToCart}
          className="text-primary hover:text-white bg-primary/10 hover:bg-primary p-2 rounded-full transition-colors cursor-pointer"
        >
          <CartIcon />
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
