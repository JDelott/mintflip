import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useChainId } from 'wagmi';
import { sepolia } from 'wagmi/chains';

export const CustomConnectButton = () => {
  const chainId = useChainId();
  const isWrongNetwork = chainId !== sepolia.id;

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button 
                    onClick={openConnectModal} 
                    className="px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (isWrongNetwork) {
                return (
                  <button 
                    onClick={openChainModal} 
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Wrong Network
                  </button>
                );
              }

              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 bg-background-elevated rounded-lg px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button 
                    onClick={openAccountModal}
                    className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors"
                  >
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
