import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../../services/userService';

const WelcomeHeroSection = () => {
  const { address, isConnected } = useAccount();
  const [username, setUsername] = useState<string | null>(null);
  
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

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          borderRadius: '12px',
          backgroundColor: '#121212',
          border: '1px solid #2a2a2a',
          padding: '24px 28px',
          backgroundImage: `
            linear-gradient(to right, rgba(29, 185, 84, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(29, 185, 84, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          overflow: 'hidden',
          marginBottom: '40px' // Increased spacing between sections
        }}
      >
        {/* Very Subtle Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(29, 185, 84, 0.05), transparent 70%)',
          pointerEvents: 'none',
        }}></div>
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Welcome Message */}
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{ 
              fontSize: '26px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              marginBottom: '6px',
            }}>
              {isConnected && username 
                ? `Welcome back, ${username}!` 
                : "AI Music Marketplace"}
            </h1>
            
            <p style={{ 
              fontSize: '15px',
              color: '#e0e0e0',
            }}>
              Create, mint, and trade AI-generated music as digital assets
            </p>
          </div>
          
          {/* Create Mint Trade Flow */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginTop: '16px',
          }}>
            {/* Create */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: 'rgba(29, 185, 84, 0.08)',
              borderRadius: '8px',
              padding: '8px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 185, 84, 0.12)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 185, 84, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('navigation', { detail: 'create' }))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1db954" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <span style={{ color: '#1db954', fontWeight: '600', fontSize: '14px' }}>Create</span>
            </div>
            
            {/* Arrow */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 12px' }}>
              <path d="M9 18L15 12L9 6" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {/* Mint */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: 'rgba(29, 185, 84, 0.08)',
              borderRadius: '8px',
              padding: '8px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 185, 84, 0.12)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 185, 84, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('navigation', { detail: 'mint' }))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1db954" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span style={{ color: '#1db954', fontWeight: '600', fontSize: '14px' }}>Mint</span>
            </div>
            
            {/* Arrow */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 12px' }}>
              <path d="M9 18L15 12L9 6" stroke="#4a4a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            
            {/* Trade */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: 'rgba(29, 185, 84, 0.08)',
              borderRadius: '8px',
              padding: '8px 14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 185, 84, 0.12)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(29, 185, 84, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('navigation', { detail: 'trade' }))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#1db954" style={{ marginRight: '8px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span style={{ color: '#1db954', fontWeight: '600', fontSize: '14px' }}>Trade</span>
            </div>
          </div>
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
