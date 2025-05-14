import { getContract, type PublicClient, type WalletClient, type GetContractReturnType } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { type Abi } from 'abitype';

// Define contract data type
interface ContractData {
  [contractName: string]: {
    address: `0x${string}`;
    abi: Abi;
  }
}

// Default contract address from your deployment
const DEFAULT_CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

// Load contract data
const loadContractData = (): ContractData => {
  try {
    // Use dynamic import instead of require
    // This is only called at runtime, so it's fine
    return {
      MintFlipNFT: {
        address: DEFAULT_CONTRACT_ADDRESS,
        // In a real app, you would import the ABI from a JSON file
        abi: [
          {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
              }
            ],
            "name": "mintNFT",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "royaltyBasisPoints",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ] as Abi
      }
    };
  } catch (error) {
    console.warn('Failed to load contract data:', error);
    // Fallback with minimal ABI
    return {
      MintFlipNFT: {
        address: DEFAULT_CONTRACT_ADDRESS,
        abi: [] as unknown as Abi
      }
    };
  }
};

// Cached contract data
const contractData = loadContractData();

// Hook to get a read-only contract instance
export function useContract<TAbi extends Abi>(contractName: string) {
  const publicClient = usePublicClient();
  const [contract, setContract] = useState<GetContractReturnType<TAbi, PublicClient> | null>(null);
  
  useEffect(() => {
    if (!publicClient || !contractData[contractName]) return;
    
    try {
      const newContract = getContract({
        address: contractData[contractName].address,
        abi: contractData[contractName].abi as TAbi,
        client: publicClient,
      }) as GetContractReturnType<TAbi, PublicClient>;
      
      setContract(newContract);
    } catch (error) {
      console.error(`Error creating contract for ${contractName}:`, error);
    }
  }, [contractName, publicClient]);
  
  return contract;
}

// Hook to get a writable contract instance
export function useWriteContract<TAbi extends Abi>(contractName: string) {
  const { data: walletClient } = useWalletClient();
  const [contract, setContract] = useState<GetContractReturnType<TAbi, WalletClient> | null>(null);
  
  useEffect(() => {
    if (!walletClient || !contractData[contractName]) return;
    
    try {
      const newContract = getContract({
        address: contractData[contractName].address,
        abi: contractData[contractName].abi as TAbi,
        client: walletClient,
      }) as GetContractReturnType<TAbi, WalletClient>;
      
      setContract(newContract);
    } catch (error) {
      console.error(`Error creating write contract for ${contractName}:`, error);
    }
  }, [contractName, walletClient]);
  
  return contract;
} 
