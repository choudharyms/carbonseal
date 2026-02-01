const { Project, Verification, User } = require('../models');
const crypto = require('crypto');
const { mintCarbonCredits } = require('./tokenizationService');

// Mock Factors
const ECOSYSTEM_FACTORS = {
    'MANGROVE': 400, // tonnes CO2e per hectare
    'SEAGRASS': 250,
    'WETLAND': 300,
    'PEATLAND': 1000
};

const verifyProject = async (projectId) => {
    const project = await Project.findByPk(projectId);
    if (!project) throw new Error("Project not found");

    // 1. Mock Satellite Analysis
    console.log(`🛰️ Tasking Sentinel-2 for Project ${project.name}...`);
    
    // Random healthy NDVI
    const ndvi = (0.6 + Math.random() * 0.3).toFixed(2);
    
    // Dynamic Mock Area based on project ID to keep it consistent but different per project
    // Use last 4 chars of ID converted to number, mapped to 10-500 Ha range
    const idNum = parseInt(project.id.slice(-4), 16) || Date.now();
    const area = (idNum % 490) + 10; 

    // 2. Calculate Carbon
    const factor = ECOSYSTEM_FACTORS[project.ecosystem_type] || 200;
    const carbonCredits = Math.floor(area * factor);

    // 3. Generate Report Hash
    const reportData = {
        projectId,
        ndvi,
        area,
        credits: carbonCredits,
        timestamp: Date.now()
    };
    const ipfsHash = crypto.createHash('sha256').update(JSON.stringify(reportData)).digest('hex');

    // 4. Save Record
    const verification = await Verification.create({
        project_id: projectId,
        satellite_source: 'Sentinel-2 L2A',
        capture_date: new Date(),
        ndvi_score: parseFloat(ndvi),
        estimated_biomass: area * 500, // Mock biomass
        carbon_credits_calculated: carbonCredits,
        ipfs_report_hash: `QmMock${ipfsHash}`, // Mock IPFS CID
        verifier_id: null // System verified
    });

    // 5. Update Project Status
    project.status = 'VERIFIED';
    await project.save();

    // 6. MINT TOKENS ON-CHAIN
    const mintResult = await mintCarbonCredits(
        project.owner_id, 
        project.id, 
        carbonCredits, 
        ipfsHash
    );

    if (mintResult) {
        verification.blockchain_tx_hash = mintResult.txHash;
        await verification.save();
        
        // SAVE TOKEN ID TO PROJECT
        project.registry_contract_id = mintResult.tokenId;
        await project.save();
    }

    return verification;
};

module.exports = { verifyProject };

