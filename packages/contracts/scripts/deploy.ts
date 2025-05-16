import { createPublicClient, http, createWalletClient, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';
import { artifacts } from 'hardhat';
import * as fs from 'fs';

async function main() {
  console.log("Starting deployment...");
  
  // Create viem clients
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http()
  });

  // Get test account - using first hardhat account
  const testKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const account = privateKeyToAccount(testKey);
  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http()
  });
  
  console.log(`Deploying from account: ${account.address}`);
  
  // Get contract artifacts
  const MintFlipNFTArtifact = await artifacts.readArtifact("MintFlipNFT");
  const MusicNFTArtifact = await artifacts.readArtifact("MusicNFT");
  
  // Deploy MintFlipNFT
  console.log("Deploying MintFlipNFT...");
  const mintFlipNFTHash = await walletClient.deployContract({
    abi: MintFlipNFTArtifact.abi,
    bytecode: MintFlipNFTArtifact.bytecode,
    args: []
  });
  
  const mintFlipNFTReceipt = await publicClient.waitForTransactionReceipt({ 
    hash: mintFlipNFTHash 
  });
  const mintFlipNFTAddress = mintFlipNFTReceipt.contractAddress;
  console.log(`MintFlipNFT deployed to: ${mintFlipNFTAddress}`);
  
  // Deploy MusicNFT
  console.log("Deploying MusicNFT...");
  const musicNFTHash = await walletClient.deployContract({
    abi: MusicNFTArtifact.abi,
    bytecode: MusicNFTArtifact.bytecode,
    args: []
  });
  
  const musicNFTReceipt = await publicClient.waitForTransactionReceipt({ 
    hash: musicNFTHash 
  });
  const musicNFTAddress = musicNFTReceipt.contractAddress;
  console.log(`MusicNFT deployed to: ${musicNFTAddress}`);
  
  // Save the contract addresses
  console.log("Saving contract addresses...");
  const contractAddresses = {
    MintFlipNFT: mintFlipNFTAddress,
    MusicNFT: musicNFTAddress
  };
  
  // Make sure directories exist
  try {
    fs.mkdirSync('../web/src', { recursive: true });
  } catch (err) {
    console.log('Directory already exists');
  }
  
  fs.writeFileSync(
    '../web/src/contractAddresses.json',
    JSON.stringify(contractAddresses, null, 2)
  );
  
  console.log("Deployment completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
