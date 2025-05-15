import React from 'react';

// Create a dedicated component just for this text
const NftDescriptionText: React.FC = () => {
  // Style to force horizontal text flow
  const forceHorizontalStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    whiteSpace: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    margin: '0 auto 2rem auto',
    maxWidth: '30rem',
    color: '#9ca3af',
    fontFamily: 'sans-serif',
    fontSize: '1rem'
  };

  return (
    <div className="block text-center" style={forceHorizontalStyle}>
      Your digital music collection is waiting to be built. Discover unique AI-generated tracks and start collecting today.
    </div>
  );
};

export default NftDescriptionText;
