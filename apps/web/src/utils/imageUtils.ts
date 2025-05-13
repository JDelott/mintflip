/**
 * Album covers utility for the music streaming app
 * Using curated high-quality image URLs to ensure reliability
 */

// Collection of music-related album cover images
const albumCovers = [
  'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/167092/pexels-photo-167092.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/351265/pexels-photo-351265.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1021876/pexels-photo-1021876.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/3756766/pexels-photo-3756766.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1069798/pexels-photo-1069798.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/2426085/pexels-photo-2426085.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/2479312/pexels-photo-2479312.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/6966/abstract-music-rock-bw.jpg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/96380/pexels-photo-96380.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/159376/turntable-top-view-audio-equipment-159376.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/210887/pexels-photo-210887.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/290660/pexels-photo-290660.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/164853/pexels-photo-164853.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/860707/pexels-photo-860707.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/167295/pexels-photo-167295.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/2191013/pexels-photo-2191013.jpeg?auto=compress&cs=tinysrgb&w=300',
  'https://images.pexels.com/photos/1001850/pexels-photo-1001850.jpeg?auto=compress&cs=tinysrgb&w=300'
];

// Featured header images (landscape orientation)
const featuredImages = [
  'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/167491/pexels-photo-167491.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/144429/pexels-photo-144429.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'https://images.pexels.com/photos/1916824/pexels-photo-1916824.jpeg?auto=compress&cs=tinysrgb&w=1200'
];

// Add these to your existing featured images array
const featuredNftImages = [
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1748&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1932&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558244402-286dd748c593?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1629367494173-c78a56567877?q=80&w=1974&auto=format&fit=crop'
];

// Store used image indexes to prevent duplicates
const usedAlbumCoverIndexes = new Set<number>();
const usedFeaturedImageIndexes = new Set<number>();

/**
 * Get a unique album cover image
 * @param query Any string like artist or track name
 * @returns URL to an album cover image
 */
export const getAlbumCover = (query: string): string => {
  // Start with a deterministic index based on the query
  let index = Math.abs(hashString(query) % albumCovers.length);
  
  // If this index is already used, find the next available one
  if (usedAlbumCoverIndexes.has(index)) {
    // Find the next available index
    let attempts = 0;
    const maxAttempts = albumCovers.length;
    
    while (usedAlbumCoverIndexes.has(index) && attempts < maxAttempts) {
      index = (index + 1) % albumCovers.length;
      attempts++;
    }
    
    // If all images are used, reset and start from the beginning
    if (attempts >= maxAttempts) {
      usedAlbumCoverIndexes.clear();
    }
  }
  
  // Mark this index as used
  usedAlbumCoverIndexes.add(index);
  
  return albumCovers[index];
};

/**
 * Get a unique featured playlist/header image
 * @param query Any string
 * @returns URL to a featured image
 */
export const getFeaturedImage = (query: string): string => {
  let index = Math.abs(hashString(query) % featuredImages.length);
  
  if (usedFeaturedImageIndexes.has(index)) {
    let attempts = 0;
    const maxAttempts = featuredImages.length;
    
    while (usedFeaturedImageIndexes.has(index) && attempts < maxAttempts) {
      index = (index + 1) % featuredImages.length;
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      usedFeaturedImageIndexes.clear();
    }
  }
  
  usedFeaturedImageIndexes.add(index);
  
  return featuredImages[index];
};

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Reset all used image trackers - call this when you want to reuse images
 */
export const resetImageTracking = (): void => {
  usedAlbumCoverIndexes.clear();
  usedFeaturedImageIndexes.clear();
};

/**
 * Add this function to your exports
 */
export const getNftFeaturedImage = (): string => {
  // Simply get a random image from the array
  const randomIndex = Math.floor(Math.random() * featuredNftImages.length);
  return featuredNftImages[randomIndex];
};
