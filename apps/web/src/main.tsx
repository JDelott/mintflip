import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { http, WagmiProvider } from 'wagmi'
import { hardhat } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { MusicProvider } from './contexts/MusicContext'

// Project ID from WalletConnect Cloud
const projectId = '30d404517cc9c411d88eeabec2257428'

// Create a combined config for both RainbowKit and wagmi
const config = getDefaultConfig({
  appName: 'MintFlip',
  projectId,
  chains: [hardhat],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
  },
})

// Create React Query client
const queryClient = new QueryClient()

// Render the app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#22c55e',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          <MusicProvider>
            <App />
          </MusicProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
