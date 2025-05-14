import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MusicPlayer from '../ui/MusicPlayer';
import { useSwitchChain } from 'wagmi';
import { hardhat } from 'wagmi/chains';

interface LayoutProps {
  children: ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
  isWrongNetwork?: boolean;
}

const Layout = ({ children, onNavigate, currentPage, isWrongNetwork }: LayoutProps) => {
  const { switchChain } = useSwitchChain();

  return (
    <div className="flex flex-col h-screen bg-background">
      {isWrongNetwork && (
        <div className="bg-red-500 text-white p-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span>Wrong network detected. MintFlip runs on Hardhat local network.</span>
            <button 
              onClick={() => switchChain({ chainId: hardhat.id })}
              className="ml-2 bg-white text-red-500 px-3 py-1 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors"
            >
              Switch Network
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onNavigate={onNavigate} currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <MusicPlayer />
    </div>
  );
};

export default Layout;
