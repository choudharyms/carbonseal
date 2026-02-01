const { Listing, Project, User } = require('../models');
const { ethers } = require('ethers');
const contracts = require('../config/contracts.json');
const { decrypt } = require('../utils/crypto');

// ABI for Marketplace
const MarketplaceABI = [
  "function listTokens(uint256 tokenId, uint256 amount, uint256 pricePerToken) external",
  "function buyTokens(uint256 listingId, uint256 amountToBuy) external payable"
];
// ABI for Token (needed for approval)
const TokenABI = [
  "function setApprovalForAll(address operator, bool approved) external"
];

const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL || "http://127.0.0.1:8545");

exports.getListings = async (req, res) => {
    try {
        const listings = await Listing.findAll({
            where: { status: 'ACTIVE' },
            include: [{ model: Project, as: 'project' }, { model: User, as: 'seller', attributes: ['username'] }]
        });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createListing = async (req, res) => {
    try {
        const { projectId, tokenId, amount, pricePerToken } = req.body;
        const sellerId = req.user.id;
        
        // 1. Get Seller Wallet
        const seller = await User.findByPk(sellerId);
        const privateKey = decrypt(JSON.parse(seller.encrypted_private_key));
        const wallet = new ethers.Wallet(privateKey, provider);

        // 2. Blockchain: Approve & List
        const tokenContract = new ethers.Contract(contracts.BlueCarbonToken, TokenABI, wallet);
        const marketContract = new ethers.Contract(contracts.CarbonMarketplace, MarketplaceABI, wallet);

        console.log(`📝 Approving Marketplace for ${amount} tokens...`);
        // Approve marketplace to spend tokens
        // In prod check allowance first
        try {
            const txApprove = await tokenContract.setApprovalForAll(contracts.CarbonMarketplace, true);
            // await txApprove.wait(); 
        } catch (e) {
            console.warn("Blockchain interaction failed (Approval), proceeding with DB only for demo");
        }

        console.log(`📝 Listing on chain...`);
        try {
            const txList = await marketContract.listTokens(tokenId, amount, ethers.parseUnits(pricePerToken.toString(), "ether")); // assuming price in ETH for simplicity
            // await txList.wait();
        } catch (e) {
            console.warn("Blockchain interaction failed (Listing), proceeding with DB only for demo");
        }

        // 3. Save to DB
        const listing = await Listing.create({
            project_id: projectId,
            seller_id: sellerId,
            token_id: tokenId,
            amount_available: amount,
            price_per_tonne_usd: pricePerToken,
            status: 'ACTIVE'
        });

        res.status(201).json(listing);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

exports.buyListing = async (req, res) => {
    try {
        const { listingId, amount } = req.body;
        const buyerId = req.user.id;

        const listing = await Listing.findByPk(listingId);
        if (!listing || listing.status !== 'ACTIVE') return res.status(400).json({ error: "Listing unavailable" });

        if (listing.amount_available < amount) return res.status(400).json({ error: "Insufficient tokens" });

        // 1. Get Buyer Wallet
        const buyer = await User.findByPk(buyerId);
        const privateKey = decrypt(JSON.parse(buyer.encrypted_private_key));
        const wallet = new ethers.Wallet(privateKey, provider);
        
        // 2. Blockchain: Buy
        const marketContract = new ethers.Contract(contracts.CarbonMarketplace, MarketplaceABI, wallet);
        
        try {
            const totalPrice = ethers.parseUnits((listing.price_per_tonne_usd * amount).toString(), "ether");
            const tx = await marketContract.buyTokens(listing.id, amount, { value: totalPrice });
            // await tx.wait();
        } catch (e) {
            console.warn("Blockchain interaction failed (Buy), proceeding with DB only for demo");
        }

        // 3. Update DB
        listing.amount_available -= amount;
        if (listing.amount_available <= 0) listing.status = 'SOLD';
        await listing.save();

        res.json({ success: true, message: "Purchase successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
