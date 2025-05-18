import { useState, useEffect } from 'react';
import { fetchTracks } from '../../../services/musicService';
import { useMusic } from '../../../hooks/useMusic';
import type { Track } from '../../../contexts/MusicContext.types';

const FeaturedSection = () => {
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('left');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const music = useMusic();
  
  // Fallback image - themed for MintFlip
  const fallbackImage = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1770&auto=format&fit=crop";
  
  const transitionDuration = "600ms"; // Slower transition (600ms instead of 400ms)
  
  useEffect(() => {
    const loadFeaturedTracks = async () => {
      try {
        setIsLoading(true);
        const tracks = await fetchTracks(10);
        
        if (tracks && tracks.length > 0) {
          // Select up to 3 tracks for the carousel
          setFeaturedTracks(tracks.slice(0, Math.min(3, tracks.length)));
        }
      } catch (error) {
        console.error('Error loading featured tracks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedTracks();
  }, []);
  
  // Auto-rotate carousel every 7 seconds (longer to accommodate slower transition)
  useEffect(() => {
    if (featuredTracks.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [featuredTracks.length, currentIndex]);
  
  const handlePlayTrack = () => {
    if (featuredTracks.length > 0 && music) {
      music.playTrack(featuredTracks[currentIndex]);
    }
  };
  
  const handleNext = () => {
    if (featuredTracks.length <= 1 || isTransitioning) return;
    
    setSlideDirection('left');
    animateSlide((currentIndex + 1) % featuredTracks.length);
  };
  
  const handlePrevious = () => {
    if (featuredTracks.length <= 1 || isTransitioning) return;
    
    setSlideDirection('right');
    animateSlide(currentIndex === 0 ? featuredTracks.length - 1 : currentIndex - 1);
  };
  
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setSlideDirection(index > currentIndex ? 'left' : 'right');
    animateSlide(index);
  };
  
  const animateSlide = (newIndex: number) => {
    setIsTransitioning(true);
    
    // Using a slower transition duration for more dramatic effect
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsTransitioning(false);
    }, 600); // Match this with the CSS transition duration
  };

  // Direct CID URL access for reliable loading
  const getImageUrl = (imageUri: string | undefined) => {
    if (!imageUri || imageUri === 'undefined') return fallbackImage;
    
    if (imageUri.includes('/ipfs/')) {
      const match = imageUri.match(/\/ipfs\/([^/]+)/);
      if (match && match[1]) return `https://ipfs.io/ipfs/${match[1]}`;
    }
    
    return imageUri;
  };
  
  // Get current track to display
  const currentTrack = featuredTracks.length > 0 ? featuredTracks[currentIndex] : null;

  // Helper for slide transitions
  const getSlideTransform = (element: 'current' | 'next') => {
    if (!isTransitioning) return 'translate-x-0';
    
    if (slideDirection === 'left') {
      return element === 'current' ? '-translate-x-full' : 'translate-x-full';
    } else {
      return element === 'current' ? 'translate-x-full' : '-translate-x-full';
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-background-highlight bg-gradient-to-r from-primary/5 via-background-elevated to-background shadow-md">
      <div className="flex items-center h-48 relative">
        {/* Artwork section with dramatic slide effect */}
        <div className="h-full aspect-square relative overflow-hidden">
          <div 
            className={`absolute inset-0 transition-transform ease-in-out ${
              isTransitioning ? getSlideTransform('current') : 'translate-x-0'
            }`}
            style={{ transitionDuration }}
          >
            {isLoading ? (
              <div className="w-full h-full bg-background-highlight"></div>
            ) : (
              <img
                src={currentTrack ? getImageUrl(currentTrack.image_uri) : fallbackImage}
                alt={currentTrack?.name || "Featured"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackImage;
                }}
              />
            )}
            
            {/* Play button overlay */}
            <div 
              className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
              onClick={handlePlayTrack}
            >
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Invisible swipe overlays */}
          <div 
            className="absolute inset-y-0 left-0 w-1/3 cursor-pointer z-10" 
            onClick={handlePrevious}
          />
          <div 
            className="absolute inset-y-0 right-0 w-1/3 cursor-pointer z-10" 
            onClick={handleNext}
          />
        </div>
        
        {/* Track info with dramatic slide effect */}
        <div className="flex-1 px-6 py-4 overflow-hidden">
          <div 
            className={`flex flex-col h-full justify-center transition-all ease-in-out ${
              isTransitioning ? `${getSlideTransform('current')} opacity-0` : 'translate-x-0 opacity-100'
            }`}
            style={{ transitionDuration }}
          >
            <span className="text-primary text-xs font-medium mb-1">Featured Track</span>
            
            <h2 className="text-xl font-bold mb-1 line-clamp-1">
              {isLoading ? "Loading..." : (currentTrack?.name || "Featured Track")}
            </h2>
            
            {!isLoading && currentTrack && (
              <>
                <p className="text-text-secondary text-sm mb-3">
                  {currentTrack.artist}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {currentTrack.nftPrice}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background text-text-secondary">
                    {currentTrack.licenseType}
                  </span>
                  {currentTrack.genre && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background text-text-secondary">
                      {currentTrack.genre}
                    </span>
                  )}
                </div>
              </>
            )}
            
            <div className="flex gap-3">
              <button 
                onClick={handlePlayTrack}
                disabled={!currentTrack}
                className="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm rounded-md transition-colors flex items-center gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play
              </button>
              
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('navigation', { detail: 'marketplace' }))}
                className="px-4 py-1.5 bg-transparent hover:bg-background-highlight text-text-primary text-sm border border-background-highlight rounded-md transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
        
        {/* Right side with dramatic fade/slide */}
        <div className="w-36 h-full p-4 flex flex-col justify-between border-l border-background-highlight bg-background/30">
          <div className="text-center">
            <div 
              className={`transition-all ease-in-out ${
                isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
              }`}
              style={{ transitionDuration }}
            >
              <div className="text-xs text-text-secondary mb-1">Current Price</div>
              <div className="text-2xl font-bold text-primary">
                {isLoading ? "..." : (currentTrack?.nftPrice || "0.00 ETH")}
              </div>
            </div>
          </div>
          
          {/* Dots with dramatic effect */}
          <div className="flex justify-center gap-2 mt-auto">
            {featuredTracks.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-primary w-8' 
                    : 'bg-background-highlight w-2 hover:bg-text-secondary'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Larger tap areas for swiping (invisible) */}
        {featuredTracks.length > 1 && (
          <>
            <div 
              className="absolute left-0 top-0 bottom-0 w-12 cursor-pointer" 
              onClick={handlePrevious}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 w-12 cursor-pointer" 
              onClick={handleNext}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedSection;
