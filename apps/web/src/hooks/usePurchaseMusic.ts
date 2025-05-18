import { useState } from 'react';
import { useContractWrite, useTransaction, useAccount } from 'wagmi';
import { parseEther } from 'viem';

// Define a simple ABI for the buyMusic function
const MUSIC_NFT_ABI = [
  {
    inputs: [
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'buyMusic',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
];

// Hardcoded for now, but should be moved to config in a real app
const MUSIC_NFT_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export function usePurchaseMusic() {
  const [lastPurchasedTrackId, setLastPurchasedTrackId] = useState<number | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const { address } = useAccount();
  
  const { 
    isPending: isPurchasing,
    error: purchaseError,
    writeContract
  } = useContractWrite();
  
  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError
  } = useTransaction({
    hash: transactionHash ? (transactionHash as `0x${string}`) : undefined,
  });
  
  const purchaseTrack = async (trackId: number, priceInEth: string) => {
    if (!address) {
      throw new Error('Wallet not connected');
    }
    
    try {
      setLastPurchasedTrackId(trackId);
      
      // Convert price from ETH to Wei
      const priceInWei = parseEther(priceInEth);
      
      // Prepare contract parameters
      const contractParams = {
        address: MUSIC_NFT_CONTRACT_ADDRESS as `0x${string}`,
        abi: MUSIC_NFT_ABI,
        functionName: 'buyMusic',
        args: [BigInt(trackId)],
        value: priceInWei
      };
      
      // Execute the contract write
      try {
        // Using a separate try-catch here to handle the writeContract result
        // without creating TypeScript errors
        const result = await writeContract(contractParams);
        if (typeof result === 'string') {
          setTransactionHash(result);
          return {
            success: true,
            transactionHash: result,
          };
        }
      } catch (writeError) {
        console.error('Error writing to contract:', writeError);
        throw writeError; // Re-throw to be caught by outer try-catch
      }
      
      // If we get here without a result, consider it a success but without a hash
      return {
        success: true,
        transactionHash: null,
      };
    } catch (error) {
      console.error('Error purchasing track:', error);
      return {
        success: false,
        error
      };
    }
  };
  
  return {
    purchaseTrack,
    isPurchasing,
    isConfirming,
    isConfirmed,
    purchaseError,
    confirmError,
    transactionHash,
    lastPurchasedTrackId
  };
}
