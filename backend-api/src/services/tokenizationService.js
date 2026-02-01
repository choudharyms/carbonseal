const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const contracts = require('../config/contracts.json');
const { decrypt } = require('../utils/crypto');
const { User } = require('../models');

// Human-Readable ABIs
const TokenABI = [
  "function mint(address to, uint256 id, uint256 amount, uint256 projectId, bytes data)",
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function uri(uint256 id) view returns (string)"
];

const RegistryABI = [
  "function registerProject(address owner, string geoHash) external returns (uint256)",
  "function verifyProject(uint256 projectId) external"
];

// Provider (Mocking localhost for now, change URL in .env)
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL || "http://127.0.0.1:8545");

// System Admin Wallet (The one deploying/minting)
// In prod, load from env private key. Here using a hardhat default account #0 which has 10000 ETH
const SYSTEM_PRIVATE_KEY = process.env.SYSTEM_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const systemWallet = new ethers.Wallet(SYSTEM_PRIVATE_KEY, provider);

// Contract Instances
const tokenContract = new ethers.Contract(contracts.BlueCarbonToken, TokenABI, systemWallet);
const registryContract = new ethers.Contract(contracts.CarbonRegistry, RegistryABI, systemWallet);

const mintCarbonCredits = async (userId, projectId, amount, verificationReportHash) => {
    try {
        const user = await User.findByPk(userId);
        if (!user || !user.wallet_address) throw new Error("User has no wallet");

        console.log(`⛓️ Minting ${amount} BCTs for Project ${projectId} to ${user.wallet_address}...`);

        // Generate Token ID (e.g., using timestamp or deterministic hash)
        // Simple strategy: Project ID (if numeric) << 128 | Year
        // For UUID project IDs, we might just hash it to get a uint256
        const tokenId = ethers.toBigInt(ethers.id(projectId + new Date().getFullYear()));

        // Call Smart Contract
        // Note: In real world, we might want to batch this or use a queue
        const tx = await tokenContract.mint(
            user.wallet_address,
            tokenId,
            amount,
            1, // Mapped Project ID (numeric) - simplified for prototype
            ethers.toUtf8Bytes(verificationReportHash)
        );

        console.log(`✅ Mint Tx Sent: ${tx.hash}`);
        
        // Wait for confirmation (optional, but good for sync)
        // await tx.wait(); 

        return {
            txHash: tx.hash,
            tokenId: tokenId.toString()
        };

    } catch (error) {
        console.error("Minting Error:", error);
        // We don't throw here to avoid failing the whole verification flow if blockchain is down,
        // but we should log it for retry.
        return null;
    }
};

module.exports = { mintCarbonCredits };
