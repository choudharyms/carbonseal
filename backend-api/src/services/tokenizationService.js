const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const contracts = require('../config/contracts.json');
const { decrypt } = require('../utils/crypto');
const { User } = require('../models');

const MOCK_MODE = process.env.MOCK_BLOCKCHAIN === 'true';

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

let provider, systemWallet, tokenContract, registryContract;

if (!MOCK_MODE) {
    try {
        // Provider
        provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL || "http://127.0.0.1:8545");
        
        // System Admin Wallet
        const SYSTEM_PRIVATE_KEY = process.env.SYSTEM_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        systemWallet = new ethers.Wallet(SYSTEM_PRIVATE_KEY, provider);

        // Contract Instances
        tokenContract = new ethers.Contract(contracts.BlueCarbonToken, TokenABI, systemWallet);
        registryContract = new ethers.Contract(contracts.CarbonRegistry, RegistryABI, systemWallet);
    } catch (e) {
        console.warn("⚠️ Blockchain initialization failed. Switching to mock mode internally.");
    }
} else {
    console.log("⚠️ MOCK_BLOCKCHAIN=true. Skipping real contract calls.");
}

const mintCarbonCredits = async (userId, projectId, amount, verificationReportHash) => {
    try {
        const user = await User.findByPk(userId);
        if (!user || !user.wallet_address) throw new Error("User has no wallet");

        console.log(`⛓️ Minting ${amount} BCTs for Project ${projectId} to ${user.wallet_address}...`);

        // Generate Token ID
        const tokenId = ethers.toBigInt(ethers.id(projectId + new Date().getFullYear()));

        if (MOCK_MODE || !tokenContract) {
            console.log(`[MOCK] Minted Token ${tokenId} successfully.`);
            return {
                txHash: "0xMOCK" + require('crypto').randomBytes(30).toString('hex'),
                tokenId: tokenId.toString()
            };
        }

        // Call Smart Contract
        const tx = await tokenContract.mint(
            user.wallet_address,
            tokenId,
            amount,
            1, // Mapped Project ID (numeric)
            ethers.toUtf8Bytes(verificationReportHash)
        );

        console.log(`✅ Mint Tx Sent: ${tx.hash}`);
        return {
            txHash: tx.hash,
            tokenId: tokenId.toString()
        };

    } catch (error) {
        console.error("Minting Error:", error);
        return null;
    }
};

module.exports = { mintCarbonCredits };