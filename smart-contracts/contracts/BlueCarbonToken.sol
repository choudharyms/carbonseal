// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract BlueCarbonToken is ERC1155, Ownable, ERC1155Burnable {
    
    // Mapping from Token ID to Project ID
    mapping(uint256 => uint256) public tokenToProject;
    
    // Address allowed to mint (The Registry/Backend)
    address public minter;

    event TokensMinted(uint256 indexed id, uint256 amount, uint256 indexed projectId);
    event TokensRetired(address indexed user, uint256 indexed id, uint256 amount);

    constructor() ERC1155("https://ipfs.io/ipfs/{id}") Ownable(msg.sender) {
        minter = msg.sender;
    }

    function setMinter(address _minter) external onlyOwner {
        minter = _minter;
    }

    function mint(address _to, uint256 _id, uint256 _amount, uint256 _projectId, bytes memory _data) external {
        require(msg.sender == minter || msg.sender == owner(), "Not minter");
        _mint(_to, _id, _amount, _data);
        tokenToProject[_id] = _projectId;
        emit TokensMinted(_id, _amount, _projectId);
    }

    function retire(uint256 _id, uint256 _amount) external {
        burn(msg.sender, _id, _amount);
        emit TokensRetired(msg.sender, _id, _amount);
    }
}
