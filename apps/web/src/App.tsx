import { useState, useEffect } from 'react'
import Layout from './components/layout/Layout'
import HomePage from './pages/Home/HomePage'
import ProfilePage from './components/profile/ProfilePage'
import { NetworkSwitcher } from './components/profile/NetworkSwitcher'
import { useAccount, useChainId } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import UploadPage from './pages/Upload/UploadPage'
import MarketplacePage from './pages/Marketplace/Marketplace'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const chainId = useChainId()
  const { isConnected } = useAccount()
  
  useEffect(() => {
    // Listen for navigation events
    const handleNavigation = (event: CustomEvent) => {
      setCurrentPage(event.detail);
    };
    
    window.addEventListener('navigation', handleNavigation as EventListener);
    
    return () => {
      window.removeEventListener('navigation', handleNavigation as EventListener);
    };
  }, []);

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage />
      case 'search':
        return <div className="p-6">Search Page</div>
      case 'library':
        return <div className="p-6">Library Page</div>
      case 'profile':
        return <ProfilePage />
      case 'upload':
        return <UploadPage />
      case 'marketplace': 
        return <MarketplacePage category="all" />
      case 'trending':
        return <MarketplacePage category="trending" />
      case 'new':
        return <MarketplacePage category="new" />
      case 'exclusive':
        return <MarketplacePage />
      case 'commercial':
        return <MarketplacePage />
      case 'creators':
        return <MarketplacePage />
      default:
        return <HomePage />
    }
  }

  // Accept both hardhat and sepolia as valid networks for development
  const isWrongNetwork = isConnected && chainId !== hardhat.id;

  return (
    <>
      <NetworkSwitcher />
      <Layout 
        onNavigate={setCurrentPage} 
        currentPage={currentPage}
        isWrongNetwork={isWrongNetwork}
      >
        {renderPage()}
      </Layout>
    </>
  )
}

export default App
