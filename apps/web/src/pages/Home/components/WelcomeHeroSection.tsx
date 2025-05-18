import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../../services/userService';

const WelcomeHeroSection = () => {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (isConnected && address) {
      const loadProfile = async () => {
        try {
          const profile = await fetchUserProfile(address);
          setUsername(profile.username || null);
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      };
      
      loadProfile();
    }
  }, [isConnected, address]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    window.dispatchEvent(new CustomEvent('search', { detail: searchQuery }));
  };

  const handleUpload = () => {
    window.dispatchEvent(new CustomEvent('navigation', { detail: 'upload' }));
  };

  return (
    <div className="w-full">
      {/* Hero Section - Horizontal with Search */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '12px',
          backgroundColor: '#121212',
          border: '1px solid #2a2a2a',
          padding: '16px 20px',
          backgroundImage: `
            linear-gradient(to right, rgba(29, 185, 84, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(29, 185, 84, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          overflow: 'hidden',
          marginBottom: '36px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        {/* Very Subtle Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(29, 185, 84, 0.05), transparent 70%)',
          pointerEvents: 'none',
        }}></div>
        
        {/* Left Side - Welcome Message */}
        <div style={{ 
          position: 'relative', 
          zIndex: 1,
          flex: '1',
          minWidth: '220px',
          maxWidth: '400px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#ffffff',
            marginBottom: '4px',
          }}>
            {isConnected && username 
              ? `Welcome back, ${username}!` 
              : "AI Music Marketplace"}
          </h1>
          
          <p style={{ 
            fontSize: '14px',
            color: '#e0e0e0',
          }}>
            Upload, mint, and sell your AI-generated music
          </p>
        </div>
        
        {/* Right Side - Search Bar and Upload Button */}
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          gap: '12px',
          flex: '1',
          minWidth: '280px',
          maxWidth: '550px',
          alignItems: 'center'
        }}>
          <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
            <div style={{ 
              position: 'relative',
              display: 'flex',
              width: '100%'
            }}>
              <input
                type="text"
                placeholder="Search music..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '10px 14px 10px 38px',
                  color: '#ffffff',
                  width: '100%',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(29, 185, 84, 0.4)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                }}
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="#999999"
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          
          {/* Upload Button */}
          <button 
            onClick={handleUpload}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#1db954',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 16px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#1ed760';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1db954';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ marginRight: '6px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>
        </div>
      </div>
      
      {/* Featured Tracks Heading */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#1db954" style={{ marginRight: '10px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          Featured Tracks
        </h1>
      </div>
      
      {/* Here the FeaturedTrack component would be rendered */}
    </div>
  );
};

export default WelcomeHeroSection;
