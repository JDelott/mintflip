import { useState } from 'react'
import Layout from './components/layout/Layout'
import HomePage from './pages/Home/HomePage'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage />
      case 'search':
        return <div className="p-6">Search Page</div>
      case 'library':
        return <div className="p-6">Library Page</div>
      default:
        return <HomePage />
    }
  }

  return (
    <Layout onNavigate={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
