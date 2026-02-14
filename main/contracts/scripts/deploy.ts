import { ethers, upgrades } from "hardhat";

async function main() {
  console.log("Deploying Neuro-Data Steward Smart Contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy ConsentManager
  console.log("\n1. Deploying ConsentManager...");
  const ConsentManager = await ethers.getContractFactory("ConsentManager");
  const consentManager = await ConsentManager.deploy();
  await consentManager.waitForDeployment();
  const consentManagerAddress = await consentManager.getAddress();
  console.log("ConsentManager deployed to:", consentManagerAddress);

  // Deploy NeuroDataRegistry
  console.log("\n2. Deploying NeuroDataRegistry...");
  const NeuroDataRegistry = await ethers.getContractFactory("NeuroDataRegistry");
  const neuroDataRegistry = await NeuroDataRegistry.deploy();
  await neuroDataRegistry.waitForDeployment();
  const neuroDataRegistryAddress = await neuroDataRegistry.getAddress();
  console.log("NeuroDataRegistry deployed to:", neuroDataRegistryAddress);

  // Deploy KeyRecovery
  console.log("\n3. Deploying KeyRecovery...");
  const KeyRecovery = await ethers.getContractFactory("KeyRecovery");
  const keyRecovery = await KeyRecovery.deploy();
  await keyRecovery.waitForDeployment();
  const keyRecoveryAddress = await keyRecovery.getAddress();
  console.log("KeyRecovery deployed to:", keyRecoveryAddress);

  // Grant roles
  console.log("\n4. Setting up roles...");
  
  // Grant REGISTRAR_ROLE to deployer for NeuroDataRegistry
  const REGISTRAR_ROLE = await neuroDataRegistry.REGISTRAR_ROLE();
  await neuroDataRegistry.grantRole(REGISTRAR_ROLE, deployer.address);
  console.log("Granted REGISTRAR_ROLE to deployer");

  // Grant RESEARCHER_ROLE to deployer for testing
  const RESEARCHER_ROLE = await consentManager.RESEARCHER_ROLE();
  await consentManager.grantRole(RESEARCHER_ROLE, deployer.address);
  console.log("Granted RESEARCHER_ROLE to deployer");

  // Verify contracts (optional - requires block explorer API key)
  console.log("\n5. Contract Deployment Summary:");
  console.log("=".repeat(50));
  console.log("ConsentManager:", consentManagerAddress);
  console.log("NeuroDataRegistry:", neuroDataRegistryAddress);
  console.log("KeyRecovery:", keyRecoveryAddress);
  console.log("=".repeat(50));

  // Save addresses to file for frontend
  const fs = require("fs");
  const addresses = {
    consentManager: consentManagerAddress,
    neuroDataRegistry: neuroDataRegistryAddress,
    keyRecovery: keyRecoveryAddress,
    network: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "./deployments/addresses.json",
    JSON.stringify(addresses, null, 2)
  );
  console.log("\nAddresses saved to deployments/addresses.json");

  // Verify on Polygonscan (if on testnet/mainnet)
  const chainId = (await ethers.provider.getNetwork()).chainId;
  if (chainId === 80002n || chainId === 137n) {
    console.log("\nVerifying contracts on Polygonscan...");
    try {
      await run("verify:verify", {
        address: consentManagerAddress,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: neuroDataRegistryAddress,
        constructorArguments: [],
      });
      await run("verify:verify", {
        address: keyRecoveryAddress,
        constructorArguments: [],
      });
      console.log("Contracts verified!");
    } catch (error) {
      console.log("Verification skipped or failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
