// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CarbonRegistry is Ownable {
    
    struct ProjectData {
        address owner;
        string geoHash; // IPFS hash of geometry/metadata
        bool isVerified;
    }

    mapping(uint256 => ProjectData) public projects;
    uint256 public nextProjectId = 1;

    event ProjectRegistered(uint256 indexed projectId, address indexed owner, string geoHash);
    event ProjectVerified(uint256 indexed projectId);

    constructor() Ownable(msg.sender) {}

    function registerProject(address _owner, string memory _geoHash) external onlyOwner returns (uint256) {
        uint256 projectId = nextProjectId++;
        projects[projectId] = ProjectData({
            owner: _owner,
            geoHash: _geoHash,
            isVerified: false
        });

        emit ProjectRegistered(projectId, _owner, _geoHash);
        return projectId;
    }

    function verifyProject(uint256 _projectId) external onlyOwner {
        require(projects[_projectId].owner != address(0), "Project does not exist");
        projects[_projectId].isVerified = true;
        emit ProjectVerified(_projectId);
    }
}
