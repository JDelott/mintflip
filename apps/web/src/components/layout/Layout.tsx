import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import MusicPlayer from '../ui/MusicPlayer';

interface LayoutProps {
  children: ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Layout = ({ children, onNavigate, currentPage }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen bg-background">
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
