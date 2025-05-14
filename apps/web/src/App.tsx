import { useState } from 'react'
import Layout from './components/layout/Layout'
import HomePage from './pages/Home/HomePage'
import ProfilePage from './components/profile/ProfilePage'
import { NetworkSwitcher } from './components/profile/NetworkSwitcher'
import { useAccount, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const chainId = useChainId()
  const { isConnected } = useAccount()
  
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
      default:
        return <HomePage />
    }
  }

  // Determine if we need to show wrong network UI
  const isWrongNetwork = isConnected && chainId !== sepolia.id;

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
