// Script to deploy contracts to the local network

import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { hardhat } from 'viem/chains';
import hre from 'hardhat';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log("Starting deployment...");

  try {
    // Get deployer client
    const [deployer] = await hre.viem.getWalletClients();
    console.log("Deploying from account:", deployer.account.address);

    // Get the contract factory - this needs to be done differently with viem
    const publicClient = await hre.viem.getPublicClient();
    
    // Deploy using the low-level viem API
    console.log("Deploying MintFlipNFT...");
    
    // Get the artifact
    const MintFlipNFTArtifact = await hre.artifacts.readArtifact("MintFlipNFT");
    
    // Deploy the contract
    const hash = await deployer.deployContract({
      abi: MintFlipNFTArtifact.abi,
      bytecode: MintFlipNFTArtifact.bytecode as `0x${string}`,
      args: [] // Constructor arguments, if any
    });
    
    console.log("Deployment transaction hash:", hash);
    
    // Wait for transaction to be mined
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    // Get the contract address from the receipt
    const contractAddress = receipt.contractAddress;
    if (!contractAddress) {
      throw new Error("Contract address not found in transaction receipt");
    }
    
    console.log("MintFlipNFT deployed to:", contractAddress);
    
    // Save deployment info for the frontend
    const deploymentDir = path.resolve(__dirname, '../deployments');
    if (!fs.existsSync(deploymentDir)) {
      fs.mkdirSync(deploymentDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.resolve(deploymentDir, 'contracts.json'),
      JSON.stringify({
        MintFlipNFT: {
          address: contractAddress,
          abi: MintFlipNFTArtifact.abi
        }
      }, null, 2)
    );
    
    console.log("Deployment completed!");
  } catch (error) {
    console.error("Error during deployment:", error);
    process.exit(1);
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
