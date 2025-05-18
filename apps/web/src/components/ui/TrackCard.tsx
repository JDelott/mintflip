import React from 'react';
import type { Track } from '../../contexts/MusicContext.types';

// Simple mock shopping cart hook
const dummyCart = {
  addToCart: () => console.warn('Shopping cart not available'),
  items: [],
  getItemCount: () => 0,
};

interface TrackCardProps {
  track: Track;
  onClick?: () => void;
  // Optional prop for shopping cart functionality
  addToCart?: (track: Track) => void;
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

const TrackCard: React.FC<TrackCardProps> = ({ track, onClick, addToCart = dummyCart.addToCart }) => {
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (addToCart) {
      addToCart(track);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full aspect-square object-cover rounded-lg"
          onError={(e) => {
            // Try direct CID URL if the image fails to load
            try {
              const target = e.target as HTMLImageElement;
              const url = target.src;
              if (url.includes('/ipfs/')) {
                const cid = url.match(/\/ipfs\/([^/]+)/)?.[1] || '';
                target.src = `https://ipfs.io/ipfs/${cid}`;
              } else {
                // Fallback to placeholder if nothing else works
                target.src = 'https://placehold.co/300x300/1db954/FFFFFF?text=Error';
              }
            } catch (imgError) {
              console.error('Error handling image load failure:', imgError);
              (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/1db954/FFFFFF?text=Error';
            }
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
          <div className="flex gap-2">
            <button
              onClick={handleClick}
              className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-primary-dark transition-colors"
              aria-label="Play track"
            >
              <PlayIcon />
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-800 rounded-full w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label="Add to cart"
            >
              <CartIcon />
            </button>
          </div>
        </div>
      </div>
      <h3 className="tracktitle mt-2 overflow-hidden text-ellipsis whitespace-nowrap">{title}</h3>
      <p className="trackartist overflow-hidden text-ellipsis whitespace-nowrap">{artist}</p>
      <div className="flex items-center mt-1">
        <span className="mr-2 text-xs bg-primary/20 text-primary rounded-full px-2 py-0.5">
          {price}
        </span>
        <span className="text-xs text-text-secondary">{licenseType}</span>
      </div>
    </div>
  );
};

export default TrackCard;
