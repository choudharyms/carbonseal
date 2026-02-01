// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CarbonMarketplace is ERC1155Holder, ReentrancyGuard {
    
    IERC1155 public carbonToken;

    struct Listing {
        uint256 listingId;
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 pricePerToken; // In Wei
        bool active;
    }

    uint256 public nextListingId = 1;
    mapping(uint256 => Listing) public listings;

    event Listed(uint256 indexed listingId, address indexed seller, uint256 indexed tokenId, uint256 amount, uint256 price);
    event Sale(uint256 indexed listingId, address indexed buyer, uint256 amount);

    constructor(address _tokenAddress) {
        carbonToken = IERC1155(_tokenAddress);
    }

    function listTokens(uint256 _tokenId, uint256 _amount, uint256 _pricePerToken) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        
        // Transfer tokens to contract (Escrow)
        carbonToken.safeTransferFrom(msg.sender, address(this), _tokenId, _amount, "");

        listings[nextListingId] = Listing({
            listingId: nextListingId,
            seller: msg.sender,
            tokenId: _tokenId,
            amount: _amount,
            pricePerToken: _pricePerToken,
            active: true
        });

        emit Listed(nextListingId, msg.sender, _tokenId, _amount, _pricePerToken);
        nextListingId++;
    }

    function buyTokens(uint256 _listingId, uint256 _amountToBuy) external payable nonReentrant {
        Listing storage listing = listings[_listingId];
        require(listing.active, "Listing not active");
        require(listing.amount >= _amountToBuy, "Not enough tokens");
        
        uint256 totalPrice = listing.pricePerToken * _amountToBuy;
        require(msg.value >= totalPrice, "Insufficient funds");

        // Update listing
        listing.amount -= _amountToBuy;
        if (listing.amount == 0) {
            listing.active = false;
        }

        // Transfer Tokens to Buyer
        carbonToken.safeTransferFrom(address(this), msg.sender, listing.tokenId, _amountToBuy, "");

        // Transfer Funds to Seller
        payable(listing.seller).transfer(totalPrice);

        // Refund excess
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }

        emit Sale(_listingId, msg.sender, _amountToBuy);
    }
}
