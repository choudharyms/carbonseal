// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BlueCarbonToken.sol";
import "./CarbonNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonRegistry is Ownable {
    
    struct Project {
        uint256 id;
        string name;
        string location;
        uint256 carbonCredits;
        string ipfsMetadata; // Link to MRV Report
        bool isVerified;
        address owner;
    }

    uint256 public projectCount;
    mapping(uint256 => Project) public projects;
    
    BlueCarbonToken public tokenContract;
    CarbonNFT public nftContract;

    event ProjectRegistered(uint256 indexed id, string name, address owner);
    event ProjectVerified(uint256 indexed id, uint256 creditsMinted);

    constructor(address _tokenAddress, address _nftAddress) Ownable(msg.sender) {
        tokenContract = BlueCarbonToken(_tokenAddress);
        nftContract = CarbonNFT(_nftAddress);
    }

    // 1. Register a new Carbon Project
    function registerProject(string memory _name, string memory _location, string memory _ipfsMetadata) public {
        projectCount++;
        projects[projectCount] = Project(
            projectCount,
            _name,
            _location,
            0,
            _ipfsMetadata,
            false,
            msg.sender
        );
        emit ProjectRegistered(projectCount, _name, msg.sender);
    }

    // 2. Verify Project (Admin/MRV Oracle Only) and Mint Tokens/NFT
    function verifyProject(uint256 _projectId, uint256 _creditAmount) public onlyOwner {
        Project storage proj = projects[_projectId];
        require(!proj.isVerified, "Project already verified");

        proj.carbonCredits = _creditAmount;
        proj.isVerified = true;

        // A. Mint ERC-20 Credits to Project Owner
        tokenContract.mint(proj.owner, _creditAmount * 10**18); // Assumes 18 decimals

        // B. Mint NFT representing the project Certificate
        nftContract.safeMint(proj.owner, proj.ipfsMetadata);

        emit ProjectVerified(_projectId, _creditAmount);
    }

    function getProject(uint256 _id) public view returns (Project memory) {
        return projects[_id];
    }
}