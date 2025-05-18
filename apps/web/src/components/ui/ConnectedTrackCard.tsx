import React from 'react';
import TrackCard from './TrackCard';
import type { Track } from '../../contexts/MusicContext.types';

interface ConnectedTrackCardProps {
  track: Track;
  onClick?: () => void;
}

const ConnectedTrackCard: React.FC<ConnectedTrackCardProps> = ({ track, onClick }) => {
  return <TrackCard track={track} onClick={onClick} />;
};

export default ConnectedTrackCard;
