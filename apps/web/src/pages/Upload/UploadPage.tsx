import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import UploadMusicForm from '../../components/upload/UploadMusicForm';

export default function UploadPage() {
  const { isConnected } = useAccount();
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upload Music</h1>
        <ConnectButton showBalance chainStatus="icon" />
      </div>
      
      {!isConnected ? (
        <div className="bg-gradient-to-b from-[#1c1c1c] to-[#111] rounded-xl shadow-xl overflow-hidden border border-[#333] p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1db954] mx-auto flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Connect Wallet to Upload</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            You need to connect your wallet to upload and mint your music.
          </p>
          <ConnectButton />
        </div>
      ) : (
        <UploadMusicForm />
      )}
    </div>
  );
}
