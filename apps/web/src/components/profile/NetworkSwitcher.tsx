import { useChainId, useAccount, useSwitchChain } from 'wagmi'
import { hardhat } from 'wagmi/chains'

export function NetworkSwitcher() {
  const chainId = useChainId()
  const { isConnected } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  
  // Only show if connected and on wrong network
  if (!isConnected || chainId === hardhat.id) {
    return null
  }
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => switchChain({ chainId: hardhat.id })}
        disabled={isPending}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
        {isPending ? 'Switching Network...' : 'Switch to Hardhat Network'}
      </button>
    </div>
  )
}
