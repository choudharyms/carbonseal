import hre from "hardhat";

async function main() {
  console.log("🚀 Starting Deployment...");

  // 1. Deploy Blue Carbon Token
  const token = await hre.ethers.deployContract("BlueCarbonToken");
  await token.waitForDeployment();
  console.log(`✅ BlueCarbonToken deployed to: ${token.target}`);

  // 2. Deploy Carbon NFT
  const nft = await hre.ethers.deployContract("CarbonNFT");
  await nft.waitForDeployment();
  console.log(`✅ CarbonNFT deployed to: ${nft.target}`);

  // 3. Deploy Registry
  const registry = await hre.ethers.deployContract("CarbonRegistry", [token.target, nft.target]);
  await registry.waitForDeployment();
  console.log(`✅ CarbonRegistry deployed to: ${registry.target}`);

  // 4. Grant Roles
  console.log("⚙️  Configuring Roles...");
  // Note: We need to access the MINTER_ROLE. Since it's a public constant, we can fetch it or just use the hash.
  // The hash for "MINTER_ROLE" is standard:
  const MINTER_ROLE = "0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6";

  const tx1 = await token.grantRole(MINTER_ROLE, registry.target);
  await tx1.wait();

  const tx2 = await nft.grantRole(MINTER_ROLE, registry.target);
  await tx2.wait();

  console.log("🎉 Deployment Complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});