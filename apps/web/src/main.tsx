import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { http, WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

// Project ID from WalletConnect Cloud (required for WalletConnect v2)
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_WALLET_CONNECT_PROJECT_ID'

// Create a combined config for both RainbowKit and wagmi
const config = getDefaultConfig({
  appName: 'MintFlip',
  projectId,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
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
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
