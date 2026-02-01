const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // 1. Deploy Registry
  const CarbonRegistry = await hre.ethers.getContractFactory("CarbonRegistry");
  const registry = await CarbonRegistry.deploy();
  await registry.waitForDeployment();
  console.log(`CarbonRegistry deployed to ${registry.target}`);

  // 2. Deploy Token
  const BlueCarbonToken = await hre.ethers.getContractFactory("BlueCarbonToken");
  const token = await BlueCarbonToken.deploy();
  await token.waitForDeployment();
  console.log(`BlueCarbonToken deployed to ${token.target}`);

  // 3. Deploy Marketplace
  const CarbonMarketplace = await hre.ethers.getContractFactory("CarbonMarketplace");
  const marketplace = await CarbonMarketplace.deploy(token.target);
  await marketplace.waitForDeployment();
  console.log(`CarbonMarketplace deployed to ${marketplace.target}`);

  // 4. Setup Permissions
  // Allow Marketplace to interact if needed (usually requires approval from user, handled in UI)
  // Set Minter role to Backend Wallet (Deployer for now)
  await token.setMinter(deployer.address);
  console.log("Minter role assigned to deployer.");

  // 5. Save Addresses & ABIs for Backend
  const addresses = {
    CarbonRegistry: registry.target,
    BlueCarbonToken: token.target,
    CarbonMarketplace: marketplace.target
  };

  const backendConfigPath = path.join(__dirname, '../../backend-api/src/config/contracts.json');
  fs.writeFileSync(backendConfigPath, JSON.stringify(addresses, null, 2));
  
  // Copy ABIs
  const artifactsDir = path.join(__dirname, '../artifacts/contracts');
  const backendAbiDir = path.join(__dirname, '../../backend-api/src/config/abis');
  
  if (!fs.existsSync(backendAbiDir)) fs.mkdirSync(backendAbiDir, { recursive: true });

  ['CarbonRegistry', 'BlueCarbonToken', 'CarbonMarketplace'].forEach(name => {
      const artifact = JSON.parse(fs.readFileSync(path.join(artifactsDir, `${name}.sol/${name}.json`)));
      fs.writeFileSync(path.join(backendAbiDir, `${name}.json`), JSON.stringify(artifact.abi));
  });

  console.log("Configuration saved to Backend.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
