import type { Abi } from 'abitype';

// Fallback ABI with just the key functions we need
const fallbackMintFlipNFTAbi: Abi = [
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
];

// The contract addresses from your local deployment
export const ContractAddresses = {
  MintFlipNFT: '0x5fbdb2315678afecb367f032d93f642f64180aa3' as `0x${string}`
};

// For our local development, we'll use the fallback ABI directly
// In a production app, you would try to load the actual artifact if available
export const ContractAbis = {
  MintFlipNFT: fallbackMintFlipNFTAbi
};

// Contract data bundled together
export const Contracts = {
  MintFlipNFT: {
    address: ContractAddresses.MintFlipNFT,
    abi: ContractAbis.MintFlipNFT
  }
};
